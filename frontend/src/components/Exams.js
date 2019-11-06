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
  handleResponse,
  handleHeaderWithAuthToken,
  handleUrl,
} from '../fetchClient/fetchHandler';

export default class Exams  extends React.Component {
  constructor(props) {
    super(props);
    this.number = 0
  }


  componentDidMount() {

  }

  render() {
    console.log("exams render");
    const content = this.number > 0 ? (
      <>{this.number}</>
    ) : (
      <FormText color="mute">没有报名考试</FormText>
    );
    return (
      <Form>
        {content}
      </Form>
    )
  };
}
