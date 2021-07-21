import "./App.scss";
import Header from "./components/header";
import Footer from "./components/footer";
import Container from "./components/container";
import firebase from "firebase";
import Login from "./components/login";
import Reg from "./components/reg";
import { useEffect, useState } from "react";
import  { auth } from "./firebase";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import AdminMenu from "./components/AdminMenu";
import ListOrders from "./components/listOrders/ListOrders";
import OrderHistory from "./components/orderHistory/OrderHistory";
import Users from "./components/users/Users";
import OrderHistoryUser from "./components/orderHistoryUser/OrderHistoryUser";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

function App() {

  const [user, setUser] = useState();
  const [data1, setData1] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      const user = {
        uid: userAuth.uid,
        email: userAuth.email,
      };
      if (userAuth) {
        setUser(user);
        firebase
          .database()
          .ref(`users/${user.uid}`)
          .on("value", (snapshot) => {
            const data = snapshot.val();
            setData1(data);

            // setData1([data])
          });
        // var starCountRef = firebase.database().ref(`/users`);
        // starCountRef.on("value", (snapshot) => {
        //   const data = snapshot.val();
        //   // data.includes(user.uid);
        //   setData1(data);
        // });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);
  return (
    <Router>
      <div className="App">
        <Header user={user} data={data1} />
        <Switch>
          {localStorage.getItem("token") && (
            <Route path="/orders-history">
              <OrderHistory user={user} data={data1}></OrderHistory>
            </Route>
          )}

          {data1 && data1.admin === true && (
            <Route path="/users">
              <Users user={user} data={data1}></Users>
            </Route>
          )}
          {data1 && data1.admin === true && (
            <Route path="/user-history">
              <OrderHistoryUser></OrderHistoryUser>
            </Route>
          )}
          {data1 && data1.admin === true && (
            <Route path="/orders">
              <ListOrders user={user} data={data1}></ListOrders>
            </Route>
          )}
          {localStorage.getItem("token") ? (
            <Route exact path="/">
              <Container user={user} data={data1}></Container>
            </Route>
          ) : (
            <Route exact path="/">
              <Login></Login>
            </Route>
          )}

          {data1 && data1.admin === true && (
            <Route path="/admin-menu">
              <AdminMenu user={user} data={data1}></AdminMenu>
            </Route>
          )}

          {localStorage.getItem("token") && (
            <>
              <Redirect from="/login" to="/"></Redirect>
              <Redirect from="/reg" to="/"></Redirect>
            </>
          )}

          {data1 && data1.admin !== true && (
            <>
              <Redirect from="/admin-menu" to="/"></Redirect>
            </>
          )}
          <Route path="/login" component={Login}></Route>
          <Route path="/reg" component={Reg}></Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
