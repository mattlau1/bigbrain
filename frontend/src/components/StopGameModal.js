import React from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const StopGameModal = ({ show, handleClose, id }) => {
  return (
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>Would you like to view the results?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Container>
        <Row>
          <Col md={6}>
            <Link to={`/results/${id}`}>
              <Button className='mx-0 w-100 my-1' variant="primary">Yes</Button>
            </Link>
          </Col>
          <Col md={6}>
            <Button className="mx-0 w-100 my-1" onClick={() => { handleClose() }}>No</Button>
          </Col>
        </Row>
      </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
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
