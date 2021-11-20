import React from 'react';
import styled from 'styled-components';
import { useHistory } from '../core/Router';

const Title = styled.div`
  color: skyblue;
`;

const World: React.FC = () => {
  const { location, push } = useHistory();
  return (
    <Title
      onClick={() => {
        push('/hello', { message: 'hi' });
      }}
    >
      월드월드~
    </Title>
  );
};

export default World;
