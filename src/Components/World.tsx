import React from 'react';
import styled from 'styled-components';
import { useLocation } from '../core/Router';

const Title = styled.div`
  color: skyblue;
`;

const World: React.FC = () => {
  const [location, setLocation] = useLocation();

  return (
    <Title
      onClick={() => {
        setLocation('/hello');
      }}
    >
      월드월드~
    </Title>
  );
};

export default World;
