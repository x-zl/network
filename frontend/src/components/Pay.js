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
  Col,
} from 'reactstrap';
import {
  Route,
  Link,
} from 'react-router-dom';
import ExamInfo from './examInfo';

import {
  handleResponse,
  handleHeaderWithAuthToken,
  handleUrl,
} from '../fetchClient/fetchHandler';

const ExamType = {
  '四级': '1',
  '六级': '2',
  '计算机等级考试': '3',
}

export default class Pay extends React.Component {
  constructor(props) {
    super(props);
    this.account_total = 25;
    this.state = {
      pay_status: 'unpaid',
      orderInfo: {
        // update
        exam_number: '1',
        // return out_trade_no
        trade_no: '',
      },
    }
  }

  handleChange = e => {
    let {name, value} = e.target;
    if (e.target.type === "select") {
      value = ExamType[value];
      console.log("----in-if----")
    }
    console.log("----end-if----")
    console.log(e.target.type)
    const orderInfo = { ...this.state.orderInfo, [name]: value };
    this.setState({orderInfo });
    console.log(name, value);
  };

  query_pay = () => {
    const data = this.state.orderInfo
    if (!data.trade_no) {
      // error
    }
    const url = handleUrl('order/', data)
    console.log("url: ", url)
    fetch(url, {
      method: 'GET',
      headers: handleHeaderWithAuthToken(),
    })
      .then(res => handleResponse(res))
      .then(json => {
        console.log(json);
        if (json.finished === 'true') {
          // TODO 支付成功可以跳转，得到生成的考生号，考场号
          console.log(json)
          this.setState({pay_status: 'success'});
        } else {
          // TODO 支付失败不跳转，显示未成功
          this.setState({pay_status: 'failed'});
        }
      })
      .catch(err => {
        this.props.handle_expired_error(err);
        console.log("order unsuccessful", err);
      });
  }

  handle_pay = () => {
    const data = this.state.orderInfo;
    console.log("post", data, "to order/");
    fetch(handleUrl('order/'), {
      method: 'POST',
      headers: handleHeaderWithAuthToken({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data)
    })
      .then(res => handleResponse(res))
      .then(json => {
        console.log(json);
        const pay_url = json.pay_url;
        if(pay_url) {
          window.open(pay_url);
          console.log(json.trade_no)
          // json
          const orderInfo = { ...this.state.orderInfo, ...json};
          this.setState({pay_status: 'topay'});
        } else {
          alert('err');
          this.setState({pay_status: 'unpaid'});
        }
      })
      .catch(err => {
        this.props.handle_expired_error(err);
        console.log("order unsuccessful", err);
      });
  }

  render() {
    const {orderInfo, pay_status} = this.state;
    return (
      <>
        <Breadcrumb>
          <BreadcrumbItem><a href="/">Home</a></BreadcrumbItem>
          <BreadcrumbItem><a href="/profile">Profile</a></BreadcrumbItem>
          <BreadcrumbItem active>Pay</BreadcrumbItem>
        </Breadcrumb>
        <div style={{width: "600px", margin: "auto", borderColor: "red"}}>
          <Form row>
            <FormGroup row>
              <Label for="account_total" sm={3}>account_total</Label>
              <Col sm={2}>
                <Input type="text" name="account_total" id="account_total"
                  plaintext={true} value={25} readOnly/>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="examSelect" sm={3}>exam_number</Label>
              <Col sm={5}>
                <Input
                  type="select"
                  name="exam_number"
                  id="examSelect"
                  onChange={this.handleChange}
                  value={orderInfo.exam_number}
                >
                  <option>四级</option>
                  <option>六级</option>
                  <option>计算机等级考试</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              {pay_status === "unpaid" && <Button color="success" onClick={this.handle_pay}>去支付</Button>}
              {(pay_status === "topay" || pay_status === "failed") &&
                <>
                  <Link to="/profile">
                    <Button >返回</Button>
                  </Link>
                  {pay_status === "topay" &&
                    <>
                      {'  '}
                      <Button onClick={this.query_pay}>已支付</Button>
                    </>
                  }
                  {'  '}
                  <Button onClick={this.handle_pay}>重新支付></Button>
                </>
              }
              {pay_status === "success" &&
                <>
                  <Link to="/examInfo">
                    <Button>下一步></Button>
                  </Link>
                  <Route exact path='/examInfo'>
                    <ExamInfo exam_number={orderInfo.exam_number} pay={true}/>
                  </Route>
                </>
              }
              {'  '}{pay_status}
            </FormGroup>
          </Form>

        </div>
      </>
    );


  }



}
