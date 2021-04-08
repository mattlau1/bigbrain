import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import { Link, NavLink, useHistory } from 'react-router-dom';
import API from '../utils/API';
import { useAlert } from '../contexts/AlertProvider';

const Brand = styled.h4`
  font-size: 20pt;
`

const Navigation = () => {
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
      const token = localStorage.getItem('token');

      // we want users to be logged out on the client side
      // even if the server side request fails
      localStorage.removeItem('token');
      history.push('/');
      createAlert('SUCCESS', 'Successfully logged out')

      // server side log out
      const res = await api.postAPIRequestToken('admin/auth/logout', token)
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem('token');
        history.push('/');
      } else {
        console.warn(data.message);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/dashboard" className="mr-auto">
        <Row>
          <Brand className="display-1 pl-2">BigBrain</Brand>
        </Row>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav variant="pills" className="ml-auto" defaultActiveKey="/creategame">
          <Nav.Link as={NavLink} to="/creategame" className="mx-2">
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
  );
}

export default Navigation
