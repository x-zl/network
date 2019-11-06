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
  Route,
  Link,
} from 'react-router-dom';
import ExamInfo from './examInfo';

import {
  handleResponse,
  handleHeaderWithAuthToken,
  handleUrl,
} from '../fetchClient/fetchHandler';


export default class Pay extends React.Component {
  constructor(props) {
    super(props);
    this.account_total = 25;
    this.state = {
      pay_status: 'unpaid',
      orderInfo: {
        // update
        exam_number: '',
        // return out_trade_no
        trade_no: '',
      },
    }
  }
  /*
  componentDidMount() {
    console.log("get data from /profile");
    fetch(handleUrl('profile/'), {
      method: 'GET',
      headers: handleHeaderWithAuthToken(),
    })
      .then(res => handleResponse(res))
      .then(json => {
        console.log("last profile", json)
        this.setState({orderInfo: {...orderInfo, ...json} })
      }).catch(err => {
        console.log("get last profile error", err);
      });
  }
  */

  handleChange = e => {
    const {name, value} = e.target;
    const orderInfo = { ...this.state.orderInfo, [name]: value };
    this.setState({orderInfo });
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
        console.log("order unsuccessful", err);
      });
    /*
    fetch(handleUrl('order/result'), {
      method: 'GET',
      headers: handleHeaderWithAuthToken({
        //'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data)
    })
      .then(res => handleResponse(res))
      .then(json => {
        console.log("payment finished", json)
        this.setState({pay_status: 'finished'});
      }).catch(err => {
        console.log("payment unsuccessful", err);
        this.setState({pay_status: 'failed'});
      });
      */
  }

  render() {
    const {orderInfo, pay_status} = this.state;
    return (
      <Form>
        <FormGroup>
          <Label for="account_total">account_total</Label>
          <Input type="text" name="account_total" plaintext={true} value={25} />
        </FormGroup>
        <FormGroup>
          <Label for="exam_number">exam_number</Label>
          <Input
            type="text"
            name="exam_number"
            onChange={this.handleChange}
            value={orderInfo.exam_number} />
        </FormGroup>
        {pay_status === "unpaid" && <Button onClick={this.handle_pay}>去支付</Button>}
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
      </Form>
    );


  }



}
