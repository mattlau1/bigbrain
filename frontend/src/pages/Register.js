import { React, useState } from 'react';
import API from '../utils/API';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useHistory } from 'react-router-dom';
import { useAlert } from '../contexts/AlertProvider';
import styled from 'styled-components';

const CenteredRegisteredRow = styled(Row)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const history = useHistory();
  const dispatch = useAlert();
  const api = new API();

  // pop up messages if errors got encountered
  /** @param {String} type */
  /** @param {String} message */
  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  // collects user details from input and register an account
  const postRegisterInfo = async () => {
    if (!email) {
      // user submitted with empty email
      createAlert('ERROR', 'Your email cannot be empty')
      return;
    }
    if (!name) {
      // user submitted with empty name
      createAlert('ERROR', 'Your name cannot be empty')
      return;
    }
    if (!password1 || !password2) {
      // user submitted empty passwords
      createAlert('ERROR', 'Your password cannot be empty')
      return;
    }
    if (password1 !== password2) {
      // two passwords don't match
      createAlert('ERROR', 'Passwords must match')
      return;
    }

    const body = {
      email: email,
      password: password1,
      name: name,
    };

    try {
      // routing to create an account with given details
      const res = await api.postAPIRequestBody('admin/auth/register', body);
      const data = await res.json();
      if (res.ok) {
        // redirect to the dashboard page when registered
        createAlert('SUCCESS', 'Registered & logged in successfully')
        localStorage.setItem('token', data.token);
        history.push('/dashboard');
      } else {
        // register failed
        createAlert('ERROR', 'That email has already been registered')
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred')
      console.warn(e);
    }
  };

  return (
    <Container md={12} className="rounded justify-content-center align-items-center">
      <CenteredRegisteredRow>
        <Row className="w-100 rounded">
          <Col md={12} className="w-100 px-0 py-2 rounded">
            <Form className="rounded border border-dark p-4 mx-4">
              <Row className="justify-content-center" md={12}>
                <h1 className="display-2 w-100 text-center mb-4">BigBrain</h1>
              </Row>
              <Row className="justify-content-center" md={12}>
                {/* Input name */}
                <Form.Group className="w-75 px-4" controlId="formBasicName">
                  <Form.Control
                    className="inputBox"
                    type="name"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row className="justify-content-center" md={12}>
                {/* Input email */}
                <Form.Group className="w-75 px-4" controlId="formBasicEmail">
                  <Form.Control
                    className="inputBox"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row className="justify-content-center" md={12}>
                {/* Input password */}
                <Form.Group className="w-75 px-4" controlId="formBasicPassword">
                  <Form.Control
                    className="inputBox"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword1(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row className="justify-content-center" md={12}>
                {/* Ensure the password matches */}
                <Form.Group className="w-75 px-4" controlId="formBasicConfirmPassword">
                  <Form.Control
                    className="inputBox"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row className="justify-content-center" md={12}>
                {/* Submit user details */}
                <div className="w-75 text-center">
                  <Button
                    className="mt-2 mb-4"
                    variant="primary"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      postRegisterInfo();
                    }}
                  >
                    Register
                  </Button>
                </div>
              </Row>
              <Row md={12} className="justify-content-center">
                <p className="w-100 text-center mt-2 mb-1">Already have an account?</p>
              </Row>
              <Row md={12} className="justify-content-center">
                {/* Change to login screens */}
                <div className="w-100 text-center">
                  <Link to="/" id="loginBtn" className="btn btn-primary">
                    Login
                  </Link>
                </div>
              </Row>
            </Form>
          </Col>
        </Row>
      </CenteredRegisteredRow>
    </Container>
  );
}

export default Register;
