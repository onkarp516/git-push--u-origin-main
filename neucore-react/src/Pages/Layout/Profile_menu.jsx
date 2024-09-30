import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Navbar,
  NavDropdown,
  Item,
  Nav,
  Form,
  Container,
  FormControl,
  InputGroup,
  Table,
  Alert,
  Modal,
  Tab,
  Card,
  Accordion,
  CloseButton,
  Tabs,
} from "react-bootstrap";
import menu_utilities from "@/assets/images/1x/menu_utilities.png";
import menu_master from "@/assets/images/1x/menu_master.png";
import { DropdownSubmenu, NavDropdownMenu } from "@/CustMenu";

import { eventBus } from "@/helpers";
import { authenticationService } from "@/services/api_functions";

export default class Profile_menu extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <>
        <Nav>
          <NavDropdownMenu
            className="right-side"
            title={
              <span>
                {authenticationService.currentUserValue &&
                  authenticationService.currentUserValue.userCode}
                <img alt="menu_account_entry" src={menu_utilities} />
              </span>
            }
          >
            <NavDropdown.Item href="#action/8.1">
              Update Profile
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/8.1">
              Change Password
            </NavDropdown.Item>
            <DropdownSubmenu
              href="#action/3.7"
              title={
                <span>
                  <img alt="" src={menu_master} /> Themes
                </span>
              }
            >
              <NavDropdown.Item href="#action/8.1">Blue</NavDropdown.Item>
              <NavDropdown.Item href="#action/8.1">Green</NavDropdown.Item>
              <NavDropdown.Item href="#action/8.1">Purple</NavDropdown.Item>
              <NavDropdown.Item href="#action/8.1">Red</NavDropdown.Item>
              <NavDropdown.Item href="#action/8.1">Orange</NavDropdown.Item>
              <NavDropdown.Item href="#action/8.1">Yellow</NavDropdown.Item>
            </DropdownSubmenu>
            <NavDropdown.Item
              href="#action/8.1"
              onClick={(e) => {
                e.preventDefault();
                console.log("logout clicked");
                eventBus.dispatch("page_change", "logout");
                eventBus.dispatch("handle_main_state", {
                  statekey: "isShowMenu",
                  statevalue: false,
                });
              }}
            >
              Sign Out
            </NavDropdown.Item>
          </NavDropdownMenu>
        </Nav>
      </>
    );
  }
}
