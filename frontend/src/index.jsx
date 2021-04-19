import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlertProvider from './contexts/AlertProvider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider>
      <App />
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
