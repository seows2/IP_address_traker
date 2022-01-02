import { Component } from 'react';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import {
  Book,
  Gift,
  House,
  KK,
  Tree,
  TypeCategoryIcon,
} from '../../components/main/IconButtons';
import PixelArt, {
  genRandomPixelArt,
  Minimi,
} from '../../components/main/Minimi';
import createSocket from '../../lib/api/socket';
import { VideoGrid, MainContainer, MyVideoWrapper } from './index.style';
import { v4 as uuidv4 } from 'uuid';
import createPeer from '../../lib/api/peer';
import { alert } from '../../utils/modal';
import { Socket } from 'socket.io-client';
import RTCVideo from './RTCVideo';

interface MainState {
  users: { id: string; x: number; y: number; minimi: Minimi }[];
  peerCalls: Record<
    string,
    { mediaConn: MediaConnection; isSendingVoice: boolean }
  >;
  connections: Record<string, DataConnection>;
  streams: { id: string; stream: MediaStream }[];
  minimi: Minimi;
  entered?: TypeCategoryIcon;
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
const delayMS = 400;
const pleaseAlloweRecord =
  '다른사람은 내목소리를 못들어요. 마이크 권한을 켜주세요.';
const MEDIA_OPTIONS = {
  audio: true,
  video: {
    width: { min: 100, ideal: 240 },
  },
};

const categoryCoords = {
  book: {
    x: 20,
    y: 17,
  },
  gift: {
    x: -3,
    y: 36,
  },
  tree: {
    x: 39,
    y: 73,
  },
  house: {
    x: 67,
    y: 43,
  },
  kk: {
    x: 59,
    y: 5,
  },
};

class Main extends Component<{ u?: string }, MainState> {
  myStream?: MediaStream;
  peer: Peer;
  myId: string;
  socket: Socket;
  state: Readonly<MainState>;

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
      streams: [],
    };

    this.socket = createSocket();
    this.myId = uuidv4();
    this.peer = createPeer(this.myId);

    this.peer.on('open', (id) => {
      this.socket.emit('join-room', id);
    });

    this.setupConnections();
  }

  componentWillUnmount() {
    this.myStream?.getTracks().forEach((mediaTrack) => {
      mediaTrack.stop();
    });
    this.socket.disconnect();
    this.peer.destroy();
    document.body.removeEventListener('keydown', this.onKeyDown);
  }

  boundChecker = () => {
    const threshold = {
      x: 12,
      y: 14,
    };

    const characterOffset = {
      x: 3,
      y: 3,
    };

    const { x, y } = this.state;

    let enteredCategory: TypeCategoryIcon | undefined = undefined;

    Object.entries(categoryCoords).forEach(
      ([category, { x: categoryX, y: categoryY }]) => {
        if (
          categoryY - threshold.y < y - characterOffset.y &&
          y - characterOffset.y < categoryY + threshold.y &&
          categoryX - threshold.x < x - characterOffset.x &&
          x - characterOffset.x < categoryX + threshold.x
        ) {
          enteredCategory = category as TypeCategoryIcon;
        }
      },
    );
    if (enteredCategory) {
      this.setState({ entered: enteredCategory }, () => {
        alert(`엔터 버튼을 눌러서 ${enteredCategory}로 이동해요`);
      });
    } else {
      this.setState({ entered: undefined });
    }
  };

  onMinimiMove = () => {
    this.boundChecker();
    this.broadCastMove();
  };

  setupConnections() {
    this.setupVideoStream();

    this.socket.on('user-connected', async (userId: string) => {
      console.log(this.myId, userId);

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
          const conn = this.peer.connect(con.peer);
          setTimeout(() => {
            conn.send({ message: 'hello2', from: this.myId });
            this.addConnections(con.peer, conn);
          }, delayMS);
        } else if (data.message === 'callMe') {
          alert(`${con.peer}가 내 목소리를 듣습니다.`);
          this.callTo(con.peer);
        }
      });
    });

    this.socket.on('user-disconnected', (userId) => {
      alert(`${userId}님이 퇴장했습니다.`);
      const { peerCalls } = this.state;
      peerCalls[userId]?.mediaConn.close();
      delete peerCalls[userId];
      this.setState({
        peerCalls,
        users: this.state.users.filter((user) => user.id !== userId),
      });
      this.removeConnections(userId);
      this.removeVideoStream(userId);
    });

    document.body.addEventListener('keydown', this.onKeyDown);
  }

  callTo = (peerId: string) => {
    navigator.mediaDevices.getUserMedia(MEDIA_OPTIONS).then((myVoice) => {
      const call = this.peer.call(peerId, myVoice);
      const { peerCalls } = this.state;
      const nextPeers = {
        ...peerCalls,
        [peerId]: {
          mediaConn: call,
          isSendingVoice: false,
        },
      };
      this.setState({ peerCalls: nextPeers });
    });
  };

  addConnections = (id: string, connection: DataConnection) => {
    const { connections } = this.state;
    const nextConnections = {
      ...connections,
      [id]: connection,
    };
    this.setState({ connections: nextConnections });
  };

  removeConnections = (id: string) => {
    const { connections } = this.state;
    delete connections[id];
    this.setState({ connections });
  };

  updateMinimi = (minimiMessage: MinimiUpdateMessage) => {
    const { x, y, from, minimi } = minimiMessage;
    const { users } = this.state;
    const nextUsers = users.slice().filter((user) => user.id !== from);
    nextUsers.push({ x, y, minimi, id: from });
    this.setState({ users: nextUsers });
  };

  setupVideoStream = () => {
    this.peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia(MEDIA_OPTIONS)
        .then((myStream) => {
          this.myStream = myStream;
          call.answer(myStream);
          call.on('stream', (otherUserStream) => {
            this.addVideoStream(otherUserStream, call.peer);
          });
        })
        .catch((_) => {
          const { peerCalls } = this.state;
          const nextPeers = {
            ...peerCalls,
            [call.peer]: {
              mediaConn: call,
              isSendingVoice: false,
            },
          };
          this.setState({ peerCalls: nextPeers });

          call.answer(undefined);
          call.on('stream', (otherUserSteram) => {
            this.addVideoStream(otherUserSteram, call.peer);
          });
          alert(`${call.peer}의 음성을 듣기 시작합니다.`, 3000);
        });
    });

    this.socket.on('user-connected', async (userId) => {
      navigator.mediaDevices
        .getUserMedia(MEDIA_OPTIONS)
        .then((myStream) => {
          this.myStream = myStream;
          const call = this.peer.call(userId, myStream);

          call.on('stream', (otherUserStream) => {
            this.addVideoStream(otherUserStream, call.peer);
          });

          const { peerCalls } = this.state;
          const nextPeers = {
            ...peerCalls,
            [call.peer]: {
              mediaConn: call,
              isSendingVoice: true,
            },
          };
          this.setState({ peerCalls: nextPeers });
        })
        .catch((_) => {
          setTimeout(() => {
            const { connections } = this.state;
            connections[userId]?.send({ message: 'callMe', from: this.myId });
          }, delayMS);
        });
    });
  };

  addVideoStream = (stream: MediaStream, id: string) => {
    const { streams } = this.state;

    const nextStreams = [
      ...streams.filter((streamInfo) => streamInfo.id !== id),
      {
        stream,
        id,
      },
    ];
    this.setState({ streams: nextStreams });
  };

  removeVideoStream = (id: string) => {
    const { streams } = this.state;
    const nextStreams = streams.filter((streamInfo) => streamInfo.id !== id);
    this.setState({ streams: nextStreams });
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
        this.setState({ y: Math.max(0, y - DY) }, this.onMinimiMove);
        break;
      case 'ArrowDown':
        this.setState({ y: Math.min(90, y + DY) }, this.onMinimiMove);
        break;
      case 'ArrowLeft':
        this.setState({ x: Math.max(0, x - DX) }, this.onMinimiMove);
        break;
      case 'ArrowRight':
        this.setState({ x: Math.min(90, x + DX) }, this.onMinimiMove);
        break;
      default:
        break;
    }
  };

  render() {
    const { minimi, y, x, users, entered, streams, connections } = this.state;
    return (
      <MainContainer>
        <VideoGrid>
          {streams.map(({ id, stream }) => (
            <RTCVideo key={id} id={id} stream={stream} />
          ))}
        </VideoGrid>
        <MyVideoWrapper>
          <div>{Object.keys(connections).length} 명 접속중</div>
          {this.myStream && (
            <RTCVideo id={this.myId} stream={this.myStream} muted />
          )}
        </MyVideoWrapper>
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
        <House entered={entered} />
        <KK entered={entered} />
        <Tree entered={entered} />
        <Gift entered={entered} />
        <Book entered={entered} />
      </MainContainer>
    );
  }
}

export default Main;
