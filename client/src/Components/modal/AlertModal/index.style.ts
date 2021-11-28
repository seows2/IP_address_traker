import styled from 'styled-components';

export const AlertModalWrapper = styled.aside`
  opacity: 0;
  position: fixed;
  padding: 13px 30px;
  left: calc(50% - 155px);
  bottom: calc(50% - 400px);
  height: 20px;
  line-height: 1.71;
  font-size: 14px;
  color: #fff;
  background-color: #000;
  border-radius: 40px;
  transform: translateY(0px);
  transition: all 0.8s ease;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  z-index: -1;
  &.show {
    opacity: 1;
    transform: translateY(-100px);
    z-index: 9999;
  }
`;
