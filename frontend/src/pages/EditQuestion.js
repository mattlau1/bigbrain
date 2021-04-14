import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Navigation from '../components/Navigation';
import { useParams } from 'react-router';
import API from '../utils/API';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const EditQuestion = () => {
  const [questions, setQuestions] = useState([]);
  console.log(questions)
  const [newText, setNewText] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [point, setPoint] = useState(0);
  console.log(point)

  console.log(newText);
  // const [ansCount, setAnsCount] = useState(0)
  const { id, qid } = useParams();
  const setSingle = () => {
    setQuestionType('single')
  }

  const setMultiple = () => {
    setQuestionType('multiple')
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const api = new API();

    const loadQuestion = async () => {
      try {
        const res = await api.getAPIRequestToken(`admin/quiz/${id}`, token);
        const data = await res.json();
        if (res.ok) {
          console.log(data.questions);
          setQuestions(data.questions);
          setQuestionType('single');
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
        <Col md={{ span: 8, offset: 2 }}>
          <Form.Group>
            <Form.Control
              className="inputBox"
              placeholder="Rename Question"
              onChange={(e) => setNewText(e.target.value)}
            />

            <Form.Control
              className="inputBox"
              placeholder="Points"
              onChange={(e) => setPoint(e.target.value)}
            />
          </Form.Group>
          <Row md={12}>
            The question type is {questionType}
          </Row>

          <Row>
            <ButtonGroup aria-label="Basic example">
              <Button variant="primary" onClick={setSingle}>Single Choice</Button>
              <Button variant="primary" onClick={setMultiple}>Multiple Choice</Button>
            </ButtonGroup>
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
