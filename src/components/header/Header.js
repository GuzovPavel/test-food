import { Link } from "react-router-dom";
import React from "react";
import { auth } from "../../firebase";
import './Header.scss'


export const Header = ({ user, data }) => {
  const signOut = () => {
    auth
      .signOut()
      .then(function (res) {
        localStorage.clear();
      })
      .catch(function (error) {
      });
  };
  return (
    <div id="header">
      <Link to="/"><button className='head-button'>home</button></Link>
      {localStorage.getItem("token") && (
        <Link to="/orders-history"><button className='head-button'>Orders History</button></Link>
      )}
      {!user && <Link to="/reg"><button className='head-button'>register</button></Link>}
      {!user && <Link to="/login">log in</Link>}
      {data && data.admin === true && <Link to="/admin-menu"><button className='head-button'>admin menu</button></Link>}
      {data && data.admin === true && <Link to="/orders"><button className='head-button'>orders</button></Link>}
      {data && data.admin === true && <Link to="/users"><button className='head-button'>Users</button></Link>}
      {user && (
        <span className='log-out'
          onClick={() => {
            signOut();
            window.location.reload();
          }}
        >
          LOG OUT
        </span>
      )}
    </div>
  );
};
