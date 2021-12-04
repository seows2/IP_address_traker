import { Component, createRef, RefObject } from 'react';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { Book, Gift, House, KK, Tree } from '../../components/main/IconButtons';
import PixelArt, {
  genRandomPixelArt,
  Minimi,
} from '../../components/main/Minimi';
import socket from '../../lib/api/socket';
import { MainContainer } from './index.style';
import { v4 as uuidv4 } from 'uuid';
import createPeer from '../../lib/api/peer';
import { alert } from '../../utils/modal';

interface MainState {
  users: { id: string; x: number; y: number; minimi: Minimi }[];
  peerCalls: Record<string, MediaConnection>;
  connections: Record<string, DataConnection>;
  minimi: Minimi;
  x: number;
  y: number;
}

type MinimiUpdateMessage = {
  x: number;
  y: number;
  minimi: Minimi;
  from: string;
  message: 'updateMinimi';
};

const [DX, DY] = [2, 2];
const delayMS = 250;
const pleaseAlloweRecord =
  '음성녹음을 허용해주세요! 다른유저와 채팅할 수 있습니다.';

class Main extends Component<{ u?: string }, MainState> {
  audioGridRef: RefObject<HTMLDivElement>;
  myStream?: MediaStream;
  peer: Peer;
  myId: string;

  constructor(props) {
    super(props);
    const { minimi, x, y } = genRandomPixelArt();

    this.state = {
      peerCalls: {},
      connections: {},
      minimi,
      x,
      y,
      users: [],
    };

    this.myId = uuidv4();
    this.peer = createPeer(this.myId);
    this.peer.on('open', (id) => {
      socket.emit('join-room', id);
    });
    this.audioGridRef = createRef<HTMLDivElement>();
    this.setupConnections = this.setupConnections.bind(this);
    this.addConnections = this.addConnections.bind(this);
    this.addAudioStream = this.addAudioStream.bind(this);
    this.updateMinimi = this.updateMinimi.bind(this);
    this.setupConnections();
  }

  componentWillUnmount() {
    this.myStream?.getTracks().forEach((mediaTrack) => {
      mediaTrack.stop();
    });
    document.body.removeEventListener('keydown', this.onKeyDown);
  }

  setupConnections() {
    this.setupAudioStream();

    socket.on('user-connected', async (userId: string) => {
      alert(`user-connected! ID: ${userId}`);
      const conn = this.peer.connect(userId);

      setTimeout(() => {
        const { minimi, x, y } = this.state;
        const firstMinimiNotifyMessage: MinimiUpdateMessage = {
          x,
          y,
          from: this.myId,
          minimi,
          message: 'updateMinimi',
        };
        conn.send({ message: 'hello', from: this.myId });
        this.addConnections(userId, conn);
        conn.send(firstMinimiNotifyMessage);
      }, delayMS);
    });

    this.peer.on('connection', (con) => {
      con.on('data', (data) => {
        if (data.message === 'updateMinimi') {
          this.updateMinimi(data);
        } else if (data.message === 'hello') {
          alert(`new user: ${con.peer}`);
          const conn = this.peer.connect(con.peer);
          setTimeout(() => {
            conn.send({ message: 'hello2', from: this.myId });
            this.addConnections(con.peer, conn);
          }, delayMS);
        }
      });
    });

    socket.on('user-disconnected', (userId) => {
      alert(`user-disconnected: ${userId}`);
      const { peerCalls } = this.state;
      peerCalls[userId]?.close();
      delete peerCalls[userId];
      this.setState({
        peerCalls,
        users: this.state.users.filter((user) => user.id !== userId),
      });
      this.removeConnections(userId);
    });

    document.body.addEventListener('keydown', this.onKeyDown);
  }

  addConnections = (id: string, connection: DataConnection) => {
    const { connections } = this.state;
    const nextConnections = {
      ...connections,
      [id]: connection,
    };
    this.setState({ connections: nextConnections }, () => {
      console.log('myId', this.myId);
      console.log(this.state);
    });
  };

  removeConnections = (id: string) => {
    const { connections } = this.state;
    delete connections[id];
    this.setState({ connections }, () => {
      console.log(`deleted id: ${id}`);
      console.log(this.state.connections);
    });
  };

  updateMinimi = (minimiMessage: MinimiUpdateMessage) => {
    const { x, y, from, minimi } = minimiMessage;
    const { users } = this.state;
    const nextUsers = users.slice().filter((user) => user.id !== from);
    nextUsers.push({ x, y, minimi, id: from });
    this.setState({ users: nextUsers });
  };

  setupAudioStream = () => {
    /**
     * 누군가가 나할테 call을 했을 때.
     */
    this.peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((myStream) => {
          this.myStream = myStream;
          call.answer(myStream);

          const newAudio = document.createElement('audio');
          this.audioGridRef.current?.appendChild(newAudio);
          call.on('stream', (otherUserStream) => {
            this.addAudioStream(newAudio, otherUserStream);
          });
          console.log('peer ', call.peer);
        })
        .catch((_) => {
          alert(pleaseAlloweRecord, 3000);
        });
    });

    socket.on('user-connected', (userId) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((myStream) => {
          this.myStream = myStream;
          const call = this.peer.call(userId, myStream);
          const newAudio = document.createElement('audio');
          this.audioGridRef.current?.appendChild(newAudio);

          call.on('stream', (otherUserStream) => {
            this.addAudioStream(newAudio, otherUserStream);
          });

          call.on('close', () => {
            newAudio.remove();
          });

          const { peerCalls } = this.state;
          const nextPeers = {
            ...peerCalls,
            [userId]: call,
          };
          this.setState({ peerCalls: nextPeers });
        })
        .catch((_) => {
          alert(pleaseAlloweRecord, 3000);
        });
    });
  };

  addAudioStream = (audio: HTMLAudioElement, stream: MediaStream) => {
    audio.srcObject = stream;
    audio.addEventListener('loadedmetadata', () => {
      audio.play();
    });
  };

  broadCastMove = () => {
    const { connections, minimi, x, y } = this.state;

    Object.keys(connections).forEach((targetId) => {
      const conn = connections[targetId];
      const minimiUpdateMessage: MinimiUpdateMessage = {
        x,
        y,
        minimi,
        from: this.myId,
        message: 'updateMinimi',
      };
      conn.send(minimiUpdateMessage);
    });
  };

  onKeyDown = (event: globalThis.KeyboardEvent) => {
    const { y, x } = this.state;

    switch (event.code) {
      case 'ArrowUp':
        this.setState({ y: Math.max(0, y - DY) }, this.broadCastMove);
        break;
      case 'ArrowDown':
        this.setState({ y: Math.min(90, y + DY) }, this.broadCastMove);
        break;
      case 'ArrowLeft':
        this.setState({ x: Math.max(0, x - DX) }, this.broadCastMove);
        break;
      case 'ArrowRight':
        this.setState({ x: Math.min(90, x + DX) }, this.broadCastMove);
        break;
      default:
        break;
    }
  };

  render() {
    const { minimi, y, x, users } = this.state;
    return (
      <MainContainer>
        <div className="audio-gred" ref={this.audioGridRef} />
        <PixelArt className="cat" />
        <PixelArt className="chicken" coord={{ left: '35%', top: '20%' }} />
        <PixelArt className="sonic" coord={{ left: '15%', top: '30%' }} />
        <PixelArt className={minimi} coord={{ left: `${x}%`, top: `${y}%` }} />
        <PixelArt className="hedgehog" coord={{ right: '10%' }} />
        <PixelArt className="flower" coord={{ bottom: '20%' }} />
        <PixelArt className="ladybug" coord={{ bottom: '20%', right: '40%' }} />
        {users.map(({ id, y, x, minimi }) => (
          <PixelArt
            key={id}
            className={minimi}
            coord={{ left: `${x}%`, top: `${y}%` }}
          />
        ))}
        <House />
        <KK />
        <Tree />
        <Gift />
        <Book />
      </MainContainer>
    );
  }
}

export default Main;
