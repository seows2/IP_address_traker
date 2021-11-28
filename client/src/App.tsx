import styled from 'styled-components';
import LinkedHello from './components/Hello';
import AlertModal from './components/modal/AlertModal';
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
        </Switch>
      </Main>
      <AlertModal />
    </BrowserRouter>
  );
}

export default App;
