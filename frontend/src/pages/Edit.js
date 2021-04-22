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

  // pop up messages if errors got encountered
  /** @param {String} type */
  /** @param {String} message */
  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  // creating a new question for the game
  const addQuestion = () => {
    // set default question
    setQuestions(prevQuestion => {
      return [...prevQuestion,
        {
          id: uuidv4(),
          text: 'Empty Question',
          time_limit: 10,
          type: 'single',
          point: 20,
          // set default answers
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

  // remove the question off from the game
  /** @param {Number} qId */
  const removeQuestion = (qId) => {
    setQuestions(questions.filter(question => question.id !== qId))
  }

  // user uploaded the thumbnail for the game
  /** @param {Object} e */
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1);

      // the uploaded file must be in image
      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
        const base64 = await convertBase64(file);
        setBaseImage(base64);
      } else {
        // if it is not an image, show popups
        createAlert('ERROR', 'This file format is not supported');
      }
    }
  };

  // convert the uploaded image into base64 URL
  /** @param {Object} file */
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

  // remove the thumbnail from the game
  const removeImage = async () => {
    setBaseImage(defaultThumbnail);
  }

  // save all the changes made into the game
  const confirmChanges = async () => {
    const token = localStorage.getItem('token');
    const api = new API();
    const body = {
      questions: questions,
      thumbnail: baseImage,
    };

    try {
      // routing to update all changes associated with the game
      const res = await api.putAPIRequestTokenBody(`admin/quiz/${quizId}`, body, token);
      if (res.ok) {
        // game has successfully been updated
        createAlert('SUCCESS', 'Changes have been made');
      } else {
        // changes can't be made if encounters any error
        createAlert('ERROR', 'Changes has not been made');
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred');
      console.warn(e);
    }
  }

  // save the newly added questions before getting redirected to edit question
  const quickSave = async () => {
    const token = localStorage.getItem('token');
    const api = new API();
    const body = {
      questions: questions,
      thumbnail: baseImage,
    };

    try {
      // routing to update all changes associated with the game
      const res = await api.putAPIRequestTokenBody(`admin/quiz/${quizId}`, body, token);
      if (!res.ok) {
        // saving changes was unsuccessful
        createAlert('ERROR', 'Changes has not been made');
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred');
      console.warn(e);
    }
  }

  // display all questions associated to the game and thumbnail if it exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    const api = new API();

    // load questions and thumbnails
    const loadQuestion = async () => {
      try {
        // retrieving details were successful
        const res = await api.getAPIRequestToken(`admin/quiz/${quizId}`, token);
        const data = await res.json();
        if (res.ok) {
          setQuestionDetail(data);
          setQuestions(data.questions);
          setBaseImage(data.thumbnail);
        } else {
          // failed to retrieve question details
          createAlert('ERROR', 'Questions could not be loaded');
        }
      } catch (e) {
        createAlert('ERROR', 'An unexpected error has occurred');
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
          {/* Name of the quiz */}
          <h2>{questionDetail.name}</h2>
        </Row>

        <Col md={{ span: 4, offset: 4 }}>
          {/* Game thumbnail */}
          <Card.Img src={baseImage || defaultThumbnail} alt='Game Thumbnail'/>
        </Col>
        <Row className="d-flex justify-content-center align-items-center text-center mt-2">
          {/* Button to upload thumbnail images */}
          <input className="mb-2 formContainer rounded border border-dark p-1"
            type="file"
            onChange={(e) => {
              uploadImage(e);
            }}
            accept={'.png, .jpeg, .jpg'}
          />
          {/* Button to remove the thumbnail images */}
          <Button
            className="ml-1 mr-0 mb-2"
            variant="danger"
            onClick={removeImage}
          >
            Remove Thumbnail
          </Button>
        </Row>

        <Col md={{ span: 8, offset: 2 }}>
          {questions &&
            // display all questions
            questions.map((question, index) => (
            <Col className='m-2 p-1' key={index} md={12}>
              <Card>
              <Card.Body>
              <Row>
                {/* question text */}
                <Col md={9}>{index + 1}. {question.text}</Col>
                <Col md={3}>
                  {/* each question has its own edit button which redirects to edit question page */}
                  <Link
                    to={{ pathname: `/editquestion/${quizId}/${question.id}`, state: { qObj: question } }}
                  >
                    {/* saves all adedd question before going to edit question page */}
                    <Button className='mx-1' variant="primary" onClick={quickSave}>Edit</Button>
                  </Link>
                  {/* Button to remove the question */}
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
          {/* Button to add questinos */}
            <Button
              className='mx-1'
              variant="primary"
              onClick={addQuestion}
              id="add-question-btn"
            >
              Add New Question
            </Button>
            {/* Button to save all the changes made in the game */}
            <Button
              className='mx-1'
              variant="success"
              id="confirm-changes-btn"
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
