import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap'

import ExamInfo from './components/ExamInfo'
import Profile from './components/Profile';
import ReadOnlyProfile from './components/ReadOnlyProfile';
import Home from "./components/Home"
import TopNav from './components/TopNav';
import ResetModal from './components/ResetModal';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import Pay from "./components/Pay";
import Exams from "./components/Exams";
import {
  handleResponse,
  handleHeaderWithAuthToken,
  handleUrl,
} from './fetchClient/fetchHandler';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: false,
      username: '',
      errmsg: '',
      exam_number: '',
      pay: false,
    };
  }

  componentDidMount() {
    const hasToken = !!localStorage.getItem('token');
    if (hasToken) {
      fetch(handleUrl('accounts/current_user/'), {
        headers: handleHeaderWithAuthToken(),
      })
        .then(res => {
          return handleResponse(res);
        })
        .then(json => {
          console.log("local storage token is ok", json);
          this.setState({ logged_in: true });
          this.setState({ username: json.username });
        }).catch(err => {
          this.setState({ logged_in: false, displayed_form: 'login' });

          console.log("error is", err);
        });
    }
  }

  handle_query_exam = (exam_number, pay) => {
    this.setState({exam_number, pay,});
  }

  handle_login = (data) => {
    console.log("send", data, "to /token-auth");
    return fetch(handleUrl('token-auth/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => handleResponse(res))
      .then(json => {
        console.log(json)
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username
        });
        return Promise.resolve(json)
      }).catch(err => {
        console.log("login error", err);
      });
  };

  handle_signup = (data) => {
    console.log("send", data, "to /accounts/users");
    return fetch(handleUrl('accounts/users/'), {
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
          username: json.username,
          errmsg: '',
        });
        return Promise.resolve(json)
      }).catch(err => {
        console.log("signup error", err);
      });
  };

  handle_reset = (data) => {
    console.log("send", data, "to accounts/reset");
    return fetch(handleUrl('accounts/reset/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => handleResponse(res))
      .then(json => {
        console.log(json)
        return Promise.resolve(json)
      }).catch(err => {
        console.log("send error", err);
        return Promise.resolve(err)
      });
  };

  handle_reset_email = (data) => {
    console.log("sent",data,"accounts/reset/");
    return fetch(handleUrl('accounts/reset/', data), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => handleResponse(res))
      .then(json => {
        console.log(json)
        return Promise.resolve(json)
      }).catch(err => {
        console.log("send error", err);
        return Promise.resolve(err)
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' }, () => {
      window.location.href = '/';
    });
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

  handle_expired_error = (err) => {
    if (err.statusText === "Unauthorized") {
      if (err.detail === "Signature has expired.") {
        this.display_form("login");
      }
    }
  }

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
            username={this.state.logged_in ? this.state.username : undefined}
          />
          {display === 'login' &&
            <LoginModal
              isOpen={true}
              toggle={this.display_form}
              sendEmail={this.handle_reset_email}
              onSave={this.handle_login}
            />
          }
          {display === 'signup' &&
            <SignupModal
              isOpen={true}
              toggle={this.display_form}
              onSave={this.handle_signup}
            />
          }
          {display === 'reset' &&
            <ResetModal
              isOpen={true}
              toggle={this.display_form}
              onSave={this.handle_reset}
            />
          }
          <Switch>
            <Route exact path="/">
              <Home
                logged_in={this.state.logged_in}
                username={this.state.username}
              />
            </Route>
            <Route exact path="/profile/pay">
              <Pay handle_expired_error={this.handle_expired_error}
                handle_query_exam={this.handle_query_exam} />
            </Route>
            <Route exact path="/profile">
              <Profile handle_expired_error={this.handle_expired_error}/>
            </Route>
            <Route exact path="/check/profile">
              <ReadOnlyProfile handle_expired_error={this.handle_expired_error}/>
            </Route>
            <Route exact path="/check/exams">
              <Exams />
            </Route>
            <Route exact path='/examInfo'>
              <ExamInfo exam_number={this.state.exam_number} pay={this.state.pay}/>
            </Route>

          </Switch>

        </Router>
      </div>
    );
  }
}

export default App;
