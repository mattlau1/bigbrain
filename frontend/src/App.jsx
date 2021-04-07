import React from 'react';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App () {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/dashboard" exact component={Dashboard} />
      </Switch>
    </Router>
  );
}

export default App;
