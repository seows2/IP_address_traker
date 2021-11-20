import React, {
  Component,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  params?: {
    [key: string]: string;
  };
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
  const [windowLocation, setWindowLocation] = useState<RouterLocation>(
    window.location,
  );

  const ctx = {
    location: windowLocation,
    push: (newLocation: Partial<RouterLocation>) => {
      const { state, pathname } = newLocation;
      window.history.pushState(state, '', pathname);
      setWindowLocation({ ...windowLocation, ...newLocation });
    },
  };

  const handleLocationChange = (popEvent: PopStateEvent) => {
    const { pathname, hash, search } = window.location;
    const { state } = popEvent;
    setWindowLocation({ ...windowLocation, pathname, hash, search, state });
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

const compilePath = (path: string) => {
  const keys: string[] = [];

  const subPath = path.replace(/:(\w+)/g, (_, key) => {
    keys.push(key);
    return '([^\\/]+)';
  });

  const source = `^(${subPath})`;
  const regex = new RegExp(source, 'i');

  return { regex, keys };
};

const Switch: React.FC<{ children: JSX.Element[] }> = ({ children }) => {
  const routerCtx = useContext(RouterContext);
  let routerParams = {};

  for (const route of children) {
    const { exact, path } = route.props;
    if (exact && route.props.path === routerCtx.location.pathname) return route;
    if (exact && route.props.path !== routerCtx.location.pathname) continue;

    const { regex, keys } = compilePath(path);
    const match = routerCtx.location.pathname.match(regex);

    if (match) {
      const params = match.slice(2);

      routerParams = keys.reduce<{ [key: string]: string }>((acc, cur, idx) => {
        acc[cur] = params[idx];
        return acc;
      }, {});

      routerCtx.params = routerParams;
      return route;
    }
  }

  return <div>No Matching Route</div>;
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
 * url에 매칭된 파라미터들을 가져옵니다.
 * @returns {
 *  pattern: "matched"
 * }
 *
 * @example
 * <Route path="/hello/:name/:age">
 *    <Person/>
 * </Route>
 *
 * const Person = () => {
 *    const { name, age } = useParams();
 *    return <div>내 이름은 {name}이고 나이는 {age}야</div>
 * }
 */
const useParams = () => {
  const routerCtx = useContext(RouterContext);

  return routerCtx.params;
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

export {
  BrowserRouter,
  Route,
  Switch,
  Link,
  useHistory,
  useLocation,
  useParams,
};
export type { RouterLocation };
