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
  const [newText, setNewText] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [point, setPoint] = useState(0);
  const [time, setTime] = useState(0);
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
    if (answerList.length >= 6) return;
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

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setVideoFile('');
    setHeight(0);
    setBaseImage(base64);
  };

  const uploadVideo = async (e) => {
    setBaseImage('');
    setHeight(360);
    setVideoFile(URL.createObjectURL(e.target.files[0]));
  }

  const displayVideo = (src) => {
    if (!src) return;
    setHeight(360);
    console.log(src);
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
      };
    });
  };

  const changeCorrectAnswer = (option) => {
    console.log(option)
    if (!correctAnswers.includes(option.id)) {
      correctAnswers.push(option.id)
    } else {
      const newAnswers = correctAnswers;
      newAnswers.splice(newAnswers.indexOf(option.id), 1)
      setCorrectAnswers([...newAnswers]);
      console.log(correctAnswers);
    }
    console.log(correctAnswers);
    let index;
    let i = 0;
    answerList.forEach((item) => {
      if (item.id === option.id) {
        index = i;
      }
      i++;
    })
    const clone = [...answerList];
    // if (option.check) {
    //   clone[index].check = false;
    // } else {
    //   clone[index].check = true;
    // }
    (option.check) ? clone[index].check = false : clone[index].check = true;

    setAnswerList(clone);
  }

  const confirmChanges = async () => {
    console.log(answerList);
    if (answerList.length < 2) {
      createAlert('ERROR', 'Need at least 2 answers to make changes');
      return;
    }
    if (questionType === 'single') {
      if (correctAnswers.length > 1 || correctAnswers.length < 1) {
        createAlert('ERROR', 'This is a single choice question. Must have 1 correct answer only');
        return;
      }
    } else if (questionType === 'multiple') {
      if (correctAnswers.length < 2) {
        createAlert('ERROR', 'This is a multiple choice question. Must have at least 2 correct answers');
        return;
      }
    }
    createAlert('SUCCESS', 'Changes has been made');
    const questionBody = {
      id: qid,
      point: (!point) ? qObj.point : parseInt(point, 10),
      text: (!newText) ? qObj.text : newText,
      time_limit: (!time) ? qObj.time_limit : parseInt(time, 10),
      answers: answerList,
      type: questionType,
      thumbnail: baseImage,
      video: videoFile,
      correctAnswers: correctAnswers
    }
    console.log(questionBody);
    let index;
    let i = 0;
    questions.forEach((question) => {
      if (question.id === qid) {
        index = i;
      }
      i++;
    })
    const clone = [...questions]
    clone[index] = questionBody
    const token = localStorage.getItem('token');
    const api = new API();
    const body = {
      questions: clone,
    };

    try {
      const res = await api.putAPIRequestTokenBody(`admin/quiz/${id}`, body, token);
      const data = await res.json();
      if (res.ok) {
        console.log('changed successully');
        console.log(data);
        history.push(`/edit/${id}`);
      } else {
        console.log('changed UNsuccessully');
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
        <Col md={12}>
          <ReactPlayer
            playing={true}
            loop={true}
            height={height}
            url={videoFile}
          />
        </Col>
        <Col md={{ span: 4, offset: 4 }}>
          <Card.Img src={baseImage} />
        </Col>
        <Row className="d-flex justify-content-center align-items-center text-center" md={12}>

          <Col className="d-flex justify-content-center align-items-center text-center mt-2" md={12}>
            <input className='mb-2 mr-2 formContainer rounded border border-dark p-1'
              type="file"
              onChange={(e) => {
                uploadImage(e);
              }}
            />
            Add Thumbnail
          </Col>

          <Col className="d-flex justify-content-center align-items-center text-center mt-2" md={12}>
            <input className='mb-2 mr-2 formContainer rounded border border-dark p-1'
              type="file"
              onChange={(e) => {
                uploadVideo(e);
              }}
            />
            Add Video
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Control
                className="inputBox mt-3"
                placeholder="Add video"
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Button variant="primary" onClick={addVideo}>Display video URL</Button>
        </Row>
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
            Current time: {qObj.time_limit}
            <Form.Control
              className="inputBox m-2"
              placeholder="Time Limit (seconds)"
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
                    <Col md={9}><Form.Check type="checkbox" checked={ans.check} onChange={() => changeCorrectAnswer(ans)}/>{index + 1}. {ans.answerText}</Col>
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
              <Button variant="primary" onClick={addAnswer}>Add option</Button>
          </Row>

          <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
            <Button className='my-5' variant="primary" onClick={confirmChanges}>Confirm Changes</Button>
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
