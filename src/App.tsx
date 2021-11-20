import React from 'react';
import LinkedHello from './Components/Hello';
import World from './Components/World';
import { BrowserRouter, Route, Switch } from './core/Router';

function App() {
  return (
    <BrowserRouter>
      <Switch>
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
    </BrowserRouter>
  );
}

export default App;
