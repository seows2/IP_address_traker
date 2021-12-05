import { FC, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import {
  BookIcon,
  GiftIcon,
  HouseIcon,
  KKIcon,
  TreeIcon,
} from '../../../assets';
import { useHistory } from '../../../core/Router';
import { alert } from '../../../utils/modal';

const ALERT_MESSAGE = '아직 구현되지 않았습니다.';
const AlertNotAvailable = () => alert(ALERT_MESSAGE);

const BUTTON_INFOS = {
  book: ['20%', '15%', <BookIcon />],
  gift: ['0%', '35%', <GiftIcon />],
  house: ['70%', '45%', <HouseIcon />],
  kk: ['60%', '10%', <KKIcon />],
  tree: ['40%', '75%', <TreeIcon />],
};

const rotate = keyframes`
  100% {
    transform: rotate(1turn)
  }
`;

export type TypeCategoryIcon = 'book' | 'gift' | 'house' | 'kk' | 'tree';

const ButtonWrapper = styled.button<{ category: string; entered?: boolean }>`
  position: absolute;
  cursor: pointer;
  left: ${({ category }) => BUTTON_INFOS[category][0]};
  top: ${({ category }) => BUTTON_INFOS[category][1]};
  animation: ${({ entered }) =>
    entered &&
    css`
      ${rotate} 1s linear infinite
    `};
  animation-play-state: ${({ entered }) => (entered ? 'running' : 'paused')};
`;

const Button: FC<{
  category: string;
  entered?: boolean;
  onClick?: () => void;
}> = ({ category, entered, onClick }) => (
  <ButtonWrapper
    category={category}
    type="button"
    entered={entered}
    onClick={onClick || AlertNotAvailable}
  >
    {BUTTON_INFOS[category][2]}
  </ButtonWrapper>
);

const House: FC<{ entered?: TypeCategoryIcon }> = ({ entered }) => {
  const { push } = useHistory();
  const onClick = useCallback(() => push('/'), []);
  return (
    <Button category="house" entered={entered === 'house'} onClick={onClick} />
  );
};

const Book: FC<{ entered?: TypeCategoryIcon }> = ({ entered }) => {
  const { push } = useHistory();
  const onClick = useCallback(() => push('/'), []);
  return (
    <Button category="book" entered={entered === 'book'} onClick={onClick} />
  );
};
const Gift: FC = () => {
  return <Button category="gift" />;
};
const KK: FC = () => {
  return <Button category="kk" />;
};
const Tree: FC = () => {
  return <Button category="tree" />;
};

export { House, Book, Gift, KK, Tree };
