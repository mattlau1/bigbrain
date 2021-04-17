import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { useAlert } from '../contexts/AlertProvider';
import API from '../utils/API';

const StartGameModal = ({ show, handleClose, sessionId, gameId }) => {
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

  const handleAdvance = async () => {
    const token = localStorage.getItem('token');
    const api = new API();
    try {
      console.log(gameId)
      const res = await api.postAPIRequestToken(`admin/quiz/${gameId}/advance`, token);
      const data = await res.json()
      if (res.ok) {
        createAlert('SUCCESS', 'Advanced to the next question');
      } else {
        createAlert('ERROR', 'There was a problem advancing to the next question');
        console.log(data)
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred');
      console.warn(e);
    }
  }

  return (
      <Modal show={show} onHide={handleClose} size="lg">
      <Form>
        <Modal.Header closeButton>
        <Modal.Title>Share Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-1">Your Session ID is...</p>
          <h1 className="text-center session-id">{sessionId}</h1>
          <Form.Group controlId="inviteLink">
            <Button onClick={() => { handleCopy(sessionId) }}>
              Copy Session ID
            </Button>
          </Form.Group>
          <p>Join now at <a href={`${window.location.origin}/play/`}>{window.location.origin}/play/</a></p>
          <hr></hr>
          <h2 className="text-center">Control Panel</h2>
          <div className="d-flex justify-content-center align-items-center">
            <Button variant="success" onClick={() => { handleAdvance() }}>
              Next Question
            </Button>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

StartGameModal.propTypes = {
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  gameId: PropTypes.number,
  sessionId: PropTypes.number
};

export default StartGameModal
