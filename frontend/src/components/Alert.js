import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Alert = props => {
  const [exit, setExit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [intervalID, setIntervalID] = useState(null);
  const tickSpeed = 20
  const maxTime = 400

  // starts the timer for alert
  const handleStartTimer = () => {
    const id = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 0.5;
        }

        clearInterval(id);
        return prev;
      });
    }, tickSpeed);
    setIntervalID(id);
  };

  // closing the alert
  const handleCloseAlert = () => {
    clearInterval(intervalID);
    setExit(true);
    setTimeout(() => {
      props.dispatch({
        type: 'REMOVE_ALERT',
        id: props.id
      })
    }, maxTime)
  };

  // close if progress of progress bar is 100
  React.useEffect(() => {
    if (progress === 100) {
      handleCloseAlert()
    }
  }, [progress])

  // start timer when alert appears
  React.useEffect(() => {
    handleStartTimer();
  }, []);

  return (
    <div
      className={`alert-item d-none d-md-block d-lg-block d-xl-block ${
        props.type === 'SUCCESS' ? 'success' : 'error'
      } ${exit ? 'exit' : ''}`}
    >
      <p className="m-0 p-2">{props.message}</p>
      <div className={'bar'} style={{ width: `${progress}%` }} />
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
  dispatch: PropTypes.func,
  id: PropTypes.string
};

export default Alert;
