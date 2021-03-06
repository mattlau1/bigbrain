import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Edit from './pages/Edit';
import EditQuestion from './pages/EditQuestion';
import Play from './pages/Play';
import Results from './pages/Results';
import Join from './pages/Join';
import GameResult from './pages/GameResult'

function App () {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/editquestion/:id/:qid" component={EditQuestion} />
        <Route path="/edit/:quizId" component={Edit} />
        <Route path="/join" component={Join} />
        <Route path="/play/:sessionId" component={Play} />
        <Route path="/results/:sessionId" component={Results} />
        <Route path="/gameresult" component={GameResult} />
      </Switch>
    </Router>
  );
}

export default App;
