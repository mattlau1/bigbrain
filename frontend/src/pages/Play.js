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

  // automatically update user's answer when they select an option
  /** @param {Object} option */
  const changeCorrectAnswer = async (option) => {
    if (!answerList.includes(option.id)) {
      // user may have multiple correct answers
      answerList.push(option.id)
    } else {
      // user deselect answers
      const newAnswers = answerList;
      newAnswers.splice(newAnswers.indexOf(option.id), 1)
      setAnswerList([...newAnswers]);
    }
    // update the user's point based on the countdown
    setCurrentPoint(point);

    // http request body
    const body = {
      answerIds: answerList,
    }

    try {
      // routing to update user's answer
      await api.putAPIRequestBody(`play/${playerId}/answer`, body);
    } catch (e) {
      console.warn(e);
    }
  }

  // question contains a video otherwise show picture or none
  /** @param {String} src */
  const displayVideo = (src) => {
    if (!src) {
      setHeight(0);
      setVideoFile('');
      return;
    }
    setHeight(360);
    setVideoFile(src);
  }

  // determine point gain by comparing correct answers
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

  // polling and will automatically update questions after advancing
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await api.getAPIRequest(`play/${playerId}/question`);
        const data = await res.json();
        if (res.ok) {
          if ((over || !start) && (data.question.id !== questionId)) {
            // update the question detail and reset current timer and allocated points
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
            // when there are no more questions, go to result page
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
    // continuosly update player's stat
    setPlayerData({
      name: currentUser,
      point: addedPoint,
      maxPoint: maxPoint,
      correctQ: correctQ,
      maxQ: maxQ,
    });
    // deduct points every 2 seconds
    (timeLimit % 2) && setPoint(point - 0.5);
    polling >= 0 && setTimeout(() => setPolling(polling + 1), 2000);
  }, [polling])

  // get the username when stage is at -1
  useEffect(() => {
    const getPlayerName = async () => {
      try {
        const res = await api.getAPIRequest(`play/${playerId}/question`);
        if (!res.ok) {
          setCurrentUser(playerName);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    getPlayerName();
  }, []);

  // countdown with time dependency
  useEffect(() => {
    timeLimit > 0 && setTimeout(() => setTimeLimit(timeLimit - 1), 1000);
    if (timeLimit === 0) {
      // once the countdown is over, move on to next stage
      setOver(true);
      getCorrectAnswers();
    }
  }, [timeLimit])

  return (
    <>
      {inLobby && <Lobby></Lobby>}

      {!inLobby &&
      // display question details after advanced out of lobby screen
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
                <Card.Img style={{ maxHeight: 400, maxWidth: 400 }} src={baseImage} alt='Question Thumbnail'/>
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
                // while the time is on countdown, user can select any options
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
                // after the countdown is over, show correct answers
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
