import { FC, useState } from 'react';
import { Book, Gift, House, KK, Tree } from '../../components/main/IconButtons';
import { MainContainer } from './index.style';

const Main: FC = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleKeyDown = (event: globalThis.KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowUp':
        setY(Math.max(0, y - 1));
        break;
      case 'ArrowDown':
        setY(Math.max(90, y + 1));
        break;
      case 'ArrowLeft':
        setX(Math.max(0, x - 1));
        break;
      case 'ArrowRight':
        setX(Math.max(90, x + 1));
        break;
      default:
        break;
    }
  };

  return (
    <MainContainer>
      <House />
      <KK />
      <Tree />
      <Gift />
      <Book />
    </MainContainer>
  );
};

export default Main;
