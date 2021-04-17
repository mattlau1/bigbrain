import { React, useState, useEffect } from 'react'
import { useParams } from 'react-router';
import API from '../utils/API';

const Play = () => {
  const [quizId, setQuizId] = useState(0);
  console.log(quizId);
  const { sessionId } = useParams();
  const api = new API();

  useEffect(() => {
    const token = localStorage.getItem('token');

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
          console.log(data);
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
