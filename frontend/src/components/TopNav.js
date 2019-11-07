import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Button,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import {
  Route,
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import './TopNav.css';

const TopNav = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const {handle_logout, display_form} = props;

  const toggle = () => setIsOpen(!isOpen);
  console.log(props.logged_in);

  const content = !props.logged_in ? (
    <div style={{}}>

        <Button outline color="primary"
          onClick={() => {display_form('login')}}
          style={{margin: 'auto'}}
        >
          Log in
        </Button>
        <span>{'  '}</span>
        <Button outline color="warning"
          onClick={() => {display_form('signup')}}
        >
          Sign up
        </Button>

    </div>
  ) : (
    <></>
  );

  const loginDropDown = (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        {props.logged_in ? props.username : 'login!'}
      </DropdownToggle>
      <DropdownMenu right>
        <Link to='/check/profile'>
          <DropdownItem>
            查询信息
          </DropdownItem>
        </Link>
        <Link to='/check/exam'>
          <DropdownItem>
            查询考试
          </DropdownItem>
        </Link>
        <DropdownItem divider />
        <DropdownItem onClick={props.handle_logout}>
          LogOut
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">enrollmentSystem</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {content}
            {props.logged_in && loginDropDown }
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default TopNav;

Navbar.propTypes = {
  light: PropTypes.bool,
  dark: PropTypes.bool,
  fixed: PropTypes.string,
  color: PropTypes.string,
  role: PropTypes.string,
  expand: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
  // pass in custom element to use
}
