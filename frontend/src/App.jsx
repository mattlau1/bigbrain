import React from 'react';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Edit from './pages/Edit';
import EditQuestion from './pages/EditQuestion';

function App () {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/edit/:id" component={Edit} />
        <Route path="/editq/:id/:qid" component={EditQuestion} />
      </Switch>
    </Router>
  );
}

export default App;
