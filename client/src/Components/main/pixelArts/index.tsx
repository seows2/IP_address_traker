import { FC } from 'react';
import Coord from './coord';

const PixelArts: FC<{
  coord?: Coord;
  className: string;
}> = ({ coord, className }) => {
  return <div className={className}>asd</div>;
};

export default PixelArts;
