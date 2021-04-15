import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Edit from './pages/Edit';
import Play from './pages/Play';
import Results from './pages/Results';

function App () {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/edit/:id" component={Edit} />
        <Route path="/play/:id" component={Play} />
        <Route path="/results/:id" component={Results} />
      </Switch>
    </Router>
  );
}

export default App;
