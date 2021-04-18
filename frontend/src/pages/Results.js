import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import Navigation from '../components/Navigation';
import API from '../utils/API';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';

const WinnerDiv = styled.div`
  background-color: #007bff;
  color: white;
`

const Results = () => {
  const { sessionId } = useParams();
  const [results, setResults] = useState([])
  const [chartData, setChartData] = useState([]);
  const maxWinners = 5;

  useEffect(() => {
    const loadResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const api = new API();
        const res = await api.getAPIRequestToken(`admin/session/${sessionId}/results`, token);
        const data = await res.json();

        if (res.ok) {
          console.log(data.results);
          setResults(data.results);
          const questionLength = data.results.length > 0 ? data.results[0].answers.length : 0;
          const numPlayers = data.results.length;
          const correctAnswersObj = {};
          const responseTimesObj = {};

          // check how many people got the question right/wrong
          for (let i = 0; i < questionLength; i++) {
            let correctAnswersNum = 0;
            const responseTimes = []
            data.results.forEach((result) => {
              if (result.answers[i].correct === true) {
                correctAnswersNum++;
              }
              const startTime = moment(result.answers[i].questionStartedAt);
              const endTime = moment(result.answers[i].answeredAt);
              if (!isNaN(startTime) && startTime && !isNaN(endTime) && endTime) {
                responseTimes.push(endTime.diff(startTime, 'milliseconds') / 1000)
              }
            })

            const responseTimeSum = responseTimes.reduce((res, item) => {
              return res + item
            }, 0);
            responseTimesObj[i] = responseTimes ? responseTimeSum / responseTimes.length : 0;
            correctAnswersObj[i] = correctAnswersNum / numPlayers * 100;
          }

          for (let i = 0; i < questionLength; i++) {
            const newChartData = {
              question: `Question ${i + 1}`,
              'Correct %': correctAnswersObj[i],
              'Average Response Time (s)': !isNaN(responseTimesObj[i]) ? responseTimesObj[i] : 0
            }
            setChartData(chartData => [...chartData, newChartData]);
          }
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
          <h1 className="mb-0">Results</h1>
        </Row>
        <Row md={12} className="d-flex justify-content-center text-center">
          <Col md={4} className="rounded my-2">
            {results && results.slice(0, maxWinners).map((result, key) => (
              <WinnerDiv key={key} className="py-3 my-1 rounded">
                {key + 1}. {result.name}
              </WinnerDiv>
            ))}
          </Col>
        </Row>
        <Row md={12}>
          <Col md={12}>
            <ResponsiveContainer width="99%" aspect={3}>
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis yAxisId="left" orientation="left" stroke="#0069c0" />
                <YAxis yAxisId="right" orientation="right" stroke="#00a9b5" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="Correct %" fill="#0069c0" />
                <Bar yAxisId="right" dataKey="Average Response Time (s)" fill="#00a9b5" />
              </BarChart>
            </ResponsiveContainer>
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
