import React from 'react';
import Button from 'react-bootstrap/Button';
import { useAlert } from '../contexts/AlertProvider';
import API from '../utils/API';
import PropTypes from 'prop-types';

const DeleteQuizButton = ({ gameList, setGameList, gameId }) => {
  const dispatch = useAlert();

  // pop up messages if errors got encountered
  /** @param {String} type */
  /** @param {String} message */
  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  // remove the game off from the dashboard
  /** @param {Number} id */
  const deleteGame = async (id) => {
    const token = localStorage.getItem('token');
    const api = new API();
    try {
      const res = await api.deleteAPIRequestToken(`admin/quiz/${id}`, token);
      if (res.ok) {
        setGameList(gameList.filter(game => game.id !== id))
        createAlert('SUCCESS', 'Removed successfully')
      } else {
        createAlert('ERROR', 'Removing game was not successful')
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred')
      console.warn(e);
    }
  }

  return (
    <Button className='mx-0 w-100' variant="danger" onClick={() => deleteGame(gameId)}>Delete</Button>
  )
}

DeleteQuizButton.propTypes = {
  gameList: PropTypes.array,
  setGameList: PropTypes.func,
  gameId: PropTypes.number
}

export default DeleteQuizButton
