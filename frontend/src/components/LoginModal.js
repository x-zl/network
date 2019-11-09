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
    user: {
      username: '',
      password: '',
    },
    errorMessage: ''
  };

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newUser = { ...prevstate.user };
      newUser[name] = value;
      const newState = { ...prevstate };
      newState.user = newUser;
      newState.errorMessage = '';
      return newState;
    });
  }

  submit = e => {
    const { user } = this.state;
    const { onSave, toggle } = this.props;
    const validationSuccess = onSave(user);
  }

  render() {
    const { errorMessage, user } = this.state;
    const { username, password } = user;
    console.log(this.state);
    const { isOpen, toggle, onSave } = this.props;
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Log in</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              {/*for = htmlFor ?*/}
              <Label for="username">Username</Label>
              <Input
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
                placeholder="Enter UserName"
              />
              <span style={{color: 'red', fontSize: 'small'}}>{errorMessage}</span>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                placeholder="Enter Password"
              />
              <a href="#" onClick={() => {
                console.log('onClick' ,username);
                if (username) {
                  let result = this.props.sendEmail({'username': username})
                  console.log(result);
                  result.then(json => {
                    console.log(json);
                    if (json.send_status >= 0) {
                      toggle('reset');
                    }
                  })
                  /*
                  if (result) {
                    this.setState({errorMessage: ''})
                    toggle('reset');
                  } else {
                    this.setState({errorMessage: 'send error'})
                  }
                  */
                } else {
                  this.setState({errorMessage: '请输入用户名'})
                }
              }} style={{fontSize: "small"}}>忘记密码？点击找回</a>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="info" outline
            onClick={() => {toggle('signup')} }
            size="sm"
            >
            Sign up first
          </Button>
          <Button color="success" onClick={this.submit}>
            Submit
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
