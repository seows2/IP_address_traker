import { FC } from 'react';
import Coord from './coord';
import './cat/cat.css';
import './chicken/chicken.css';
import './flower/flower.css';
import './hedgehog/hedgehog.css';
import './ladybug/ladybug.css';
import './sonic/sonic.css';

type Minimi = 'cat' | 'chicken' | 'flower' | 'hedgehog' | 'ladybug' | 'sonic';

const PixelArt: FC<{
  coord?: Coord;
  className: Minimi;
}> = ({ coord, className }) => {
  return <div style={{ ...coord }} className={className}></div>;
};

export default PixelArt;
