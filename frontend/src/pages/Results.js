import React from 'react'
import { useParams } from 'react-router';
import Navigation from '../components/Navigation';

const Results = () => {
  const { sessionId } = useParams();
  return (
    <>
      <Navigation />
      <div>
        You are viewing the results of game {sessionId}
      </div>
      <div>
        your token is {localStorage.getItem('token')}
      </div>
    </>
  )
}

export default Results
