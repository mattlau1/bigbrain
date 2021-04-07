import { React, useState } from 'react';
import { api } from './Api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import CreateAlert from './CreateAlert';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState('danger');
  const [showAlert, setShowAlert] = useState(false);

  const postLoginInfo = async () => {
    if (!username) {
      setShowAlert(true);
      setAlertType('danger');
      setAlertText('Username can\'t be empty');
      return;
    }
    if (!password) {
      setShowAlert(true);
      setAlertText('Password can\'t be empty');
      return;
    }

    const body = {
      username: username,
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
        // history.push('/tasks');
      } else {
        setShowAlert(true);
        setAlertText(`${data.message}`);
      }
    } catch (e) {
      console.warn(e);
      setShowAlert(true);
      setAlertText('Invalid Credentials - Please check your username/password and try again');
    }
  };

  return (
    <>
      {api}
      <Container md={12} className="rounded px-0 justify-content-center align-items-center">
        <Row className="center">
          <Row className="w-100 rounded">
            <Col md={6} className="w-100 formImage py-2 px-0 mx-0 rounded">
              <Row md={12} className="justify-content-center">
                <h3 className="w-100 text-center" id="formHeader">
                  Welcome back to BigBrain
                </h3>
              </Row>

              <Row md={12} className="justify-content-center">
                <p className="w-100 text-center">
                  Continue reaching your goals!
                </p>
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
            </Col>
            <Col
              md={6}
              className="w-100 px-0 mx-0 py-2 rounded"
            >
              <Form>
                <Row className="justify-content-center" md={12}>
                  <h2 className="formHeader w-100 text-center my-4">Log In</h2>
                  <CreateAlert
                    text={alertText}
                    type={alertType}
                    show={showAlert}
                    setShow={setShowAlert}
                    classes="mx-4"
                  />
                </Row>
                <Row className="justify-content-center" md={12}>
                  <Form.Group className="w-100 px-4" controlId="formBasicUsername">
                    <Form.Control
                      className="inputBox"
                      type="username"
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>
                </Row>

                <Row className="justify-content-center" md={12}>
                  <Form.Group className="w-100 px-4" controlId="formBasicPassword">
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
                <Row md={12}></Row>
              </Form>
            </Col>
          </Row>
        </Row>
      </Container>
    </>
  )
}

export default Login
