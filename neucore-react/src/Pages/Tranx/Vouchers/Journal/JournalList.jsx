import React from "react";
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
  InputGroup,
  Table,
  Alert,
  CloseButton,
  Modal,
} from "react-bootstrap";

import { get_journal_list_by_outlet } from "@/services/api_functions";
import moment from "moment";

import {
  AuthenticationCheck,
  MyDatePicker,
  eventBus,
  MyNotifications,
  numberWithCommasIN,
  isActionExist,
} from "@/helpers";
import view_icon_3 from "@/assets/images/3x/view_icon_3.svg";

export default class JournalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      brandshow: false,
      opendiv: false,
      showDiv: false,
      productdetaillistmodal: false,
      getJournalTable: [],
      productLst: [],
    };
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  get_journal_list = () => {
    get_journal_list_by_outlet()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ getJournalTable: res.data });
        }
      })
      .catch((error) => {
        this.setState({ getJournalTable: [] });
      });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  handleFetchData = (id) => {
    eventBus.dispatch("page_change", {
      from: "productlist",
      to: "productedit",
      isNewTab: false,
      prop_data: id,
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.get_journal_list();
    }
  }

  render() {
    const {
      show,
      brandshow,
      productLst,
      productdetaillistmodal,
      showDiv,
      opendiv,
      getJournalTable,
    } = this.state;
    return (
      <div className="">
        <div className="wrapper_div" style={{ height: "700px" }}>
          <div className="cust_table">
            <div className="">
              {!opendiv && (
                <Row>
                  <Col md="3">
                    <div className="">
                      <Form>
                        <Form.Group
                          className="search_btn_style mt-1"
                          controlId="formBasicSearch"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search"
                            className="main_search"
                          />
                          <Button type="submit">x</Button>
                        </Form.Group>
                      </Form>
                    </div>
                  </Col>
                  <Col md="5">
                    <InputGroup className="mb-3 ">
                      <MyDatePicker
                        placeholderText="DD/MM/YYYY"
                        id="bill_dt"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="FROM DATE"
                        // onChange={(date) => {
                        //   setFieldValue('bill_dt', date);
                        // }}
                        // selected={values.bill_dt}
                        maxDate={new Date()}
                        className="newdate text_center mt-1"
                      />
                      <InputGroup.Text id="basic-addon2" className=" mt-1">
                        <i class="fa fa-arrow-right" aria-hidden="true"></i>
                      </InputGroup.Text>
                      <MyDatePicker
                        placeholderText="DD/MM/YYYY"
                        id="bill_dt"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="TO DATE"
                        // onChange={(date) => {
                        //   setFieldValue('bill_dt', date);
                        // }}
                        // selected={values.bill_dt}
                        maxDate={new Date()}
                        className="newdate text_center mt-1"
                      />
                    </InputGroup>
                  </Col>
                  <Col md="4" className="mainbtn_create">
                    {/* {this.state.hide == 'true'} */}
                    <Button
                      className="createbtn mr-2"
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   // this.setState({ opendiv: !opendiv });

                      //   eventBus.dispatch("page_change", "voucher_journal");
                      // }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (isActionExist("voucher_journal_list", "create")) {
                          this.setState({ opendiv: !opendiv });
                          this.setLastSalesSerialNo();
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
                      Create &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-plus-square-dotted"
                        viewBox="0 0 16 16"
                      >
                        Create &nbsp;
                        <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                      </svg>
                    </Button>
                    &nbsp;
                    <Button
                      className="ml-2 alterbtn"
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        this.pageReload();
                      }}
                    >
                      Refresh
                    </Button>
                  </Col>
                </Row>
              )}
            </div>
          </div>
          <Form>
            <div className="table_wrapper denomination-style">
              {getJournalTable.length > 0 && (
                <Table
                  bordered
                  hover
                  size="sm"
                  className="new_tbldesign fix-height-200"
                  // responsive
                >
                  <thead>
                    {/* <div className="scrollbar_hd"> */}
                    <tr>
                      <th>Sr. #.</th>

                      {/* <th>Payment#</th> */}
                      <th>Journal #</th>
                      <th>Transcation Date</th>

                      <th>Total Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* <div className="scrollban_new"> */}
                    {getJournalTable.map((v, i) => {
                      return (
                        <tr
                        //   onDoubleClick={(e) => {
                        //     e.preventDefault();
                        //     this.handleFetchData(v.id);
                        //   }}
                        >
                          <td style={{ width: "3%" }}>{i + 1}</td>

                          {/* <td>{v.payment_sr_no}</td> */}
                          <td>{v.journal_code}</td>
                          <td>
                            {moment(v.transaction_dt).format("DD-MM-yyyy")}
                          </td>

                          <td>{numberWithCommasIN(v.total_amount, true, 2)}</td>
                          <td
                            style={{
                              width: "7%",
                              borderBottom: "1px solid #dee2e6",
                            }}
                            onClick={(e) => {
                              // if (isActionExist("ledger-list", "view"))
                              {
                                // this.setUpdateValue(v.id);
                                let prop_data = {
                                  id: v.id,
                                  journal_code: v.journal_code,
                                  journal_sr_no: v.journal_sr_no,
                                  transaction_dt: v.transaction_dt,
                                  narration: v.narration,
                                };
                                eventBus.dispatch("page_change", {
                                  from: "voucher_journal_list",
                                  to: "voucher_journal_details",
                                  prop_data: prop_data,
                                  isNewTab: false,
                                });
                              }
                              // else {
                              //   MyNotifications.fire({
                              //     show: true,
                              //     title: "Error",
                              //     icon: "error",
                              //     msg: "Permission is denied!",
                              //     is_button_show: true,
                              //   });
                              // }
                            }}
                          >
                            {" "}
                            <img src={view_icon_3} title="View" />
                          </td>
                        </tr>
                      );
                    })}
                    {/* </div> */}
                  </tbody>
                </Table>
              )}
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
