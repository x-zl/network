import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from 'reactstrap';
import './Profile.css';
import handleResponse from '../fetchClient/fetchHandler';
/*
# write read
name = models.CharField(null=True, max_length=50)
major = models.CharField(null=True, blank=True, max_length=100)
school = models.CharField(null=True, blank=True, max_length=100)
IDcard = models.CharField(null=True, unique=True, max_length=50)
phone_number = models.CharField(null=True, blank=True, max_length=10)
birth_date = models.DateField(null=True, blank=True)
# read_only
grade = models.PositiveIntegerField(null=True)
pay_status = models.BooleanField(default=False)
*/
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      major: '',
      shcool: '',
      IDCard: '',
      phone_number: '',
      birth_date: '',
    };
  }

  componentDidMount() {
    console.log("get data from /profile");
    fetch('http://47.100.162.64:8000/profile', {
      method: 'GET',
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      },
    })
      .then(res => handleResponse(res))
      .then(json => {
        console.log("last profile", json)
        this.setState({...json });
      }).catch(err => {
        console.log("get last profile error", err);
      });
  }

  handleChange = e => {
    const {name, value} = e.target;

    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  handle_profile_submit = (data) => {
    console.log("send", data, "to /profile");
    fetch('http://47.100.162.64:8000/profile/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })
      .then(res => handleResponse(res))
      .then(json => {
        console.log("submit profile success", json)
      }).catch(err => {
        console.log("submit profile error", err);
      });
  };

  render() {
    console.log('state', this.state);
    return (
      <Form style={{width: "300px"}}>
        <FormGroup>
          <Label for="name">name</Label>
          <Input
            type="text"
            name="name"
            value={this.state.name||''}
            onChange={this.handleChange}
            placeholder="Enter Your Name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="major">major</Label>
          <Input
            type="text"
            name="major"
            value={this.state.major||''}
            onChange={this.handleChange}
            placeholder="Enter major"
          />
        </FormGroup>
        <FormGroup>
          <Label for="IDCard">IDCard</Label>
          <Input
            type="text"
            name="IDCard"
            value={this.state.IDCard||''}
            onChange={this.handleChange}
            placeholder="Enter IDCard"
          />
        </FormGroup>
        <FormGroup>
          <Label for="phone_number">phone_number</Label>
          <Input
            type="text"
            name="phone_number"
            value={this.state.phone_number||''}
            onChange={this.handleChange}
            placeholder="Enter phone_number"
          />
        </FormGroup>
        <Button onClick={() => this.handle_profile_submit(this.state)}>
          Submit
        </Button>
      </Form>
    );
  }
}
