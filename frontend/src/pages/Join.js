import { React, useState } from 'react';
import API from '../utils/API';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CenteredRow from '../components/CenteredRow';
import { useAlert } from '../contexts/AlertProvider';
import { useHistory } from 'react-router-dom';

const Join = () => {
  const [user, setUser] = useState('');
  const [sessionId, setSessionId] = useState('');
  const dispatch = useAlert();
  const history = useHistory();
  const api = new API();

  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const joinSession = async () => {
    if (!user) {
      createAlert('ERROR', 'Your name cannot be empty')
      return;
    }

    if (!sessionId) {
      createAlert('ERROR', 'Your session ID cannot be empty')
      return;
    }

    const body = {
      name: user
    };

    try {
      const res = await api.postAPIRequestBody(`play/join/${sessionId}`, body);
      if (res.ok) {
        history.push(`/play/${sessionId}`);
      } else {
        createAlert('ERROR', 'Invalid session ID - Please try again')
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred')
      console.warn(e);
    }
  }

  return (
    <Container md={12} className="justify-content-center align-items-center">
      <CenteredRow>
        <Row className="w-100 rounded justify-content-center">
          <Col md={12} className="w-100 px-0 mx-0 rounded ">
            <Form className="formContainer rounded border border-dark p-4">
              <Row className="justify-content-center" md={12}>
                <h1 className="display-2 w-100 text-center mb-4">Join Game</h1>
              </Row>
              <Row className="justify-content-center" md={12}>
                <Form.Group className="w-75 px-4">
                  <Form.Control
                    className="inputBox"
                    placeholder="Name"
                    onChange={(e) => setUser(e.target.value)}
                  />
                </Form.Group>
              </Row>

              <Row className="justify-content-center" md={12}>
                <Form.Group className="w-75 px-4">
                  <Form.Control
                    className="inputBox"
                    placeholder="Session ID"
                    onChange={(e) => setSessionId(e.target.value)}
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
                      joinSession();
                    }}
                  >
                    Join
                  </Button>
                </div>
              </Row>
            </Form>
          </Col>
        </Row>
      </CenteredRow>
    </Container>
  )
}

export default Join
