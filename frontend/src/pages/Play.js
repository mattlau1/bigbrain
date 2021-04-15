import React from 'react'
import { useParams } from 'react-router';

const Play = () => {
  const { id } = useParams();
  return (
    <>
      <div>
          You are playing game {id}
      </div>
    </>
  )
}

export default Play
