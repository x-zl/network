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

const ExamMap = {
  '1':'四级',
  '2':'六级',
  '3':'计算机等级考试',
};


export default class ExamInfo extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      examInfo: {
        exam_number: this.props.exam_number || '',
        student_id: '',
        name: '',
        IDCard: '',
        student_id: '',
        exam_id: '',
        class_number: '',
        grade: '',
      },
    }
  }
  // TODO
  componentDidMount() {
    this.query_exam();
  }

  query_exam = () => {
    const { exam_number } = this.props;
    const data = {
      exam_number,
    }

    fetch(handleUrl('exam_info/', {
      'exam_number': exam_number
    }), {
      method: 'GET',
      headers: handleHeaderWithAuthToken(),
    })
      .then(res => handleResponse(res))
      .then(json => {
        let examInfo = {...this.state.examInfo}
        examInfo = {...examInfo, ...json};
        this.setState({examInfo})
      })
      .catch(err => {
        console.log("exam query unsuccessful", err);
      });
  }

  render() {
    console.log(this.props, this.state);
    const {
      name,
      exam_id,
      IDCard,
      exam_number,
      student_id,
      grade,
    } = this.state.examInfo;

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
            <FormText>{name}</FormText>
          </FormGroup>
          <FormGroup>
            <Label>考号</Label>
            <FormText>{exam_id}</FormText>
          </FormGroup>
          <FormGroup>
            <Label>身份证号</Label>
            <FormText>{IDCard}</FormText>
          </FormGroup>
          <FormGroup>
            <Label>考试类型</Label>
            <FormText>{ExamMap[exam_number]}</FormText>
          </FormGroup>
          <FormGroup>
            <Label>考生序号</Label>
            <FormText>{student_id}</FormText>
          </FormGroup>
          {this.props.pay && <FormText color='success'>报名成功!</FormText>}
          {grade == 0 && <FormText color='mute'>未考试</FormText>}
        </Form>
      </>
    );
  }
}
