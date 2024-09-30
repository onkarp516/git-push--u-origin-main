import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  ButtonGroup,
  FormControl,
  Table,
} from "react-bootstrap";
import { Formik } from "formik";

import Select from "react-select";
import * as Yup from "yup";
//import "./css/purchace.scss";
import cancel from "@/assets/images/3x/cancel.png";
import view_icon_3 from "@/assets/images/3x/view_icon_3.svg";
import delete_ from "@/assets/images/3x/delete_.png";
import { getLedgersDetails, deleteJournalMaster } from "@/services/api_functions";
import moment from "moment";
import {
  getRandomIntInclusive,
  AuthenticationCheck,
  MyDatePicker,
  eventBus,
  MyNotifications,

  numberWithCommasIN,
} from "@/helpers";

const taxOpt = [
  { value: "central_tax", label: "Central Tax" },
  { value: "state_tax", label: "State Tax" },
  { value: "integrated_tax", label: "Integrated Tax" },
];

export default class LedgerEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      principleList: [],
      undervalue: [],
      balancingOpt: [],
      stateOpt: [],
      countryOpt: [],
      edit_data: "",
      GSTTypeOpt: [],
      opbranchList: [],

      gstList: [],
      deptList: [],
      shippingList: [],
      billingList: [],

      removeGstList: [],
      removeDeptList: [],
      removeShippingList: [],
      removeBillingList: [],
      lstLedgerList: [],

      initVal: {
        id: "",
        ledger_name: "",
        underId: "",
        supplier_code: getRandomIntInclusive(1, 1000),
        opening_balance: 0,
        is_private: "false",
      },
      isEditDataSet: false,
      ledgerName: "",
      openingBal: "",
    };
  }
  getCreditTotalAmount = () => {
    let { lstLedgerList } = this.state;
    let creditamt = 0;
    lstLedgerList.map((v) => {
      creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
    });

    return isNaN(creditamt) ? 0 : numberWithCommasIN(creditamt, true, 2);
  };
  getDebitTotalAmount = () => {
    let { lstLedgerList } = this.state;
    let debitamt = 0;
    lstLedgerList.map((v) => {
      debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
    });

    return isNaN(debitamt) ? 0 : numberWithCommasIN(debitamt, true, 2);
  };

  getClosingBal = () => {
    // debugger;
    let { openingBal, edit_data, lstLedgerList } = this.state;
    // let debitamt = this.getDebitTotalAmount();
    // let creditamt = this.getCreditTotalAmount();

    let debitamt = 0;
    lstLedgerList.map((v) => {
      debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
    });
    let creditamt = 0;
    lstLedgerList.map((v) => {
      creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
    });

    let closeamt = 0;
    if (edit_data.cr > 0)
      closeamt =
        parseFloat(openingBal) + parseFloat(creditamt) - parseFloat(debitamt);

    if (edit_data.dr > 0)
      closeamt =
        parseFloat(openingBal) + parseFloat(debitamt) - parseFloat(creditamt);

    console.log({ closeamt });

    closeamt = Math.abs(closeamt);

    return numberWithCommasIN(closeamt, true, 2);
  };
  DeleteNoFun = (voucher_id) => {
    console.log({ voucher_id });
  };

  lstLedgerDetails = (prop_data) => {
    let requestData = new FormData();
    requestData.append("id", prop_data.ledgerId);
    this.setState({ ledgerName: prop_data.ledger_name });
    console.log("propdata called->", prop_data);
    getLedgersDetails(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ lstLedgerList: res.data, openingBal: res.opening });
          console.log("lstledgerList", this.state.lstLedgerList);
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ lstLedgerList: [] });
      });
  };

  deleteJournalMaster = (voucher_id) => {
    let requestData = new FormData();
    requestData.append("jvMasterId", voucher_id);
    deleteJournalMaster(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          MyNotifications.fire(
            {
              show: true,
              icon: "success",
              title: "Success",
              msg: "Deleted Journal Record SuccessFully !",
              is_timeout: true,
              delay: 1000,
            });

        }

        this.componentDidMount();
      })
      .catch((error) => {
        console.log("error", error);
      });

  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      const { prop_data } = this.props.block;
      console.log({ prop_data });
      this.setState({ edit_data: prop_data });
      this.lstLedgerDetails(prop_data);
    }
  }

  // componentDidUpdate() {
  //   const {
  //     undervalue,
  //     balancingOpt,
  //     stateOpt,
  //     countryOpt,
  //     GSTTypeOpt,
  //     edit_data,
  //     isEditDataSet,
  //   } = this.state;

  //   if (
  //     undervalue.length > 0 &&
  //     balancingOpt.length > 0 &&
  //     stateOpt.length > 0 &&
  //     countryOpt.length > 0 &&
  //     GSTTypeOpt.length > 0 &&
  //     isEditDataSet == false &&
  //     edit_data != ""
  //   ) {
  //     console.log("componentDidUpdate call");
  //     this.getLedgerDetails();
  //   }
  // }

  render() {
    const { lstLedgerList, ledgerName, openingBal, edit_data } = this.state;
    const validate = (values) => {
      const errors = {};

      if (!values.ledger_name) {
        errors.ledger_name = "Ledger name is required";
      }

      return errors;
    };
    return (
      <div className="company-from">
        {/* <h6>Purchase Invoice</h6> */}
        {/* {JSON.stringify(edit_data)} */}

        <div className="d-bg i-bg">
          <div className="wrapper_div">
            <div className="cust_table">
              {/* <h4 className="form-header text-center">Company Name</h4> */}

              <div className="ledger-header mb-0">
                <Row className="">
                  <Col md="4">
                    <Form.Group
                      as={Row}
                      className=""
                      controlId="formHorizontalEmail"
                    >
                      <Form.Label column sm={2}>
                        Ledger:
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Label className="text-start p-2">
                          {ledgerName}
                        </Form.Label>

                        {/* {edit_data.cr}
                        <br />
                        {edit_data.dr} */}
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col md="3"></Col>
                  <Col md="4">
                    <InputGroup className="mb-3 justify-content-end">
                      <MyDatePicker
                        // placeholderText="DD/MM/YYYY"
                        id="bill_dt"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="FROM DATE"
                        className="newdate text_center mt-1"
                      />
                      <InputGroup.Text id="basic-addon2" className=" mt-1">
                        <i class="fa fa-arrow-right" aria-hidden="true"></i>
                      </InputGroup.Text>
                      <MyDatePicker
                        // placeholderText="DD/MM/YYYY"
                        id="bill_dt"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="TO DATE"
                        className="newdate text_center mt-1"
                      />
                    </InputGroup>
                  </Col>
                  <Col md="1">
                    <div className="">
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", {
                            from: "ledgerdetails",
                            to: "ledgerlist",
                            isNewTab: false,
                          });
                        }}
                        className="submitbtn cancelbtn formbtn affiliated"
                        variant="secondary"
                      >
                        Cancel
                        <img src={cancel} alt="" className="btsubmit "></img>
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>

              <>
                <div
                  className="ledgerstyle table_wrapper denomination-style"
                  style={{ overflowY: "hidden" }}
                >
                  <Table hover size="sm" className="tbl-font">
                    <thead style={{ borderBottom: "1px solid transparent" }}>
                      <tr>
                        <th style={{ width: "10%" }}>Date</th>
                        <th style={{ width: "10%" }}>Voucher No</th>
                        <th style={{ width: "10%" }}>Voucher Type</th>
                        <th style={{ width: "49%" }}>Particulars</th>

                        <th style={{ width: "7%" }}>Debit</th>
                        <th style={{ width: "7%" }}>Credit</th>
                        <th style={{ width: "7%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: "2px solid transparent" }}>
                      {/* {JSON.stringify(lstLedgerList)} */}
                      {lstLedgerList.length > 0 ? (
                        lstLedgerList.map((v, i) => {
                          return (
                            <tr className="cursur_pointer">
                              <td
                                style={{
                                  width: "10%",
                                  borderBottom: "1px solid #dee2e6",
                                }}
                              >
                                {moment(v.invoice_date).format("DD-MM-yyyy")}
                              </td>
                              <td
                                style={{
                                  width: "10%",
                                  borderBottom: "1px solid #dee2e6",
                                }}
                              >
                                {v.voucher_no}
                              </td>
                              <td
                                style={{
                                  width: "10%",
                                  borderBottom: "1px solid #dee2e6",
                                }}
                              >
                                {v.voucher_type.charAt(0).toUpperCase() +
                                  v.voucher_type.slice(1)}
                              </td>
                              <td
                                style={{
                                  width: "49%",
                                  borderBottom: "1px solid #dee2e6",
                                }}
                              >
                                {v.particulars}
                              </td>
                              <td
                                style={{
                                  width: "7%",
                                  borderBottom: "1px solid #dee2e6",
                                }}
                              >
                                {numberWithCommasIN(v.debit, true, 2)}
                              </td>
                              <td
                                style={{
                                  width: "7%",
                                  borderBottom: "1px solid #dee2e6",
                                }}
                              >
                                {numberWithCommasIN(v.credit, true, 2)}
                              </td>
                              <td
                                style={{
                                  width: "7%",
                                  borderBottom: "1px solid #dee2e6",
                                }}
                              >
                                {" "}
                                <img
                                  onClick={(e) => {
                                    // if (isActionExist("ledger-list", "view"))
                                    {
                                      // this.setUpdateValue(v.id);
                                      let prop_data = {
                                        transaction_id: v.transaction_id,
                                        voucher_id: v.voucher_id,
                                        voucher_no: v.voucher_no,
                                        invoice_date: v.invoice_date,
                                        narration: v.narration,

                                        mainPropData: edit_data,
                                      };
                                      eventBus.dispatch("page_change", {
                                        from: "ledgerdetails",
                                        to: "ledgervoucherdetails",
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
                                  src={view_icon_3}
                                  title="View"
                                />
                                &nbsp; &nbsp;
                                {v.voucher_type == "journal" &&
                                  v.feeReceiptNo == undefined && (
                                    <a
                                      href="#."
                                      onClick={(e) => {
                                        e.preventDefault();
                                        console.log("delete Clicked");
                                        MyNotifications.fire({
                                          show: true,
                                          msg: "Are you sure want to Delete ?",
                                          icon: "confirm",
                                          title: "confirm",
                                          is_button_show: true,

                                          handleFn: () => {
                                            this.deleteJournalMaster(v.voucher_id);

                                          },
                                          handleFailureFn: () => {
                                            this.DeleteNoFun(
                                              v.voucher_id
                                            );
                                          },

                                        });

                                      }}
                                    >

                                      <img
                                        src={delete_}
                                        title=""
                                        className="marico"
                                      />
                                      {v.feeReceiptNo}
                                    </a>
                                  )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">
                            No Data Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {lstLedgerList.length > 0 && (
                      <tfoot>
                        <tr
                          className="fourbtnfeestrans"
                          style={{ borderBottom: "1px solid transparent" }}
                        >
                          <td
                            style={{
                              width: "79%",
                              textAlign: "end",
                              borderTop: "1px solid #dee2e6",
                            }}
                          >
                            Opening Balance:
                          </td>
                          <td
                            style={{
                              width: "7%",
                              borderTop: "1px solid #dee2e6",
                            }}
                            className="ms-5"
                          >
                            <b>{openingBal}</b>
                          </td>
                          <td
                            style={{
                              width: "7%",
                              borderTop: "1px solid #dee2e6",
                            }}
                          ></td>
                          <td
                            style={{
                              width: "7%",
                              borderTop: "1px solid #dee2e6",
                            }}
                          ></td>
                        </tr>
                        <tr className="fourbtnfeestrans">
                          <td style={{ width: "79%", textAlign: "end" }}>
                            Current Total:
                          </td>
                          <td style={{ width: "7%" }}>
                            <b>{this.getDebitTotalAmount()}</b>
                          </td>
                          <td style={{ width: "7%" }}>
                            <b>{this.getCreditTotalAmount()}</b>
                          </td>
                          <td style={{ width: "7%" }}></td>
                        </tr>
                        <tr className="fourbtnfeestrans">
                          <td
                            style={{
                              width: "79%",
                              textAlign: "end",
                              borderTop: "1px solid #dee2e6",
                            }}
                          >
                            <b>Closing Balance:</b>
                          </td>
                          <td
                            style={{
                              width: "7%",
                              borderTop: "1px solid #dee2e6",
                            }}
                          >
                            <b>{edit_data.dr > 0 ? this.getClosingBal() : 0}</b>
                          </td>
                          <td
                            style={{
                              width: "7%",
                              borderTop: "1px solid #dee2e6",
                            }}
                          >
                            <b>{edit_data.cr > 0 ? this.getClosingBal() : 0}</b>
                          </td>
                          <td
                            style={{
                              width: "7%",
                              borderTop: "1px solid #dee2e6",
                            }}
                          ></td>
                        </tr>
                      </tfoot>
                    )}
                  </Table>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
