import React from 'react'
import { Button } from 'react-bootstrap'
import { useAlert } from '../contexts/AlertProvider';
import API from '../utils/API';
import PropTypes from 'prop-types'

const StopQuizButton = ({ game, setGameList, handleShowStop, id }) => {
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

  // sends request to backend to stop game and refreshes game list
  const stopGame = async () => {
    const token = localStorage.getItem('token');
    const api = new API();
    try {
      const res = await api.postAPIRequestToken(`admin/quiz/${game.id}/end`, token);
      if (res.ok) {
        createAlert('SUCCESS', 'Successfully ended game!')

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
    <Button
      id="stopgame-btn"
      className='mx-0 w-100'
      variant="danger"
      onClick={() => { stopGame(); handleShowStop(id); }}
    >
      Stop
    </Button>
  )
}

StopQuizButton.propTypes = {
  game: PropTypes.object,
  setGameList: PropTypes.func,
  handleShowStop: PropTypes.func,
  id: PropTypes.number
}

export default StopQuizButton
