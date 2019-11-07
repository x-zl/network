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

export default class Exams  extends React.Component {
  constructor(props) {
    super(props);
    this.number = 0;
    this.exams = undefined;
  }


  componentDidMount() {
    this.query_exams()
  }

  query_exams = () => {
    fetch(handleUrl('exams/'), {
      method: 'GET',
      headers: handleHeaderWithAuthToken(),
    })
      .then(res => handleResponse(res))
      .then(json => {
        this.exams = {...json};
        console.log("get exams", json);
      })
      .catch(err => {
        console.log("exams query unsuccessful", err);
      });
  }

  render() {
    console.log("exams render");
    const content = this.number > 0 ? (
      <Table hover>
        <thead>
          <tr>
            <th>#考试信息</th>
            <th>考试类型</th>
            <th>考场号</th>
            <th>考号</th>
          </tr>
        </thead>
        <tbody>
          {
          this.exams.map((index, exam) => (
            <tr key="index">
              <th scope="row">index</th>
              <td>exam.exam_number</td>
              <td>exam.class_number</td>
              <td>exam.exam_id</td>
            </tr>
          ))
          }
        </tbody>
      </Table>
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
