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
} from 'react-router-dom';
import {
  handleResponse,
  handleHeaderWithAuthToken,
  handleUrl,
} from '../fetchClient/fetchHandler';

export default class ExamInfo extends React.Component {
  constructor(props) {
    super(props);
    this.examInfo = {
      student_name: '',
      exam_number: this.props.exam_number || '',
      student_id: '',
    }
  }
  // TODO
  componentDidMount() {
    // query_pay()
  }

  query_pay = () => {
    const { exam_number } = this.props;
    const data = {
      exam_number,
    }

    fetch(handleUrl('exams/'), {
      method: 'GET',
      headers: handleHeaderWithAuthToken(),
    })
      .then(res => handleResponse(res))
      .then(json => {
        this.examInfo = {...this.examInfo, ...json};
        console.log(json);
      })
      .catch(err => {
        console.log("exam query unsuccessful", err);
      });
  }

  render() {
    const { student_name, exam_number, student_id } = this.examInfo;
    return (
      <Form>
        <Label>考试信息</Label>
        <FormGroup>
          <Label>姓名</Label>
          <FormText>{student_name}</FormText>
        </FormGroup>
        <FormGroup>
          <Label>考试类型</Label>
          <FormText>{exam_number}</FormText>
        </FormGroup>
        <FormGroup>
          <Label>考生号</Label>
          <FormText>{student_id}</FormText>
        </FormGroup>
        {this.props.pay && <FormText color='success'>报名成功!</FormText>}
      </Form>
    );
  }
}
