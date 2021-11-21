import React from 'react';
import styled from 'styled-components';
import { useHistory } from '../core/Router';

const Title = styled.div`
  color: skyblue;
`;

const World: React.FC = () => {
  const { location, push, goBack } = useHistory();
  return (
    <>
      <Title
        onClick={() => {
          push('/hello/seows/123', { message: 'hi' });
        }}
      >
        월드월드~
      </Title>
      <div onClick={() => goBack()}>1231231</div>
    </>
  );
};

export default World;
