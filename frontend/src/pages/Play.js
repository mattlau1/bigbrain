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
  const [answerList, setAnswerList] = useState([]);
  const [over, setOver] = useState(false);
  const [options, setOptions] = useState([]);
  const [timeLimit, setTimeLimit] = useState();
  const [correctAnswerList, setCorrectAnswerList] = useState([]);
  const playerId = location.state?.playerId;
  const api = new API();
  console.log('player id is ' + playerId);
  console.log(answerList);

  const changeCorrectAnswer = async (option) => {
    if (!answerList.includes(option.id)) {
      answerList.push(option.id)
    } else {
      const newAnswers = answerList;
      newAnswers.splice(newAnswers.indexOf(option.id), 1)
      setAnswerList([...newAnswers]);
    }

    const body = {
      answerIds: answerList,
    }

    try {
      const res = await api.putAPIRequestBody(`play/${playerId}/answer`, body);
      if (res.ok) {
        console.log('answers submitted')
      } else {
        console.log('invalid output');
      }
    } catch (e) {
      console.log('error');
      console.warn(e);
    }
  }

  useEffect(() => {
    const getQuestionDetail = async () => {
      try {
        const res = await api.getAPIRequest(`play/${playerId}/question`);
        const data = await res.json();
        if (res.ok) {
          console.log(data);
          setAnswerList([]);
          setCorrectAnswerList([]);
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
    const getCorrectAnswers = async () => {
      try {
        const res = await api.getAPIRequest(`play/${playerId}/answer`);
        const data = await res.json();
        if (res.ok) {
          console.log('correct answers gathered')
          setCorrectAnswerList(data.answerIds)
        } else {
          console.log('invalid output');
        }
      } catch (e) {
        console.log('error');
        console.warn(e);
      }
    }
    timeLimit > 0 && setTimeout(() => setTimeLimit(timeLimit - 1), 1000);
    if (timeLimit === 0) {
      setOver(true);
      getCorrectAnswers();
    }
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
            {(!over)
              ? options &&
                options.map((option, index) => (
                <Col className='m-2 p-1' key={index} md={12}>
                  <Card>
                  <Card.Body>
                    <Row>
                      <Col md={12}>
                        <span>Select Answer: </span>
                        <Form.Check
                          className="d-inline my-0 py-0"
                          type="checkbox"
                          // checked={option.check}
                          onChange={() => changeCorrectAnswer(option)}
                        />
                        <p className="m-0" style={{ fontSize: 20 }}>{option.answerText}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                  </Card>
                </Col>
                ))
              : options &&
                options.map((option, index) => (
                <Col className='m-2 p-1' key={index} md={12}>
                  <Card>
                  <Card.Body>
                    <Row>
                      <Col md={12}>
                        {correctAnswerList.includes(option.id)
                          ? <span className='text-success'>Correct Answer</span>
                          : <span className='text-danger'>Incorrect Answer</span>}
                        <p className="m-0" style={{ fontSize: 20 }}>{option.answerText}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                  </Card>
                </Col>
                ))}
          </Row>
        </Col>
      </Container>
    </>
  )
}

export default Play
