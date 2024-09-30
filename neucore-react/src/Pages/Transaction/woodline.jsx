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
  Modal,
  CloseButton,
  Collapse,
  FormControl,
} from "react-bootstrap";

import "@/assets/scss/format.scss";
import { getInvoiceBill } from "@/services/api_functions";

export default class Woodline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerData: "",
      invoiceData: "",
      invoiceDetails: "",
      supplierData: "",
    };
  }

  callPrint = () => {
    var newWin = window.frames["printf"];
    var divToPrint = document.getElementById("printDiv");
    let data = divToPrint.outerHTML;
    let htmlToPrint = '<body onload="window.print()">';
    htmlToPrint +=
      "<style>@media print{td,th{border:1px solid #000}table{border-collapse:collapse}.tb-form{width:800px;height:400px;text-align:center}.text{text-align:left}.text1{text-align:left}.col{background-color:#d0caca}}</style>";
    htmlToPrint += data;
    htmlToPrint += "</body>";
    newWin.document.write(htmlToPrint);
    newWin.document.close();
  };

  getInvoiceBillsLst = () => {
    let reqData = new FormData();
    reqData.append("id", 1);
    getInvoiceBill(reqData).then((response) => {
      let responseData = response.data;
      if (responseData.responseStatus == 200) {
        console.log("responseData ---->>>", responseData);
        // let invoiceDetails = responseData.invoice_details.product_details;
        // console.log("invoiceDetails :", invoiceDetails);

        this.setState({
          customerData: responseData.customer_data,
          invoiceData: responseData.invoice_data,
          supplierData: responseData.supplier_data,
          invoiceDetails: responseData.invoice_details.product_details,
          // productDetails: responseData.product_details,
        });
      }
    });
  };

  componentDidMount = () => {
    this.getInvoiceBillsLst();
  };

  render() {
    const {
      customerData,
      invoiceData,
      invoiceDetails,
      supplierData,
      productDetails,
    } = this.state;
    return (
      <div className="">
        <Button
          onClick={(e) => {
            e.preventDefault();
            this.callPrint();
          }}
        >
          Print
        </Button>
        <iframe id="printf" name="printf" className="d-none"></iframe>

        <div className="pagestyle" id="printDiv">
          {JSON.stringify(invoiceDetails)}
          {/* <h1 className="blueheading ms-2"> Table</h1> */}
          <div className="institutetbl denomination-style p-2">
            <table className="tb-form">
              <tr>
                <th colSpan={5}>
                  TAX INVOICE <br />
                </th>
                <th colSpan={4} className="text text-rt">
                  <img
                    className="logo"
                    src="data:image/png;base64,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"
                  />
                  <br />
                  {supplierData && supplierData.company_name}
                  <br />
                  {supplierData && supplierData.company_address}
                  <br />
                  Phone:{supplierData && supplierData.phone_number}
                  <br />
                  E-Mail:{supplierData && supplierData.email_address}
                  <br />
                  GSTIN NO:-{supplierData && supplierData.gst_number}
                </th>
              </tr>
              <tr>
                <th colSpan={6} className="text">
                  TO: {customerData && customerData.supplier_name}
                  <br />
                  {customerData && customerData.supplier_address} <br />
                  {customerData && customerData.supplier_phone}
                  <br />
                  BUYER'S GSTIN NO:{customerData && customerData.supplier_gstin}
                </th>
                <th colSpan={3} className="text">
                  Invoice No:{invoiceData && invoiceData.invoice_no} <br />
                  Date:{invoiceData && invoiceData.invoice_dt}
                  <br />
                  CREDIT MEMO
                  <br />
                  STATE NAME:{invoiceData && invoiceData.state_name}
                  <br />
                  STATE CODE:{invoiceData && invoiceData.state_code}
                </th>
              </tr>

              <tr className="col">
                <th>Sr.No</th>
                <th>Particulars</th>
                <th>HSN Code</th>
                <th>Gst %</th>
                <th>QTY</th>
                <th>Unit Name</th>
                <th>Rate</th>
                <th>Taxable Amount</th>
                <th>Net Amount</th>
              </tr>

              {invoiceDetails != "" &&
                invoiceDetails.map((v, i) => {
                  return (
                    v.units &&
                    v.units.map((vi, ii) => {
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          <td>{v.product_name}</td>
                          <td className="text-align">{v.product_hsn}</td>
                          <td className="text-align">{v.Gst}</td>
                          <td className="text-align">{vi.qty}</td>
                          <td className="text-align"> {vi.unit_name}</td>
                          <td className="text-align">{vi.rate}</td>

                          <td className="text-align">
                            {invoiceData && invoiceData.taxable_amt}
                          </td>
                          <td className="text-align">
                            {invoiceData && invoiceData.net_amount}
                          </td>
                        </tr>
                      );
                }})
                  );
                })}
              {/* <tr>
                <td>1</td>
                <td>
                  <span className="text-rg">MATTRESS</span>
                  <br />
                  SLEEPWELL MATTRESS WITH PILLOW
                  <br />
                  MODEL-AKASH
                  <br />
                  SIZE-78*66*5
                  <br />
                  SR.NO-PHML3B4Y
                  <br />
                  SR.NO-UCM14WZG
                </td>
                <td className="text-align">9404</td>
                <td className="text-align">
                  {productDetails && productDetails}
                </td>
                <td className="text-align"> 2</td>
                <td className="text-align">NO</td>
                <td className="text-align">11500.00</td>
                <td className="text-align">
                  {invoiceData && invoiceData.taxable_amt}
                </td>
                <td className="text-align">
                  {invoiceData && invoiceData.net_amount}
                </td>
              </tr> */}

              {/* <tr>
                <td colSpan={6}></td>
                <td colSpan={2}>ADVANCE</td>
                <td colSpan={2}>ADVANCE</td>
              </tr> */}
              <tr>
                <th colSpan={6} className="text"></th>
                {/* <th colSpan={3}>STATE:27-MAHARASHTRA</th> */}
                <td colSpan={2}>DISCOUNT</td>
                <td colSpan={1}>{invoiceData && invoiceData.total_discount}</td>
              </tr>
              <tr>
                <td colSpan={6}></td>
                <td className="text-bold" colSpan={2}>
                  SUB TOTAL
                </td>
                <td colSpan={2}>{} </td>
              </tr>

              <tr>
                <td colSpan={6} className="text-bank">
                  BANK DETAILS
                  {/* *Subject To SOLAPUR Jusrisdiction Only */}
                </td>
                {/* <td colSpan={3}>*Goods Once Sold will not be taken back
                </td>*/}
                <td colSpan={2}>CGST 9.00%</td>
                <td colSpan={1}>{invoiceData && invoiceData.total_cgst}</td>
              </tr>
              <tr className="bd">
                <td colSpan={3} className="text">
                  Acc Name : WOODLINE
                </td>
                <td colSpan={3}>Acc No :266010200000453</td>
                <td colSpan={2}>SGST 9.00%</td>
                <td colSpan={1}>{invoiceData && invoiceData.total_sgst}</td>
              </tr>
              <tr>
                <td colSpan={3} className="text">
                  Bank Name : Axis Bank
                </td>
                <td colSpan={3}>IFSC Code:UTIB0000266</td>
                <td colSpan={2}>Round Off</td>
                <td colSpan={1}>0.00</td>
              </tr>
              <tr>
                <td colSpan={6} className="text text-bold">
                  RS. Twenty Three Thousand Only
                </td>
                <th colSpan={2}>TOTAL</th>
                <td className="text-bold" colSpan={2}>
                  {invoiceData && invoiceData.total_amount}
                </td>
              </tr>
              <tr>
                <td colSpan={9} className="text">
                  <span className="terms">Terms and Conditions:-</span>
                  <br />
                  *Subject To SOLAPUR Jusrisdiction Only
                  <br />
                  *Goods Once Sold will not be taken back
                </td>

                {/* <td colSpan={3}>*Goods Once Sold will not be taken back</td> */}
              </tr>
              <tr classname="sign">
                <td className="text-bold" colSpan={4}>
                  <br />
                  <br />
                  Customer's Signature
                </td>
                <td className="text-bold" colSpan={5}>
                  <br />
                  <br />
                  FOR WOODLINE
                  <br />
                  <span className="text-size">Prepaired By :LATA</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
