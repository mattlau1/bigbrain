import React, { useState } from 'react';
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

const Chart = () => {
  const [data, setData] = useState([])

  useState(() => {
    setData([
      {
        question: 'Question 1',
        'Correct %': 90,
        'Average Response Time (ms)': 20
      },
      {
        question: 'Question 2',
        'Correct %': 100,
        'Average Response Time (ms)': 20
      },
      {
        question: 'Question 3',
        'Correct %': 40,
        'Average Response Time (ms)': 20
      },
      {
        question: 'Question 4',
        'Correct %': 60,
        'Average Response Time (ms)': 20
      },
      {
        question: 'Question 5',
        'Correct %': 70,
        'Average Response Time (ms)': 20
      },
      {
        question: 'Question 6',
        'Correct %': 20,
        'Average Response Time (ms)': 20
      },
      {
        question: 'Question 7',
        'Correct %': 10,
        'Average Response Time (ms)': 20
      },
    ])
  }, [])
  return (
    <ResponsiveContainer width="99%" aspect={3}>
      <BarChart
        data={data}
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
        <Bar yAxisId="right" dataKey="Average Response Time (ms)" fill="#00a9b5" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default Chart
