import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Table
} from 'reactstrap';
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


export default class Exams extends React.Component {
  constructor(props) {
    console.log('exams, constructor')
    super(props);
    this.state = {
      number: 0,
    }
    this.exams = [];
  }


  componentDidMount() {
    console.log('didmount')
    this.query_exams()
  }

  query_exams = () => {
    fetch(handleUrl('exams/'), {
      method: 'GET',
      headers: handleHeaderWithAuthToken(),
    })
      .then(res => handleResponse(res))
      .then(json => {
        for (let [key, exam] of Object.entries(json)) {
          this.exams.push(exam);
        }
        this.number = this.exams.length
        console.log("get exams", json);
        this.setState({number: this.exams.length})
      })
      .catch(err => {
        console.log("exams query unsuccessful", err);
      });
  }

  render() {
    console.log("exams render", this.state.number, this.exams, this.exams.length);
    if (!this.state.number) {
      // load
      return <Label style={{textAlign: "center", display: "block",}} >{'loading'}</Label>
    }
    const content = this.exams.length > 0 ? (
      <>
      <Label style={{textAlign: "center", display: "block"}} >{this.exams[0].name}</Label>
      <Table style={{margin: "auto", width: "700px"}} hover>
        <thead>
          <tr>
            <th>考试信息</th>
            <th>考试类型</th>
            <th>考场号</th>
            <th>考号</th>
            <th>成绩</th>
          </tr>
        </thead>
        <tbody>
          {

          this.exams.map((exam, index) => (
            <tr key={index}>
              <th scope="row">{index}</th>
              <td>{ExamMap[exam.exam_number]}</td>
              <td>{exam.class_number}</td>
              <td>{exam.exam_id}</td>
              <td>{exam.grade > 0 ? exam.grade : '未考'}</td>
            </tr>
          ))

          }
        </tbody>
      </Table>
      </>
    ) : (
      <Form style={{width: "300px", margin: "auto"}}>
        <FormText color="mute">没有报名考试</FormText>
      </Form>
    );
    return (
      <>
        {content}
      </>
    )
  };
}
