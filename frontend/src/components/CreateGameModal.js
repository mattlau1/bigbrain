import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import API from '../utils/API';
import PropTypes from 'prop-types';
import { useAlert } from '../contexts/AlertProvider';

const CreateGameModal = ({ setShow, show, handleClose, handleShow, gameList, setGameList }) => {
  const [newGameName, setNewGameName] = useState('');
  const dispatch = useAlert();

  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const createGame = async (e) => {
    e.preventDefault()
    if (!newGameName) {
      createAlert('ERROR', 'Your new quiz cannot have an empty name');
      return;
    }

    const body = {
      name: newGameName,
    };

    try {
      const token = localStorage.getItem('token');
      const api = new API();
      const res = await api.postAPIRequestBodyToken('admin/quiz/new', body, token);
      if (res.ok) {
        handleClose();
      } else {
        createAlert('ERROR', 'There was a problem creating a new quiz');
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occured');
      console.warn(e);
    }
  }

  return (
        <Modal show={show} onHide={handleClose}>
        <Form>
            <Modal.Header closeButton>
            <Modal.Title>Create Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form.Control
                className="inputBox"
                type="text"
                placeholder="Game Title"
                onChange={(e) => setNewGameName(e.target.value)}
            />
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" type="submit" onClick={(e) => { createGame(e) } }>
                Create Game
            </Button>
            </Modal.Footer>
        </Form>
      </Modal>
  )
}

CreateGameModal.propTypes = {
  setShow: PropTypes.func,
  handleShow: PropTypes.func,
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  gameList: PropTypes.array,
  setGameList: PropTypes.func
};

export default CreateGameModal
