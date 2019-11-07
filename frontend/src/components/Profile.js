import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Breadcrumb,
  BreadcrumbItem,
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
import BaseProfile from "./BaseProfile"
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
      couldPay: false,
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
        console.log("last profile", json, "valida", this.validateFormInfo(json))
        this.setState( {formInfo: {...json}, couldPay: this.validateFormInfo(json) });
      }).catch(err => {
        console.log("get last profile error", err);
      });
  }

  validateFormInfo = (json) => {
    const { name, IDCard, phone_number } = json ? json : this.state.formInfo;
    console.log(name, IDCard, phone_number)
    if (!!name && !!IDCard && !!phone_number) {
      return true;
    }
    return false;
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
        this.setState({couldSave: false, couldPay: this.validateFormInfo()});
        console.log("submit profile success", json)
      }).catch(err => {
        console.log("submit profile error", err);
      });
  };

  render() {
    const { formInfo, hasChanged, couldSave, couldPay } = this.state;
    console.log('state', this.state);
    return (
      <>
        <Breadcrumb>
          <BreadcrumbItem><a href="/">Home</a></BreadcrumbItem>
          <BreadcrumbItem active>Profile</BreadcrumbItem>
        </Breadcrumb>
        <Form style={{width: "300px", margin: "auto"}}>
          <BaseProfile handleChange={this.handleChange} formInfo={formInfo}/>
          <Button
            onClick={() => this.handle_profile_submit(formInfo)}
            disabled={!couldSave}
            color = {couldSave ? 'success' : undefined}
          >
            保存信息
          </Button>{' '}
          <Link to="/profile/pay">
            <Button disabled={!couldPay} color={couldPay ? 'success' : undefined}>
              支付报名
            </Button>
          </Link>
        </Form>
      </>
    );
  }
}
