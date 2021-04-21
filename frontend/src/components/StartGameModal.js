import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { useAlert } from '../contexts/AlertProvider';
import API from '../utils/API';
import styled from 'styled-components';
import { openInNewTab } from '../utils/openInNewTab';

const SessionIDText = styled.h2`
  @media (max-width: 768px) {
    font-size: 56pt;
  }
  @media (max-width: 576px) {
    font-size: 36pt;
  }
`
const StartGameModal = ({ show, handleClose, sessionId, gameId, handleShowStop, setGameList }) => {
  const [position, setPosition] = useState(-1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [polling, setPolling] = useState(0);
  const [playerList, setPlayerList] = useState([]);

  const dispatch = useAlert();
  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    createAlert('SUCCESS', 'Session ID copied to clipboard');
  }

  const updatePosition = async () => {
    const token = localStorage.getItem('token');
    const api = new API();

    try {
      console.log(gameId)
      const res = await api.getAPIRequestToken(`admin/session/${sessionId}/status`, token);
      const data = await res.json();
      if (res.ok) {
        if (position < totalQuestions) {
          setPosition(data.results.position + 1);
        } else {
          // reset quiz
          setPosition(-1);
        }
        setTotalQuestions(data.results.questions.length)
      } else {
        createAlert('ERROR', 'There was a problem loading the game\'s status');
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred');
      console.warn(e);
    }
  }

  const handleAdvance = async () => {
    const token = localStorage.getItem('token');
    const api = new API();
    try {
      const res = await api.postAPIRequestToken(`admin/quiz/${gameId}/advance`, token);
      const data = await res.json()

      if (res.ok) {
        updatePosition();
        createAlert('SUCCESS', 'Advanced to the next question');
        if (position >= totalQuestions) {
          // refresh games if we are at the end of quiz
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
          setPosition(-1);
          handleClose(true);
          handleShowStop(sessionId);
        }
      } else if (res.status === 400) {
        // quiz is probably complete
        handleClose(true);
        handleShowStop(sessionId);
      } else {
        createAlert('ERROR', 'There was a problem advancing to the next question');

        console.log(data)
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred');
      console.warn(e);
    }
  }

  useEffect(() => {
    const loadPlayers = async () => {
      // get all players for a given sessionId
      const token = localStorage.getItem('token');
      const api = new API();
      const res = await api.getAPIRequestToken(`admin/session/${sessionId}/status`, token);
      const data = await res.json();
      if (res.ok) {
        setPlayerList(data.results.players);
      } else {
        setPlayerList([]);
      }
    }
    sessionId !== 0 && loadPlayers();
    polling >= 0 && setTimeout(() => setPolling(polling + 1), 1000);
  }, [polling])

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Form>
        <Modal.Header closeButton>
        <Modal.Title>Share Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-1">Your Session ID is...</p>
          <SessionIDText className="text-center session-id">{sessionId}</SessionIDText>
          <div className="d-flex justify-content-center">
            <Button className="my-1" onClick={() => { handleCopy(sessionId) }} id="copy-button">
              Copy Session ID
            </Button>
          </div>
          <div className="d-flex justify-content-center">
            <Button
              className="my-1"
              onClick={() => openInNewTab(`${window.location.origin}/join?game=${sessionId}`)}
              id="join-button"
            >
              Join Game
            </Button>
          </div>
          <hr/>
          <h2 className="text-center">Control Panel</h2>
          <Container md={12}>
            <Col>
              <Row className="justify-content-center">
                {position > -1 && <p className="mb-1">Question {position}/{totalQuestions}</p>}
              </Row>
              <Row className="justify-content-center">
                <Button id="start-advance-btn" variant="success" onClick={() => { handleAdvance() }}>
                  {position === -1 ? 'Start Game' : 'Next Question'}
                </Button>
              </Row>
              <hr/>
              <h2 className="text-center">Players</h2>
              <Row className="justify-content-center">
                {playerList.map((player, key) => (
                  <Col md={5} key={key} className="m-2 bg-info rounded">
                    <p className="w-100 text-center text-light my-2">{player}</p>
                  </Col>
                ))}
              </Row>
            </Col>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} id="close-button">
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

StartGameModal.propTypes = {
  handleClose: PropTypes.func,
  handleShowStop: PropTypes.func,
  setGameList: PropTypes.func,
  show: PropTypes.bool,
  gameId: PropTypes.number,
  sessionId: PropTypes.number
};

export default StartGameModal
