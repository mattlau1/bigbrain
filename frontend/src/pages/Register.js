import { React, useState } from 'react';
import API from '../utils/API';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useHistory } from 'react-router-dom';
import CenteredRow from '../components/CenteredRow';
import { useAlert } from '../contexts/AlertProvider';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const history = useHistory();
  const dispatch = useAlert();
  const api = new API();

  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const postRegisterInfo = async () => {
    if (!email) {
      createAlert('ERROR', 'Your email cannot be empty')
      return;
    }
    if (!name) {
      createAlert('ERROR', 'Your name cannot be empty')
      return;
    }
    if (!password1 || !password2) {
      createAlert('ERROR', 'Your password cannot be empty')
      return;
    }
    if (password1 !== password2) {
      createAlert('ERROR', 'Passwords must match')
      return;
    }

    const body = {
      email: email,
      password: password1,
      name: name,
    };

    try {
      const res = await api.postAPIRequestBody('admin/auth/register', body);
      const data = await res.json();
      if (res.ok) {
        createAlert('SUCCESS', 'Registered & logged in successfully')
        localStorage.setItem('token', data.token);
        console.log(`${name}'s token is `, data.token);
        history.push('/dashboard');
      } else {
        createAlert('ERROR', 'That email has already been registered')
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred')
      console.warn(e);
    }
  };

  return (
    <Container md={12} className="rounded px-0 justify-content-center align-items-center">
      <CenteredRow>
        <Row className="w-100 rounded">
          <Col md={12} className="w-100 px-0 mx-0 py-2 rounded">
            <Form className="formContainer rounded border border-dark p-4">
              <Row className="justify-content-center" md={12}>
                <h1 className="display-2 w-100 text-center mb-4">BigBrain</h1>
                {/* <h2 className="formHeader w-100 text-center mt-4 mb-2">Register</h2> */}
              </Row>
              <Row className="justify-content-center" md={12}>
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
                <div className="w-100 text-center">
                  <Link to="/" id="loginBtn" className="btn btn-primary">
                    Login
                  </Link>
                </div>
              </Row>
            </Form>
          </Col>
        </Row>
      </CenteredRow>
    </Container>
  );
}

export default Register;
