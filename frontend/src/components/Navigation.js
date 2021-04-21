import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import styled from 'styled-components';
import { Link, NavLink, useHistory } from 'react-router-dom';
import API from '../utils/API';
import { useAlert } from '../contexts/AlertProvider';
import Logo from '../assets/Logo.png';
import { Image } from 'react-bootstrap';

const Brand = styled.span`
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

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center mx-2">
          <Image
            style={{
              width: 60,
              height: 60,
            }}
            src={Logo}
            className="d-inline-block align-top mr-2"
          />
          <Brand id="brand-name">BigBrain</Brand>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" id='navButton'/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav variant="pills" className="ml-auto" defaultActiveKey="/creategame">
            <Nav.Link as={NavLink} to="/dashboard" id="dashboard-link" className="mx-2 text-center">
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              className="mx-2 text-center"
              exact
              to="/"
              onClick={() => {
                logOut();
              }}
              id='signout-link'
            >
              Sign Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default Navigation
