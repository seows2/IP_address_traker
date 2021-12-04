import { FC } from 'react';
import Coord from './coord';
import './cat/cat.css';
import './chicken/chicken.css';
import './flower/flower.css';
import './hedgehog/hedgehog.css';
import './ladybug/ladybug.css';
import './sonic/sonic.css';
import { getRandNumBetween } from '../../../utils/random';

type Minimi = 'cat' | 'chicken' | 'flower' | 'hedgehog' | 'ladybug' | 'sonic';

const minimiMap = ['cat', 'chicken', 'flower', 'hedgehog', 'ladybug', 'sonic'];

const PixelArt: FC<{
  coord?: Coord;
  className: Minimi;
}> = ({ coord, className }) => {
  return <div style={{ ...coord }} className={className}></div>;
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

export default PixelArt;
