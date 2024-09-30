import React from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  InputGroup,
} from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";

import moment from "moment";
import Select from "react-select";
import {
  getPurchaseAccounts,
  getSundryCreditors,
  getPurchaseInvoiceList,
  getLastPurchaseInvoiceNo,
} from "@/services/api_functions";

import {
  getSelectValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  isActionExist,
  MyNotifications,
} from "@/helpers";

export default class TranxPurchaseInvoiceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opendiv: false,
      showDiv: true,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],

      initVal: {
        pi_sr_no: 1,
        pi_no: 1,
        pi_transaction_dt: new Date(),
        pi_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
    };

    this.myRef = React.createRef();
  }

  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ purchaseAccLst: opt });
        }
      })
      .catch((error) => {});
  };
  lstPurchaseInvoice = () => {
    getPurchaseInvoiceList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ purchaseInvoiceLst: res.data });
        }
      })
      .catch((error) => {
        this.setState({ purchaseInvoiceLst: [] });
      });
  };
  setLastPurchaseSerialNo = () => {
    getLastPurchaseInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          initVal["pi_sr_no"] = res.count;
          initVal["pi_no"] = res.serialNo;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {});
  };
  lstSundryCreditors = () => {
    getSundryCreditors()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.name,
              value: v.id,
              code: v.ledger_code,
              state: stateCode,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.ledger_code,
              value: v.id,
              name: v.name,
              state: stateCode,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,
          });
        }
      })
      .catch((error) => {});
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstPurchaseAccounts();
      this.lstSundryCreditors();
      this.lstPurchaseInvoice();
    }
  }

  render() {
    const {
      show,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      purchaseInvoiceLst,
      initVal,
      showDiv,
      opendiv,
    } = this.state;

    return (
      <>
        {/* <h6>Purchase</h6> */}
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Purchase Ivoice</h4>
              <Formik
                innerRef={this.myRef}
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  pi_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  pi_transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  purchaseId: Yup.object().required("Select purchase account"),
                  pi_no: Yup.string().trim().required("invoice no is required"),
                  pi_invoice_dt: Yup.string().required(
                    "Invoice date is required"
                  ),
                  supplierCodeId: Yup.object().required("Select supplier code"),
                  supplierNameId: Yup.object().required("Select supplier name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // window.electron.ipcRenderer.webPageChange({
                  //   from: "tranx_purchase_invoice_list",
                  //   to: "tranx_purchase_invoice_create",
                  //   prop_data: values,
                  //   isNewTab: false,
                  // });
                  eventBus.dispatch("page_change", {
                    from: "tranx_purchase_invoice_list",
                    to: "tranx_purchase_invoice_create",
                    prop_data: values,
                    isNewTab: false,
                  });
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
                  <Form
                    onSubmit={handleSubmit}
                    noValidate
                    className="form-style"
                  >
                    <Row>
                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Purchase Sr. #.
                            <span className="pt-1 pl-1 req_validation">
                              *
                            </span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="pi_sr_no"
                            id="pi_sr_no"
                            onChange={handleChange}
                            value={values.pi_sr_no}
                            isValid={touched.pi_sr_no && !errors.pi_sr_no}
                            isInvalid={!!errors.pi_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pi_sr_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Transaction Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>

                          <MyDatePicker
                            name="pi_transaction_dt"
                            placeholderText="DD/MM/YYYY"
                            id="pi_transaction_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("pi_transaction_dt", date);
                            }}
                            selected={values.pi_transaction_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pi_transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Invoice #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Invoice No."
                            name="pi_no"
                            id="pi_no"
                            onChange={handleChange}
                            value={values.pi_no}
                            isValid={touched.pi_no && !errors.pi_no}
                            isInvalid={!!errors.pi_no}
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pi_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Invoice Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <MyDatePicker
                            name="pi_invoice_dt"
                            placeholderText="DD/MM/YYYY"
                            id="pi_invoice_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("pi_invoice_dt", date);
                            }}
                            selected={values.pi_invoice_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />

                          <span className="text-danger errormsg">
                            {errors.pi_invoice_dt}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="4">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Purchase A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            autoFocus
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={purchaseAccLst}
                            borderRadius="0px"
                            colors="#729"
                            name="purchaseId"
                            onChange={(v) => {
                              setFieldValue("purchaseId", v);
                            }}
                            value={values.purchaseId}
                          />

                          <span className="text-danger errormsg">
                            {errors.purchaseId}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Supplier Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="supplierNameId"
                            onChange={(v) => {
                              if (v != null) {
                                setFieldValue(
                                  "supplierCodeId",
                                  getSelectValue(supplierCodeLst, v.value)
                                );
                              }
                              setFieldValue("supplierNameId", v);
                            }}
                            value={values.supplierNameId}
                          />

                          <span className="text-danger errormsg">
                            {errors.supplierNameId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Supplier Code{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={supplierCodeLst}
                            borderRadius="0px"
                            colors="#729"
                            name="supplierCodeId"
                            onChange={(v) => {
                              setFieldValue("supplierCodeId", v);
                              if (v != null) {
                                setFieldValue(
                                  "supplierNameId",
                                  getSelectValue(supplierNameLst, v.value)
                                );
                              }
                            }}
                            value={values.supplierCodeId}
                          />

                          <span className="text-danger errormsg">
                            {errors.supplierCodeId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="7" className="mt-4 btn_align">
                        <Button className="create-btn" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            this.myRef.current.resetForm();
                            this.setState({ opendiv: !opendiv });
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Collapse>

        <div className="wrapper_div">
          {!opendiv && (
            <Row className="p-2">
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
                      {/* <Button type="submit">x</Button> */}
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
                    maxDate={new Date()}
                    className="date-style text_center mt-1"
                  />
                  <InputGroup.Text id="basic-addon2" className=" mt-1">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                  </InputGroup.Text>
                  <MyDatePicker
                    placeholderText="DD/MM/YYYY"
                    id="bill_dt"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="TO DATE"
                    maxDate={new Date()}
                    className="date-style text_center mt-1"
                  />
                </InputGroup>
              </Col>{" "}
              <Col md="4" className="mt-2 text-end">
                {!opendiv && (
                  <Button
                    className="createbtn mr-2"
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   this.setState({ opendiv: !opendiv });
                    //   this.setLastPurchaseSerialNo();
                    // }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        isActionExist("tranx_purchase_invoice_list", "create")
                      ) {
                        this.setState({ opendiv: !opendiv });
                        this.getLastPurchaseOrderSerialNo();
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
                    aria-controls="example-collapse-text"
                    aria-expanded={opendiv}
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
                )}

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
          )}
          {/* {purchaseInvoiceLst.length > 0 && ( */}
          <div className="table_wrapper row-inside">
            <Table hover size="sm" className="tbl-font mt-2">
              <thead>
                {/* <div className="scrollbar_hd"> */}
                <tr>
                  {this.state.showDiv}

                  <th style={{ width: "5%" }}>Sr. #.</th>
                  <th>Invoice #.</th>
                  <th>Invoice Date</th>
                  <th>Transaction Date</th>

                  <th>Purchase Account</th>
                  <th>Supplier Name</th>
                  <th className="btn_align ">Total Amount</th>
                </tr>
                {/* </div> */}
              </thead>
              <tbody>
                {/* <div className="scrollban_new"> */}
                {purchaseInvoiceLst.length > 0 ? (
                  purchaseInvoiceLst.map((v, i) => {
                    return (
                      <tr
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", {
                            from: "tranx_purchase_invoice_list",
                            to: "tranx_purchase_invoice_edit",
                            prop_data: v,
                            isNewTab: false,
                          });
                        }}
                      >
                        {/* <td>{i + 1}</td> */}
                        <td style={{ width: "5%" }}>{i + 1}</td>
                        <td>{v.invoice_no}</td>
                        <td>{moment(v.invoice_date).format("DD-MM-YYYY")}</td>
                        <td>
                          {moment(v.transaction_date).format("DD-MM-YYYY")}
                        </td>

                        <td>{v.purchase_account_name}</td>
                        <td>{v.sundry_creditor_name}</td>
                        <td className="text-end">{v.total_amount}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </>
    );
  }
}
