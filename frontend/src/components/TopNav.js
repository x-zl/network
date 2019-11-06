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
    <>
      <NavItem>
        <Button outline color="primary"
          onClick={() => {display_form('login')}}
        >
          Log in
        </Button>
      </NavItem>
      <NavItem>
        <Button outline color="warning"
          onClick={() => {display_form('signup')}}
        >
          Sign up
        </Button>
      </NavItem>
    </>
  ) : (
    <Button outline color="warning"
      onClick={handle_logout}
    >
      Log out
    </Button>
  );
  console.log(content);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">enrollmentSystem</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {content}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Profile
              </DropdownToggle>
              <DropdownMenu right>
                <Link to='profile/exams'>
                  <DropdownItem>
                    查询考试
                  </DropdownItem>
                </Link>
                <DropdownItem>
                  Option 2
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Reset
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
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
