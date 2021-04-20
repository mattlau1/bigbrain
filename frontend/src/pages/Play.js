import { React, useEffect, useState } from 'react'
import API from '../utils/API';
import { Container, Row, Col, Card, Form } from 'react-bootstrap'
import ReactPlayer from 'react-player';
import Lobby from '../components/Lobby';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router';

const WhiteH1 = styled.h1`
  color: white;
  font-family: 'Montserrat', sans-serif;
`

const WhiteH2 = styled.h2`
  color: white;
  font-family: 'Montserrat', sans-serif;
`

const WhiteH3 = styled.h3`
  color: white;
  font-family: 'Montserrat', sans-serif;
`

const QuestionText = styled.p`
  font-size: 24pt;
  font-family: 'Montserrat', sans-serif;
  color: white;
`

const Play = () => {
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
  const [currentPoint, setCurrentPoint] = useState('');
  const [point, setPoint] = useState(0);
  const [addedPoint, setAddedPoint] = useState(0);
  const [maxPoint, setMaxPoint] = useState(0);
  const [correctQ, setCorrectQ] = useState(0);
  const [questionId, setQuestionId] = useState('');
  const [maxQ, setMaxQ] = useState(0);
  const [playerData, setPlayerData] = useState({})
  const playerId = location.state?.playerId;
  const playerName = location.state?.playerName;
  const history = useHistory();
  const api = new API();

  const changeCorrectAnswer = async (option) => {
    if (!answerList.includes(option.id)) {
      answerList.push(option.id)
    } else {
      const newAnswers = answerList;
      newAnswers.splice(newAnswers.indexOf(option.id), 1)
      setAnswerList([...newAnswers]);
    }

    setCurrentPoint(point);

    const body = {
      answerIds: answerList,
    }

    try {
      await api.putAPIRequestBody(`play/${playerId}/answer`, body);
    } catch (e) {
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
        setCorrectAnswerList(data.answerIds);
        if (data.answerIds.join() === answerList.join()) {
          setAddedPoint(addedPoint + currentPoint);
          setCorrectQ(correctQ + 1);
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await api.getAPIRequest(`play/${playerId}/question`);
        const data = await res.json();
        if (res.ok) {
          if ((over || !start) && (data.question.id !== questionId)) {
            setAnswerList([]);
            setCorrectAnswerList([]);
            displayVideo(data.question.video);
            setBaseImage(data.question.thumbnail);
            setQuestionText(data.question.text);
            setQuestionType(data.question.type);
            setOptions(data.question.answers);
            setQuestionId(data.question.id);
            !timeLimit && setTimeLimit(data.question.time_limit);
            setPoint(data.question.point);
            setMaxPoint(maxPoint + data.question.point);
            setMaxQ(maxQ + 1);
            setCurrentPoint(0);
            setOver(false);
            setStart(true);
            setPolling(0);
            setInLobby(false);
          }
        } else {
          if (!inLobby) {
            setInLobby(true);
            history.push({
              pathname: '/gameresult',
              state: {
                playerData: playerData,
              }
            })
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
    poll();
    setPlayerData({
      name: currentUser,
      point: addedPoint,
      maxPoint: maxPoint,
      correctQ: correctQ,
      maxQ: maxQ,
    });
    (timeLimit % 2) && setPoint(point - 0.5);
    polling >= 0 && setTimeout(() => setPolling(polling + 1), 2000);
  }, [polling])

  useEffect(() => {
    const getQuestionDetail = async () => {
      try {
        const res = await api.getAPIRequest(`play/${playerId}/question`);
        const data = await res.json();
        if (res.ok) {
          if (over) {
            setAnswerList([]);
            setCorrectAnswerList([]);
            displayVideo(data.question.video);
            setBaseImage(data.question.thumbnail);
            setQuestionId(data.question.id);
            setQuestionText(data.question.text);
            setQuestionType(data.question.type);
            setOptions(data.question.answers);
            !timeLimit && setTimeLimit(data.question.time_limit);
            setOver(false);
          }
        } else {
          setCurrentUser(playerName);
        }
      } catch (e) {
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
      {inLobby && <Lobby></Lobby>}

      {!inLobby &&
      <Container style={{ backgroundColor: '#44A3E5', height: '100vh' }} fluid>
        <Container>
          <Col>
            <Row className="justify-content-center align-items-center">
              <WhiteH1 className="mt-4">{questionText}</WhiteH1>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center align-items-center text-center"
              md={12}>
                <ReactPlayer
                  playing={true}
                  controls={true}
                  loop={false}
                  height={height}
                  url={videoFile}
                />
              </Col>
              <Col md={12} className={baseImage ? 'd-flex justify-content-center' : 'd-none'}>
                <Card.Img style={{ maxHeight: 400, maxWidth: 400 }} src={baseImage} />
              </Col>
            </Row>
            <Row>
              <Col md={10} className='p-1'>
                {questionType && <WhiteH3>{questionType.charAt(0).toUpperCase() + questionType.slice(1)} choice question</WhiteH3>}
              </Col>
              <Col md={2} className='d-inline mx-0 px-1'>
              <WhiteH2 className='text-right'>{timeLimit}</WhiteH2>
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
                          <QuestionText className="m-0">{option.answerText}</QuestionText>
                        </Col>
                        <Col className="d-flex justify-content-end" md={2}>
                        <Form.Check
                            className="d-inline my-0 py-0"
                            type="checkbox"
                            id="big-checkbox"
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
      </Container>}
    </>
  )
}

export default Play
