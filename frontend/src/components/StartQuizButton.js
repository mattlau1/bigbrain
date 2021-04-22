import React from 'react'
import { Button } from 'react-bootstrap'
import { useAlert } from '../contexts/AlertProvider';
import API from '../utils/API';
import PropTypes from 'prop-types'

const StartQuizButton = ({ game, setGameList }) => {
  const dispatch = useAlert();

  // creates and displays an alert
  /** @param {String} type */
  /** @param {String} message */
  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  // starts a game and refreshes game list
  const startGame = async () => {
    const token = localStorage.getItem('token');
    const api = new API();
    try {
      const res = await api.postAPIRequestToken(`admin/quiz/${game.id}/start`, token);
      if (res.ok) {
        createAlert('SUCCESS', 'Successfully started game!')

        // refresh games
        api.getAPIRequestToken('admin/quiz', token).then((data) => {
          if (data.status === 403) {
            createAlert('ERROR', 'Invalid Token');
          } else if (data.status === 200) {
            setGameList([]);
            data.json().then((quizzes) => {
              quizzes.quizzes.forEach((quiz) => {
                api.getAPIRequestToken(`admin/quiz/${quiz.id}`, token).then((data) => {
                  data.json().then((quizData) => {
                    const newGame = { ...quizData, ...quiz }
                    setGameList(gameList => [...gameList, newGame]);
                  })
                }).catch((e) => {
                  createAlert('ERROR', 'There was a problem getting quizzes');
                  console.warn(e)
                })
              })
            })
          }
        }).catch((e) => {
          createAlert('ERROR', 'There was a problem getting quizzes');
          console.warn(e)
        })
      } else if (res.status === 400) {
        createAlert('ERROR', 'Game has already been started')
      } else {
        createAlert('ERROR', 'There was an error starting the game')
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred')
      console.warn(e);
    }
  }

  return (
    <Button className='mx-0 w-100' variant="primary" onClick={() => startGame()}>Start</Button>
  )
}

StartQuizButton.propTypes = {
  game: PropTypes.object,
  setGameList: PropTypes.func
}

export default StartQuizButton
