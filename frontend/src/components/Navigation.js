import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { api } from './Api';

const Brand = styled.h4`
  font-size: 20pt;
`

const Navigation = () => {
  const history = useHistory();

  const logOut = async () => {
    try {
      const token = localStorage.getItem('token');
      localStorage.removeItem('token');
      history.push('/');
      const res = await fetch(`${api}/admin/auth/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log('successfully logged out')
        localStorage.removeItem('token');
        history.push('/');
      } else {
        console.log(data.message);
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
