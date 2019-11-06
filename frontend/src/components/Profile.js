import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from 'reactstrap';
import {
  Link
} from "react-router-dom"
import './Profile.css';
import {
  handleResponse,
  handleHeaderWithAuthToken,
  handleUrl,
} from '../fetchClient/fetchHandler';
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
      formInfo: {
        name: '',
        major: '',
        shcool: '',
        IDCard: '',
        phone_number: '',
        birth_date: '',
      },
      // if change since last submit
      couldSave: false,
    };
  }

  componentDidMount() {
    console.log("get data from /profile");
    fetch(handleUrl('profile/'), {
      method: 'GET',
      headers: handleHeaderWithAuthToken(),
    })
      .then(res => handleResponse(res))
      .then(json => {
        console.log("last profile", json)
        this.setState( {formInfo: {...json} });
      }).catch(err => {
        console.log("get last profile error", err);
      });
  }

  handleChange = e => {
    const {name, value} = e.target;
    const formInfo = { ...this.state.formInfo, [name]: value };
    this.setState({formInfo, couldSave: true});
  };

  handle_profile_submit = (data) => {
    console.log("send", data, "to /profile");
    fetch(handleUrl('profile/'), {
      method: 'PUT',
      headers: handleHeaderWithAuthToken({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data)
    })
      .then(res => handleResponse(res))
      .then(json => {
        this.setState({couldSave: false});
        console.log("submit profile success", json)
      }).catch(err => {
        console.log("submit profile error", err);
      });
  };

  render() {
    const { formInfo, hasChanged, couldSave } = this.state;
    console.log('state', this.state);
    return (
      <Form style={{width: "300px"}}>
        <FormGroup>
          <Label for="name">name</Label>
          <Input
            type="text"
            name="name"
            value={formInfo.name||''}
            onChange={this.handleChange}
            placeholder="Enter Your Name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="major">major</Label>
          <Input
            type="text"
            name="major"
            value={formInfo.major||''}
            onChange={this.handleChange}
            placeholder="Enter major"
          />
        </FormGroup>
        <FormGroup>
          <Label for="IDCard">IDCard</Label>
          <Input
            type="text"
            name="IDCard"
            value={formInfo.IDCard||''}
            onChange={this.handleChange}
            placeholder="Enter IDCard"
          />
        </FormGroup>
        <FormGroup>
          <Label for="phone_number">phone_number</Label>
          <Input
            type="text"
            name="phone_number"
            value={formInfo.phone_number||''}
            onChange={this.handleChange}
            placeholder="Enter phone_number"
          />
        </FormGroup>
        <Button
          onClick={() => this.handle_profile_submit(formInfo)}
          disabled={!couldSave}
        >
          保存信息
        </Button>{' '}
        <Link to="/profile/pay">
          <Button>
            支付报名
          </Button>
        </Link>
      </Form>
    );
  }
}
