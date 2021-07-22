import { Checkbox } from '@material-ui/core';
import React from 'react';
import './SwitchBox.scss'

const SwitchBox = ({ cutleryCheck, setCutleryCheck, setCutlery,  }) => {

  const handleChange = () => {
    setCutleryCheck(!cutleryCheck);
    if (!cutleryCheck) {
      setCutlery('без приборов')
    } else {
      setCutlery('') 
    }

  };
  return (
    <div>
    <span>Убрать приборы</span>
  <Checkbox onChange={handleChange}/>
  </div>
  )

}

export default SwitchBox;