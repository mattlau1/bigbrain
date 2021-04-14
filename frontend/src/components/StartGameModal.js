import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { useAlert } from '../contexts/AlertProvider';

const StartGameModal = ({ show, handleClose, id }) => {
  const dispatch = useAlert();

  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const handleCopy = (text) => {
    createAlert('SUCCESS', 'Invitation link copied to clipboard');
    navigator.clipboard.writeText(`${window.location.origin}/play/${text}`);
  }

  return (
        <Modal show={show} onHide={handleClose}>
        <Form>
            <Modal.Header closeButton>
            <Modal.Title>Share Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-1">Session id: <strong>{id}</strong></p>
              <Form.Group controlId="inviteLink">
                <Form.Control
                  type="text"
                  value={`${window.location.origin}/play/${id}`}
                  readOnly
                  plaintext
                />
                <Button onClick={() => { handleCopy(id) }}>
                  Copy Link
                </Button>
              </Form.Group>
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
  setShow: PropTypes.func,
  handleShow: PropTypes.func,
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  gameList: PropTypes.array,
  setGameList: PropTypes.func,
  id: PropTypes.number
};

export default StartGameModal
