import { Component, createRef, RefObject } from 'react';
import { MediaConnection } from 'peerjs';
import { Book, Gift, House, KK, Tree } from '../../components/main/IconButtons';
import PixelArt from '../../components/main/Minimi';
import socket from '../../lib/api/socket';
import { MainContainer } from './index.style';
import peer from '../../lib/api/peer';

interface MainState {
  users?: { id: string; x: number; y: number }[];
  peers: Record<string, MediaConnection>;
  x: number;
  y: number;
}

const [DX, DY] = [2, 2];

class Main extends Component<{ u?: string }, MainState> {
  myVideoRef: RefObject<HTMLVideoElement>;

  audioGridRef: RefObject<HTMLDivElement>;

  videoGridRef: RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.state = {
      peers: {},
      x: 5,
      y: 5,
    };
    console.log(this.state);
    this.audioGridRef = createRef<HTMLDivElement>();
    this.myVideoRef = createRef<HTMLVideoElement>();
    this.videoGridRef = createRef<HTMLDivElement>();
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({
        // video: true,
        audio: true,
      })
      .then((myStream) => {
        /**
         * 누군가가 나할테 call을 했을 때.
         */
        peer.on('call', (call) => {
          call.answer(myStream);

          const newAudio = document.createElement('audio');
          this.audioGridRef.current?.appendChild(newAudio);
          call.on('stream', (otherUserStream) => {
            this.addAudioStream(newAudio, otherUserStream);
          });
          console.log('peer ', call.peer);
        });

        socket.on('user-connected', (userId) => {
          console.log('user-connected! ID: ', userId);
          const call = peer.call(userId, myStream);
          const newAudio = document.createElement('audio');
          this.audioGridRef.current?.appendChild(newAudio);

          call.on('stream', (otherUserStream) => {
            this.addAudioStream(newAudio, otherUserStream);
          });

          call.on('close', () => {
            newAudio.remove();
          });

          const { peers } = this.state;
          const nextPeers = {
            ...peers,
            userId: call,
          };
          this.setState({ peers: nextPeers });
        });
      });

    peer.on('open', (id) => {
      socket.emit('join-room', id);
    });

    socket.on('user-disconnected', (userId) => {
      console.log(`user-disconnected: ${userId}`);
      const { peers } = this.state;
      peers[userId]?.close();
    });

    document.body.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onKeyDown);
  }

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
