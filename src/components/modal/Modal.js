import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Button } from "@material-ui/core";
import firebase from "firebase";
import moment from "moment";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import "./modal.scss"
import SwitchBox from "../SwitchBox/SwitchBox";
import Bread from "../../Bread/Bread";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 0 0",
  },
  ulStyles: {
    paddingLeft: 0,
    overflow: "auto",
    maxHeight: 300,
  },
}));

export const SimpleModal = ({
  isOpen,
  setIsOpen,
  selected,
  selectedPrice,
  user,
  data,
}) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [preOrder, setPreOrder] = useState();
  const [preSum, setPreSum] = useState();
  const [turn, isTurn] = useState();  
  const [open, setOpen] = useState(false);
  const [cutleryCheck, setCutleryCheck] = useState(false);
  const [cutlery, setCutlery] = useState('')
  const [breadCheck, setBreadCheck] = useState(false);
  const [bread, setBread] = useState('')
  const handleClose = (answer) => {
    setIsOpen(false);
  };


  const save = (e) => {
    e.preventDefault();
    isTurn(true);
    const form = new FormData(e.target);
    const order = [];
    const sum = [];
    for (let item in selected) {
      const a = form.get(selected[item]);
      for (let i = 0; i < a; i++) {
        order.push(`${selected[item]} ${cutlery} ${bread}`);
        // order.push(`${selected[item]} ${bread}`);
        sum.push(selectedPrice[item]);  
        console.log(order);
      }
      setPreOrder(order);
      setPreSum(sum);
    }

 
    // let newTemplate = firebase.database().ref(`/orders/${data.office}`);
    // newTemplate.push(order.map((item, index) => item));
    // var date = new Date();

    // order.length !== 0 &&
    //   firebase
    //     .database()
    //     .ref(`/orders/history/${user.uid}`)
    //     .push({
    //       id: user.uid,
    //       name: data.name,
    //       office: data.office,
    //       date: moment(date).format("YYYY.MM.DD"),
    //       time: new Date().toLocaleTimeString(),
    //       selected: order,
    //       selectedPrice: selectedPrice.reduce(
    //         (partial_sum, a) => partial_sum + a,
    //         0
    //       ),
    //     });
  };
  // console.log(selected,'1111')
  const test = (key) => {
    var date = new Date();
    firebase
      .database()
      .ref(`/orders/history/${user.uid}`)
      .push({
        id: key,
        name: data.name,
        office: data.office,
        date: moment(date).format("YYYY.MM.DD"),
        time: new Date().toLocaleTimeString(),
        selected: preOrder,
        selectedPrice: preSum.reduce((partial_sum, a) => partial_sum + a, 0),
      })
      .then((data) => {
        let key = data.key;
        firebase.database().ref(`orders/history/${user.uid}/${key}`).update({
          ind: key,
        });
      });
  };
  const go = async () => {
    let newTemplate = firebase.database().ref(`/orders/${data.office}`);
    await newTemplate.push(preOrder.map((item, index) => item)).then((data) => {
      let key = data.key;
      // console.log(key, "0000000000");
      test(key);
    });

    firebase
      .database()
      .ref(`/orders/sum`)
      .push(preSum.reduce((partial_sum, a) => partial_sum + a, 0))
      .then((res) => {
        setIsOpen(false);
      });
    setOpen(true);
  };
  const handleClose1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const body = (
    <form onSubmit={(e) => save(e)}>
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">???????????????? ???????????</h2>
        <ul className={classes.ulStyles}>
          {!selected.length ? (
            <li>????????????</li>
          ) : (
            selected?.map((item) => (
              <li className='choise-food'>
               {item}             

              <select name={item}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </li>
        
            )
            )
          )}
        </ul>
        <div className='switch-button'>
        <SwitchBox cutleryCheck={cutleryCheck} setCutleryCheck={setCutleryCheck} setCutlery={setCutlery} /> 
        <Bread breadCheck={breadCheck} setBreadCheck={setBreadCheck} bread={bread} setBread={setBread} />
        </div>

        <footer className={classes.footer}>
          <Button type="submit" variant="contained" color="primary">
            ????????????????????
          </Button>
          {selected.length && turn && (
            <>
              ??????????:
              {preSum && preSum.reduce((partial_sum, a) => partial_sum + a, 0)}
              <Button onClick={() => go()} variant="contained" color="primary">
                ????????????????
              </Button>
            </>
          )}
        </footer>
      </div>
    </form>
  );

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose1} severity="success">
          ?????????? ????????????! ???? ????????????????: {selected.map((item, index) => item)}
        </Alert>
      </Snackbar>
    </div>
  );
};
