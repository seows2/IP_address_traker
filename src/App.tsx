import React from 'react';
import Hello from './Components/Hello';
import World from './Components/World';
import { BrowserRouter, Route, Switch } from './core/Router';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/hello" exact>
          <Hello>안녕!</Hello>
        </Route>
        <Route path="/world" exact>
          <World>세상!</World>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
