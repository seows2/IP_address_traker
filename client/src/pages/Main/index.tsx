import { FC, useCallback, useEffect, useState } from 'react';
import { Book, Gift, House, KK, Tree } from '../../components/main/IconButtons';
import PixelArt from '../../components/main/pixelArts';
import socket from '../../lib/api/socket';
import { MainContainer } from './index.style';

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
};

export default Main;
