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
  Label
} from "reactstrap";

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
      return newState;
    });
  }

  submit = e => {
    const { user } = this.state;
    const { onSave, toggle } = this.props;
    const validationSuccess = onSave(user);
    if (validationSuccess === true) {
      this.setState({errorMessage: ''}, () => {
        console.log('validation success');
        toggle();
      });
    } else {
      this.setState({errorMessage: 'error validation'}, () => {
        console.log('validation error');
      })
    }
  }

  render() {
    const { errorMessage } = this.state;
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
                value={this.state.username}
                onChange={this.handleChange}
                placeholder="Enter UserName"
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <span style={{padding: '10px', color: 'red'}}>{errorMessage}</span>
              <Input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="Enter Password"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
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
