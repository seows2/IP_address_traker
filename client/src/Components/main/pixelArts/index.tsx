import { FC } from 'react';
import Coord from './coord';
import './cat/cat.css';

const PixelArt: FC<{
  coord?: Coord;
  className: 'cat';
}> = ({ coord, className }) => {
  return <div style={{ ...coord }} className={className}></div>;
};

export default PixelArt;
