import styled from 'styled-components';
import LinkedHello from './Components/Hello';
import World from './Components/World';
import { BrowserRouter, Route, Switch } from './core/Router';
import MainPage from './pages/Main';
import './styles/app.css';

const Main = styled.main`
  height: 100%;
`;

function App() {
  return (
    <BrowserRouter>
      <Main>
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route exact path="/hello">
            <LinkedHello />
          </Route>
          <Route path="/hello/:name/:number">
            <LinkedHello />
          </Route>
          <Route exact path="/world">
            <World />
          </Route>
        </Switch>
      </Main>
    </BrowserRouter>
  );
}

export default App;
