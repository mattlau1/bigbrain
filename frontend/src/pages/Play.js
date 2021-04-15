import React from 'react'
import { useParams } from 'react-router';

const Play = () => {
  const { sessionId } = useParams();
  return (
    <>
      <div>
          You are playing game {sessionId}
      </div>
    </>
  )
}

export default Play
