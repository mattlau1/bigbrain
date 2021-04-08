import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { useAlert } from '../contexts/AlertProvider';

const Dashboard = () => {
  const [inputVal, setInputVal] = useState('');
  const [inputVal2, setInputVal2] = useState('');
  const dispatch = useAlert();

  const handleNewAlert = () => {
    dispatch({
      type: 'SUCCESS',
      message: inputVal,
      title: 'Successful Request'
    })
  }

  const handleNewError = () => {
    dispatch({
      type: 'ERROR',
      message: inputVal,
      title: 'Successful Request'
    })
  }

  return (
    <>
      <Navigation />
      <p>This is a dashboard</p>
      <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)}/>
      <button onClick={handleNewAlert}>Add Alert</button>
      <input type="text" value={inputVal2} onChange={e => setInputVal2(e.target.value)}/>
      <button onClick={handleNewError}>Add Error</button>

    </>
  )
}

export default Dashboard;
