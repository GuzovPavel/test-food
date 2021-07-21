import React, { useState } from 'react';
import Switch from '@material-ui/core/Switch';
import './SwitchBox.scss'

const SwitchBox = () => {
  const [check, setCheck] = useState({
    checkedA: true,
    checkedB: false,
  });

  const handleChange = (event) => {
    setCheck({ ...check, [event.target.name]: event.target.checked });
  };

  return (
    <div className='cutlery'>
        <p>Приборы</p>
        <div>
        <span>Не нужны</span>
      <Switch
        checked={check.checkedA}
        onChange={handleChange}
        name="checkedA"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
        <span>Нужны</span>
        </div>
    </div>
  );
}

export default SwitchBox;