import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import API from '../utils/API';
import Button from 'react-bootstrap/Button';

const Dashboard = () => {
  const [gameList, setGameList] = useState([]);
  console.log(gameList);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const api = new API();

    const loadGames = async () => {
      try {
        const res = await api.getAPIRequestQuiz('admin/quiz', token);
        const data = await res.json();
        if (res.ok) {
          console.log('load quiz successully');
          console.log(data);
          setGameList(data.quizzes);
        } else {
          console.log('load quiz UNsuccessully');
        }
      } catch (e) {
        console.log('error');
        console.warn(e);
      }
    }
    loadGames();
  }, [])
  // const getDetails = async (gameId) => {
  //   const token = localStorage.getItem('token');
  //   const api = new API();
  //   try {
  //     const res = await api.getAPIRequestQuizDetails(`admin/quiz/${gameId}`, token);
  //     const data = await res.json();
  //     if (res.ok) {
  //       console.log('load details successully');
  //       console.log(data);
  //     } else {
  //       console.log('load details UNsuccessully');
  //     }
  //   } catch (e) {
  //     console.log('error');
  //     console.warn(e);
  //   }
  // }

  return (
    <>
      <Navigation />
        <Container fluid>
          <Row md={12}>
            {gameList.map((game, key) => (
              <Col className='mt-5' md={4} key={key}>
                {/* {getDetails(game.id)} */}
                <Card>
                  <Card.Header><h2>{game.id}, {game.name}</h2></Card.Header>
                  <Card.Img src='https://cdn.mos.cms.futurecdn.net/42E9as7NaTaAi4A6JcuFwG-1200-80.jpg' />
                    <Card.Body>
                      <Card.Text>
                      X questions
                      Y minutes
                      </Card.Text>
                      <Button className='mx-1' variant="primary">Start</Button>
                      <Button className='mx-1' variant="primary">Stop</Button>
                      <Button className='mx-1' variant="primary">Edit</Button>
                      <Button className='mx-1' variant="primary">Delete</Button>
                    </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
    </>
  )
}

export default Dashboard;
