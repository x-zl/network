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

class SignupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      errorMessage: '',
    };
  }

  handleChange = e => {
    const {name, value} = e.target;

    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  submit = e => {
    const { user } = this.state;
    const { onSave, toggle } = this.props;
    const validationSuccess = onSave(user);
    if (validationSuccess === true) {
      this.setState({errorMessage: ''}, () => {
        // console.log('validation success');
        // toggle();
      });
    } else {
      this.setState({errorMessage: 'xx'}, () => {

      })
    }
  }

  render() {
    const { errorMessage } = this.state;
    const {isOpen, toggle, onSave} = this.props;
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Sign up</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              {/*for = htmlFor ?*/}
              <Label for="username">Username</Label>
              <FormFeedback invalid={errorMessage!==''}>{errorMessage}</FormFeedback>
              <Input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
                placeholder="Enter UserName"
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="enter Password"
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="enter email"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" outline
            onClick={() => {toggle('login')} }
            size="sm" >
            已有账号？登陆
          </Button>
          <Button color="success" onClick={() => onSave(this.state)}>
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default SignupModal;

SignupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};
