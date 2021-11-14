import React from 'react';
import Title from './Components/Title';
import { BrowserRouter, Route, Switch } from './core/Router';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/hello" exact>
          <Title>안녕!</Title>
        </Route>
        <Route path="/world" exact>
          <Title>세상!</Title>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
