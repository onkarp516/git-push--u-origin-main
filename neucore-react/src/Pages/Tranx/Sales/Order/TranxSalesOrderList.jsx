// /* eslint-disable @typescript-eslint/dot-notation */
// /* eslint-disable eqeqeq */
import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  InputGroup,
  Collapse,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import moment from "moment";
import Select from "react-select";
import {
  getSalesAccounts,
  getSundryDebtors,
  authenticationService,
  getSalesInvoiceList,
  getLastSalesOrder,
  getSaleOrderList,
  getLastSalesChallanNo,
  getLastSalesInvoiceNo,
} from "@/services/api_functions";

import {
  ShowNotification,
  getSelectValue,
  AuthenticationCheck,
  getHeader,
  CustomDTHeader,
  customStyles,
  MyDatePicker,
  eventBus,
  customStylesWhite,
  MyNotifications,
  isActionExist,
} from "@/helpers";

export default class TranxSalesOrderList extends React.Component {
  constructor(props) {
    super(props);
    this.tableManager = React.createRef(null);
    this.state = {
      show: false,
      opendiv: false,
      ConvertIntoChallan: false,
      convshow: false,
      showDiv: false,
      convshowInvoice: false,
      ConvertIntoInvoice: false,
      isAllChecked: false,
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      salesInvoiceLst: [],

      selectedCounterSalesBills: [],
      selectedSDids: "",
      soBills: [],
      initVal: {
        so_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        sobill_no: "",

        clientCodeId: "",
        invoice_dt: "",
        clientNameId: "",
      },
      ChallaninitVal: {
        sc_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        scbill_no: "",

        clientCodeId: "",
        invoice_dt: "",
        clientNameId: "",
      },
      InvoiceinitVal: {
        si_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        sibill_no: "",

        clientCodeId: "",
        invoice_dt: "",
        clientNameId: "",
      },
    };
  }
  open() {
    const { showDiv } = this.state;
    this.setState({
      showDiv: !showDiv,
    });
  }
  handleClose = () => {
    this.setState({ show: false });
  };
  setLastSalesOrderSerialNo = () => {
    getLastSalesOrder()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          initVal["so_sr_no"] = res.count;
          initVal["sobill_no"] = res.serialNo;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  setLastSalesChallanSerialNo = () => {
    getLastSalesChallanNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { ChallaninitVal } = this.state;
          ChallaninitVal["sc_sr_no"] = res.count;
          ChallaninitVal["scbill_no"] = res.serialNo;
          this.setState({
            ChallaninitVal: ChallaninitVal,
            ConvertIntoChallan: true,
            ConvertIntoInvoice: false,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  setLastSalesInvoiceSerialNo = () => {
    getLastSalesInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { InvoiceinitVal } = this.state;
          InvoiceinitVal["si_sr_no"] = res.count;
          InvoiceinitVal["sibill_no"] = res.serialNo;
          this.setState({
            InvoiceinitVal: InvoiceinitVal,
            ConvertIntoChallan: false,
            ConvertIntoInvoice: true,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstSalesAccounts = () => {
    getSalesAccounts()
      .then((response) => {
        // console.log("res", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ salesAccLst: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstSundrydebtors = () => {
    getSundryDebtors()
      .then((response) => {
        // console.log("res", response);

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
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstSaleOrder = () => {
    getSaleOrderList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          console.log({ res });
          this.setState({ salesInvoiceLst: res.data });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceLst: [] });
      });
  };
  setTableManager = (tm) => (this.tableManager.current = tm);

  callOpenDiv = () => {
    const { opendiv } = this.state;
    this.setState({ opendiv: !opendiv });
  };

  handleCounterSalesBillsSelection = (id, sundry_debtors_id, status) => {
    let {
      soBills,
      salesInvoiceLst,
      selectedSDids,
      supplierNameLst,
      InvoiceinitVal,

      ChallaninitVal,
    } = this.state;
    if (status == true) {
      if (soBills.length == 0) {
        if (!soBills.includes(id)) {
          soBills = [...soBills, id];
        }
        // InvoiceinitVal = ['supplierNameId'];
        InvoiceinitVal["clientNameId"] = getSelectValue(
          supplierNameLst,
          sundry_debtors_id + ""
        );
        ChallaninitVal["clientNameId"] = getSelectValue(
          supplierNameLst,
          sundry_debtors_id + ""
        );

        this.setState({ selectedSDids: sundry_debtors_id });
      } else {
        if (selectedSDids == sundry_debtors_id) {
          if (!soBills.includes(id)) {
            soBills = [...soBills, id];
          }
        } else {
          ShowNotification("Error", "You have selected different supplier");
        }
      }
    } else {
      if (selectedSDids == sundry_debtors_id) {
        if (!soBills.includes(id)) {
          soBills = [...soBills, id];
        } else {
          soBills = soBills.filter((v) => v != id);
        }
      }
    }
    this.setState(
      {
        isAllChecked:
          soBills.length == 0
            ? false
            : soBills.length === salesInvoiceLst.length
            ? true
            : false,
        soBills: soBills,
        InvoiceinitVal: InvoiceinitVal,
        ChallaninitVal: ChallaninitVal,
      },
      () => {
        if (this.state.soBills.length == 0) {
          InvoiceinitVal["clientNameId"] = "";

          ChallaninitVal["clientNameId"] = "";

          this.setState({
            InvoiceinitVal: InvoiceinitVal,
            ChallaninitVal: ChallaninitVal,

            selectedSDids: "",
          });
        }
      }
    );
  };

  handleCounterSalesBillsSelectionAll = (status) => {
    let {
      salesInvoiceLst,
      selectedSDids,
      InvoiceinitVal,

      ChallaninitVal,
    } = this.state;

    let lstSelected = [];
    let selectedSundryId = "";
    if (status == true) {
      salesInvoiceLst.map((v) => {
        if (
          v.sundry_debtors_id == selectedSDids &&
          v.sales_order_status == "opened"
        ) {
          lstSelected.push(v.id);
        }
      });
      selectedSundryId = selectedSDids;
    } else {
      InvoiceinitVal["clientNameId"] = "";

      ChallaninitVal["clientNameId"] = "";
    }

    this.setState(
      {
        isAllChecked: status,
        soBills: lstSelected,
        selectedSDids: selectedSundryId,

        InvoiceinitVal: InvoiceinitVal,
        ChallaninitVal: ChallaninitVal,
      },
      () => {
        if (this.state.soBills.length == 0) {
          this.setState({ selectedSDids: "" });
        }
      }
    );
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstSalesAccounts();
      this.lstSundrydebtors();
      // this.lstSalesInvoice();
      this.lstSaleOrder();
    }
  }
  render() {
    const {
      show,
      salesAccLst,
      supplierNameLst,
      opendiv,
      showDiv,
      supplierCodeLst,
      salesInvoiceLst,
      initVal,
      ChallaninitVal,
      InvoiceinitVal,
      selectedSDids,
      convshow,
      selectedCounterSalesBills,
      soBills,
      convshowInvoice,
      isAllChecked,
      ConvertIntoChallan,
      ConvertIntoInvoice,
    } = this.state;

    return (
      <div className="">
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Sales Order</h4>
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  so_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  salesAccId: Yup.object().required("Select sales account"),
                  sobill_no: Yup.string()
                    .trim()
                    .required("bill no is required"),
                  bill_dt: Yup.string().required("Order date is required"),
                  // clientCodeId: Yup.object().required("select client code"),
                  clientNameId: Yup.object().required("Select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_order_list",
                    to: "tranx_sales_order_create",
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
                    {/* {JSON.stringify(errors)}; */}
                    <Row>
                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Order Sr. #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="so_sr_no"
                            id="so_sr_no"
                            onChange={handleChange}
                            value={values.so_sr_no}
                            isValid={touched.so_sr_no && !errors.so_sr_no}
                            isInvalid={!!errors.so_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.so_sr_no}
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
                            name="transaction_dt"
                            placeholderText="DD/MM/YYYY"
                            id="transaction_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("transaction_dt", date);
                            }}
                            selected={values.transaction_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />
                          <span className="text-danger errormsg">
                            {errors.transaction_dt}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Order #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Bill No."
                            name="sobill_no"
                            id="sobill_no"
                            onChange={handleChange}
                            value={values.sobill_no}
                            isValid={touched.sobill_no && !errors.sobill_no}
                            isInvalid={!!errors.sobill_no}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.sobill_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Order Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <MyDatePicker
                            name="bill_dt"
                            placeholderText="DD/MM/YYYY"
                            id="bill_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("bill_dt", date);
                            }}
                            selected={values.bill_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />
                          <span className="text-danger errormsg">
                            {errors.bill_dt}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Sales A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={salesAccLst}
                            borderRadius="0px"
                            colors="#729"
                            name="salesAccId"
                            onChange={(v) => {
                              setFieldValue("salesAccId", v);
                            }}
                            value={values.salesAccId}
                          />

                          <span className="text-danger errormsg">
                            {errors.salesAccId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Client Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStylesWhite}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="clientNameId"
                            onChange={(v) => {
                              // if (v != null) {
                              //   setFieldValue(
                              //     "clientCodeId",
                              //     getSelectValue(supplierCodeLst, v.value)
                              //   );
                              // }
                              setFieldValue("clientNameId", v);
                            }}
                            value={values.clientNameId}
                          />

                          <span className="text-danger errormsg">
                            {errors.clientNameId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="12" className="mt-2 btn_align">
                        <Button className="create-btn " type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          // className="alterbtn"
                          onClick={(e) => {
                            e.preventDefault();
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

        <Collapse in={ConvertIntoChallan}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Convert Into Challan</h4>
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                initialValues={ChallaninitVal}
                validationSchema={Yup.object().shape({
                  sc_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  salesAccId: Yup.object().required("select sales account"),
                  scbill_no: Yup.string()
                    .trim()
                    .required("bill no is required"),
                  // bill_dt: Yup.string().required('Bill dt is required'),
                  // invoice_dt: Yup.string().required(
                  //   'invoice dt is required'
                  // ),
                  // clientCodeId: Yup.object().required("select client code"),
                  clientNameId: Yup.object().required("select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  values["selectedCounterSales"] = soBills;
                  console.log("values", values);

                  eventBus.dispatch(
                    "page_change",
                    "tranx_sales_order_to_challan"
                  );
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
                    {/* {JSON.stringify(errors)}; */}
                    <Row>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Challan Sr. #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="sc_sr_no"
                            id="sc_sr_no"
                            onChange={handleChange}
                            value={values.sc_sr_no}
                            isValid={touched.sc_sr_no && !errors.sc_sr_no}
                            isInvalid={!!errors.sc_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.sc_sr_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Challan Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <MyDatePicker
                            name="transaction_dt"
                            placeholderText="DD/MM/YYYY"
                            id="transaction_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("transaction_dt", date);
                            }}
                            selected={values.transaction_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />
                          <span className="text-danger errormsg">
                            {errors.transaction_dt}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Challan #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Bill No."
                            name="scbill_no"
                            id="scbill_no"
                            onChange={handleChange}
                            value={values.scbill_no}
                            isValid={touched.scbill_no && !errors.scbill_no}
                            isInvalid={!!errors.scbill_no}
                          />
                        </Form.Group>
                      </Col>

                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Sales A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={salesAccLst}
                            borderRadius="0px"
                            colors="#729"
                            name="salesAccId"
                            onChange={(v) => {
                              setFieldValue("salesAccId", v);
                            }}
                            value={values.salesAccId}
                          />
                        </Form.Group>
                      </Col>

                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Client Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            isDisabled={true}
                            className="selectTo"
                            styles={customStylesWhite}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="clientNameId"
                            onChange={(v) => {
                              setFieldValue("clientNameId", v);
                            }}
                            value={values.clientNameId}
                          />

                          <span className="text-danger errormsg">
                            {errors.clientNameId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="12" className="mt-4 btn_align">
                        <Button className="create-btn" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                              ConvertIntoChallan: !ConvertIntoChallan,
                            });
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

        <Collapse in={ConvertIntoInvoice}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Convert Into Invoice</h4>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={InvoiceinitVal}
                validationSchema={Yup.object().shape({
                  si_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  salesAccId: Yup.object().required("select sales account"),
                  sibill_no: Yup.string()
                    .trim()
                    .required("bill no is required"),
                  // bill_dt: Yup.string().required('Bill dt is required'),
                  // invoice_dt: Yup.string().required(
                  //   'invoice dt is required'
                  // ),
                  // clientCodeId: Yup.object().required("select client code"),
                  clientNameId: Yup.object().required("select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  values["selectedCounterSales"] = soBills;

                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_order_to_list",
                    to: "tranx_sales_order_to_invoice",
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
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Invoice Sr.#.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="si_sr_no"
                            id="si_sr_no"
                            onChange={handleChange}
                            value={values.si_sr_no}
                            isValid={touched.si_sr_no && !errors.si_sr_no}
                            isInvalid={!!errors.si_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.si_sr_no}
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
                            name="transaction_dt"
                            placeholderText="DD/MM/YYYY"
                            id="transaction_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("transaction_dt", date);
                            }}
                            selected={values.transaction_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />
                          <span className="text-danger errormsg">
                            {errors.transaction_dt}
                          </span>
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
                            placeholder="Bill No."
                            name="sibill_no"
                            id="sibill_no"
                            onChange={handleChange}
                            value={values.sibill_no}
                            isValid={touched.sibill_no && !errors.sibill_no}
                            isInvalid={!!errors.sibill_no}
                          />
                        </Form.Group>
                      </Col>

                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Sales A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={salesAccLst}
                            borderRadius="0px"
                            colors="#729"
                            name="salesAccId"
                            onChange={(v) => {
                              setFieldValue("salesAccId", v);
                            }}
                            value={values.salesAccId}
                          />
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Client Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>

                          <Select
                            isDisabled={true}
                            className="selectTo"
                            styles={customStylesWhite}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="clientNameId"
                            onChange={(v) => {
                              setFieldValue("clientNameId", v);
                            }}
                            value={values.clientNameId}
                          />

                          <span className="text-danger errormsg">
                            {errors.clientNameId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="12" className="mt-4 btn_align">
                        <Button className="create-btn" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          // className="alterbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                              ConvertIntoInvoice: !ConvertIntoInvoice,
                            });
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
                    // onChange={(date) => {
                    //   setFieldValue('bill_dt', date);
                    // }}
                    // selected={values.bill_dt}
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
                    // onChange={(date) => {
                    //   setFieldValue('bill_dt', date);
                    // }}
                    // selected={values.bill_dt}
                    maxDate={new Date()}
                    className="date-style text_center mt-1"
                  />
                </InputGroup>
              </Col>
              <Col md="4" className="mt-2 text-end">
                {/* {this.state.hide == 'true'} */}
                {soBills.length == 0 && !opendiv && (
                  <Button
                    className="create-btn mr-2"
                    onClick={(e) => {
                      e.preventDefault();
                      if (isActionExist("tranx_sales_order_list", "create")) {
                        this.setState({ opendiv: !opendiv });
                        this.setLastSalesQuotationSerialNo();
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
                {/* {JSON.stringify(selectedCounterSalesBills)} */}
                {soBills.length > 0 && !ConvertIntoChallan && (
                  <Button
                    className="createbtn mr-2"
                    //  disabled={selectedCounterSalesBills.length > 0}
                    // disabled={
                    //   selectedCounterSalesBills.length == 0 ? true : false
                    // }
                    onClick={(e) => {
                      e.preventDefault();

                      this.setLastSalesChallanSerialNo();
                    }}
                    aria-controls="example-collapse-text"
                    aria-expanded={ConvertIntoChallan}
                    // onClick={this.open}
                  >
                    To Challan
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
                {soBills.length > 0 && !ConvertIntoInvoice && (
                  <Button
                    className="createbtn mr-2"
                    onClick={(e) => {
                      e.preventDefault();

                      this.setLastSalesInvoiceSerialNo();
                    }}
                    aria-controls="example-collapse-text"
                    aria-expanded={ConvertIntoInvoice}
                    // onClick={this.open}
                  >
                    To Invoice
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

                <Button className="ml-2 refresh-btn" type="button">
                  Refresh
                </Button>
              </Col>
            </Row>
          )}
          {/* {salesInvoiceLst.length > 0 && ( */}
          <div className="table_wrapper row-inside">
            <Table hover size="sm" className="tbl-font mt-2">
              <thead>
                <tr>
                  <th
                    style={{ width: "5%" }}
                    className="counter-s-checkbox pl-0"
                  >
                    {selectedSDids != "" ? (
                      <Form.Group
                        controlId="formBasicCheckbox"
                        className="ml-1 mb-1"
                      >
                        <Form.Check
                          type="checkbox"
                          checked={isAllChecked === true ? true : false}
                          onChange={(e) => {
                            this.handleCounterSalesBillsSelectionAll(
                              e.target.checked
                            );
                          }}
                          label="Sr.No."
                        />
                      </Form.Group>
                    ) : (
                      "Sr.#."
                    )}
                  </th>
                  {/* )} */}
                  <th>Tranx Status</th>
                  <th>Sales Order #.</th>
                  <th>Sales Order Date</th>
                  <th>Sales A/c</th>
                  <th>Customer Name</th>
                  <th className="btn_align right_col">Total Amount</th>
                </tr>
                {/* </div> */}
              </thead>
              <tbody>
                {/* <div className="scrollban_new"> */}
                {salesInvoiceLst.map((v, i) => {
                  return (
                    <tr
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", {
                          from: "tranx_sales_order_list",
                          to: "tranx_sales_order_edit",
                          prop_data: v.id,
                          isNewTab: false,
                        });
                      }}
                    >
                      <td style={{ width: "5%" }}>
                        <Form.Group
                          controlId="formBasicCheckbox1"
                          className="ml-1 pmt-allbtn"
                        >
                          <Form.Check
                            type="checkbox"
                            disabled={v.sales_order_status == "closed"}
                            checked={soBills.includes(parseInt(v.id))}
                            onChange={(e) => {
                              // e.preventDefault();
                              this.handleCounterSalesBillsSelection(
                                v.id,
                                v.sundry_debtors_id,
                                e.target.checked
                              );
                            }}
                            label={i + 1}
                          />
                        </Form.Group>
                      </td>
                      <td>{v.sales_order_status}</td>
                      <td>{v.bill_no}</td>
                      <td>{moment(v.bill_date).format("DD-MM-YYYY")}</td>

                      <td>{v.sale_account_name}</td>
                      <td>{v.sundry_debtors_name}</td>

                      <td className="btn_align right_col">{v.total_amount}</td>
                    </tr>
                  );
                })}
                {/* </div> */}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
