import { React, useState, useEffect } from 'react'
import { useParams } from 'react-router';
import API from '../utils/API';
import { useLocation } from 'react-router-dom';

const Play = () => {
  const [quizId, setQuizId] = useState(0);
  console.log(quizId);
  const { sessionId } = useParams();
  const location = useLocation();
  const playerId = location.state?.playerId;
  const api = new API();
  console.log('player id is ' + playerId);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const getQuestionDetail = async () => {
      try {
        const res = await api.getAPIRequest(`play/${playerId}/question`);
        const data = await res.json();
        if (res.ok) {
          console.log(data);
        } else {
          console.log('cannot get question details');
        }
      } catch (e) {
        console.log('error');
        console.warn(e);
      }
    }
    const getQuizId = (quizObject) => {
      quizObject.forEach((quiz) => {
        (quiz.active === parseInt(sessionId, 10)) && setQuizId(quiz.id)
      })
    }
    const loadQuestion = async () => {
      try {
        const res = await api.getAPIRequestToken('admin/quiz', token);
        const data = await res.json();
        if (res.ok) {
          getQuizId(data.quizzes);
        } else {
          console.log('load questions UNsuccessully');
        }
      } catch (e) {
        console.log('error');
        console.warn(e);
      }
    }
    loadQuestion();
    getQuestionDetail();
  })
  return (
    <>
      <div>
          You are playing game {sessionId}, quiz id is {quizId}
      </div>
    </>
  )
}

export default Play
