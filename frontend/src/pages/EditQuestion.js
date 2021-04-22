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

  // pop up messages if errors got encountered
  /** @param {String} type */
  /** @param {String} message */
  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  // obtain game id and question id from previous component
  const { id, qid } = useParams();

  // change the question type to single choice
  const setSingle = () => {
    setQuestionType('single')
  }

  // change the question type to multiple choice
  const setMultiple = () => {
    setQuestionType('multiple')
  }

  // adding available options to the question
  const addAnswer = () => {
    if (answerList.length >= maxQuestions) {
      // user cannot have more than 6 selectable options
      createAlert('ERROR', `You cannot have more than ${maxQuestions} questions`);
      return;
    }
    // generate id for each options
    setAnswerId(answerId + 1)
    // update the list of option with relevent details
    setAnswerList(prevAnswer => {
      return [...prevAnswer, { id: answerId, answerText: answer, check: false }]
    })
  }

  // adding the video to the question
  const addVideo = () => {
    if (!videoUrl) return;
    // remove thumbnail if the video is uploaded
    setBaseImage('');
    setHeight(360);
    setVideoFile(videoUrl);
  }

  // user deselects correct option to the question
  /** @param {Integer} aId */
  const removeAnswer = (aId) => {
    if (correctAnswers.includes(aId)) {
      // removing correct option from the list
      const newAnswers = correctAnswers;
      newAnswers.splice(newAnswers.indexOf(aId), 1)
      setCorrectAnswers([...newAnswers]);
    }
    // update the correct option list
    setAnswerList(answerList.filter(ans => ans.id !== aId))
  }

  // user either uploads a video or an image
  /** @param {Object} e */
  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1);

      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
        // user uploads an image
        const base64 = await convertBase64(file);
        setVideoFile('');
        setHeight(0);
        setBaseImage(base64);
      } else if (ext === 'mp4' || ext === 'mov') {
        // user uploads a video
        setBaseImage('');
        setHeight(360);
        setVideoFile(URL.createObjectURL(e.target.files[0]));
      } else {
        // uploaded unsupported file type
        createAlert('ERROR', 'This file type is not supported');
      }
    }
  };

  // after uploading video, make it visible
  /** @param {String} src */
  const displayVideo = (src) => {
    if (!src) return;
    setHeight(360);
    setVideoFile(src);
  }

  // convert the question thumbnail to base 64 URL
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
        createAlert('ERROR', 'File could not be read');
      };
    });
  };

  // user select or deselect options
  /** @param {Object} option */
  const changeCorrectAnswer = (option) => {
    if (!correctAnswers.includes(option.id)) {
      correctAnswers.push(option.id)
    } else {
      const newAnswers = correctAnswers;
      newAnswers.splice(newAnswers.indexOf(option.id), 1)
      setCorrectAnswers([...newAnswers]);
    }

    // obtain the index of the currently changed option
    let index;
    let i = 0;
    answerList.forEach((item) => {
      (item.id === option.id) && (index = i);
      i++;
    });
    const clone = [...answerList];
    // if the option is selected, change hook to display check
    (option.check) ? clone[index].check = false : clone[index].check = true;
    setAnswerList(clone);
  }

  // save all the details associated with the question
  const confirmChanges = async () => {
    if (isNaN(points)) {
      // points is not numeric
      createAlert('ERROR', 'Awarded points must be a number');
      return;
    }

    if (isNaN(timeLimit)) {
      // time is not numeric
      createAlert('ERROR', 'Time limit must be a number');
      return;
    }

    if (answerList.length < 2) {
      // user cannot update the question if there are less than 2 options
      createAlert('ERROR', 'The question must have at least 2 choices');
      return;
    }

    if (questionType === 'single' && correctAnswers.length !== 1) {
      // single choice must not have multiple correct answers
      createAlert('ERROR', 'A single choice question must have 1 correct answer only');
      return;
    } else if (questionType === 'multiple' && correctAnswers.length < 2) {
      // multiple choice must not have less than 2 correct answers
      createAlert('ERROR', 'A multiple choice question must have at least 2 correct answers');
      return;
    }
    createAlert('SUCCESS', 'Changes has been made');
    createBody();
  }

  // preparing a body to update question details for routing
  const createBody = () => {
    const questionBody = {
      id: qid,
      // if point is empty, used previously saved value
      point: (!points) ? qObj.point : parseInt(points, 10),
      // if text is empty, used previously saved text
      text: (!question) ? qObj.text : question,
      // if time is empty, used previously saved value
      time_limit: (!timeLimit) ? qObj.time_limit : parseInt(timeLimit, 10),
      answers: answerList,
      type: questionType,
      thumbnail: baseImage,
      video: videoFile,
      correctAnswers: correctAnswers
    }

    // get the index of the question to update it in the game edit page
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

  // update the details of the question
  /** @param {Object} newBody */
  const saveChanges = async (newBody) => {
    const token = localStorage.getItem('token');
    const api = new API();
    const body = {
      questions: newBody,
    };

    try {
      // route to update the question details into the backend
      const res = await api.putAPIRequestTokenBody(`admin/quiz/${id}`, body, token);
      if (res.ok) {
        // redirects to previous page if updating is successful
        history.push(`/edit/${id}`);
      } else {
        // saving changes was unsuccessful
        createAlert('ERROR', 'There was a problem updating the questions');
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred');
      console.warn(e);
    }
  }

  // load previous changes of question detail to edit
  useEffect(() => {
    const token = localStorage.getItem('token');
    const api = new API();

    // load question details
    const loadQuestion = async () => {
      try {
        const res = await api.getAPIRequestToken(`admin/quiz/${id}`, token);
        const data = await res.json();
        if (res.ok) {
          // display currently saved details
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
          // question details could not be loaded
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
          {/* Edit question text */}
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
            {/* Display video */}
          <ReactPlayer
            controls={true}
            loop={true}
            height={height}
            url={videoFile}
          />
        </Col>
        <Col md={12} className={baseImage ? 'd-flex justify-content-center' : 'd-none'}>
          {/* Display thumbnail */}
          <Card.Img style={{ maxHeight: 400, maxWidth: 400 }} src={baseImage} alt='Question Thumbnail'/>
        </Col>
        <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
          <Col className="d-flex justify-content-start align-items-center text-center mt-2" md={4}>
            {/* Button to upload either video or image */}
            <input className='mb-2 mr-2 formContainer rounded border border-dark p-1'
              type="file"
              onChange={(e) => {
                uploadFile(e);
              }}
              accept={'.png, .jpeg, .jpg, .mov, .mp4'}
            />
          </Col>
          <Col md={4}>
            {/* Input video url and display */}
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
          {/* Allocated points for the question */}
          <Form.Group>
            <Form.Label>Awarded Points</Form.Label>
            <Form.Control
              className="inputBox m-2"
              value={points}
              placeholder={10}
              onChange={(e) => setPoints(e.target.value)}
            />
            {/* Allocated time to answer the question */}
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
            {/* Option to choose question type, either single choice or multiple choice */}
            <ButtonGroup>
              <Button className='mx-1 mb-2' variant="primary" onClick={setSingle}>Single Choice</Button>
              <Button className='mx-1 mb-2' variant="primary" onClick={setMultiple}>Multiple Choice</Button>
            </ButtonGroup>
          </Row>

          <Col>
            {answerList &&
              // display list of available options
              answerList.map((ans, index) => (
              <Col className='m-2 p-1' key={index} md={12}>
                <Card>
                <Card.Body>
                  <Row>
                    <Col md={10}>
                      <span>Correct Answer: </span>
                      {/* select or deselect correct option(s) */}
                      <Form.Check
                        className="d-inline my-0 py-0"
                        type="checkbox"
                        checked={ans.check}
                        onChange={() => changeCorrectAnswer(ans)}
                      />
                      <p className="m-0" style={{ fontSize: 20 }}>{ans.answerText}</p>
                    </Col>
                    <Col md={2} className="d-flex justify-content-end align-items-center">
                      {/* remove the option completely from the question */}
                      <Button className='mx-1' variant="danger" onClick={() => removeAnswer(ans.id)}>Delete</Button>
                    </Col>
                  </Row>
                </Card.Body>
                </Card>
              </Col>
              ))}
          </Col>

          <Row className="d-flex justify-content-start align-items-center text-center" md={12}>
            {/* Set text for the available options */}
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
              {/* New answer options will be displayed */}
              <Button variant="primary w-100" onClick={addAnswer}>Add option</Button>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center align-items-center text-center" md={12}>
            {/* Save changes to the question */}
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
