import React, { createContext, useContext, useReducer } from 'react';
import { v4 } from 'uuid';
import Alert from '../components/Alert';
import PropTypes from 'prop-types';

const AlertContext = createContext();

const AlertProvider = (props) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'ADD_ALERT':
        return [...state, { ...action.payload }];
      case 'REMOVE_ALERT':
        return state.filter(e => e.id !== action.id);
      default:
        return state
    }
  }, []);

  return (
    <AlertContext.Provider value={dispatch}>
      <div className={'alert-container'}>
        {state.map((note) => {
          return <Alert dispatch={dispatch} key={note.id} {...note} />
        })}
      </div>
      {props.children}
    </AlertContext.Provider>
  )
};

export const useAlert = () => {
  const dispatch = useContext(AlertContext);
  return (props) => {
    dispatch({
      type: 'ADD_ALERT',
      payload: {
        id: v4(),
        ...props
      }
    })
  }
};

AlertProvider.propTypes = {
  children: PropTypes.node
};

export default AlertProvider;
