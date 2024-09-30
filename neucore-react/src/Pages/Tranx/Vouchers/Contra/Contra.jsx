import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  ButtonGroup,
  Modal,
  CloseButton,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
// import TRowComponent from '../Tranx/Components/TRowComponent';
import moment from "moment";
import Select from "react-select";

import {
  getcashAcbankaccount,
  get_last_record_contra,
  create_contra,
} from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
  eventBus,
  MyNotifications,
} from "@/helpers";

const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    fontSize: "13px",
    border: "none",
    padding: "0 6px",
    fontFamily: "MontserratRegular",
    boxShadow: "none",
    //lineHeight: "10",
    background: "transparent",
  }),
};

const BankOpt = [
  { label: "Cheque / DD", value: "cheque-dd" },
  { label: "NEFT", value: "neft" },
  { label: "IMPS", value: "imps" },
  { label: "UPI", value: "upi" },
  { label: "Others", value: "others" },
];
export default class Contra extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      bankaccmodal: false,
      cashAcbankLst: [],
      rows: [],
      initVal: {
        voucher_contra_sr_no: 1,
        voucher_contra_no: 1,
        transaction_dt: moment().format("YYYY-MM-DD"),
      },
    };
  }

  get_last_record_contraFun = () => {
    get_last_record_contra()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let lastRow = res.response;
          let initVal = {
            voucher_contra_sr_no: res.count,
            voucher_contra_no: res.contraNo,
            transaction_dt: moment().format("YYYY-MM-DD"),
          };
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstgetcashAcbankaccount = () => {
    getcashAcbankaccount()
      .then((response) => {
        let res = response.data ? response.data : [];
        let resLst = [];

        if (res.responseStatus == 200) {
          if (res.list.length > 0) {
            res.list.map((v) => {
              let innerrow = {
                id: v.id,
                type: v.type,
                value: v.id,
                label: v.name,
              };
              resLst.push(innerrow);
            });
          }
          this.setState({ cashAcbankLst: resLst });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  initRows = () => {
    let rows = [];
    for (let index = 0; index < 9; index++) {
      let innerrow = {
        type: "",
        paid_amt: "",
      };
      if (index == 0) {
        innerrow["type"] = "dr";
      }
      rows.push(innerrow);
    }
    this.setState({ rows: rows });
  };

  handleClear = (index) => {
    const { rows } = this.state;
    let frows = [...rows];
    let data = {
      perticulars: "",
      paid_amt: "",
      debit: "",
      credit: "",
      type: "",
    };
    frows[index] = data;

    this.setState({ rows: frows });
  };

  /**
   *
   * @param {*} element
   * @param {*} value
   * @param {*} index
   * @param {*} setFieldValue
   * @description on change of each element in row function will recalculate amt
   */

  handleChangeArrayElement = (element, value, index) => {
    let debitBal = 0;
    let creditBal = 0;

    let { rows } = this.state;
    let debitamt = 0;
    let creditamt = 0;
    let frows = rows.map((v, i) => {
      if (v["type"] == "dr") {
        debitamt = parseFloat(debitamt) + parseFloat(v["paid_amt"]);
        // bal = parseFloat(bal);
        if (v["debit"] != "" && !isNaN(v["debit"])) {
          debitBal = debitBal + parseFloat(v["debit"]);
        }
      } else if (v["type"] == "cr") {
        if (v["credit"] != "" && !isNaN(v["credit"])) {
          creditBal = creditBal + parseFloat(v["credit"]);
        }
      }
      if (i == index) {
        if (element == "debit") {
          v["paid_amt"] = value;
        } else if (element == "credit") {
          v["paid_amt"] = value;
        }

        v[element] = value;
        return v;
      } else {
        return v;
      }
    });

    let lastCrBal = debitBal - creditBal;

    if (element == "perticulars") {
      let obj = frows.find((v, i) => i == index);
      frows = rows.map((vi, ii) => {
        if (ii == index && vi.type == "cr") {
          vi["credit"] = lastCrBal;
        } else if (ii == index && vi.type == "dr") {
          vi["debit"] = lastCrBal;
        }
        return vi;
      });

      if (obj.perticulars.type == "others") {
      } else if (obj.perticulars.type == "bank_account") {
        this.setState({ bankaccmodal: true });
      }
    }

    this.setState({ rows: frows, index: index });
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    return elementCheck ? elementCheck[element] : "";
  };

  getTotalDebitAmt = () => {
    let { rows } = this.state;
    let debitamt = 0;
    rows.map((v) => {
      if (v.type == "dr" && v["debit"] != "") {
        debitamt = parseFloat(debitamt) + parseFloat(v["debit"]);
      }
    });

    return isNaN(debitamt) ? 0 : debitamt;
  };

  getTotalCreditAmt = () => {
    let { rows } = this.state;
    let creditamt = 0;
    rows.map((v) => {
      if (v.type == "cr" && v["credit"] != "") {
        creditamt = parseFloat(creditamt) + parseFloat(v["credit"]);
      }
    });

    return isNaN(creditamt) ? 0 : creditamt;
  };

  getElementObject = (index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck : "";
  };

  handleBankAccountCashAccSubmit = (v) => {
    let { index, rows } = this.state;
    let frow = rows.map((vi, ii) => {
      if (ii == index) {
        v["credit"] = v["credit"];
        // v['credit'] = v['paid_amt'];

        return v;
      } else {
        return vi;
      }
    });
    this.setState(
      {
        rows: frow,
      },
      () => {
        this.setState({ bankaccmodal: false, index: -1 });
      }
    );
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.get_last_record_contraFun();
      this.lstgetcashAcbankaccount();
      this.initRows();
    }
  }

  render() {
    const { bankaccmodal, invoice_data, rows, cashAcbankLst, initVal } =
      this.state;
    return (
      <div className="">
        <div className="dashboardpg institutepg">
          {/* <h6>Purchase Invoice</h6> */}

          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            enableReinitialize={true}
            initialValues={initVal}
            validationSchema={Yup.object().shape({})}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let frow = rows.filter((v) => v.type != "");

              frow = frow.map((v, i) => {
                let perObj = {
                  id: v.perticulars.id,
                  type: v.perticulars.type,
                  label: v.perticulars.label,
                };
                if (v["debit"] != "" && v["type"] == "dr") {
                  v["paid_amt"] = v.debit;
                }
                if (v["credit"] != "" && v["type"] == "cr") {
                  v["paid_amt"] = v.credit;
                }

                if (v.perticulars && v.perticulars.type == "bank_account") {
                  return {
                    type: v.type,
                    paid_amt: v.paid_amt,
                    bank_payment_type: v.bank_payment_type.value,
                    bank_payment_no: v.bank_payment_no,
                    perticulars: perObj,
                  };
                } else {
                  return {
                    type: v.type,
                    paid_amt: v.paid_amt,
                    // paid_amt: v.credit,
                    perticulars: perObj,
                  };
                }
              });

              let formData = new FormData();

              if (values.narration != null && values.narration != "")
                formData.append("narration", values.narration);
              formData.append("rows", JSON.stringify(frow));
              formData.append("transaction_dt", values.transaction_dt);
              formData.append(
                "voucher_contra_sr_no",
                values.voucher_contra_sr_no
              );
              let total_amt = this.getTotalDebitAmt();
              formData.append("total_amt", total_amt);
              formData.append("voucher_contra_no", values.voucher_contra_no);
              if (this.getTotalDebitAmt() == this.getTotalCreditAmt()) {
                create_contra(formData)
                  .then((response) => {
                    let res = response.data;

                    if (res.responseStatus == 200) {
                      // ShowNotification("Success", res.message);
                      MyNotifications.fire({
                        show: true,
                        icon: "success",
                        title: "Success",
                        msg: res.message,
                        is_timeout: true,
                        delay: 1000,
                      });
                      resetForm();
                      this.componentDidMount();
                      eventBus.dispatch("page_change", {
                        from: "tranx_contra",
                        to: "tranx_contra_List",
                        isNewTab: false,
                      });
                    } else {
                      // ShowNotification("Error", res.message);
                      setSubmitting(false);
                      if (response.responseStatus == 401) {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: response.message,
                          is_button_show: true,
                        });
                      } else {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Server Error! Please Check Your Connectivity",
                        });
                        console.log(
                          "Server Error! Please Check Your Connectivity"
                        );
                      }
                    }
                  })
                  .catch((error) => {
                    console.log("error", error);
                  });
              } else {
                ShowNotification("Please Correct the Credit and Debit values");
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
              resetForm,
              setFieldValue,
            }) => (
              <div className="new_trnx_design">
                <Row>
                  <Col md="12">
                    <Form onSubmit={handleSubmit} noValidate className="">
                      <div className="d-bg i-bg" style={{ height: "auto" }}>
                        <div className="institute-head pt-1 pl-2 pr-2 pb-1">
                          <Row>
                            <Col md="12">
                              <div className="supplie-det">
                                <ul>
                                  <li>
                                    <Form.Group as={Row}>
                                      <Form.Label
                                        column
                                        sm="5"
                                        className="pt-0"
                                      >
                                        <h6>Contra Sr. #.</h6>:{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <Col sm="6">
                                        <Form.Control
                                          style={{
                                            textAlign: "left",
                                            paddingRight: "10px",
                                            background: "#f5f5f5",
                                          }}
                                          type="text"
                                          name="voucher_contra_sr_no"
                                          id="voucher_contra_sr_no"
                                          disabled
                                          placeholder="PAY1234"
                                          className="mb-0 mt-2"
                                          value={values.voucher_contra_sr_no}
                                        />
                                      </Col>
                                    </Form.Group>
                                  </li>
                                  <li>
                                    {/* <h6>Voucher Sr. #.</h6>:{' '} */}
                                    {/* <span>
                                      {invoice_data
                                        ? invoice_data.purchase_sr_no
                                        : ''}
                                    </span> */}
                                    <Form.Group as={Row}>
                                      <Form.Label
                                        column
                                        sm="5"
                                        className="pt-0"
                                      >
                                        <h6>Contra #.</h6>:{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <Col sm="6">
                                        <Form.Control
                                          style={{
                                            textAlign: "left",
                                            paddingRight: "10px",
                                            background: "#f5f5f5",
                                            // /readonly,
                                          }}
                                          type="text"
                                          disabled
                                          placeholder="1234"
                                          className="mb-0 mt-1"
                                          value={values.voucher_contra_no}
                                        />
                                      </Col>
                                    </Form.Group>
                                  </li>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <li>
                                    <Form.Group as={Row}>
                                      <Form.Label
                                        column
                                        sm="6"
                                        className="pt-0"
                                      >
                                        <b>Transaction Date : </b>
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <Col sm="6">
                                        <Form.Control
                                          type="date"
                                          className="mt-2"
                                          name="transaction_dt"
                                          id="transaction_dt"
                                          onChange={handleChange}
                                          value={values.transaction_dt}
                                          isValid={
                                            touched.transaction_dt &&
                                            !errors.transaction_dt
                                          }
                                          isInvalid={!!errors.transaction_dt}
                                          readOnly={true}
                                        />
                                      </Col>
                                    </Form.Group>
                                  </li>
                                </ul>
                              </div>
                            </Col>
                          </Row>
                        </div>
                        {/* right side menu start */}
                        {/* right side menu end */}
                        <div className="institutetbl p-2">
                          <Table
                            size="sm"
                            className="key purchacetbl mb-0"
                            style={{ width: "100%" }}
                          >
                            <thead>
                              <tr>
                                <th style={{ width: "5%" }}>Type</th>
                                <th style={{ textAlign: "left" }}>
                                  Particulars
                                </th>
                                <th
                                  style={{ width: "13%", textAlign: "right" }}
                                >
                                  Debit &nbsp;
                                </th>
                                <th
                                  style={{ width: "57%", textAlign: "right" }}
                                  className="pl-4"
                                >
                                  Credit &nbsp;
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rows.length > 0 &&
                                rows.map((vi, ii) => {
                                  return (
                                    <tr className="entryrow">
                                      <td>
                                        <Form.Control
                                          as="select"
                                          onChange={(e) => {
                                            if (e.target.value != "") {
                                              this.handleChangeArrayElement(
                                                "type",
                                                e.target.value,
                                                ii
                                              );
                                            } else {
                                              this.handleClear(ii);
                                            }
                                          }}
                                          value={this.setElementValue(
                                            "type",
                                            ii
                                          )}
                                          placeholder="select type"
                                        >
                                          {ii == 0 ? (
                                            <option selected value="dr">
                                              Dr
                                            </option>
                                          ) : (
                                            <>
                                              <option value=""></option>
                                              <option value="dr">Dr</option>
                                            </>
                                          )}
                                          <option value="cr">Cr</option>
                                        </Form.Control>
                                      </td>
                                      <td
                                        style={{
                                          width: "75%",
                                          background: "#f5f5f5",
                                        }}
                                      >
                                        <Select
                                          components={{
                                            DropdownIndicator: () => null,
                                            IndicatorSeparator: () => null,
                                          }}
                                          placeholder=""
                                          styles={customStyles1}
                                          isClearable
                                          options={cashAcbankLst}
                                          theme={(theme) => ({
                                            ...theme,
                                            height: "26px",
                                            borderRadius: "5px",
                                          })}
                                          onChange={(v) => {
                                            if (v != null) {
                                              this.handleChangeArrayElement(
                                                "perticulars",
                                                v,
                                                ii
                                              );
                                            } else {
                                              this.handleClear(ii);
                                            }
                                          }}
                                          value={this.setElementValue(
                                            "perticulars",
                                            ii
                                          )}
                                        />
                                      </td>

                                      <td>
                                        <Form.Control
                                          type="text"
                                          onChange={(e) => {
                                            let v = e.target.value;
                                            this.handleChangeArrayElement(
                                              "debit",
                                              e.target.value,
                                              ii
                                            );
                                          }}
                                          style={{ textAlign: "right" }}
                                          value={this.setElementValue(
                                            "debit",
                                            ii
                                          )}
                                          readOnly={
                                            this.setElementValue("type", ii) ==
                                            "dr"
                                              ? false
                                              : true
                                          }
                                        />
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="text"
                                          onChange={(e) => {
                                            let v = e.target.value;
                                            this.handleChangeArrayElement(
                                              "credit",
                                              v,
                                              ii
                                            );
                                          }}
                                          style={{ textAlign: "right" }}
                                          value={this.setElementValue(
                                            "credit",
                                            ii
                                          )}
                                          readOnly={
                                            this.setElementValue("type", ii) ==
                                            "cr"
                                              ? false
                                              : true
                                          }
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                            <tbody
                              style={{
                                background:
                                  "linear-gradient(44deg, #f1e8e8, #f5f3f3)",
                              }}
                            >
                              <tr>
                                <td></td>
                                <td
                                  style={{
                                    textAlign: "right",
                                    paddingRight: "10px",
                                  }}
                                >
                                  TOTAL
                                </td>
                                <td
                                  style={{
                                    textAlign: "right",
                                    paddingRight: "10px",
                                  }}
                                >
                                  {this.getTotalDebitAmt()}
                                </td>
                                <td
                                  style={{
                                    textAlign: "right",
                                    paddingRight: "10px",
                                  }}
                                >
                                  {this.getTotalCreditAmt()}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                        <div className="summery p-2">
                          <Row>
                            <Col md="4">
                              <div className="summerytag narrationdiv">
                                <fieldset>
                                  <legend>Narration</legend>
                                  <Form.Group>
                                    <Form.Control
                                      as="textarea"
                                      rows={7}
                                      cols={25}
                                      name="narration"
                                      onChange={handleChange}
                                      style={{ width: "100%" }}
                                      className="purchace-text"
                                      value={values.narration}
                                      //placeholder="Narration"
                                    />
                                  </Form.Group>
                                </fieldset>
                              </div>
                            </Col>
                            <Col md="6"></Col>
                            <Col md="2">
                              <ButtonGroup
                                className="pull-right submitbtn pt-5 mt-5"
                                aria-label="Basic example"
                              >
                                {/* <Button variant="secondary">Draft</Button> */}
                                <Button
                                  className="mid-btn mt-4"
                                  variant="secondary"
                                  type="submit"
                                >
                                  Submit
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_purchase_invoice_create",
                                      to: "tranx_purchase_invoice_list",
                                      isNewTab: false,
                                    });
                                  }}
                                  className="mt-4"
                                >
                                  Cancel
                                </Button>
                              </ButtonGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="9"></Col>
                          </Row>
                        </div>
                      </div>
                    </Form>
                  </Col>
                </Row>
              </div>
            )}
          </Formik>
        </div>

        {/*  On Account payment- Bank Acc - Payable amount */}
        <Modal
          show={bankaccmodal}
          size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ bankaccmodal: false })}
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Bank Account
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal ">
            <div className="purchasescreen">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={this.getElementObject(this.state.index)}
                validationSchema={Yup.object().shape({
                  bank_payment_type: Yup.object().required("Select type"),
                  bank_payment_no: Yup.string().required("No is required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  this.handleBankAccountCashAccSubmit(values);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  resetForm,
                  setFieldValue,
                }) => (
                  <Form onSubmit={handleSubmit} noValidate>
                    <Row>
                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>Type</Form.Label>
                          <Select
                            className="selectTo"
                            placeholder=""
                            styles={customStyles}
                            isClearable
                            options={BankOpt}
                            borderRadius="0px"
                            colors="#729"
                            name="bank_payment_type"
                            onChange={(value) => {
                              setFieldValue("bank_payment_type", value);
                            }}
                            value={values.bank_payment_type}
                          />
                          <span className="text-danger">
                            {errors.bank_payment_type}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="bank_payment_no"
                            placeholder="bank_payment_no"
                            id="bank_payment_no"
                            onChange={handleChange}
                            value={values.bank_payment_no}
                            isValid={
                              touched.bank_payment_no && !errors.bank_payment_no
                            }
                            isInvalid={!!errors.bank_payment_no}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.bank_payment_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="6" className="btn_align mt-4">
                        <Button className="createbtn mt-2" type="submit">
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </Modal.Body>
        </Modal>
        {/* On Account payment- Bank Acc - Payable amount */}
      </div>
    );
  }
}
