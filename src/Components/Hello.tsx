import React from 'react';
import styled from 'styled-components';
import { useLocation } from '../core/Router';

const Title = styled.div`
  color: skyblue;
`;

const Hello: React.FC = () => {
  const [location, setLocation] = useLocation();

  return (
    <Title
      onClick={() => {
        setLocation('/world');
      }}
    >
      안녕안녕
    </Title>
  );
};

export default Hello;
