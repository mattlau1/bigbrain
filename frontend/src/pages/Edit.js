import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import Navigation from '../components/Navigation';
import Button from 'react-bootstrap/Button';
import { Col, Row, Container, Card } from 'react-bootstrap';
import API from '../utils/API';
import { v4 as uuidv4 } from 'uuid'
import { useAlert } from '../contexts/AlertProvider';
import { Link } from 'react-router-dom';
import defaultThumbnail from '../assets/defaultThumbnail.png';

const Edit = () => {
  const [questionDetail, setQuestionDetail] = useState([])
  const [questions, setQuestions] = useState([])
  const [baseImage, setBaseImage] = useState('');
  const { quizId } = useParams();

  const dispatch = useAlert();

  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const addQuestion = () => {
    setQuestions(prevQuestion => {
      return [...prevQuestion,
        {
          id: uuidv4(),
          text: 'Empty Question',
          time_limit: 10,
          type: 'single',
          point: 20,
          answers: [
            {
              id: -500,
              answerText: 'Apple',
              check: true,
            },
            {
              id: -404,
              answerText: 'Banana',
              check: false,
            },
          ],
          thumbnail: null,
          video: null,
          correctAnswers: [-500]
        }]
    })
  }

  const removeQuestion = (qId) => {
    setQuestions(questions.filter(question => question.id !== qId))
  }

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1);

      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
        const base64 = await convertBase64(file);
        setBaseImage(base64);
      } else {
        createAlert('ERROR', 'This file format is not supported');
      }
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const removeImage = async () => {
    setBaseImage(defaultthumbnail);
    console.log(baseImage);
  }

  const confirmChanges = async () => {
    const token = localStorage.getItem('token');
    const api = new API();
    const body = {
      questions: questions,
      thumbnail: baseImage,
    };

    try {
      const res = await api.putAPIRequestTokenBody(`admin/quiz/${quizId}`, body, token);
      const data = await res.json();
      if (res.ok) {
        console.log('changed successully');
        console.log(data);
        createAlert('SUCCESS', 'Changes have been made');
      } else {
        console.log('changed UNsuccessully');
      }
    } catch (e) {
      console.log('error');
      console.warn(e);
    }
  }

  const quickSave = async () => {
    const token = localStorage.getItem('token');
    const api = new API();
    const body = {
      questions: questions,
      thumbnail: baseImage,
    };

    try {
      const res = await api.putAPIRequestTokenBody(`admin/quiz/${quizId}`, body, token);
      const data = await res.json();
      if (res.ok) {
        console.log(data);
      } else {
        console.log('UNsuccessful');
      }
    } catch (e) {
      console.log('error');
      console.warn(e);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const api = new API();

    const loadQuestion = async () => {
      try {
        const res = await api.getAPIRequestToken(`admin/quiz/${quizId}`, token);
        const data = await res.json();
        if (res.ok) {
          console.log('load questions successully');
          console.log(data);
          setQuestionDetail(data);
          setQuestions(data.questions);
          setBaseImage(data.thumbnail);
        } else {
          console.log('load questions UNsuccessully');
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
      <Container>
        <Row className="d-flex justify-content-center align-items-center text-center mt-2">
          <h2>{questionDetail.name}</h2>
        </Row>

        <Col md={{ span: 4, offset: 4 }}>
          <Card.Img src={baseImage || defaultthumbnail} />
        </Col>
        <Row className="d-flex justify-content-center align-items-center text-center mt-2">
          <input className='mb-2 formContainer rounded border border-dark p-1'
            type="file"
            onChange={(e) => {
              uploadImage(e);
            }}
            accept={'.png, .jpeg, .jpg'}
          />
          <Button
            className='mx-1 mb-2'
            variant="danger"
            onClick={removeImage}
          >
            Remove Thumbnail
          </Button>
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
                  <Link
                    to={{ pathname: `/editquestion/${quizId}/${question.id}`, state: { qObj: question } }}
                  >
                    <Button className='mx-1' variant="primary" onClick={quickSave}>Edit</Button>
                  </Link>
                  <Button
                    className='mx-1'
                    variant="danger"
                    onClick={() => removeQuestion(question.id)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
              </Card.Body>
              </Card>
            </Col>
            ))}
        </Col>

        <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
          <Col>
            <Button
              className='mx-1'
              variant="primary"
              onClick={addQuestion}
            >
              Add a new question
            </Button>
            <Button
            className='mx-1'
            variant="success"
            onClick={confirmChanges}
            >
              Confirm Changes
            </Button>
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
