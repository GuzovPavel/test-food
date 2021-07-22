import React from 'react';
import './Bread.scss'

const Bread = ({ bread, setBread }) => {


  const handleChange = () => {
    setBread(!bread);

  };

  return (
    <div className='bread'>
      <button className="choise-check" onClick={handleChange}>
      without bread
      </button>
    </div>
  );
}

export default Bread;