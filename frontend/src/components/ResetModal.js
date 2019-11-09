import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  FormText,
  FormFeedback,
} from "reactstrap";
import {
  Route,
  Link,
} from 'react-router-dom';

class LoginModal extends React.Component {
  state = {
    formInfo: {
      username: '',
      code: '',
      password: '',
      password2: '',
    },
    errorMessage: ''
  };

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const formInfo = { ...prevstate.formInfo, [name]: value };
      const errorMessage = '';
      const newState = {formInfo, errorMessage}
      return newState;
    });
  }

  submit = e => {
    const { formInfo } = this.state;
    const { onSave, toggle } = this.props;
    const { username, password, password2, code } = formInfo;
    if (!username || !password || !password2 || !code) {
      this.setState({errorMessage: '请填写完整'});
      return;
    }
    if (password !== password2) {
      this.setState({errorMessage: '两次密码不一致'});
      return;
    }

    let res = onSave({
      'username': username,
      'password': password,
      'code': code,
    })
    console.log(res);
    if (res) {
      res.then(json => {
        console.log(json)
        this.setState({errorMessage: ''}, () => {
          toggle('login');
        });
      });
    }
  }

  render() {
    const { errorMessage, formInfo } = this.state;
    console.log(this.state);
    const { username, code, password, password2 } = formInfo;
    const { isOpen, toggle, onSave } = this.props;
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Reset Password</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              {/*for = htmlFor ?*/}
              <Label for="username">username</Label>
              <Input
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
                placeholder="Enter username"
              />
            </FormGroup>
            <FormGroup>
              {/*for = htmlFor ?*/}
              <Label for="code">Verify Code</Label>
              <span style={{color: 'red', fontSize: 'small'}}>{errorMessage}</span>
              <Input
                type="text"
                name="code"
                value={code}
                onChange={this.handleChange}
                placeholder="Enter Verify Code"
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">New Password</Label>

              <Input
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                placeholder="Enter New Password"
              />
            </FormGroup>
            <FormGroup>
              <Label for="password2">New Password</Label>
              <Input
                type="password"
                name="password2"
                value={password2}
                onChange={this.handleChange}
                placeholder="Confirm New Password"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={this.submit}>
            reset password
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default LoginModal;

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};
