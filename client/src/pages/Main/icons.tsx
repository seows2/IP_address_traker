import { FC } from 'react';

import { BookIcon, GiftIcon, HouseIcon, KKIcon, TreeIcon } from '../../assets';

const House: FC = () => {
  return (
    <button
      type="button"
      style={{
        position: 'absolute',
        left: '450px',
        top: '110px',
        cursor: 'pointer',
      }}
    >
      <HouseIcon />
    </button>
  );
};
const Book: FC = () => {
  return (
    <button
      type="button"
      style={{
        position: 'absolute',
        left: '550px',
        top: '300px',
        cursor: 'pointer',
      }}
    >
      <BookIcon />
    </button>
  );
};
const Gift: FC = () => {
  return (
    <button
      type="button"
      style={{
        position: 'absolute',
        left: '300px',
        top: '580px',
        cursor: 'pointer',
      }}
    >
      <GiftIcon />
    </button>
  );
};
const KK: FC = () => {
  return (
    <button
      type="button"
      style={{
        position: 'absolute',
        left: '150px',
        top: '280px',
        cursor: 'pointer',
      }}
    >
      <KKIcon />
    </button>
  );
};
const Tree: FC = () => {
  return (
    <button
      type="button"
      style={{
        position: 'absolute',
        left: '1100px',
        top: '100px',
        cursor: 'pointer',
      }}
    >
      <TreeIcon />
    </button>
  );
};

export { House, Book, Gift, KK, Tree };
