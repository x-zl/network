import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"

import Profile from './components/Profile';
import Home from "./components/Home"
import TopNav from './components/TopNav';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import handleResponse from './fetchClient/fetchHandler';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: false,
      username: ''
    };
  }

  componentDidMount() {
    const hasToken = !!localStorage.getItem('token');
    if (hasToken) {
      fetch('http://47.100.162.64:8000/accounts/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          return handleResponse(res);
        })
        .then(json => {
          console.log("local storage token is ok", json);
          this.setState({ logged_in: true });
          this.setState({ username: json.username });
        }).catch(err => {
          this.setState({ logged_in: false });
          console.log("error is", err);
        });
    }
  }

  handle_login = (data) => {
    console.log("send", data, "to /token-auth");
    fetch('http://47.100.162.64:8000/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => handleResponse(res))
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username
        });
        return true;
      }).catch(err => {
        console.log("login error", err);
        return false;
      });
  };

  handle_signup = (data) => {
    console.log("send", data, "to /accounts/users");
    fetch('http://47.100.162.64:8000/accounts/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => handleResponse(res))
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.username
        });
      }).catch(err => {
        console.log("signup error", err);
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  handle_toggle = () => {
    this.setState({ displayed_form: '' });
  }

  display_form = (form) => {
    console.log("onClick", form);
    this.setState({
      displayed_form: form ? form : ''
    });
  };

  render() {
    const display = this.state.displayed_form;
    console.log("render", display);

    return (
      <div className="App">
        <Router>
          <TopNav
            logged_in={this.state.logged_in}
            display_form={this.display_form}
            handle_logout={this.handle_logout}
          />
          {display === 'login' &&
            <LoginModal
              isOpen={display==='login'}
              toggle={this.display_form}
              onSave={this.handle_login}
            />
          }
          {display === 'signup' &&
            <SignupModal
              isOpen={display==='signup'}
              toggle={this.display_form}
              onSave={this.handle_signup}
            />
          }
          <Home logged_in={this.state.logged_in} username={this.state.username}/>
        </Router>
      </div>
    );
  }
}

export default App;
