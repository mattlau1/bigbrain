import React from 'react'
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

const Edit = () => {
  const { id } = useParams();
  return (
    <div>
        You are editing game with id {id && id}
    </div>
  )
}

Edit.propTypes = {
  id: PropTypes.number
}

export default Edit
