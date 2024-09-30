import React from "react";
import {
  Button,
  Col,
  Row,
  Table,
  ButtonGroup,
  Modal,
  CloseButton,
  Form,
  FormGroup,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import Select from "react-select";

import {
  getLedgerVoucherDetails,
  getSaleInvoiceDetails,
  getJournalDetails,
} from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
  eventBus,
  MyNotifications,
  numberWithCommasIN,
} from "@/helpers";

const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 26,
    minHeight: 26,
    border: "none",
    padding: "0 6px",
    boxShadow: "none",
    //lineHeight: "10",
    background: "transparent",
  }),
};
const drcrtype = [
  { value: "dr", label: "dr" },
  { value: "cr", label: "cr" },
];
const BankOpt = [
  { label: "Cheque / DD", value: "cheque-dd" },
  { label: "NEFT", value: "neft" },
  { label: "IMPS", value: "imps" },
  { label: "UPI", value: "upi" },
  { label: "Others", value: "others" },
];
export default class JournalDetails extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      invoice_data: "",
      amtledgershow: false,
      onaccountmodal: false,
      billadjusmentmodalshow: false,
      billadjusmentDebitmodalshow: false,
      bankledgershow: false,
      isDisabled: false,
      bankchequeshow: false,
      isAllCheckeddebit: false,
      sundryindirect: [],
      cashAcbankLst: [],
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      selectedBillsdebit: [],
      selectedBillsCredit: [],
      billLst: [],
      billLstSc: [],
      selectedBills: [],
      accountLst: [],
      invoiceedit: false,
      adjusmentbillmodal: false,
      createproductmodal: false,
      pendingordermodal: false,
      pendingorderprdctsmodalshow: false,
      productLst: [],
      unitLst: [],
      rows: [],
      serialnopopupwindow: false,

      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      isAllChecked: false,
      selectedProductDetails: [],
      selectedPendingOrder: [],
      purchasePendingOrderLst: [],
      selectedPendingChallan: [],
      opbranchList: [],
      initVal: {
        receipt_sr_no: 1,
        receipt_code: "",
        transaction_dt: moment().format("YYYY-MM-DD"),
        po_sr_no: 1,
        sundryindirectid: "",
        id: "",
        type: "",
        balancing_method: "",
        amount: "",
        branchId: "",
        studentLedgerId: "",
      },

      voucher_edit: false,
      voucher_data: {
        voucher_sr_no: 1,
        transaction_dt: moment().format("YYYY-MM-DD"),
        payment_dt: moment().format("YYYY-MM-DD"),
      },
      rows: [],
      sundryCreditorLst: [],
      cashAccLedgerLst: [],
      lstSundryCreditorsPayment: [],
      lstSundryDebtors: [],

      index: 0,
      crshow: false,
      onaccountcashaccmodal: false,
      bankaccmodal: false,
      lstLedgerVoucherList: [],
      narration: "",
      vouchernumber: "",
      tranx_date_frm: "",
    };
  }
  // const { i, productLst, setFieldValue, isDisabled } = props;
  handleClose = () => {
    this.setState({ show: false });
  };
  getElementObject = (index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    console.log("elementCheck", elementCheck);
    return elementCheck ? elementCheck : "";
  };
  lstLedgerVoucherDetails = (edit_data) => {
    console.log(":edit_data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>. ", edit_data);
    let requestData = new FormData();
    // this.setState({
    //   narration: edit_data.narration,
    //   voucherid: edit_data.voucher_id,
    //   vouchernumber: edit_data.voucher_no,
    //   tranx_date_frm: edit_data.invoice_date,
    // });
    requestData.append("id", edit_data.id);

    console.log("propdata called->", edit_data);
    getJournalDetails(requestData)
      .then((response) => {
        let res = response.data;
        console.log({ res });
        if (res.responseStatus == 200) {
          this.setState({
            // isEditDataSet: true,
            edit_data: edit_data,
            lstLedgerVoucherList: res && res.data,
          });
          //   console.log("lstLedgerVoucherList", res.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ lstLedgerVoucherList: [] });
      });
  };
  getCreditTotalAmount = () => {
    let { lstLedgerVoucherList } = this.state;
    let creditamt = 0;
    lstLedgerVoucherList.map((v) => {
      if (v.tranxType == "CR") {
        creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
      }
    });

    return isNaN(creditamt) ? 0 : numberWithCommasIN(creditamt, true, 2);
  };
  getDebittTotalAmount = () => {
    let { lstLedgerVoucherList } = this.state;
    let creditamt = 0;
    lstLedgerVoucherList.map((v) => {
      // console.log({ v });
      if (v.tranxType == "DR") {
        creditamt = parseFloat(creditamt) + parseFloat(v["debit"]);
      }
    });

    return isNaN(creditamt) ? 0 : numberWithCommasIN(creditamt, true, 2);
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      const { prop_data } = this.props.block;
      console.log({ prop_data });
      this.setState({ edit_data: prop_data });
      // this.lstLedgreDetails(prop_data);
      this.lstLedgerVoucherDetails(prop_data);
    }
  }

  render() {
    const { lstLedgerVoucherList, edit_data } = this.state;
    return (
      <div className="">
        <div style={{ overflowX: "hidden" }}>
          <div className="mb-2 p-2 bg-white">
            <Row>
              <Col md="1">
                <Form.Label className="pt-0">
                  Voucher Sr. #.
                  <span className="pt-1 pl-1 req_validation">*</span>
                </Form.Label>
              </Col>
              <Col md="1">{edit_data && edit_data.journal_sr_no}</Col>
              <Col md="1">
                <Form.Label className="pt-0">
                  Voucher #.
                  <span className="pt-1 pl-1 req_validation">*</span>
                </Form.Label>
              </Col>
              <Col md="1">{edit_data && edit_data.journal_code}</Col>
              <Col md="1">
                <Form.Label className="pt-0">
                  Transaction Date :
                  <span className="pt-1 req_validation">*</span>
                </Form.Label>
              </Col>
              <Col md="1">
                {edit_data &&
                  moment(edit_data.transaction_dt).format("DD-MM-yyyy")}
              </Col>
            </Row>
          </div>

          {lstLedgerVoucherList.length > 0 && (
            <div
              className="ledgerstyle table_wrapper"
              style={{
                height: "63vh",
                maxHeight: "63vh",
                overflowY: "hidden",
              }}
            >
              <Table hover size="sm" className="tbl-font">
                <thead className="text-center">
                  <tr>
                    <th style={{ width: "5%" }}>Type</th>
                    <th style={{ width: "75%" }}>Particulars</th>
                    <th style={{ width: "10%" }}>Debit &nbsp;</th>
                    <th style={{ width: "10%" }}>Credit &nbsp;</th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    borderTop: "1px solid transparent",
                    background: "#fff",
                    borderCollapse: "separate !important",
                    borderSpacing: "5px 4px !important",
                  }}
                >
                  {lstLedgerVoucherList.map((v, i) => {
                    return (
                      <tr className="entryrow">
                        <td
                          style={{
                            width: "5%",
                            // borderBottom: "2px solid #cacaca",
                          }}
                        >
                          <Form.Control
                            value={v.tranxType}
                            className="form-control-style"
                          />
                          {/* {v.TranxType} */}
                        </td>

                        <td
                          style={{
                            width: "75%",
                            background: "#f5f5f5",
                            // borderBottom: "2px solid #cacaca",
                          }}
                        >
                          <p className="m-0 pt-2 form-control-style-particular">
                            {v.particular}
                          </p>
                        </td>

                        <td
                          style={{
                            width: "10%",
                            // borderBottom: "2px solid #cacaca",
                          }}
                        >
                          {v.tranxType == "DR" && (
                            <Form.Control
                              value={
                                v.tranxType == "DR" &&
                                numberWithCommasIN(v.debit, true, 2)
                              }
                              className="form-control-style"
                            />
                          )}
                        </td>

                        <td
                          style={{
                            width: "10%",
                            // borderBottom: "2px solid #cacaca",
                          }}
                        >
                          {v.tranxType == "CR" && (
                            <Form.Control
                              value={
                                v.tranxType == "CR" &&
                                numberWithCommasIN(v.credit, true, 2)
                              }
                              className="form-control-style"
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bb-total">
                  <tr
                    className="fourbtnfeestrans"
                    style={{
                      borderBottom: "2px solid transparent",
                      background: "#f5f5f5",
                      borderTop: "1px solid",
                    }}
                  >
                    <td
                      style={{
                        width: "5%",
                        borderBottom: "2px solid #cacaca",
                        // textAlign: "right",
                      }}
                    >
                      <b>Total</b>
                    </td>
                    <td
                      className="pr-2 qtotalqty"
                      style={{
                        background: "#eee",

                        width: "75%",
                        borderBottom: "2px solid #cacaca",
                      }}
                    ></td>
                    <td style={{ borderBottom: "2px solid #cacaca" }}>
                      <b>{this.getDebittTotalAmount()}</b>
                    </td>
                    <td style={{ borderBottom: "2px solid #cacaca" }}>
                      <b>{this.getCreditTotalAmount()}</b>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          )}
          <div className="summery mx-2 p-2 invoice-btm-style mt-4">
            <Row>
              <Col md="10">
                <div className="summerytag">
                  <FormGroup>
                    <Form.Label>
                      Narration :{edit_data && edit_data.narration}
                    </Form.Label>
                  </FormGroup>
                </div>
              </Col>
              <Col md="2" className="text-center">
                <ButtonGroup className="">
                  <Button
                    variant="secondary cancel-btn mx-2"
                    onClick={(e) => {
                      e.preventDefault();

                      eventBus.dispatch("page_change", {
                        from: "voucher_journal_details",
                        to: "voucher_journal_list",
                        prop_data: edit_data.mainPropData,
                        isNewTab: false,
                      });
                    }}
                    className=""
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
