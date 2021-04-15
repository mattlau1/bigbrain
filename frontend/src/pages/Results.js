import React from 'react'
import { useParams } from 'react-router';
import Navigation from '../components/Navigation';

const Results = () => {
  const { id } = useParams();
  return (
    <>
      <Navigation />
      <div>
          You are viewing the results of game {id}
      </div>
    </>
  )
}

export default Results
