import { FC, useCallback } from 'react';
import styled from 'styled-components';
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
  book: ['20%', '110px', <BookIcon />],
  gift: ['0%', '280px', <GiftIcon />],
  house: ['70%', '240px', <HouseIcon />],
  kk: ['75%', '100px', <KKIcon />],
  tree: ['65%', '550px', <TreeIcon />],
};

const ButtonWrapper = styled.button<{ category: string }>`
  position: absolute;
  cursor: pointer;
  left: ${({ category }) => BUTTON_INFOS[category][0]};
  top: ${({ category }) => BUTTON_INFOS[category][1]};
`;

const Button: FC<{ category: string; onClick?: () => void }> = ({
  category,
  onClick,
}) => (
  <ButtonWrapper
    category={category}
    type="button"
    onClick={onClick || AlertNotAvailable}
  >
    {BUTTON_INFOS[category][2]}
  </ButtonWrapper>
);

const House: FC = () => {
  const { push } = useHistory();
  const onClick = useCallback(() => push('/'), []);
  return <Button category="house" onClick={onClick} />;
};

const Book: FC = () => {
  const { push } = useHistory();
  const onClick = useCallback(() => push('/'), []);
  return <Button category="book" onClick={onClick} />;
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
