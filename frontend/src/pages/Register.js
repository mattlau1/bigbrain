import { React, useState } from 'react';
import { api } from '../components/Api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import CenteredRow from '../components/CenteredRow';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const postRegisterInfo = async () => {
    if (!email) {
      console.log('Email cant be empty')
      return;
    }
    if (!name) {
      console.log('Name cant be empty');
      return;
    }
    if (!password1 || !password2) {
      console.log('password cant be empty');
      return;
    }
    if (password1 !== password2) {
      console.log('password must match');
      return;
    }

    const body = {
      email: email,
      password: password1,
      name: name,
    };

    try {
      const res = await fetch(`${api}/admin/auth/register`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        history.push('/');
      } else {
        console.log(data.message);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <>
      <Container md={12} className="rounded px-0 justify-content-center align-items-center">
        <CenteredRow>
          <Row className="w-100 rounded">
            <Col
              md={12}
              className="w-100 px-0 mx-0 py-2 rounded"
            >
              <Form className="formContainer">
                <Row className="justify-content-center" md={12}>
                  <h2 className="formHeader w-100 text-center my-4">Register</h2>
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
                <p
                  className="w-100 text-center mt-2 mb-1"
                >
                  Already have an account?
                </p>
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
    </>
  )
}

export default Register;
