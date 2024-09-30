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

import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";
import Datetime from "./Datetime";
import Profile_menu from "./Profile_menu";
import dashboard from "./assets/images/1x/menu_dashboard.png";
import menu_master from "./assets/images/1x/menu_master.png";
import menu_transaction from "./assets/images/1x/menu_transaction.png";
import menu_account_entry from "./assets/images/1x/menu_account_entry.png";
import menu_reports from "./assets/images/1x/menu_reports.png";
import menu_utilities from "./assets/images/1x/menu_utilities.png";

export default class Menus extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <>
        <Navbar bg="light" expand="lg">
          <Container fluid className="menu-style">
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                <Nav.Link href="#action1">
                  <img alt="" src={dashboard} /> Dashboard
                </Nav.Link>
                <NavDropdown
                  title={
                    <span>
                      <img alt="" src={menu_master} /> Master
                    </span>
                  }
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={
                    <span>
                      <img alt="" src={menu_transaction} /> Transaction
                    </span>
                  }
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={
                    <span>
                      <img alt="menu_account_entry" src={menu_account_entry} />
                      Account Entry
                    </span>
                  }
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={
                    <span>
                      <img alt="menu_account_entry" src={menu_reports} />
                      Reports
                    </span>
                  }
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={
                    <span>
                      <img alt="menu_account_entry" src={menu_utilities} />
                      Utilities
                    </span>
                  }
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown>
                {/* <Nav.Link href="#" disabled>
                  Logout
                </Nav.Link> */}
              </Nav>
              <Datetime />
              <Profile_menu />
              {/* <Form className="d-flex">
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form> */}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}
