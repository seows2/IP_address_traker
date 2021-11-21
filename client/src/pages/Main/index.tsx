import { FC } from 'react';
import { Book, Gift, House, KK, Tree } from './icons';
import { MainContainer } from './index.style';

const Main: FC = () => {
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
