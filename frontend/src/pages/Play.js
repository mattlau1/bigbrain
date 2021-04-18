import { React, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import API from '../utils/API';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form } from 'react-bootstrap'

const Play = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [over, setOver] = useState(false);
  const [options, setOptions] = useState([]);
  const [timeLimit, setTimeLimit] = useState();
  const playerId = location.state?.playerId;
  const api = new API();
  console.log('player id is ' + playerId);

  useEffect(() => {
    const getQuestionDetail = async () => {
      try {
        const res = await api.getAPIRequest(`play/${playerId}/question`);
        const data = await res.json();
        if (res.ok) {
          console.log(data);
          setQuestionText(data.question.text);
          setQuestionType(data.question.type);
          setOptions(data.question.answers);
          !timeLimit && setTimeLimit(data.question.time_limit);
        } else {
          console.log('cannot get question details');
        }
      } catch (e) {
        console.log('error');
        console.warn(e);
      }
    }
    getQuestionDetail();
  }, []);

  useEffect(() => {
    timeLimit > 0 && setTimeout(() => setTimeLimit(timeLimit - 1), 1000);
    (timeLimit === 0) && setOver(true)
  }, [timeLimit])
  return (
    <>
      <Container>
        <Col>
          <Row>
            You are playing game {sessionId}
          </Row>
          <Row>
            <h2>{questionText}</h2>
          </Row>
          <Row>
            {questionType && <h3>This is a {questionType} type question</h3>}
          </Row>
          <Row>
            <h2>{timeLimit}</h2>
          </Row>
          <Row>
            {(!over) ? 'choose something' : 'its game over now, these are the correct answer'}
          </Row>
          <Col>
            {options &&
              options.map((option, index) => (
              <Col className='m-2 p-1' key={index} md={12}>
                <Card>
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <span>Correct Answer: </span>
                      <Form.Check
                        className="d-inline my-0 py-0"
                        type="checkbox"
                        // checked={option.check}
                        // onChange={() => changeCorrectAnswer(option)}
                      />
                      <p className="m-0" style={{ fontSize: 20 }}>{option.answerText}</p>
                    </Col>
                  </Row>
                </Card.Body>
                </Card>
              </Col>
              ))}
          </Col>
        </Col>
      </Container>
    </>
  )
}

export default Play
