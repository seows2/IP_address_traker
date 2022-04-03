import { FC, memo } from 'react';
import Coord from './coord';
import './cat/cat.css';
import './chicken/chicken.css';
import './flower/flower.css';
import './hedgehog/hedgehog.css';
import './ladybug/ladybug.css';
import './sonic/sonic.css';
import { getRandNumBetween } from '../../../utils/random';
import styled from 'styled-components';
import { getHashedNickName } from '../../../utils/hashedNickname';

type Minimi = 'cat' | 'chicken' | 'flower' | 'hedgehog' | 'ladybug' | 'sonic';

const minimiMap = ['cat', 'chicken', 'flower', 'hedgehog', 'ladybug', 'sonic'];

const PixelArtNickname = styled.div`
   position: relative;
   top: -10px;
   font-size: 11px;
   white-space: nowrap;
   line-height: 14px;
   text-align: center;
 `;

const PixelArt: FC<{
  coord?: Coord;
  className: Minimi;
  id?: string;
}> = ({ coord, className, id }) => {
  return (
    <div style={{ ...coord }} className={className}>
      <PixelArtNickname>{id && getHashedNickName(id)}</PixelArtNickname>
    </div>
  );
};

const genRandomPixelArt = () => {
  const randNum = getRandNumBetween(0, minimiMap.length - 1);
  const minimi = minimiMap[randNum] as Minimi;
  const x = getRandNumBetween(5, 95);
  const y = getRandNumBetween(5, 95);

  return { minimi, x, y };
};

export { genRandomPixelArt };
export type { Minimi };

export default memo(PixelArt);
