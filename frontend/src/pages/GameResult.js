import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';

const MediumText = styled.h2`
  font-family: 'Montserrat', sans-serif;
  color: #333333;
  margin-bottom: 0;
  font-weight: 700;

  font-size: 56pt;
  @media (max-width: 992px) {
    font-size: 36pt;
  }
`

const CenteredGameResultRow = styled(Row)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

const SmallText = styled(MediumText)`
  font-size: 24pt;
  margin-bottom: 20px;
  font-weight: 600;

  @media (max-width: 992px) {
    font-size: 20pt;
  }
`

// display game result to show user's performances
const GameResult = () => {
  // get props from the previous components using locations
  const location = useLocation();
  const playerData = location.state?.playerData;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container style={{ backgroundColor: '#44A3E5' }} fluid>
      <Container>
        <CenteredGameResultRow md={12}>
          <Col>
            <Card>
              <Card.Header>
                <Row className="justify-content-center align-items-center">
                  <MediumText>Good job, {playerData.name}!</MediumText>
                </Row>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="justify-content-center align-items-center">
                  {/* display number of questions answered correctly */}
                  <SmallText>You got {playerData.correctQ} out of {playerData.maxQ} questions correct!</SmallText>
                </Row>
                <Row className="justify-content-center align-items-center">
                  {/* display accumulated score throughout the game */}
                  <SmallText>You scored {playerData.point} / {playerData.maxPoint} points!</SmallText>
                </Row>
                <Row className="justify-content-end align-items-center">
                  {/* pop up window to explain the point system */}
                  <Button className="mr-3" onClick={handleShow}>
                    How do points work?
                  </Button>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </CenteredGameResultRow>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>The Point System</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="justify-content-start align-items-center mx-1">
            <p>Points are based off how fast you select your answers.</p>
          </Row>
          <Row className="justify-content-start align-items-center mx-1">
            <p>The maximum number of points can be achieved if you select the correct answer within 2 seconds.</p>
          </Row>
          <Row className="justify-content-start align-items-center mx-1">
            <p>You lose 0.5 points every 2 seconds. </p>
          </Row>
          <Row className="justify-content-start align-items-center mx-1">
            <p>You also lose points if you change any answers.</p>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {/* Hide the modal */}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default GameResult
