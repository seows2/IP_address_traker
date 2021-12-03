import { Component, createRef, RefObject } from 'react';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { Book, Gift, House, KK, Tree } from '../../components/main/IconButtons';
import PixelArt from '../../components/main/Minimi';
import socket from '../../lib/api/socket';
import { MainContainer } from './index.style';
import { v4 as uuidv4 } from 'uuid';
import createPeer from '../../lib/api/peer';
import { delay } from '../../utils/protocol';

interface MainState {
  myId: string;
  users?: { id: string; x: number; y: number }[];
  peerCalls: Record<string, MediaConnection>;
  connections: Record<string, DataConnection>;
  x: number;
  y: number;
}

const [DX, DY] = [2, 2];

class Main extends Component<{ u?: string }, MainState> {
  audioGridRef: RefObject<HTMLDivElement>;
  peer: Peer;
  myId: string;

  constructor(props) {
    super(props);
    this.state = {
      peerCalls: {},
      connections: {},
      myId: '',
      x: 5,
      y: 5,
    };
    this.myId = uuidv4();
    this.peer = createPeer(this.myId);
    this.audioGridRef = createRef<HTMLDivElement>();
  }

  componentDidMount() {
    this.setupAudioStream();
    this.peer.on('open', (id) => {
      socket.emit('join-room', id);
    });

    socket.on('user-connected', async (userId: string) => {
      console.log('user-connected! ID: ', userId);
      const conn = this.peer.connect(userId, { reliable: true });
      // const { myId } = this.state;

      await delay(2000);
      conn.send({ message: 'hello', from: this.myId });
    });

    this.peer.on('connection', (con) => {
      con.on('data', (data) => {
        console.log('received data', data);
        this.addConnections(data.from, con);
      });
    });

    socket.on('user-disconnected', (userId) => {
      console.log(`user-disconnected: ${userId}`);
    });

    document.body.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onKeyDown);
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

  setupAudioStream = () => {
    navigator.mediaDevices
      .getUserMedia({
        // video: true,
        audio: true,
      })
      .then((myStream) => {
        /**
         * 누군가가 나할테 call을 했을 때.
         */
        this.peer.on('call', (call) => {
          call.answer(myStream);

          const newAudio = document.createElement('audio');
          this.audioGridRef.current?.appendChild(newAudio);
          call.on('stream', (otherUserStream) => {
            this.addAudioStream(newAudio, otherUserStream);
          });
          console.log('peer ', call.peer);
        });

        socket.on('user-connected', (userId) => {
          const call = this.peer.call(userId, myStream);
          const newAudio = document.createElement('audio');
          this.audioGridRef.current?.appendChild(newAudio);

          call.on('stream', (otherUserStream) => {
            this.addAudioStream(newAudio, otherUserStream);
          });

          call.on('close', () => {
            newAudio.remove();
          });

          const { peerCalls: peers } = this.state;
          const nextPeers = {
            ...peers,
            [userId]: call,
          };
          this.setState({ peerCalls: nextPeers });
        });
      });
  };

  addAudioStream = (audio: HTMLAudioElement, stream: MediaStream) => {
    audio.srcObject = stream;
    audio.addEventListener('loadedmetadata', () => {
      audio.play();
    });
  };

  onKeyDown = (event: globalThis.KeyboardEvent) => {
    const { y, x } = this.state;
    switch (event.code) {
      case 'ArrowUp':
        this.setState({ y: Math.max(0, y - DY) });
        break;
      case 'ArrowDown':
        this.setState({ y: Math.min(90, y + DY) });
        break;
      case 'ArrowLeft':
        this.setState({ x: Math.max(0, x - DX) });
        break;
      case 'ArrowRight':
        this.setState({ x: Math.min(90, x + DX) });
        break;
      default:
        break;
    }
  };

  render() {
    const { y, x } = this.state;
    return (
      <MainContainer>
        <div className="audio-gred" ref={this.audioGridRef} />
        <PixelArt className="cat" />
        <PixelArt className="sonic" coord={{ left: '15%', top: '30%' }} />
        <PixelArt className="chicken" coord={{ left: `${x}%`, top: `${y}%` }} />
        <PixelArt className="hedgehog" coord={{ right: '10%' }} />
        <PixelArt className="flower" coord={{ bottom: '20%' }} />
        <PixelArt className="ladybug" coord={{ bottom: '20%', right: '40%' }} />
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
