import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  Table,
  FormControl,
} from "react-bootstrap";
import { getFeesMasters } from "@/services/api_functions";
import {
  AuthenticationCheck,
  MyDatePicker,
  eventBus,
  MyNotifications,
  isActionExist,
  customStyles,
  numberWithCommasIN,
} from "@/helpers";

import Select from "react-select";

import refresh_iconblack from "@/assets/images/3x/refresh_iconblack.png";
import excel from "@/assets/images/3x/excel.png";
import print from "@/assets/images/3x/print.png";
import delete_ from "@/assets/images/3x/delete_.png";
import edit_ from "@/assets/images/3x/edit_.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default class FeesMasterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      brandshow: false,
      opendiv: false,
      showDiv: false,
      productdetaillistmodal: false,
      data: [],
      productLst: [],
    };
  }

  getFeesMasterslst = () => {
    getFeesMasters()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          if (d.length > 0) {
            this.setState({ data: d });
          }
        }
      })
      .catch((error) => {
        this.setState({ data: [] });
        console.log("error", error);
      });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getFeesMasterslst();
    }
  }

  render() {
    const { data } = this.state;
    return (
      <div className="">
        <div className="wrapper_div">
          <div className="cust_table p-2">
            <Row style={{ padding: "8px" }} className="headpart">
              <Col lg={2} md={3} xs={12} className="mb-2">
                <Row>
                  <Col>
                    <Form.Label>Result Per Page</Form.Label>
                  </Col>
                  <Col>
                    <Select
                      className="selectTo"
                      styles={customStyles}
                      name="currency"
                      placeholder="10"
                    />
                  </Col>
                </Row>
              </Col>

              <Col lg={6} md="2"></Col>
              <Col lg={2} md={3} xs={12}>
                <Form.Label
                  htmlFor="inlineFormInputGroup"
                  visuallyHidden
                ></Form.Label>
                <InputGroup className="mb-2 headt">
                  <FormControl
                    id="inlineFormInputGroup"
                    placeholder="Search"
                    type="search"
                    aria-label="Search"
                    className="search-conrol"
                  />
                  <InputGroup.Text
                    style={{
                      borderLeft: "none",
                      background: "white",
                      borderTop: "none",
                      borderRight: "none",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="faIcon-style"
                    ></FontAwesomeIcon>
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col lg={2} md={3} xs={12} className="btn_align mainbtn_create">
                <Button
                  className="create-btn me-2"
                  onClick={(e) => {
                    e.preventDefault();
                    // if (isActionExist("fees-master", "create")) {
                    eventBus.dispatch("page_change", "feesmaster");
                    // } else {
                    //   MyNotifications.fire({
                    //     show: true,
                    //     icon: "error",
                    //     title: "Error",
                    //     msg: "Permission is denied!",
                    //     is_button_show: true,
                    //   });
                    // }
                  }}
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
                  className="ml-1"
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: "2px",
                  }}
                  type="button"
                  onClick={() => {
                    this.pageReload();
                  }}
                >
                  <img src={refresh_iconblack} className="iconstable"></img>
                </Button>
                <Button
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: "2px",
                  }}
                >
                  <img src={print} className="iconstable"></img>
                </Button>
                <Button
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: "2px",
                  }}
                >
                  <img src={excel} className="iconstable"></img>
                </Button>
              </Col>
            </Row>
            {/* {data.length > 0 && ( */}
            <div className="table_wrapper denomination-style">
              {isActionExist("fees-master", "list") && (
                <Table size="sm" hover className="tbl-font">
                  <thead>
                    <tr>
                      <th>#.</th>
                      {/* <th>Institute Name</th> */}
                      {/* <th>Branch Name</th> */}
                      <th>Standard</th>
                      <th>Academic Year</th>
                      <th>Student Type</th>
                      <th>Student Group</th>
                      <th>Boy</th>
                      <th>Girl</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody
                    className="tabletrcursor"
                    style={{ borderTop: "transparent" }}
                  >
                    {data.map((v, i) => {
                      return (
                        <tr>
                          <td style={{ width: "3%" }}>{i + 1}</td>

                          {/* <td>{v.outletName}</td> */}
                          {/* <td>{v.branchName}</td> */}
                          <td>{v.standard}</td>
                          <td>{v.academicYear}</td>
                          <td>{v.studentType}</td>
                          <td>{v.studentGroup}</td>
                          <td>{numberWithCommasIN(v.amountForBoy, true, 2)}</td>

                          <td>
                            {numberWithCommasIN(v.amountForGirl, true, 2)}
                          </td>
                          <td>{numberWithCommasIN(v.amount, true, 2)}</td>
                          <td>
                            {" "}
                            <a
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                if (isActionExist("fees-master", "edit")) {
                                  console.log({ v });
                                  eventBus.dispatch("page_change", {
                                    from: "feesmasterlist",
                                    to: "feesmasteredit",
                                    prop_data: v.id,
                                    isNewTab: false,
                                  });
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Permission is denied!",
                                    is_button_show: true,
                                  });
                                }
                              }}
                            >
                              <img src={edit_} alt="" className="marico"></img>
                            </a>
                            <a href="">
                              <img
                                src={delete_}
                                alt=""
                                className="marico"
                              ></img>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
    );
  }
}
