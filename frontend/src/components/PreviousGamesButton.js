import React, { useState } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useAlert } from '../contexts/AlertProvider';
import API from '../utils/API';
import { openInNewTab } from '../utils/NewTab';
import PropTypes from 'prop-types';

const PreviousGamesButton = ({ gameId }) => {
  const [previousGames, setPreviousGames] = useState([]);

  const dispatch = useAlert();
  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const getPreviousGames = async () => {
    const token = localStorage.getItem('token');
    const api = new API();
    try {
      const res = await api.getAPIRequestToken('admin/quiz', token);
      const data = await res.json();
      if (res.ok) {
        console.log(data)
        const currQuiz = data.quizzes.filter((quiz) => {
          return quiz.id === gameId;
        })

        currQuiz && currQuiz[0] && setPreviousGames(currQuiz[0].oldSessions);
      } else {
        console.warn('xd')
      }
    } catch (e) {
      createAlert('ERROR', 'There was a problem getting previous games')
      console.warn(e);
    }
  }
  return (
    <DropdownButton drop={'up'} onClick={() => getPreviousGames()} title="Previous Games">
      {previousGames && previousGames.length !== 0
        ? previousGames.map((sessionId, key) => (
          <Dropdown.Item
            key={key}
            onClick={() => { openInNewTab(`${window.location.origin}/results/${sessionId}`) }}
          >
            {`Game ${sessionId}`}
          </Dropdown.Item>
          ))
        : <p className="text-center mb-0">No Games Found</p>}
    </DropdownButton>
  )
}

PreviousGamesButton.propTypes = {
  gameId: PropTypes.number,
};

export default PreviousGamesButton
