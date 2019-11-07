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
      name: '',
      IDCard: '',
      student_id: '',
      exam_id: '',
      class_number: '',
      grade: '',
    }
  }
  // TODO
  componentDidMount() {
    this.query_exam()
  }

  query_exam = () => {
    const { exam_number } = this.props;
    const data = {
      exam_number,
    }

    fetch(handleUrl('order/', {
      'exam_number': exam_number
    }), {
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
    const {
      student_name,
      exam_number,
      student_id,
      grade,
    } = this.examInfo;

    return (
      <>
        {this.props.pay &&
          <Breadcrumb>
            <BreadcrumbItem><a href="/">Home</a></BreadcrumbItem>
            <BreadcrumbItem><a href="/profile">Profile</a></BreadcrumbItem>
            <BreadcrumbItem><a href="/profile/pay">Pay</a></BreadcrumbItem>
            <BreadcrumbItem active>Exam Infomation</BreadcrumbItem>
          </Breadcrumb>
        }
        <Form style={{width: "300px", margin: "auto"}}>
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
          {grade == 0 && <FormText color='mute'>未考试</FormText>}
        </Form>
      </>
    );
  }
}
