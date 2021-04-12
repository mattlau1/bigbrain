import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import { Link, NavLink, useHistory } from 'react-router-dom';
import API from '../utils/API';
import { useAlert } from '../contexts/AlertProvider';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Brand = styled.h4`
  font-size: 20pt;
`

const Navigation = () => {
  const [show, setShow] = useState(false);
  const [newGame, setNewGame] = useState('');
  console.log(newGame);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const history = useHistory();
  const dispatch = useAlert();
  const api = new API();

  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const logOut = async () => {
    try {
      // we want users to be logged out on the client side
      // even if the server side request fails
      const token = localStorage.getItem('token');
      localStorage.removeItem('token');
      history.push('/');
      createAlert('SUCCESS', 'Successfully logged out')

      // server side log out
      const res = await api.postAPIRequestToken('admin/auth/logout', token)
      const data = await res.json();
      if (!res.ok) {
        console.warn(data.message);
      }
    } catch (e) {
      console.warn(e);
    }
  }
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
      const res = await api.postAPICreateQuiz('admin/quiz/new', body, token);
      const data = await res.json();
      if (data.ok) {
        console.log('created new game')
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
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/dashboard" className="mr-auto">
          <Row>
            <Brand className="display-1 pl-2">BigBrain</Brand>
          </Row>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav variant="pills" className="ml-auto" defaultActiveKey="/creategame">
            <Nav.Link onClick={handleShow} className="mx-2">
              Create Game
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              className="mx-2"
              exact
              to="/"
              onClick={() => {
                logOut();
              }}
            >
              Sign Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Row>
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
      </Row>
    </>
  );
}

export default Navigation
