import { React, useEffect, useState } from 'react';
import API from '../utils/API';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useAlert } from '../contexts/AlertProvider';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import queryString from 'query-string';

const JoinFormContainer = styled(Container)`
  background-color: #44A3E5;
  color: white;
  padding: 0;
`

const HeadingText = styled.h1`
  font-weight: 700;
`

const CenteredJoinRow = styled(Row)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

const Join = () => {
  const [user, setUser] = useState('');
  const [sessionId, setSessionId] = useState('');
  const dispatch = useAlert();
  const history = useHistory();
  const api = new API();
  const maxNameLength = 32;

  // pop up messages if errors got encountered
  /** @param {String} type */
  /** @param {String} message */
  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  // User submit details to join the game session
  const joinSession = async () => {
    // user submitted with empty name
    if (!user) {
      createAlert('ERROR', 'Your name cannot be empty')
      return;
    }

    // user cannot have very long names
    if (user.length >= maxNameLength) {
      createAlert('ERROR', `Your name cannot longer than ${maxNameLength} characters`)
      return;
    }

    // user submitted with empty session id
    if (!sessionId) {
      createAlert('ERROR', 'Your session ID cannot be empty')
      return;
    }

    // http request body
    const body = {
      name: user
    };

    try {
      // routing for user to join the game session
      const res = await api.postAPIRequestBody(`play/join/${sessionId}`, body);
      const data = await res.json();
      if (res.ok) {
        // user has successfully joined and will be redirected to play screen
        history.push({ pathname: `/play/${sessionId}`, state: { playerId: data.playerId, playerName: user } });
      } else {
        // user could not join the game session
        createAlert('ERROR', 'Invalid session ID - Please try again')
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred')
      console.warn(e);
    }
  }

  // load session id from query string if it exists
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    parsed.game && setSessionId(parsed.game)
  }, [])

  return (
    <JoinFormContainer md={12} className="justify-content-center align-items-center" fluid>
      <CenteredJoinRow>
        <Row className="w-100 rounded justify-content-center">
          <Col md={12} className="w-100 px-0 mx-0 rounded ">
            <Form className="formContainer rounded p-4">

              <Row className="justify-content-center" md={12}>
                <HeadingText className="display-2 w-100 text-center mb-4">BigBrain</HeadingText>
              </Row>

              <Row className="justify-content-center" md={12}>
                {/* Input name */}
                <Form.Group className="w-25 px-4">
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setUser(e.target.value)}
                  />
                </Form.Group>
              </Row>

              <Row className="justify-content-center" md={12}>
                {/* Input session ID */}
                <Form.Group className="w-25 px-4">
                  <Form.Control
                    size="lg"
                    placeholder="Session ID"
                    onChange={(e) => setSessionId(e.target.value)}
                    value={sessionId}
                  />
                </Form.Group>
              </Row>

              <Row className="justify-content-center" md={12}>
                {/* Button to join session */}
                <div className="w-100 text-center">
                  <Button
                    className="mt-2 mb-4"
                    variant="primary"
                    size="lg"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      joinSession();
                    }}
                  >
                    Join Game
                  </Button>
                </div>
              </Row>

            </Form>
          </Col>
        </Row>
      </CenteredJoinRow>
    </JoinFormContainer>
  )
}

export default Join
