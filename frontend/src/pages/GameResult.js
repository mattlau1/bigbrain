import { React, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CenteredRow from '../components/CenteredRow';

const GameResult = () => {
  // get props from the previous components using locations
  const location = useLocation();
  const playerData = location.state?.playerData;

  // use useEffect to prevent infinite rendering loop
  useEffect(() => {
  }, []);

  return (
    <>
      <Container>
        <CenteredRow md={12}>
        <Col>
          <Card>
            <Card.Header>
              <Row className="justify-content-center align-items-center">
                <h1>Game Over</h1>
              </Row>
            </Card.Header>
            <Card.Body>
            <Row className="justify-content-center align-items-center">
              <h2>Good work {playerData.name}!</h2>
            </Row>
            <Row className="justify-content-center align-items-center">
              <h3>Below are your performances:</h3>
            </Row>
            <Row className="justify-content-center align-items-center">
              <h3>{playerData.point} / {playerData.maxPoint} points</h3>
            </Row>
            <Row className="justify-content-center align-items-center">
            <h3>{playerData.correctQ} out of {playerData.maxQ} questions correct</h3>
            </Row>
            </Card.Body>
          </Card>
        </Col>
        </CenteredRow>
      </Container>
    </>
  )
}

export default GameResult
