import { React, useEffect, useState } from 'react'
// import { useParams } from 'react-router';
import API from '../utils/API';
import { Container, Row, Col, Card, Form } from 'react-bootstrap'
import ReactPlayer from 'react-player';
import { useAlert } from '../contexts/AlertProvider';
import { useHistory, useLocation } from 'react-router-dom';

const Play = () => {
  // const { sessionId } = useParams();
  const location = useLocation();
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [answerList, setAnswerList] = useState([]);
  const [over, setOver] = useState(false);
  const [options, setOptions] = useState([]);
  const [timeLimit, setTimeLimit] = useState();
  const [correctAnswerList, setCorrectAnswerList] = useState([]);
  const [height, setHeight] = useState(0)
  const [videoFile, setVideoFile] = useState();
  const [baseImage, setBaseImage] = useState('');
  const [polling, setPolling] = useState(0);
  const [start, setStart] = useState(false);
  const [inLobby, setInLobby] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [point, setPoint] = useState(0);
  const [addedPoint, setAddedPoint] = useState(0);
  const [maxPoint, setMaxPoint] = useState(0);
  const [correctQ, setCorrectQ] = useState(0);
  const [maxQ, setMaxQ] = useState(0);
  const [playerData, setPlayerData] = useState({})
  // const [initialTime, setInitialTime] = useState(0);
  const playerId = location.state?.playerId;
  const playerName = location.state?.playerName;
  const history = useHistory();
  const api = new API();

  const dispatch = useAlert();

  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const changeCorrectAnswer = async (option) => {
    if (!answerList.includes(option.id)) {
      answerList.push(option.id)
    } else {
      const newAnswers = answerList;
      newAnswers.splice(newAnswers.indexOf(option.id), 1)
      setAnswerList([...newAnswers]);
    }

    (answerList.length === 0) && createAlert('ERROR', 'Make sure to select an answer');

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

  const displayVideo = (src) => {
    if (!src) {
      setHeight(0);
      setVideoFile('');
      return;
    }
    setHeight(360);
    setVideoFile(src);
  }

  const getCorrectAnswers = async () => {
    try {
      const res = await api.getAPIRequest(`play/${playerId}/answer`);
      const data = await res.json();
      if (res.ok) {
        console.log('correct answers gathered');
        setCorrectAnswerList(data.answerIds);
        if (data.answerIds.join() === answerList.join()) {
          console.log('you got it right!!!!');
          setAddedPoint(addedPoint + point);
          setCorrectQ(correctQ + 1);
        }
      } else {
        console.log('invalid output');
      }
    } catch (e) {
      console.log('error');
      console.warn(e);
    }
  }

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await api.getAPIRequest(`play/${playerId}/question`);
        const data = await res.json();
        if (res.ok) {
          if ((over || !start) && (data.question.text !== questionText)) {
            setAnswerList([]);
            setCorrectAnswerList([]);
            displayVideo(data.question.video);
            setBaseImage(data.question.thumbnail);
            setQuestionText(data.question.text);
            setQuestionType(data.question.type);
            setOptions(data.question.answers);
            !timeLimit && setTimeLimit(data.question.time_limit);
            setPoint(data.question.point);
            setMaxPoint(maxPoint + data.question.point);
            setMaxQ(maxQ + 1);
            setOver(false);
            setStart(true);
            setPolling(0);
            setInLobby(false);
          }
        } else {
          if (!inLobby) {
            console.log('ur at the end');
            setInLobby(true);
            console.log(playerData);
            history.push({
              pathname: '/gameresult',
              state: {
                playerData: playerData,
              }
            })
          }

          console.log('cannot get question details');
        }
      } catch (e) {
        console.log('error');
        console.warn(e);
      }
    }
    poll()
    setPlayerData({
      name: currentUser,
      point: addedPoint,
      maxPoint: maxPoint,
      correctQ: correctQ,
      maxQ: maxQ,
    })
    polling >= 0 && setTimeout(() => setPolling(polling + 1), 1000);
  }, [polling])

  useEffect(() => {
    const getQuestionDetail = async () => {
      try {
        const res = await api.getAPIRequest(`play/${playerId}/question`);
        const data = await res.json();
        if (res.ok) {
          if (over) {
            console.log('this got touched!');
            setAnswerList([]);
            setCorrectAnswerList([]);
            displayVideo(data.question.video);
            setBaseImage(data.question.thumbnail);
            setQuestionText(data.question.text);
            setQuestionType(data.question.type);
            setOptions(data.question.answers);
            !timeLimit && setTimeLimit(data.question.time_limit);
            // setInitialTime(data.question.time_limit);
            setOver(false);
          }
        } else {
          if (inLobby) console.log('This is a lobby!');
          setCurrentUser(playerName);
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
    if (timeLimit === 0) {
      setOver(true);
      getCorrectAnswers();
    }
  }, [timeLimit])
  return (
    <>
      <Container>
        <Col>
          <Row className="justify-content-center align-items-center">
            <h1>{questionText}</h1>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center align-items-center text-center"
            md={12}>
              <ReactPlayer
                playing={true}
                controls={true}
                loop={true}
                height={height}
                url={videoFile}
              />
            </Col>
            <Col md={12} className={baseImage ? 'd-flex justify-content-center' : 'd-none'}>
              <Card.Img style={{ maxHeight: 400, maxWidth: 400 }} src={baseImage} />
            </Col>
          </Row>
          <Row>
            <Col md={11} className='p-1'>
              {questionType && <h3>{questionType.charAt(0).toUpperCase() + questionType.slice(1)} choice question</h3>}
            </Col>
            <Col md={1} className='d-inline mx-0 px-1'>
            <h2 className='text-right'>{timeLimit}</h2>
            </Col>
          </Row>
          <Row>
            {(!over)
              ? options &&
                options.map((option, index) => (
                <Col className='p-1' key={index} md={6}>
                  <Card>
                  <Card.Body className="bg-primary">
                    <Row>
                      <Col md={10}>
                        <p className="m-0" style={{ fontSize: 30, color: 'white' }}>{option.answerText}</p>
                      </Col>
                      <Col className="d-flex justify-content-end" md={2}>
                      <Form.Check
                          className="d-inline my-0 py-0"
                          type="checkbox"
                          id='checkboxSize'
                          onChange={() => changeCorrectAnswer(option)}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                  </Card>
                </Col>
                ))
              : options &&
                options.map((option, index) => (
                <Col className='p-1' key={index} md={6}>
                  <Card>
                  <Card.Body
                    className={correctAnswerList.includes(option.id) ? 'bg-success' : 'bg-danger'}
                  >
                    <Row>
                      <Col md={6}>
                        <p className="m-0" style={{ fontSize: 30, color: 'white' }}>{option.answerText}</p>
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
