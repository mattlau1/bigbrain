import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Navigation from '../components/Navigation';
import { useParams } from 'react-router';
import API from '../utils/API';
import { Container, Form, Col, Row, Button, ButtonGroup, Card } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useAlert } from '../contexts/AlertProvider';

const EditQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [points, setPoints] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answerList, setAnswerList] = useState([]);
  const [answerId, setAnswerId] = useState(0);
  const [videoFile, setVideoFile] = useState();
  const [videoUrl, setVideoUrl] = useState('');
  const [baseImage, setBaseImage] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [height, setHeight] = useState(0);
  const location = useLocation();
  const qObj = location.state?.qObj;
  const history = useHistory();
  const maxQuestions = 6;

  const dispatch = useAlert();

  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const { id, qid } = useParams();
  const setSingle = () => {
    setQuestionType('single')
  }

  const setMultiple = () => {
    setQuestionType('multiple')
  }

  const addAnswer = () => {
    if (answerList.length >= maxQuestions) {
      createAlert('ERROR', `You cannot have more than ${maxQuestions} questions`);
      return;
    }
    setAnswerId(answerId + 1)
    setAnswerList(prevAnswer => {
      return [...prevAnswer, { id: answerId, answerText: answer, check: false }]
    })
  }

  const addVideo = () => {
    if (!videoUrl) return;
    setBaseImage('');
    setHeight(360);
    setVideoFile(videoUrl);
  }

  const removeAnswer = (aId) => {
    setAnswerList(answerList.filter(ans => ans.id !== aId))
  }

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1);

      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
        const base64 = await convertBase64(file);
        setVideoFile('');
        setHeight(0);
        setBaseImage(base64);
      } else if (ext === 'mp4' || ext === 'mov') {
        setBaseImage('');
        setHeight(360);
        setVideoFile(URL.createObjectURL(e.target.files[0]));
      } else {
        createAlert('ERROR', 'This file type is not supported');
      }
    }
  };

  const displayVideo = (src) => {
    if (!src) return;
    setHeight(360);
    setVideoFile(src);
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
        createAlert('ERROR', 'File could not be read');
      };
    });
  };

  const changeCorrectAnswer = (option) => {
    if (!correctAnswers.includes(option.id)) {
      correctAnswers.push(option.id)
    } else {
      const newAnswers = correctAnswers;
      newAnswers.splice(newAnswers.indexOf(option.id), 1)
      setCorrectAnswers([...newAnswers]);
    }

    let index;
    let i = 0;
    answerList.forEach((item) => {
      (item.id === option.id) && (index = i);
      i++;
    });
    const clone = [...answerList];
    (option.check) ? clone[index].check = false : clone[index].check = true;
    setAnswerList(clone);
  }

  const confirmChanges = async () => {
    if (isNaN(points)) {
      createAlert('ERROR', 'Awarded points must be a number');
      return;
    }

    if (isNaN(timeLimit)) {
      createAlert('ERROR', 'Time limit must be a number');
      return;
    }

    if (answerList.length < 2) {
      createAlert('ERROR', 'The question must have at least 2 choices');
      return;
    }

    if (questionType === 'single' && correctAnswers.length !== 1) {
      createAlert('ERROR', 'A single choice question must have 1 correct answer only');
      return;
    } else if (questionType === 'multiple' && correctAnswers.length < 2) {
      createAlert('ERROR', 'A multiple choice question must have at least 2 correct answers');
      return;
    }
    createAlert('SUCCESS', 'Changes has been made');
    createBody();
  }

  const createBody = () => {
    const questionBody = {
      id: qid,
      point: (!points) ? qObj.point : parseInt(points, 10),
      text: (!question) ? qObj.text : question,
      time_limit: (!timeLimit) ? qObj.time_limit : parseInt(timeLimit, 10),
      answers: answerList,
      type: questionType,
      thumbnail: baseImage,
      video: videoFile,
      correctAnswers: correctAnswers
    }

    let index;
    let i = 0;
    questions.forEach((question) => {
      (question.id === qid) && (index = i);
      i++;
    })
    const clone = [...questions]
    clone[index] = questionBody
    saveChanges(clone);
  }

  const saveChanges = async (newBody) => {
    const token = localStorage.getItem('token');
    const api = new API();
    const body = {
      questions: newBody,
    };

    try {
      const res = await api.putAPIRequestTokenBody(`admin/quiz/${id}`, body, token);
      if (res.ok) {
        history.push(`/edit/${id}`);
      } else {
        createAlert('ERROR', 'There was a problem updating the questions');
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred');
      console.warn(e);
    }
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
          setAnswerId(qObj.answers.length);
          displayVideo(qObj.video);
          setBaseImage(qObj.thumbnail);
          setCorrectAnswers(qObj.correctAnswers);
          setPoints(qObj.point);
          setQuestion(qObj.text)
          setTimeLimit(qObj.time_limit)
        } else {
          createAlert('ERROR', 'There was a problem loading questions');
          console.warn(data)
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
        <Row md={12}>
          <Form.Control
            size="lg"
            className="inputBox mt-4"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </Row>
        <Col className="d-flex justify-content-center align-items-center text-center"
          md={12}>
          <ReactPlayer
            controls={true}
            loop={true}
            height={height}
            url={videoFile}
          />
        </Col>
        <Col md={12} className="d-flex justify-content-center align-items-center text-center">
          <Card.Img style={{ maxHeight: 400, maxWidth: 400 }} src={baseImage} />
        </Col>
        <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
          <Col className="d-flex justify-content-start align-items-center text-center mt-2" md={4}>
            <input className='mb-2 mr-2 formContainer rounded border border-dark p-1'
              type="file"
              onChange={(e) => {
                uploadFile(e);
              }}
              accept={'.png, .jpeg, .jpg, .mov, .mp4'}
            />
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Control
                className="inputBox mt-3"
                placeholder="Youtube Video URL"
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button variant="primary" onClick={addVideo}>Display Video</Button>
          </Col>
        </Row>
        <Col md={12} className="mx-0 px-0">
          <Form.Group>
            <Form.Label>Awarded Points</Form.Label>
            <Form.Control
              className="inputBox m-2"
              value={points}
              placeholder={10}
              onChange={(e) => setPoints(e.target.value)}
            />
            <Form.Label>Time Limit (seconds)</Form.Label>
            <Form.Control
              className="inputBox m-2"
              value={timeLimit}
              placeholder={20}
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </Form.Group>

          <Row className="d-flex justify-content-start align-items-center text-left" md={12}>
            <Col md={12}>
              <h3>Choices</h3>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
            Question Type: {questionType.charAt(0).toUpperCase() + questionType.slice(1)} Choice
          </Row>

          <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
            <ButtonGroup>
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
                    <Col md={10}>
                      <span>Correct Answer: </span>
                      <Form.Check
                        className="d-inline my-0 py-0"
                        type="checkbox"
                        checked={ans.check}
                        onChange={() => changeCorrectAnswer(ans)}
                      />
                      <p className="m-0" style={{ fontSize: 20 }}>{ans.answerText}</p>
                    </Col>
                    <Col md={2} className="d-flex justify-content-end align-items-center">
                      <Button className='mx-1' variant="danger" onClick={() => removeAnswer(ans.id)}>Delete</Button>
                    </Col>
                  </Row>
                </Card.Body>
                </Card>
              </Col>
              ))}
          </Col>

          <Row className="d-flex justify-content-start align-items-center text-center" md={12}>
            <Col md={10}>
              <Form.Group>
                <Form.Control
                  className="inputBox mt-3"
                  placeholder="Answer Text"
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button variant="primary w-100" onClick={addAnswer}>Add option</Button>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
            <Button className='my-5 w-100' variant="success" onClick={confirmChanges}>Confirm Changes</Button>
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
