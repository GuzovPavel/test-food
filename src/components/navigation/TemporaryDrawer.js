import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
// import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import Header from '../header';
import { Button } from '@material-ui/core';
// import { auth } from "../../firebase";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function TemporaryDrawer({ user, data }) {
  const classes = useStyles();  
  const [state, setState] = useState({
    top: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Header user={user} data={data} /> 
      <Divider />
    </div>
  );

  return (
    <div>
      {['top'].map((anchor) => (
        <React.Fragment key={anchor}>
                   <Button onClick={toggleDrawer(anchor, true)}><MenuIcon/></Button>

          {/* <MenuIcon onClick={toggleDrawer(anchor, true)}>{anchor} </MenuIcon> */}
            {/* <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
              {list(anchor)}
            </Drawer> */}
           <SwipeableDrawer
           anchor={anchor}
           open={state[anchor]}
           onClose={toggleDrawer(anchor, false)}
           onOpen={toggleDrawer(anchor, true)}>
          {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
