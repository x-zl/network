import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import Profile from './Profile';

const Home = (props) => {

  return (
    <h3>
      {props.logged_in ? (
        <>
          <Breadcrumb>
            <BreadcrumbItem active>Home</BreadcrumbItem>
          </Breadcrumb>
          {`Hello, ${props.username}`}
          <Link to="/profile">
            点击完善资料
          </Link>
        </>
      ) : 'Please Log In'}
    </h3>
  );
}

export default Home;
