import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import API from '../utils/API';
import Button from 'react-bootstrap/Button';
import { useAlert } from '../contexts/AlertProvider';
import { Col, Row, Card, Container } from 'react-bootstrap';
import CreateGameModal from '../components/CreateGameModal';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [gameList, setGameList] = useState([]);
  const [show, setShow] = useState(false);

  // let time = 0;
  const dispatch = useAlert();

  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const deleteGame = async (id) => {
    const token = localStorage.getItem('token');
    const api = new API();
    try {
      const res = await api.deleteAPIRequestToken(`admin/quiz/${id}`, token);
      if (res.ok) {
        createAlert('SUCCESS', 'Removed successfully')
      } else {
        createAlert('ERROR', 'Removing game was not successful')
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occurred')
      console.warn(e);
    }
    setGameList(gameList.filter(game => game.id !== id))
  }

  // const timeSum = (question) => {
  //   const sum = question.reduce((prev, current) => {
  //     return prev + current.time_limit;
  //   }, 0);
  //   console.log(sum)
  //   time = sum;
  // }

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
      <Container fluid>
      {console.log(gameList)}
        <Row md={12} className="d-flex justify-content-center align-items-center text-center">
          <Button className='mt-2' variant="primary" onClick={() => handleShow()}>Create New Game</Button>
        </Row>
        <Row md={12}>
          {gameList.map((game, key) => (
            <Col className='mt-4' md={3} key={key}>
              <Card>
                <Card.Header><h2>{game.name}</h2></Card.Header>
                <Card.Img src={game.thumbnail || 'https://cdn.mos.cms.futurecdn.net/42E9as7NaTaAi4A6JcuFwG-1200-80.jpg'} />
                  <Card.Body>
                    <Card.Text>
                    {game.questions.length} questions
                    {' '}{game.questions.reduce((prev, current) => {
                      return prev + current.time_limit;
                    }, 0)}
                    {' '}seconds
                    </Card.Text>
                    <Button className='mx-1' variant="primary">Start</Button>
                    <Button className='mx-1' variant="primary">Stop</Button>
                    <Link to={`/edit/${game.id}`}>
                      <Button className='mx-1' variant="primary">
                        Edit
                      </Button>
                    </Link>
                    <Button className='mx-1' variant="danger" onClick={() => deleteGame(game.id)}>Delete</Button>
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
