import React, { useEffect } from 'react'
import { useParams } from 'react-router';
import Navigation from '../components/Navigation';
import API from '../utils/API';

const Results = () => {
  const { sessionId } = useParams();

  useEffect(() => {
    const loadResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const api = new API();
        const res = await api.getAPIRequestToken(`admin/session/${sessionId}/results`, token);
        const data = await res.json();

        if (res.ok) {
          console.log(data);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    loadResults()
  }, [])
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
