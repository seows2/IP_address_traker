import React, { Component, createContext, useContext, useEffect } from 'react';
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
  const [location, setLocation] = useLocation();

  const ctx = {
    location,
    push: setLocation,
  };

  const handleLocationChange = () => {
    setLocation(window.location.pathname);
  };

  useEffect(() => {
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  });

  return (
    <RouterContext.Provider value={ctx}>{children}</RouterContext.Provider>
  );
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
  const routerCtx = useContext(RouterContext);
  const acc = children.filter(
    (route) => route.props.path === routerCtx.location,
  );

  return acc[0];
};

const useRouter = () => {
  const routerCtx = useContext(RouterContext);

  return [routerCtx.location, routerCtx.push] as const;
};

export { BrowserRouter, Route, Switch, useRouter as useLocation };
