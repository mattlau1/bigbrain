import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import Navigation from '../components/Navigation';
import Button from 'react-bootstrap/Button';
import { Col, Row, Container, Card } from 'react-bootstrap';
import API from '../utils/API';

const Edit = () => {
  const [questionDetail, setQuestionDetail] = useState([])
  const [questions, setQuestions] = useState([])
  console.log(questions)
  const { id } = useParams();

  const addQuestion = () => {
    setQuestions(prevQuestion => {
      return [...prevQuestion, { id: 69, text: 'blank question', time_limit: 10 }]
    })
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const api = new API();

    const loadQuestion = async () => {
      try {
        const res = await api.getAPIRequestToken(`admin/quiz/${id}`, token);
        const data = await res.json();
        if (res.ok) {
          console.log('load questions successully');
          console.log(data);
          setQuestionDetail(data);
        } else {
          console.log('load questions UNsuccessully');
        }
      } catch (e) {
        console.log('error');
        console.warn(e);
      }
    }
    loadQuestion()
    const getQuestions = async () => {
      setQuestions([
        {
          id: 1,
          text: 'red or blue?',
          time_limit: 10,
        },
        {
          id: 2,
          text: 'can you answer this question?',
          time_limit: 10,
        },
        {
          id: 3,
          text: '1 + 1?',
          time_limit: 10,
        },
      ])
    }
    getQuestions()
  }, [])

  return (
    <>
      <Navigation />
      You are editing game called with id {id && id}
      <Container>
        <Row className="d-flex justify-content-center align-items-center text-center">
        <h2>{questionDetail.name}</h2>
        </Row>

        <Col md={{ span: 8, offset: 2 }}>
          {questions &&
            questions.map((question, index) => (
            <Col className='m-2 p-1' key={index} md={12}>
              <Card>
              <Card.Body>
                <Row>
                  <Col md={9}>{index + 1}. {question.text}</Col>
                  <Col md={3}>
                    <Button className='mx-1' variant="primary">Edit</Button>
                    <Button className='mx-1' variant="primary">Delete</Button>
                  </Col>
                </Row>
              </Card.Body>
              </Card>
            </Col>
            ))}
        </Col>

        <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
          <Col>
          <Button className='mx-1' variant="primary" onClick={addQuestion}>Add a new question</Button>
          <Button className='mx-1' variant="primary">Confirm Changes</Button>
          </Col>
        </Row>
      </Container>
    </>
  )
}

Edit.propTypes = {
  id: PropTypes.number
}

export default Edit
