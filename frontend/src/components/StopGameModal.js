import React from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const StopGameModal = ({ show, handleClose, id }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Game Completed</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 className="text-center">Would you like to view the results?</h4>
        <Container>
          <Row>
            <Col md={6}>
              <Link to={`/results/${id}`}>
                <Button id="view-results-btn" className='mx-0 w-100 my-1'>Yes</Button>
              </Link>
            </Col>
            <Col md={6}>
              <Button
                variant="danger"
                className="mx-0 w-100 my-1"
                onClick={() => { handleClose() }}
                id="no-click"
              >
                No
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} id="close-button">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

StopGameModal.propTypes = {
  setShow: PropTypes.func,
  handleShow: PropTypes.func,
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  gameList: PropTypes.array,
  setGameList: PropTypes.func,
  id: PropTypes.number
};

export default StopGameModal
