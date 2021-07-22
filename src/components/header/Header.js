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
      <Link to="/">home</Link>
      {localStorage.getItem("token") && (
        <Link to="/orders-history">Orders History</Link>
      )}
      {!user && <Link to="/reg">register</Link>}
      {!user && <Link to="/login">log in</Link>}
      {data && data.admin === true && <Link to="/admin-menu">admin menu</Link>}
      {data && data.admin === true && <Link to="/orders">Orders</Link>}
      {data && data.admin === true && <Link to="/users">Users</Link>}
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
