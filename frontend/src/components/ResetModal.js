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
      const newFormInfo = { ...prevstate.formInfo };
      newFormInfo[name] = value;
      const newState = { ...prevstate };
      newState.forInfo = newFormInfo;
      newState.errorMessage = '';
      return newState;
    });
  }

  submit = e => {
    const { formInfo } = this.state;
    const { onSave, toggle } = this.props;
    const { password, password2, code } = formInfo;
    if (password !== password2) {
      this.setState({errorMessage: '两次密码不一致'});
      return;
    }
    const result = onSave({
      'password': password,
      'code': code,
    });
    if (result) {
      console.log(result);
      /*
      this.setState({errorMessage: ''}, () => {
        toggle('login');
      });
      */
    } else {
      console.log('reset failed')
    }
  }

  render() {
    const { errorMessage, formInfo } = this.state;
    const { code, password, password2 } = formInfo;
    const { isOpen, toggle, onSave } = this.props;
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Reset Password</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              {/*for = htmlFor ?*/}
              <Label for="code">Verify Code</Label>
              <FormFeedback invalid={errorMessage!==''}>{errorMessage}</FormFeedback>
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
            reser password
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
