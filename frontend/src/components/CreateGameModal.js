import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import API from '../utils/API';
import PropTypes from 'prop-types';

const CreateGameModal = ({ setShow, show, handleClose, handleShow }) => {
  const [newGame, setNewGame] = useState('');

  const createGame = async () => {
    if (!newGame) {
      alert('name is empty!');
      return;
    }

    const body = {
      name: newGame,
    };

    try {
      const token = localStorage.getItem('token');
      const api = new API();
      const res = await api.postAPIRequestBodyToken('admin/quiz/new', body, token);
      const data = await res.json();
      if (res.ok) {
        console.log('created new game', data)
        handleClose();
      } else {
        console.log('cant create new game');
      }
    } catch (e) {
      console.log('error');
      console.warn(e);
    }
  }

  return (
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            className="inputBox"
            type="text"
            placeholder="Game Title"
            onChange={(e) => setNewGame(e.target.value)}
          />
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { createGame() }}>
            Create Game
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

CreateGameModal.propTypes = {
  setShow: PropTypes.func,
  handleShow: PropTypes.func,
  handleClose: PropTypes.func,
  show: PropTypes.bool
};

export default CreateGameModal
