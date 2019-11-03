import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import Profile from './Profile';

const Home = (props) => {

  return (
    <h3>
      {props.logged_in ? (
        <>
          {`Hello, ${props.username}`}
          <Link to="/profile">
            点击完善资料
          </Link>
          <Route exact path="/profile">
            <Profile />
          </Route>
        </>
      ) : 'Please Log In'}
    </h3>
  );
}

export default Home;
