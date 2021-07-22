import React from 'react';
// import Switch from '@material-ui/core/Switch';
import './SwitchBox.scss'

const SwitchBox = ({ check, setCheck }) => {

  const handleChange = () => {
    setCheck(!check);
  };
  return (
    <div className='cutlery'>
      <button className="choise-check" onClick={handleChange}>
        without cutlery
      </button>
    </div>
  )

}

export default SwitchBox;