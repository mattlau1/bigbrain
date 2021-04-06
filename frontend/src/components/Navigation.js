import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import { Link, NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/dashboard" className="mr-auto">
        <Row>
          BigBrain
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
              localStorage.removeItem('token');
            }}
          >
            Sign Out
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
