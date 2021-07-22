import React, { useState } from 'react';
import clsx from 'clsx';
import { 
  makeStyles,
  Drawer,
  Divider,
} from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';
import Header from '../header';


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
  console.log(state.top)
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
          <MenuIcon onClick={toggleDrawer(anchor, true)}>{anchor} </MenuIcon>
            <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
              {list(anchor)}
            </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
