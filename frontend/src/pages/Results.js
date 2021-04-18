import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import Chart from '../components/ResultsChart';
import Navigation from '../components/Navigation';
import API from '../utils/API';
import styled from 'styled-components';

const WinnersContainer = styled(Col)`
  background-color: #C3EBEF;
`
const WinnerDiv = styled.div`
  background-color: #007bff;
  color: white;
`

const Results = () => {
  const { sessionId } = useParams();
  const [results, setResults] = useState([])

  useEffect(() => {
    const loadResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const api = new API();
        const res = await api.getAPIRequestToken(`admin/session/${sessionId}/results`, token);
        const data = await res.json();

        if (res.ok) {
          setResults(data);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    loadResults()
  }, [])
  return (
    <>
      <Navigation />
      <Container md={12}>
        <Row md={12} className="d-flex justify-content-center text-center">
          <WinnersContainer md={4} className="border border-primary rounded my-2">
            <h1>Winners</h1>
            <WinnerDiv className="py-3 my-1 rounded">
              1. Steven2 (2000 points)
            </WinnerDiv>
            <WinnerDiv className="py-3 my-1 rounded">
              2. Steven2 (2000 points)
            </WinnerDiv>
            <WinnerDiv className="py-3 my-1 rounded">
              3. Steven3 (1000 points)
            </WinnerDiv>
            <WinnerDiv className="py-3 my-1 rounded">
              4. Steven3 (1000 points)
            </WinnerDiv>
            <WinnerDiv className="py-3 my-1 rounded">
              5. Steven3 (1000 points)
            </WinnerDiv>
            {console.log(results)}
          </WinnersContainer>
        </Row>
        <Row md={12}>
          <Col md={12}>
            <Chart />
          </Col>
        </Row>
        <Row>
          <Col></Col>
        </Row>
      </Container>
    </>
  )
}

export default Results
