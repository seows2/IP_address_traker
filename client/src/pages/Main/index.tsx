import { Component, createRef, RefObject } from 'react';
import { MediaConnection } from 'peerjs';
import { Book, Gift, House, KK, Tree } from '../../components/main/IconButtons';
import PixelArt from '../../components/main/pixelArts';
import socket from '../../lib/api/socket';
import { MainContainer } from './index.style';
import peer from '../../lib/api/peer';

interface MainState {
  users: { id: string; videoRef?: RefObject<HTMLVideoElement> }[];
  peers: Record<string, MediaConnection>;
}

class Main extends Component<{ u?: string }, MainState> {
  myVideoRef: RefObject<HTMLVideoElement>;

  audioGridRef: RefObject<HTMLDivElement>;

  videoGridRef: RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      peers: {},
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
  }

  addAudioStream = (audio: HTMLAudioElement, stream: MediaStream) => {
    audio.srcObject = stream;
    audio.addEventListener('loadedmetadata', () => {
      audio.play();
    });
  };

  render() {
    const { users } = this.state;
    return (
      <MainContainer>
        <div className="audio-gred" ref={this.audioGridRef} />
        <PixelArt className="cat" />
        <House />
        <KK />
        <Tree />
        <Gift />
        <Book />
      </MainContainer>
    );
  }
}
/* 
const Main: FC = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
          setY(Math.max(0, y - 1));
          break;
        case 'ArrowDown':
          setY(Math.min(90, y + 1));
          break;
        case 'ArrowLeft':
          setX(Math.max(0, x - 1));
          break;
        case 'ArrowRight':
          setX(Math.min(90, x + 1));
          break;
        default:
          break;
      }
      socket.emit('move', { op: JSON.stringify({ y, x }) });
    },
    [x, y],
  );

  useEffect(() => {
    socket.on('update-moves', ({ op }: { op: string }) => {
      console.log(op);
    });
  });

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <MainContainer>
      <PixelArt className="cat" coord={{ left: `${x}%`, top: `${y}%` }} />
      <House />
      <KK />
      <Tree />
      <Gift />
      <Book />
    </MainContainer>
  );
}; */

export default Main;
