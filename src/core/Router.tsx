import React, { Component, createContext, useContext } from 'react';
import useLocation from '../hooks/useLocation';

interface RoutercontextType {
  location: string;
  push: (location: string) => void;
}

const RouterContext = createContext<RoutercontextType>({
  location: '',
  push: (location: string) => {},
});

const BrowserRouter: React.FC<{
  children?: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  return <div>{children}</div>;
};

class Route extends Component<{
  exact?: boolean;
  path: string;
}> {
  render() {
    const { children } = this.props;
    return children;
  }
}

const Switch: React.FC<{ children: JSX.Element[] }> = ({ children }) => {
  const [location, setLocation] = useLocation();
  const acc = children.filter((route) => route.props.path === location);

  return acc[0];
};

export { BrowserRouter, Route, Switch };
