import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import API from '../utils/API';
import PropTypes from 'prop-types';
import { useAlert } from '../contexts/AlertProvider';

const CreateGameModal = ({ show, handleClose, setGameList }) => {
  const [newGameName, setNewGameName] = useState('');
  const dispatch = useAlert();

  // creates and displays an alert
  /** @param {String} type */
  /** @param {String} message */
  const createAlert = (type, message) => {
    dispatch({
      type: type,
      message: message,
    })
  }

  // create a game by uploading a game file
  /** @param {Object} quiz */
  const uploadGame = async (quiz) => {
    try {
      const token = localStorage.getItem('token');
      const api = new API();

      // create new quiz with given name
      const res = await api.postAPIRequestBodyToken('admin/quiz/new', { name: quiz.name }, token);
      const data = await res.json();
      if (res.ok) {
        try {
          // add id of new empty quiz to uploaded quiz
          const newQuiz = quiz;
          newQuiz.id = data.quizId;

          // put new data into the empty quiz we just made
          await api.putAPIRequestTokenBody(`admin/quiz/${data.quizId}`, newQuiz, token);

          createAlert('SUCCESS', 'Successfully created a new quiz!');
          // refresh game list
          api.getAPIRequestToken('admin/quiz', token).then((data) => {
            if (data.status === 403) {
              createAlert('ERROR', 'Invalid Token');
            } else if (data.status === 200) {
              setGameList([]);
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
        } catch (e) {
          createAlert('ERROR', 'An unexpected error has occurred');
          console.warn(e);
        }
      } else {
        createAlert('ERROR', 'The file was not in the correct format');
      }
    } catch (e) {
      console.warn(e);
    }
  }

  const handleUploadGame = (event) => {
    const file = event.target.files[0];

    // check if file exists
    if (file) {
      // get file extension
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1);

      // check if file is a json file
      if (ext === 'json') {
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], 'UTF-8');
        fileReader.onload = (e) => {
          const parsedGame = JSON.parse(e.target.result);
          uploadGame(parsedGame);
          handleClose();
        };
      } else {
        createAlert('ERROR', 'This file format is not supported');
      }
    }
  }

  const createGame = async (e) => {
    e.preventDefault()
    if (!newGameName) {
      createAlert('ERROR', 'Your new quiz cannot have an empty name');
      return;
    }

    const body = {
      name: newGameName,
    };

    try {
      const token = localStorage.getItem('token');
      const api = new API();

      // create an empty game
      const res = await api.postAPIRequestBodyToken('admin/quiz/new', body, token);
      if (res.ok) {
        // close and give success alert
        handleClose();
        createAlert('SUCCESS', 'Successfully created a new quiz!');

        // update game list
        api.getAPIRequestToken('admin/quiz', token).then((data) => {
          if (data.status === 403) {
            createAlert('ERROR', 'Invalid Token');
          } else if (data.status === 200) {
            setGameList([]);
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
      } else {
        createAlert('ERROR', 'There was a problem creating a new quiz');
      }
    } catch (e) {
      createAlert('ERROR', 'An unexpected error has occured');
      console.warn(e);
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>Create Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            id="game-title-input"
            className="inputBox my-2"
            type="text"
            placeholder="Game Title"
            onChange={(e) => setNewGameName(e.target.value)}
          />
          <Form.File
            className="text-left"
            label="Upload Quiz"
            onChange={(e) => handleUploadGame(e)}
            accept={'.json'}
            custom
          />
        </Modal.Body>
        <Modal.Footer>
          <Button id="close-button" variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            id="create-button"
            variant="primary"
            type="submit"
            onClick={(e) => { createGame(e) } }
          >
            Create Game
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

CreateGameModal.propTypes = {
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  setGameList: PropTypes.func
};

export default CreateGameModal
