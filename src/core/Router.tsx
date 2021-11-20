import React, { Component, createContext, useContext, useEffect } from 'react';
import useBrowserLocation from '../hooks/useBrowserLocation';
import styled from 'styled-components';

interface RouterLocation {
  pathname: string;
  hash: string;
  search: string;
  state?: Record<string, unknown>;
}

interface RouterContextType {
  location: RouterLocation;
  push: (location: Partial<RouterLocation>) => void;
}

const RouterContext = createContext<RouterContextType>({
  location: {
    pathname: '/dummy_path',
    hash: '#dummy',
    search: '?some=search_string',
  },
  push: (location: Partial<RouterLocation>) => {},
});

const BrowserRouter: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [location, setLocation] = useBrowserLocation();

  const ctx = {
    location,
    push: (newLocation: Partial<RouterLocation>) => {
      window.history.pushState({}, '', newLocation.pathname);
      setLocation(newLocation);
    },
  };

  const handleLocationChange = (popEvent: PopStateEvent) => {
    const { pathname, hash, search } = window.location;
    const { state } = popEvent;
    setLocation({ pathname, hash, search, state });
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
  const acc = children.filter((route) => {
    // [TODO]: route.props.exact가 true 일 때 구분 기능
    if (route.props.path === routerCtx.location.pathname) return true;
    return false;
  });

  return acc[0];
};

/**
 * useLocation hook은 현재 URL을 나타내는 위치를 반환.
 * URL이 변경될 때마다 새 위치를 반환하는 useState와 같음
 * @returns {
 *  pathname: "/path/to",
 *  search: "?search=SeoWS",
 *  hash: "#hashTo",
 * }
 *
 * @example
 * const location = useLocation();
 * console.log(location.search)
 */
const useLocation = () => {
  const routerCtx = useContext(RouterContext);

  return routerCtx.location;
};

/**
 * history 객체를 반환합니다.
 * @returns {
 *  location: {
 *    pathname: "/path/to",
 *    search: "?search=SeoWS",
 *    hash: "#hashTo"
 *  },
 *  push: (path, state?) => void,
 * }
 *
 * @example
 * const history = useHistory();
 * history.push("/main");
 *
 * @example
 * const history = useHistory();
 * console.log(history.pathname);
 *
 *
 * // main에서는 history.location.state를 통해서 message를 받음
 * @example
 * const history = useHistory();
 * history.push("/main", { message: "hi" });
 *
 */
const useHistory = () => {
  const routerCtx = useContext(RouterContext);

  return {
    location: routerCtx.location,
    push: (pathname: string, state?: Record<string, unknown>) => {
      routerCtx.push({ pathname, state });
    },
  } as const;
};

const StyledLink = styled.a`
  cursor: pointer;
`;

const Link: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => {
  const { push } = useHistory();
  return (
    <StyledLink
      href={to}
      onClick={(event) => {
        event.preventDefault();
        push(to);
      }}
    >
      {children}
    </StyledLink>
  );
};

export { BrowserRouter, Route, Link, useHistory, Switch, useLocation };
export type { RouterLocation };
