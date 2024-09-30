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
} from "@/helpers";
import { Button, Col, Row, Form, Table, Figure } from "react-bootstrap";

import { getTrasactionDetailsById } from "@/services/api_functions";
export default class StudentCopy extends Component {
  constructor(props) {
    super(props);
    this.transFormRef = React.createRef();
    this.state = {
      feesPaymentData: "",
      particularList: [],
      blankLength: "",
    };
  }

  getFeesData = (prop_data) => {
    let requestData = new FormData();
    requestData.append("transactionId", prop_data.transactionId);
    requestData.append("lastReceiptNo", prop_data.lastReceiptNo);
    console.log("fun call");
    getTrasactionDetailsById(requestData)
      .then((response) => {
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
              feesPaymentData: res.responseObject,
              particularList: res.particularList,
              blankLength: rows,
            });
          }
        }
      })
      .catch((error) => {
        console.log("errors", error);
      });
  };

  componentDidMount() {
    const { prop_data } = this.props.block;
    console.log("propData--->", prop_data);
    this.getFeesData(prop_data);
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
      "border-right:1px solid transparent;" +
      "border-left:1px solid transparent;" +
      "border-bottom:1px solid transparent;" +
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
      ".display {" +
      "display:none !important;" +
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

              eventBus.dispatch("page_change", {
                to: "dailycollection",
                from: "studentcopy",
                isNewTab: false,
              });
            }}
          >
            Cancel
            <img src={cancel} alt="" className="btsubmit "></img>
          </Button>

          <iframe id="printf" name="printf" className="d-none"></iframe>
          <div id="printDiv" className="">
            {/* <div className="data_body"> */}
            <Row>
              {particularList && particularList.length > 0 && (
                <>
                  <Col
                    lg="4"
                    className="data_body"
                    style={{ marginLeft: "10px", marginBottom: "40px" }}
                  >
                    <div className="text-center" style={{ marginTop: "120px" }}>
                      {/* <h3 className="h3-style">STUDENT COPY</h3>
                  <p className="p-style">DNYANESHWAR PRATISHTHAN,SOLAPUR</p>
                  <img
                    src={suyash}
                    style={{ width: "auto", height: "80px" }}
                  ></img> */}

                      <Row>
                        <Col>
                          <div
                            style={{
                              border: "1px solid transparent",
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
                                  {/* <b className="display">Receipt No :</b> */}
                                  <b style={{ marginLeft: "70px" }}>
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
                                  {/* <b className="display">Date : </b> */}
                                  {feesPaymentData &&
                                    moment(
                                      feesPaymentData.transactionDate
                                    ).format("DD-MMM-YYYY")}
                                </p>
                              </Col>

                              <Col md={12}>
                                <p className="rec-style">
                                  <b>
                                    {/* <span className="display">Name :&nbsp;</span> */}

                                    <span
                                      style={{ marginLeft: "50px" }}
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
                                  {/* <b className="display">School Name : </b> */}
                                  <span
                                    className="ms-2"
                                    style={{ marginLeft: "90px" }}
                                  >
                                    {" "}
                                    {/* {feesPaymentData &&
                                  feesPaymentData.schoolName.toUpperCase()} */}
                                  </span>
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  {/* <b className="display">Std : </b> */}
                                  <span
                                    className="ms-2"
                                    style={{ marginLeft: "30px" }}
                                  >
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
                        style={{
                          marginTop: "41px",
                        }}
                      >
                        <tbody className="tbody-style">
                          {/* <tr>
                        <th className="text-start td-style th-style">
                          <b>PARTICULARS</b>
                        </th>
                        <th className="amt-th-style td-style th-style">
                          <b>AMOUNT</b>
                        </th>
                      </tr> */}
                          {/* {JSON.stringify(particularList)} */}
                          {particularList != "" &&
                            particularList.map((v) => {
                              return (
                                <tr>
                                  <td className="text-start td-style">
                                    {v.particular.toUpperCase()}
                                  </td>
                                  <td className="text-center td-style amt-style">
                                    {parseFloat(v.paidAmount).toFixed(2)}
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
                              {/* <b>GRAND TOTAL</b> */}
                            </td>
                            <td className="td-style amt-style">
                              <b>
                                {" "}
                                {parseFloat(
                                  feesPaymentData && feesPaymentData.paidAmount
                                ).toFixed(2)}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b>
                                {" "}
                                {/* IN WORDS :{" "} */}
                                <span
                                  className="word-style"
                                  style={{ marginLeft: "90px" }}
                                >
                                  {feesPaymentData && feesPaymentData.inword}
                                  ONLY
                                </span>
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b style={{ marginLeft: "77px" }}>
                                {feesPaymentData &&
                                feesPaymentData.paymentNo != null
                                  ? feesPaymentData.paymentNo
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
                            &nbsp; <span style={{ marginLeft: "160px" }}></span>{" "}
                            &nbsp;
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
                    <div className="text-center" style={{ marginTop: "120px" }}>
                      {/* <h3 className="h3-style">STUDENT COPY</h3>
                  <p className="p-style">DNYANESHWAR PRATISHTHAN,SOLAPUR</p>
                  <img
                    src={suyash}
                    style={{ width: "auto", height: "80px" }}
                  ></img> */}

                      <Row>
                        <Col>
                          <div
                            style={{
                              border: "1px solid transparent",
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
                                  {/* <b className="display">Receipt No :</b> */}
                                  <b style={{ marginLeft: "70px" }}>
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
                                  {/* <b className="display">Date : </b> */}
                                  {feesPaymentData &&
                                    moment(
                                      feesPaymentData.transactionDate
                                    ).format("DD-MMM-YYYY")}
                                </p>
                              </Col>

                              <Col md={12}>
                                <p className="rec-style">
                                  <b>
                                    {/* <span className="display">Name :&nbsp;</span> */}

                                    <span
                                      style={{ marginLeft: "50px" }}
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
                                  {/* <b className="display">School Name : </b> */}
                                  <span
                                    className="ms-2"
                                    style={{ marginLeft: "90px" }}
                                  >
                                    {" "}
                                    {/* {feesPaymentData &&
                                  feesPaymentData.schoolName.toUpperCase()} */}
                                  </span>
                                </p>
                              </Col>
                              <Col md={12}>
                                <p className="rec-style">
                                  {/* <b className="display">Std : </b> */}
                                  <span
                                    className="ms-2"
                                    style={{ marginLeft: "30px" }}
                                  >
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
                        style={{
                          marginTop: "41px",
                        }}
                      >
                        <tbody className="tbody-style">
                          {/* <tr>
                        <th className="text-start td-style th-style">
                          <b>PARTICULARS</b>
                        </th>
                        <th className="amt-th-style td-style th-style">
                          <b>AMOUNT</b>
                        </th>
                      </tr> */}
                          {/* {JSON.stringify(particularList)} */}
                          {particularList != "" &&
                            particularList.map((v) => {
                              return (
                                <tr>
                                  <td className="text-start td-style">
                                    {v.particular.toUpperCase()}
                                  </td>
                                  <td className="text-center td-style amt-style">
                                    {parseFloat(v.paidAmount).toFixed(2)}
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
                              {/* <b>GRAND TOTAL</b> */}
                            </td>
                            <td className="td-style amt-style">
                              <b>
                                {" "}
                                {parseFloat(
                                  feesPaymentData && feesPaymentData.paidAmount
                                ).toFixed(2)}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b>
                                {" "}
                                {/* IN WORDS :{" "} */}
                                <span
                                  className="word-style"
                                  style={{ marginLeft: "90px" }}
                                >
                                  {feesPaymentData && feesPaymentData.inword}
                                  ONLY
                                </span>
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-start td-style">
                              <b style={{ marginLeft: "77px" }}>
                                {feesPaymentData &&
                                feesPaymentData.paymentNo != null
                                  ? feesPaymentData.paymentNo
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
                            &nbsp; <span style={{ marginLeft: "160px" }}></span>{" "}
                            &nbsp;
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </>
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
                                parseFloat(
                                  feesPaymentData.hostelamount
                                ).toFixed(2)}
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
                                  parseFloat(
                                    feesPaymentData.hostelamount
                                  ).toFixed(2)}
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
                                parseFloat(
                                  feesPaymentData.hostelamount
                                ).toFixed(2)}
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
                                {parseFloat(
                                  feesPaymentData &&
                                    feesPaymentData.hostelamount
                                ).toFixed(2)}
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
