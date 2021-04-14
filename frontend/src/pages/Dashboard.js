import React, { useState, useEffect } from 'react';
import { useAlert } from '../contexts/AlertProvider';
import { Col, Row, Card, Container, Button } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import CreateGameModal from '../components/CreateGameModal';
import DeleteQuizButton from '../components/DeleteQuizButton';
import { Link } from 'react-router-dom';
import API from '../utils/API';
import StartQuizButton from '../components/StartQuizButton';

const Dashboard = () => {
  const [gameList, setGameList] = useState([]);
  const [show, setShow] = useState(false);

  const dispatch = useAlert();
  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const getCompletionTime = (questions) => {
    return questions.reduce((prev, current) => {
      return prev + current.time_limit;
    }, 0)
  }

  const handleCopy = (text) => {
    createAlert('SUCCESS', 'Session ID copied to clipboard');
    navigator.clipboard.writeText(text);
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
          <Button className='mt-2' variant="primary" onClick={() => handleShow()}>Create New Game</Button>
        </Row>
        <Row md={12}>
          {gameList.map((game, key) => (
            <Col className='mt-4' lg={4} md={6} sm={6} key={key}>
              <Card>
                <Card.Header>
                  <Row>
                    <Col md={8} className="px-2">
                      <h3>{game.name}</h3>
                    </Col>
                    <Col md={4} className="d-flex justify-content-end align-items-center px-1">
                      {game.active &&
                        <Button onClick={() => { handleCopy(game.active) }}>
                          Share
                        </Button>
                      }
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Img
                  src={game.thumbnail ||
                    'https://cdn.mos.cms.futurecdn.net/42E9as7NaTaAi4A6JcuFwG-1200-80.jpg'
                  }
                />
                  <Card.Body>
                    <Container>
                      <Row className="justify-content-center align-items-center">
                        <Col md={6} className="text-left pl-0">
                        {game.questions.length} questions
                        </Col>
                        <Col md={6} className="text-right pr-0">
                          {getCompletionTime(game.questions)} seconds
                        </Col>
                      </Row>
                    </Container>
                    <Container>
                      <Row className="justify-content-between px-0">
                        <Col md={3} className="px-0 my-1">
                          {game.active
                            ? <Button
                                className='mx-0 w-100'
                                variant="danger">Stop
                              </Button>
                            : <StartQuizButton
                                game={game}
                                gameList={gameList}
                                setGameList={setGameList}
                              />}
                        </Col>
                        <Col md={3} className="px-0 my-1">
                          <Link to={`/edit/${game.id}`}>
                            <Button className='mx-0 w-100' variant="primary">Edit</Button>
                          </Link>
                        </Col>
                        <Col md={3} className="px-0 my-1">
                          <DeleteQuizButton
                            gameList={gameList}
                            setGameList={setGameList}
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
        setShow={setShow}
        show={show}
        handleShow={handleShow}
        handleClose={handleClose}
        gameList={gameList}
        setGameList={setGameList}
      />
    </>
  )
}

export default Dashboard;
