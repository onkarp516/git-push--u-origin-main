import React, { Component } from "react";

// import suyash from "@/assets/images/3x/suyash.jpg";
import suyash from "@/assets/images/suyash.jpg";
import cancel from "@/assets/images/3x/cancel.png";
import moment from "moment";
import {
  ShowNotification,
  customStyles,
  getSelectValue,
  MyNotifications,
  eventBus,
  isActionExist,
  MyDatePicker,
  numberWithCommasIN,
} from "@/helpers";
import { Button, Col, Row, Form, Table, Figure } from "react-bootstrap";

import { getTrasactionDetailsById } from "@/services/api_functions";
export default class StudentCopyData extends Component {
  constructor(props) {
    super(props);
    this.transFormRef = React.createRef();
    this.state = {
      isReqSent: false,
      receiptData: "",
      feesPaymentData: "",
      particularList: [],
      blankLength: "",
      isEditDataSet: false,
    };
  }

  getFeesData = () => {
    // let { receiptData } = this.state;
    if (this.state.receiptData != undefined) {
      this.setState({ isReqSent: true }, () => {
        let requestData = new FormData();
        requestData.append(
          "transactionId",
          this.state.receiptData.transactionId
        );
        requestData.append(
          "lastReceiptNo",
          this.state.receiptData.lastReceiptNo
        );
        console.log("fun call");
        getTrasactionDetailsById(requestData)
          .then((response) => {
            this.setState({
              isReqSent: false,
              isEditDataSet: true,
            });
            if (response.data.responseStatus === 200) {
              let res = response.data;

              console.log({ res });
              if (res.responseStatus === 200) {
                let len = res && res.particularList.length;
                let blen = 9 - len;

                console.log({ blen });

                let rows = [];
                for (var i = 0; i < blen; i++) {
                  rows.push(
                    <tr>
                      <td className="text-start td-style">&nbsp;</td>
                      <td className="text-center td-style">&nbsp;</td>
                    </tr>
                  );
                }

                this.setState({
                  isReqSent: false,
                  isEditDataSet: true,
                  feesPaymentData: res.responseObject,
                  particularList: res.particularList,
                  blankLength: rows,
                });
              }
            } else {
              this.setState({
                isReqSent: false,
                isEditDataSet: true,
              });
            }
          })
          .catch((error) => {
            this.setState({ isReqSent: false });
            console.log("errors", error);
          });
      });
    }
  };

  componentDidMount() {
    const { prop_data } = this.props.block;
    console.log("propData--->", prop_data);
    this.setState({ receiptData: prop_data });
  }

  componentDidUpdate() {
    let { isReqSent, receiptData, isEditDataSet } = this.state;
    console.log({ isReqSent, receiptData, isEditDataSet });
    if (receiptData != "" && isReqSent == false && isEditDataSet == false) {
      this.getFeesData();
    }
  }

  callPrint = () => {
    var newWin = window.frames["printf"];
    var divToPrint = document.getElementById("printDiv");
    let data = divToPrint.outerHTML;
    let htmlToPrint = '<body onload="window.print()">';
    htmlToPrint +=
      "<style>@media print {" +
      "body {" +
      "width: 100%;" +
      // "margin: 0;" +
      // "color: #ffffff;" +
      // "background-color: #000000;" +
      "font-size: 18px;" +
      "margin-top: 0px;" +
      "page-break-after: auto;" +
      "font-family: Calibri;" +
      "}" +
      ".data_body {" +
      // "padding: 10px" +
      "width: 47%;" +
      "display: inline-block;" +
      "font-size: 18px;" +
      "font-family: Calibri;" +
      "}" +
      ".border-style{" +
      "border-right: 1px dashed black;" +
      "margin-right: 10px" +
      "}" +
      ".p-style{" +
      "font-size: 10px;" +
      "margin: 0px;" +
      "}" +
      ".row-style{" +
      "display: flex;" +
      "}" +
      ".rec-style{" +
      "font-size: 12px;" +
      "text-align: start;" +
      "margin-left:2px;" +
      "margin:5px;" +
      "margin-bottom:11px;" +
      "line-height:5px;" +
      "}" +
      ".rec-style1{" +
      "font-size: 12px;" +
      "text-align: end;" +
      "margin-left:2px;" +
      "margin:5px;" +
      "margin-bottom:11px;" +
      "line-height:5px;" +
      "}" +
      ".word-style{" +
      "font-size: 11px;" +
      "}" +
      ".sign-style{" +
      "margin-left:5px;" +
      "font-size: 13px;" +
      "margin-top: 30px;" +
      "text-align: start;" +
      "}" +
      ".h3-style{" +
      "font-size: 16px;" +
      "margin: 0px;" +
      "}" +
      ".outlet-header {" +
      "margin-top: 0px;" +
      "text-transform: uppercase;" +
      "font-weight: bold;" +
      "margin-bottom: 0px;" +
      "font-size: 18px;" +
      "text-align: center;" +
      "font-family: Calibri;" +
      "}" +
      ".text-center {" +
      "text-align: center;" +
      "}" +
      ".text-end {" +
      "text-align: end;" +
      "}" +
      ".outlet-address {" +
      "word-wrap: break-word;" +
      "text-align: center;" +
      "font-style: italic;" +
      "font-weight: 500;" +
      "margin-bottom: 0;" +
      "font-size: 12px;" +
      "margin-top: 0px;" +
      "font-family: Calibri;" +
      "}" +
      ".printtop {" +
      "border-bottom: 1px solid #333;" +
      "}" +
      ".support {" +
      "text-align: center;" +
      "word-wrap: break-word;" +
      "font-weight: 500;" +
      "font-size: 12px;" +
      "margin-top: 0px;" +
      "margin-bottom: 0 !important;" +
      "font-family: Calibri;" +
      "}" +
      ".support1 {" +
      "font-size: 12px;" +
      // "text-align: center;" +
      "word-wrap: break-word;" +
      "margin-top: 2px;" +
      "margin-bottom: 0 !important;" +
      "font-family: Calibri;" +
      // font-family: Calibri;
      "}" +
      ".receipt-tbl {" +
      "width: 92.5%;" +
      "border-collapse: collapse;" +
      "font-size: 8px;" +
      ".tbody-style {" +
      "font-family: Calibri;" +
      "}" +
      "}" +
      ".th-style {" +
      // "font-weight: 500;" +
      "border-bottom: 1px solid #333;" +
      "border-top: 1px solid #333;" +
      "text-align:start;" +
      "width:70%;" +
      // "font-family: Calibri;" +
      "}" +
      ".td-style {" +
      "text-align:start;" +
      "border-right:1px solid #000;" +
      "border-left:1px solid #000;" +
      "border-bottom:1px solid #000;" +
      "font-size: 13px;" +
      "}" +
      ".amt-th-style {" +
      "text-align:center !important;" +
      "}" +
      ".amt-style {" +
      "text-align:center !important;" +
      // "text-align:end !important;" +
      "width:50px;" +
      "}" +
      "}</style>";
    htmlToPrint += data;
    htmlToPrint += "</body>";
    newWin.document.write(htmlToPrint);
    newWin.document.close();
  };
  render() {
    const { feesPaymentData, particularList, blankLength } = this.state;
    return (
      <>
        <Form autoComplete="off" className="form-style">
          <Button
            onClick={(e) => {
              e.preventDefault();
              this.callPrint();
            }}
          >
            Print
          </Button>
          <Button
            type="submit"
            className="submitbtn cancelbtn formbtn affiliated"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();

              eventBus.dispatch("page_change", "dailycollection");
            }}
          >
            Cancel
            <img src={cancel} alt="" className="btsubmit "></img>
          </Button>

          <iframe id="printf" name="printf" className="d-none"></iframe>
          <div id="printDiv" className="">
            {/* <div className="data_body"> */}
            <Row>
              {particularList && particularList.length > 0 ? (
                <>
                  <Col
                    lg="4"
                    className="data_body border-style"
                    style={{ marginLeft: "10px", marginBottom: "40px" }}
                  >
                    <div className="text-center">
                      <h3 className="h3-style">STUDENT COPY</h3>
                      <p className="p-style">DNYANESHWAR PRATISHTHAN,SOLAPUR</p>
                      <img
                        src={suyash}
                        style={{ width: "auto", height: "80px" }}
                      ></img>

                      <Row>
                        <Col>
                          <div
                            style={{
                              border: "1px solid",
                              marginBottom: "10px",
                              // margin: "10px",
                              width: "92%",
                            }}
                          >
                            <Row>
                              <Col md={12} className="d-flex row-style">
                                <p
                                  className="rec-style"
                                  style={{
                                    width: "300px",
                                    margin: "6px 0px 6px 5px",
                                  }}
                                >
                                  <b>Receipt No :</b>
                                  <b>
                                    {" "}
                                    {feesPaymentData &&
                                      feesPaymentData.receiptNo.toUpperCase()}
                                  </b>
                                </p>
                                <p
                                  className="rec-style1"
                                  style={{
                                    width: "160px",
                                    margin: "6px 2px 6px 0px",
                                  }}
                                >
                                  <b>Date : </b>
                                  {feesPaymentData &&
                                    moment(
                                      feesPaymentData.transactionDate
                                    ).format("DD-MMM-YYYY")}
                                </p>
                              </Col>

                              <Col md={12}>
                                <p className="rec-style">
                                  <b>
                                    Name :&nbsp;
                                    <span
                                      className="ms-2"
                                    // style={{ letterSpacing: "2px" }}
                                    >
                                      {feesPaymentData &&
                                        feesPaymentData.studentName.toUpperCase()}{" "}
                                    </span>
                                  </b>
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  <b>School Name : </b>
                                  <span className="ms-2">
                                    {" "}
                                    {feesPaymentData &&
                                      feesPaymentData.schoolName.toUpperCase()}
                                  </span>
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  <b>Std : </b>
                                  <span className="ms-2">
                                    {feesPaymentData &&
                                      feesPaymentData.standard.toUpperCase()}
                                  </span>
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                      <Table
                        // style={{ border: "1px solid black" }}
                        className="receipt-tbl"
                        style={
                          {
                            // margin: "10px",
                          }
                        }
                      >
                        <tbody className="tbody-style">
                          <tr>
                            <th className="text-start td-style th-style">
                              <b>PARTICULARS</b>
                            </th>
                            <th className="amt-th-style td-style th-style">
                              <b>AMOUNT</b>
                            </th>
                          </tr>
                          {/* {JSON.stringify(particularList)} */}
                          {particularList != "" &&
                            particularList.map((v) => {
                              return (
                                <tr>
                                  <td className="text-start td-style">
                                    {v.particular.toUpperCase()}
                                  </td>
                                  <td className="text-center td-style amt-style">
                                    {numberWithCommasIN(v.paidAmount, true, 2)}
                                  </td>
                                </tr>
                              );
                            })}

                          {blankLength}
                          {/* {Array.from(Array(9), (v) => {
                        return (
                          <tr>
                            <td className="text-start td-style">FEE HEAD</td>
                            <td className="text-center td-style amt-style">
                              {parseFloat("100000").toFixed(2)}
                            </td>
                          </tr>
                        );
                      })} */}

                          <tr>
                            <td className="text-start td-style">
                              <b>GRAND TOTAL</b>
                            </td>
                            <td className="td-style amt-style">
                              <b>
                                {" "}
                                {numberWithCommasIN(
                                  feesPaymentData && feesPaymentData.paidAmount,
                                  true,
                                  2
                                )}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b>
                                {" "}
                                IN WORDS :{" "}
                                <span className="word-style">
                                  {feesPaymentData && feesPaymentData.inword}
                                  ONLY
                                </span>
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b>
                                {feesPaymentData && feesPaymentData.paymentMode}
                                {feesPaymentData &&
                                  feesPaymentData.paymentNo != null
                                  ? " : " + feesPaymentData.paymentNo
                                  : ""}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <Row>
                        {/* <Col md={12}>
                      <p className="rec-style">
                        <b>
                          {feesPaymentData && feesPaymentData.paymentMode} -{" "}
                          {feesPaymentData && feesPaymentData.paymentNo}
                        </b>
                      </p>
                    </Col> */}
                        <Col md={6}>
                          <p className="sign-style">
                            Accountant{" "}
                            <span style={{ marginLeft: "160px" }}></span>{" "}
                            Depositor's Sign
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col
                    lg="4"
                    className="data_body"
                    style={{ marginLeft: "10px", marginBottom: "40px" }}
                  >
                    <div className="text-center">
                      <h3 className="h3-style">SCHOOL COPY</h3>
                      <p className="p-style">DNYANESHWAR PRATISHTHAN,SOLAPUR</p>
                      <img
                        src={suyash}
                        style={{ width: "auto", height: "80px" }}
                      ></img>

                      <Row>
                        <Col>
                          <div
                            style={{
                              border: "1px solid",
                              marginBottom: "10px",
                              // margin: "10px",
                              width: "92%",
                            }}
                          >
                            <Row>
                              {/* <Col md={12}>
                            <p className="rec-style" style={{ width: "350px" }}>
                              <b>Receipt No : </b>
                              {feesPaymentData &&
                                feesPaymentData.receiptNo.toUpperCase()}
                              <span style={{ marginLeft: "15px" }}></span>
                              <b>Date : </b>
                              {feesPaymentData &&
                                moment(feesPaymentData.transactionDate).format(
                                  "DD-MMM-YYYY"
                                )}
                            </p>
                          </Col> */}
                              <Col md={12} className="d-flex row-style">
                                <p
                                  className="rec-style"
                                  style={{
                                    width: "300px",
                                    margin: "6px 0px 6px 5px",
                                  }}
                                >
                                  <b>Receipt No :</b>
                                  <b>
                                    {" "}
                                    {feesPaymentData &&
                                      feesPaymentData.receiptNo.toUpperCase()}
                                  </b>
                                  {/* <span style={{ marginLeft: "15px" }}></span>
                              <b>Date : </b>
                              {feesPaymentData &&
                                moment(feesPaymentData.transactionDate).format(
                                  "DD-MMM-YYYY"
                                )} */}
                                </p>
                                <p
                                  className="rec-style1"
                                  style={{
                                    width: "160px",
                                    margin: "6px 2px 6px 0px",
                                  }}
                                >
                                  <b>Date : </b>
                                  {feesPaymentData &&
                                    moment(
                                      feesPaymentData.transactionDate
                                    ).format("DD-MMM-YYYY")}
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  <b>
                                    Name :&nbsp;
                                    <span
                                      className="ms-2"
                                    // style={{ letterSpacing: "2px" }}
                                    >
                                      {feesPaymentData &&
                                        feesPaymentData.studentName.toUpperCase()}{" "}
                                    </span>
                                  </b>
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  <b>School Name : </b>
                                  <span className="ms-2">
                                    {" "}
                                    {feesPaymentData &&
                                      feesPaymentData.schoolName.toUpperCase()}
                                  </span>
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  <b>Std : </b>
                                  <span className="ms-2">
                                    {feesPaymentData &&
                                      feesPaymentData.standard.toUpperCase()}
                                  </span>
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                      <Table
                        // style={{ border: "1px solid black" }}
                        className="receipt-tbl"
                        style={
                          {
                            // margin: "10px",
                          }
                        }
                      >
                        <tbody className="tbody-style">
                          <tr>
                            <th className="text-start td-style th-style">
                              <b>PARTICULARS</b>
                            </th>
                            <th className="amt-th-style td-style th-style">
                              <b>AMOUNT</b>
                            </th>
                          </tr>
                          {/* {JSON.stringify(particularList)} */}
                          {particularList != "" &&
                            particularList.map((v) => {
                              return (
                                <tr>
                                  <td className="text-start td-style">
                                    {v.particular.toUpperCase()}
                                  </td>
                                  <td className="text-center td-style amt-style">
                                    {numberWithCommasIN(v.paidAmount, true, 2)}
                                  </td>
                                </tr>
                              );
                            })}

                          {blankLength}

                          <tr>
                            <td className="text-start td-style">
                              <b>GRAND TOTAL</b>
                            </td>
                            <td className="td-style amt-style">
                              <b>
                                {" "}
                                {numberWithCommasIN(
                                  feesPaymentData && feesPaymentData.paidAmount,
                                  true,
                                  2
                                )}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b>
                                {" "}
                                IN WORDS:{" "}
                                <span className="word-style">
                                  {feesPaymentData && feesPaymentData.inword}
                                  ONLY
                                </span>
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b>
                                {feesPaymentData && feesPaymentData.paymentMode}
                                {feesPaymentData &&
                                  feesPaymentData.paymentNo != null
                                  ? " : " + feesPaymentData.paymentNo
                                  : ""}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <Row>
                        {/* <Col md={12}>
                      <p className="rec-style">
                        <b>
                          {feesPaymentData && feesPaymentData.paymentMode} -{" "}
                          {feesPaymentData && feesPaymentData.paymentNo}
                        </b>
                      </p>
                    </Col> */}
                        <Col md={6}>
                          <p className="sign-style">
                            Accountant{" "}
                            <span style={{ marginLeft: "160px" }}></span>{" "}
                            Depositor's Sign
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </>
              ) : (
                ""
              )}

              {/* 2 HOSTEL COPIES */}
              {feesPaymentData && feesPaymentData.Hostel != "" && (
                <>
                  <Col
                    lg="4"
                    className="data_body border-style"
                    style={{ marginLeft: "10px" }}
                  >
                    <div className="text-center">
                      <h3 className="h3-style">STUDENT COPY</h3>
                      <p className="p-style">DNYANESHWAR PRATISHTHAN,SOLAPUR</p>
                      <img
                        src={suyash}
                        style={{ width: "auto", height: "80px" }}
                      ></img>

                      <Row>
                        <Col>
                          <div
                            style={{
                              border: "1px solid",
                              marginBottom: "10px",
                              // margin: "10px",
                              width: "92%",
                            }}
                          >
                            <Row>
                              {/* <Col md={12}>
                                <p
                                  className="rec-style"
                                  style={{ width: "350px" }}
                                >
                                  <b>Receipt No : </b>
                                  {feesPaymentData &&
                                    feesPaymentData.receiptNo.toUpperCase()}
                                  <span style={{ marginLeft: "15px" }}></span>
                                  <b>Date : </b>
                                  {feesPaymentData &&
                                    moment(
                                      feesPaymentData.transactionDate
                                    ).format("DD-MMM-YYYY")}
                                </p>
                              </Col> */}
                              <Col md={12} className="d-flex row-style">
                                <p
                                  className="rec-style"
                                  style={{
                                    width: "300px",
                                    margin: "6px 0px 6px 5px",
                                  }}
                                >
                                  <b>Receipt No :</b>
                                  {feesPaymentData &&
                                    feesPaymentData.receiptNo.toUpperCase()}
                                  {/* <span style={{ marginLeft: "15px" }}></span>
                              <b>Date : </b>
                              {feesPaymentData &&
                                moment(feesPaymentData.transactionDate).format(
                                  "DD-MMM-YYYY"
                                )} */}
                                </p>
                                <p
                                  className="rec-style1"
                                  style={{
                                    width: "160px",
                                    margin: "6px 2px 6px 0px",
                                  }}
                                >
                                  <b>Date : </b>
                                  {feesPaymentData &&
                                    moment(
                                      feesPaymentData.transactionDate
                                    ).format("DD-MMM-YYYY")}
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  <b>
                                    Name :&nbsp;
                                    <span
                                      className="ms-2"
                                    // style={{ letterSpacing: "2px" }}
                                    >
                                      {feesPaymentData &&
                                        feesPaymentData.studentName.toUpperCase()}{" "}
                                    </span>
                                  </b>
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  <b>School Name : </b>
                                  <span className="ms-2">
                                    {" "}
                                    {feesPaymentData &&
                                      feesPaymentData.hostelBranch.toUpperCase()}
                                  </span>
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  <b>Std : </b>
                                  <span className="ms-2">
                                    {feesPaymentData &&
                                      feesPaymentData.standard.toUpperCase()}
                                  </span>
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                      <Table
                        // style={{ border: "1px solid black" }}
                        className="receipt-tbl"
                        style={
                          {
                            // margin: "10px",
                          }
                        }
                      >
                        <tbody className="tbody-style">
                          <tr>
                            <th className="text-start td-style th-style">
                              <b>PARTICULARS</b>
                            </th>
                            <th className="amt-th-style td-style th-style">
                              <b>AMOUNT</b>
                            </th>
                          </tr>
                          <tr>
                            <td className="text-start td-style">
                              {" "}
                              {feesPaymentData &&
                                feesPaymentData.Hostel.toUpperCase()}
                            </td>
                            <td className="text-center td-style amt-style">
                              {feesPaymentData &&
                                numberWithCommasIN(
                                  feesPaymentData.hostelamount,
                                  true,
                                  2
                                )}
                            </td>
                          </tr>

                          {Array.from(Array(8), (v) => {
                            return (
                              <tr>
                                <td className="text-start td-style">&nbsp;</td>
                                <td className="text-center td-style amt-style">
                                  &nbsp;
                                </td>
                              </tr>
                            );
                          })}

                          <tr>
                            <td className="text-start td-style">
                              <b>GRAND TOTAL</b>
                            </td>
                            <td className="td-style amt-style">
                              <b>
                                {" "}
                                {feesPaymentData &&
                                  numberWithCommasIN(
                                    feesPaymentData.hostelamount,
                                    true,
                                    2
                                  )}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b>
                                {" "}
                                IN WORDS:{" "}
                                <span className="word-style">
                                  {feesPaymentData &&
                                    feesPaymentData.HostelFeeinword}
                                  ONLY
                                </span>
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b>
                                {feesPaymentData && feesPaymentData.paymentMode}
                                {feesPaymentData &&
                                  feesPaymentData.paymentNo != null
                                  ? " : " + feesPaymentData.paymentNo
                                  : ""}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <Row>
                        {/* <Col md={12}>
                          <p className="rec-style">
                            <b>
                              {feesPaymentData && feesPaymentData.paymentMode} -{" "}
                              {feesPaymentData && feesPaymentData.paymentNo}
                            </b>
                          </p>
                        </Col> */}
                        <Col md={6}>
                          <p className="sign-style">
                            Accountant{" "}
                            <span style={{ marginLeft: "160px" }}></span>{" "}
                            Depositor's Sign
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col
                    lg="4"
                    className="data_body"
                    style={{ marginLeft: "10px" }}
                  >
                    <div className="text-center">
                      <h3 className="h3-style">SCHOOL COPY</h3>
                      <p className="p-style">DNYANESHWAR PRATISHTHAN,SOLAPUR</p>
                      <img
                        src={suyash}
                        style={{ width: "auto", height: "80px" }}
                      ></img>

                      <Row>
                        <Col>
                          <div
                            style={{
                              border: "1px solid",
                              marginBottom: "10px",
                              // margin: "10px",
                              width: "92%",
                            }}
                          >
                            <Row>
                              {/* <Col md={12}>
                                <p
                                  className="rec-style"
                                  style={{ width: "350px" }}
                                >
                                  <b>Receipt No : </b>
                                  {feesPaymentData &&
                                    feesPaymentData.receiptNo.toUpperCase()}
                                  <span style={{ marginLeft: "15px" }}></span>
                                  <b>Date : </b>
                                  {feesPaymentData &&
                                    moment(
                                      feesPaymentData.transactionDate
                                    ).format("DD-MMM-YYYY")}
                                </p>
                              </Col> */}
                              <Col md={12} className="d-flex row-style">
                                <p
                                  className="rec-style"
                                  style={{
                                    width: "300px",
                                    margin: "6px 0px 6px 5px",
                                  }}
                                >
                                  <b>Receipt No :</b>
                                  {feesPaymentData &&
                                    feesPaymentData.receiptNo.toUpperCase()}
                                  {/* <span style={{ marginLeft: "15px" }}></span>
                              <b>Date : </b>
                              {feesPaymentData &&
                                moment(feesPaymentData.transactionDate).format(
                                  "DD-MMM-YYYY"
                                )} */}
                                </p>
                                <p
                                  className="rec-style1"
                                  style={{
                                    width: "160px",
                                    margin: "6px 2px 6px 0px",
                                  }}
                                >
                                  <b>Date : </b>
                                  {feesPaymentData &&
                                    moment(
                                      feesPaymentData.transactionDate
                                    ).format("DD-MMM-YYYY")}
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  <b>
                                    Name :&nbsp;
                                    <span
                                      className="ms-2"
                                    // style={{ letterSpacing: "2px" }}
                                    >
                                      {feesPaymentData &&
                                        feesPaymentData.studentName.toUpperCase()}{" "}
                                    </span>
                                  </b>
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  <b>School Name : </b>
                                  <span className="ms-2">
                                    {" "}
                                    {feesPaymentData &&
                                      feesPaymentData.hostelBranch.toUpperCase()}
                                  </span>
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  <b>Std : </b>
                                  <span className="ms-2">
                                    {feesPaymentData &&
                                      feesPaymentData.standard.toUpperCase()}
                                  </span>
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                      <Table
                        // style={{ border: "1px solid black" }}
                        className="receipt-tbl"
                        style={
                          {
                            // margin: "10px",
                          }
                        }
                      >
                        <tbody className="tbody-style">
                          <tr>
                            <th className="text-start td-style th-style">
                              <b>PARTICULARS</b>
                            </th>
                            <th className="amt-th-style td-style th-style">
                              <b>AMOUNT</b>
                            </th>
                          </tr>

                          <tr>
                            <td className="text-start td-style">
                              {" "}
                              {feesPaymentData &&
                                feesPaymentData.Hostel.toUpperCase()}
                            </td>
                            <td className="text-center td-style amt-style">
                              {feesPaymentData &&
                                numberWithCommasIN(
                                  feesPaymentData.hostelamount,
                                  true,
                                  2
                                )}
                            </td>
                          </tr>

                          {Array.from(Array(8), (v) => {
                            return (
                              <tr>
                                <td className="text-start td-style">&nbsp;</td>
                                <td className="text-center td-style amt-style">
                                  &nbsp;
                                </td>
                              </tr>
                            );
                          })}

                          <tr>
                            <td className="text-start td-style">
                              <b>GRAND TOTAL</b>
                            </td>
                            <td className="td-style amt-style">
                              <b>
                                {" "}
                                {feesPaymentData &&
                                  numberWithCommasIN(
                                    feesPaymentData.hostelamount,
                                    true,
                                    2
                                  )}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b>
                                {" "}
                                IN WORDS:{" "}
                                <span className="word-style">
                                  {feesPaymentData &&
                                    feesPaymentData.HostelFeeinword}
                                  ONLY
                                </span>
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b>
                                {feesPaymentData && feesPaymentData.paymentMode}
                                {feesPaymentData &&
                                  feesPaymentData.paymentNo != null
                                  ? " : " + feesPaymentData.paymentNo
                                  : ""}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <Row>
                        {/* <Col md={12}>
                          <p className="rec-style">
                            <b>
                              {feesPaymentData && feesPaymentData.paymentMode} -{" "}
                              {feesPaymentData && feesPaymentData.paymentNo}
                            </b>
                          </p>
                        </Col> */}
                        <Col md={6}>
                          <p className="sign-style">
                            Accountant{" "}
                            <span style={{ marginLeft: "160px" }}></span>{" "}
                            Depositor's Sign
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </>
              )}
            </Row>
            {/* </div> */}
          </div>
        </Form>
      </>
    );
  }
}
