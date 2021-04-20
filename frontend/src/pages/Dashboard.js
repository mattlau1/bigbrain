import React, { useState, useEffect } from 'react';
import { useAlert } from '../contexts/AlertProvider';
import { Col, Row, Card, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../utils/API';
import Navigation from '../components/Navigation';
import CreateGameModal from '../components/CreateGameModal';
import DeleteQuizButton from '../components/DeleteQuizButton';
import StartQuizButton from '../components/StartQuizButton';
import StartGameModal from '../components/StartGameModal';
import StopQuizButton from '../components/StopQuizButton';
import StopGameModal from '../components/StopGameModal';
import defaultThumbnail from '../assets/defaultThumbnail.png';
import PreviousGamesButton from '../components/PreviousGamesButton';

const Dashboard = () => {
  const [gameList, setGameList] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showStop, setShowStop] = useState(false);
  const [currSessionId, setCurrSessionId] = useState(0)
  const [currGameId, setCurrGameId] = useState(0)

  const dispatch = useAlert();
  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const handleCloseCreate = () => setShowCreate(false);
  const handleShowCreate = () => setShowCreate(true);
  const handleShowStop = (id) => {
    setCurrSessionId(id);
    setShowStop(true);
  };

  const handleCloseStop = () => setShowStop(false);
  const handleCloseStart = () => setShowStart(false);
  const handleShowStart = (gameId, sessionId) => {
    setCurrSessionId(sessionId);
    setCurrGameId(gameId)
    setShowStart(true);
  }

  const getCompletionTime = (questions) => {
    return questions.reduce((prev, current) => {
      return prev + current.time_limit;
    }, 0)
  }

  useEffect(() => {
    const loadGames = async () => {
      const token = localStorage.getItem('token');
      const api = new API();
      api.getAPIRequestToken('admin/quiz', token).then((data) => {
        if (data.status === 403) {
          createAlert('ERROR', 'Invalid Token');
        } else if (data.status === 200) {
          data.json().then((quizzes) => {
            quizzes.quizzes.forEach((quiz) => {
              api.getAPIRequestToken(`admin/quiz/${quiz.id}`, token).then((data) => {
                data.json().then((quizData) => {
                  const newGame = { ...quizData, ...quiz }
                  setGameList(gameList => [...gameList, newGame]);
                })
              }).catch((e) => {
                createAlert('ERROR', 'There was a problem getting quizzes');
                console.warn(e)
              })
            })
          })
        }
      }).catch((e) => {
        createAlert('ERROR', 'There was a problem getting quizzes');
        console.warn(e)
      })
    }

    loadGames();
  }, []);

  return (
    <>
      <Navigation />
      <Container>
      {console.log(gameList)}
        <Row md={12} className="justify-content-center align-items-center text-center">
          <Button
            className="m-2"
            variant="primary"
            onClick={() => handleShowCreate()}
          >
          Create New Game
          </Button>
        </Row>
        <Row md={12}>
          {gameList.map((game, key) => (
            <Col className='mt-4' lg={4} md={6} sm={6} xs={12} key={key}>
              <Card>
                <Card.Header>
                  <Row>
                    <Col xs={8} className="px-2">
                      <h3>{game.name}</h3>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-end align-items-center px-1">
                      {game.active &&
                        <Button onClick={() => { handleShowStart(game.id, game.active) }}>
                          Share
                        </Button>
                      }
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Img
                  src={game.thumbnail || defaultThumbnail}
                />
                  <Card.Body>
                    <Container>
                      <Row className="justify-content-center align-items-center">
                        <Col xs={6} className="text-left pl-0 py-2">
                        {game.questions.length} questions
                        </Col>
                        <Col xs={6} className="text-right pr-0 py-2">
                          {getCompletionTime(game.questions)} seconds
                        </Col>
                      </Row>
                    </Container>
                    <Container>
                      <Row className="justify-content-between px-0">
                        <Col md={4} className="px-0 my-1">
                          {game.active
                            ? <StopQuizButton
                                game={game}
                                setGameList={setGameList}
                                handleShowStop={handleShowStop}
                                id={game.active}
                              />
                            : <StartQuizButton
                                game={game}
                                setGameList={setGameList}
                              />}
                        </Col>
                        <Col md={3} className="px-0 my-1">
                          <Link to={`/edit/${game.id}`}>
                            <Button className='mx-0 w-100' variant="primary">Edit</Button>
                          </Link>
                        </Col>
                        <Col md={4} className="px-0 my-1">
                          <DeleteQuizButton
                            gameList={gameList}
                            setGameList={setGameList}
                            gameId={game.id}
                          />
                        </Col>
                        <Col md={12} className="px-0 my-1 w-100">
                          <PreviousGamesButton
                            gameId={game.id}
                          />
                        </Col>
                      </Row>
                    </Container>
                  </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <CreateGameModal
        setShow={setShowCreate}
        show={showCreate}
        handleShow={handleShowCreate}
        handleClose={handleCloseCreate}
        gameList={gameList}
        setGameList={setGameList}
      />
      <StartGameModal
        show={showStart}
        handleClose={handleCloseStart}
        sessionId={currSessionId}
        gameId={currGameId}
        handleShowStop={handleShowStop}
        setGameList={setGameList}
      />
      <StopGameModal
        show={showStop}
        handleClose={handleCloseStop}
        id={currSessionId}
      />
    </>
  )
}

export default Dashboard;
