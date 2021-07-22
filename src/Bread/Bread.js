  import { Checkbox } from '@material-ui/core';
import React from 'react';
import './Bread.scss'

const Bread = ({ breadCheck, setBreadCheck , setBread }) => {


  const handleChange = () => {
    setBreadCheck(!breadCheck);
    if (!breadCheck) {
      setBread('без хлеба')
    } else {
      setBread('')
    }

  };

  return (
    <div>
      <span>Убрать хлеб</span>
    <Checkbox onChange={handleChange}/>
    </div>
  );
}

export default Bread;