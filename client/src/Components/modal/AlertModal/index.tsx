/* eslint-disable import/no-anonymous-default-export */
import { createPortal } from 'react-dom';
import { AlertModalWrapper } from './index.style';

const AlertModalComponent = () => (
  <AlertModalWrapper className="alert-modal">
    <span />
  </AlertModalWrapper>
);

export default () => {
  const $portal = document.getElementById('portal') as HTMLElement;
  return createPortal(AlertModalComponent(), $portal);
};
