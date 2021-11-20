import React from 'react';
import LinkedHello from './Components/Hello';
import World from './Components/World';
import { BrowserRouter, Route, Switch } from './core/Router';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/hello" exact>
          <LinkedHello />
        </Route>
        <Route path="/world" exact>
          <World />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
