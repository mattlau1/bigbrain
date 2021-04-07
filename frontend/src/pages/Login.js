import { React, useState } from 'react';
import { api } from '../components/Api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import CenteredRow from '../components/CenteredRow';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const postLoginInfo = async () => {
    if (!email) {
      // setShowAlert(true);
      // setAlertType('danger');
      // setAlertText('email can\'t be empty');
      console.log('email can\'t be empty');
      return;
    }
    if (!password) {
      // setShowAlert(true);
      // setAlertText('Password can\'t be empty');
      console.log('password can\'t be empty');
      return;
    }

    const body = {
      email: email,
      password: password,
    };

    try {
      const res = await fetch(`${api}/admin/auth/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        history.push('/dashboard');
      } else {
        console.log(data.message);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <>
      <Container md={12} className="justify-content-center align-items-center">
        <CenteredRow>
          <Row className="w-100 rounded justify-content-center">
            <Col
              md={12}
              className="w-100 px-0 mx-0 rounded "
            >
              <Form className='my-auto'>
                <Row className="justify-content-center" md={12}>
                  <h2 className="formHeader w-100 text-center my-4">Log In</h2>
                </Row>
                <Row className="justify-content-center" md={12}>
                  <Form.Group className="w-75 px-4" controlId="formBasicemail">
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
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row className="justify-content-center" md={12}>
                  <div className="w-100 text-center">
                    <Button
                      className="mt-2 mb-4"
                      variant="primary"
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        postLoginInfo();
                      }}
                    >
                      Login
                    </Button>
                  </div>
                </Row>
                <Row md={12} className="justify-content-center">
                  <p
                    className="w-100 text-center mt-2 mb-1"
                  >
                    Need an account?
                  </p>
                </Row>
                <Row md={12} className="justify-content-center">
                  <div className="w-100 text-center">
                    <Link to="/register" id="loginBtn" className="btn btn-primary">
                      Register
                    </Link>
                  </div>
                </Row>
              </Form>
            </Col>
          </Row>
        </CenteredRow>
      </Container>
    </>
  )
}

export default Login
