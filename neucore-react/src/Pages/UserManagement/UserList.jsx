import React, { Component } from "react";

import { Button, Col, Row, Form, Table, Collapse } from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";
import {
  authenticationService,
  get_companies_super_admin,
  createCompanyUser,
  get_c_admin_users,
  get_user_by_id,
  updateInstituteUser,
} from "@/services/api_functions";
import Select from "react-select";
import {
  EMAILREGEXP,
  numericRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  customStyles,
  eventBus,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opendiv: false,
      opCompanyList: [],
      data: [],
      CompanyInitVal: {
        id: "",
        companyId: "",
        fullName: "",
        mobileNumber: "",
        userRole: "USER",
        email: "",
        gender: "",
        usercode: "",
        password: "",
      },
      userRole: "USER",
    };
    this.ref = React.createRef();
  }

  listUsers = () => {
    get_c_admin_users()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            this.setState({ data: data });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.listUsers();
      this.setInitValue();
      mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      mousetrap.bindGlobal("ctrl+c", this.setInitValue);
    }
  }

  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+s", this.handleSubmitForm);
    mousetrap.unbindGlobal("ctrl+c", this.setInitValue);
  }

  setInitValue = () => {
    this.setState({
      opendiv: false,
      opCompanyList: [],
      data: [],
      userRole: "USER",
    });
  };

  pageReload = () => {
    this.componentDidMount();
  };
  render() {
    const { data } = this.state;
    return (
      <div className="">
        <div className="wrapper_div">
          <div className="cust_table">
            <Row style={{ padding: "8px" }}>
              <Col md="3">
                <div className="">
                  <Form>
                    <Form.Group className="mt-1" controlId="formBasicSearch">
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        className="search-box"
                      />
                    </Form.Group>
                  </Form>
                </div>
              </Col>
              <Col md="9" className="mt-2 btn_align mainbtn_create">
                <Button
                  className="create-btn mr-2"
                  onClick={(e) => {
                    e.preventDefault();
                    eventBus.dispatch("page_change", "user_mgnt_create");
                  }}
                  aria-controls="example-collapse-text"
                >
                  Create
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-plus-square-dotted svg-style"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg>
                </Button>

                <Button
                  className="ml-2 refresh-btn"
                  type="button"
                  onClick={() => {
                    this.pageReload();
                  }}
                >
                  Refresh
                </Button>
              </Col>
            </Row>
            <div className="table_wrapper mt-2">
              <Table hover size="sm" className="tbl-font">
                <thead>
                  <tr>
                    <th>#.</th>
                    <th>Company Name</th>
                    <th>Full Name</th>
                    <th>Mobile Number</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>UserCode</th>
                  </tr>
                </thead>
                <tbody className="tabletrcursor">
                  {data.length > 0 ? (
                    data.map((v, i) => {
                      return (
                        <tr
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            this.setUpdateData(v.id);
                          }}
                        >
                          <td>{i + 1}</td>
                          <td>{v.companyName}</td>
                          <td>{v.fullName}</td>
                          <td>{v.mobileNumber}</td>
                          <td>{v.email != "NA" ? v.email : ""}</td>
                          <td>{v.gender}</td>
                          <td>{v.usercode}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
