import React, {  useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {  Button } from "@material-ui/core";
import firebase from "firebase";
import CustomInput from "../customInput";
import  { auth } from "../../firebase";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    transform: "translate(-50%, -50%)",
    top: "50%",
    left: "50%",
  },
}));

export const Reg = () => {
  const history = useHistory();

  const classes = useStyles();
  const [email, setEmail] = useState("denneg@yandex.ru");
  const [password, setPassword] = useState("123123123123");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [off, setOffice] = useState("grech");


  const save = (uid) => {
    let newTemplate = firebase.database().ref(`/users/${uid}`);
    newTemplate.update({
      name: name,
      lastName: lastName,
      email: email,
      uid: uid,
      office: off,
    });
  };
  const signUp = (e) => {
    e.preventDefault();
    if (name && lastName && off && email) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          save(user.user.uid);

          localStorage.setItem("token", user.user.refreshToken);
          history.push("/");
        })
        .catch((error) => {
          // Handle error.
        });
    }
  };
  const signOut = () => {
    auth
      .signOut()
      .then(function (res) {
        localStorage.removeItem("token");
      })
      .catch(function (error) {
        // An error happened.
      });
  };

  const body = (
    <div className={classes.paper}>
      <form className="form">
        <CustomInput
          labelText="Email"
          value={email}
          id="email"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => setEmail(e.target.value)}
          type="text"
        />
        <CustomInput
          labelText="Фамилия"
          value={name}
          id="name"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => setName(e.target.value)}
          type="text"
        />
        <CustomInput
          labelText="Имя"
          value={lastName}
          id="name"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => setLastName(e.target.value)}
          type="text"
        />
        <CustomInput
          labelText="Password"
          id="password"
          value={password}
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <select
        style={{width:'100%',padding:'10px 0px'}}
          onChange={(e) => {
            setOffice(e.target.value);
          }}
          name="select"
        >
          <option defaultChecked value="grech">
            Греческая
          </option>
          <option value="alex">Александровская</option>
          <option value="cheh">Чехова</option>
          <option value="petr">Петровская</option>
        </select>
        <Button onClick={signUp} type="button" color="primary">
          Log in
        </Button>
        <span onClick={signOut}>exit</span>
      </form>
    </div>
  );

  return (
    <div>
      {body}
    </div>
  );
};
