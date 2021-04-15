import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Navigation from '../components/Navigation';
import { useParams } from 'react-router';
import API from '../utils/API';
import { Container, Form, Col, Row, Button, ButtonGroup, Card } from 'react-bootstrap'
import { useLocation } from 'react-router-dom';

const EditQuestion = () => {
  const [questions, setQuestions] = useState([]);
  console.log(questions)
  const [newText, setNewText] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [point, setPoint] = useState(0);
  const [time, setTime] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answerList, setAnswerList] = useState([]);
  const [answerId, setAnswerId] = useState(0);
  const location = useLocation();
  const qObj = location.state?.qObj;
  // const [ansCount, setAnsCount] = useState(0)
  const { id, qid } = useParams();
  const setSingle = () => {
    setQuestionType('single')
  }

  const setMultiple = () => {
    setQuestionType('multiple')
  }

  const addAnswer = () => {
    setAnswerId(answerId + 1)
    setAnswerList(prevAnswer => {
      return [...prevAnswer, { id: answerId, answerText: answer }]
    })
  }

  const removeAnswer = (aId) => {
    setAnswerList(answerList.filter(ans => ans.id !== aId))
  }

  const confirmChanges = () => {
    const questionBody = {
      id: qid,
      point: point,
      text: newText,
      time_limit: time,
      answers: answerList,
      type: questionType
    }
    console.log(questionBody);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const api = new API();

    const loadQuestion = async () => {
      try {
        const res = await api.getAPIRequestToken(`admin/quiz/${id}`, token);
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
          setQuestionType(qObj.type);
          setAnswerList(qObj.answers);
        } else {
          console.log('load answers UNsuccessully');
        }
      } catch (e) {
        console.log('error');
        console.warn(e);
      }
    }
    loadQuestion()
  }, [])

  return (
    <>
      <Navigation />
      This is the edit page with game id {id} and {qid}!
      <Container>
        <Col md={{ span: 6, offset: 3 }}>
          <Form.Group>
            Current question: {qObj.text}
            <Form.Control
              className="inputBox m-2"
              placeholder="Rename Question"
              onChange={(e) => setNewText(e.target.value)}
            />
            Current point: {qObj.point}
            <Form.Control
              className="inputBox m-2"
              placeholder="Points"
              onChange={(e) => setPoint(e.target.value)}
            />
            Current point: {qObj.time_limit}
            <Form.Control
              className="inputBox m-2"
              placeholder="Time Limit"
              onChange={(e) => setTime(e.target.value)}
            />
          </Form.Group>
          <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
            The question type is {questionType}
          </Row>

          <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
            <ButtonGroup aria-label="Basic example">
              <Button className='mx-1 mb-2' variant="primary" onClick={setSingle}>Single Choice</Button>
              <Button className='mx-1 mb-2' variant="primary" onClick={setMultiple}>Multiple Choice</Button>
            </ButtonGroup>
          </Row>

          <Col>
          {answerList &&
            answerList.map((ans, index) => (
            <Col className='m-2 p-1' key={index} md={12}>
              <Card>
              <Card.Body>
                <Row>
                  <Col md={9}>{index + 1}. {ans.answerText}</Col>
                  <Col md={3}>
                    <Button className='mx-1' variant="danger" onClick={() => removeAnswer(ans.id)}>Delete</Button>
                  </Col>
                </Row>
              </Card.Body>
              </Card>
            </Col>
            ))}
        </Col>

          <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
            <Col md={8}>
              <Form.Group>
                <Form.Control
                  className="inputBox mt-3"
                  placeholder="Make Answers"
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </Form.Group>
            </Col>
              <Button variant="primary" onClick={addAnswer}>Add answers</Button>
          </Row>

          <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
            <Button className='mt-5' variant="primary" onClick={confirmChanges}>Confirm Changes</Button>
          </Row>

        </Col>
      </Container>
    </>
  )
}

EditQuestion.propTypes = {
  id: PropTypes.number,
  qid: PropTypes.string
}

export default EditQuestion;
