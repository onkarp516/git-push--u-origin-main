import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
  CloseButton,
  Collapse,
  Card,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import Select from "react-select";
import {
  getPurchaseAccounts,
  getSundryCreditors,
  getPOInvoiceList,
  getLastPOInvoiceNo,
  getLastPurchaseInvoiceNo,
  getLastPOChallanInvoiceNo,
} from "@/services/api_functions";

import {
  ShowNotification,
  getSelectValue,
  customStyles,
  MyDatePicker,
  eventBus,
  customStylesWhite,
  isActionExist,
  MyNotifications,
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
    borderBottom: "1px solid #ccc",
    "&:focus": {
      borderBottom: "1px solid #1e3989",
    },
  }),
};

export default class POOrderList extends React.Component {
  constructor(props) {
    super(props);
    this.po_ref = React.createRef();
    this.po_invoice_ref = React.createRef();
    this.po_challan_ref = React.createRef();
    this.state = {
      show: false,
      showDiv: false,
      opendiv: false,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],
      selectetSCIds: "",
      selectetPOBills: [],
      ConvertIntoChallan: false,
      selectedOrderToInvoice: [],
      isAllChecked: false,
      convshow: false,
      convshowInvoice: false,
      ConvertIntoInvoice: false,
      successAlert: false,
      warningAlert: false,
      errorAlert: false,
      confirmAlert: false,
      initVal: {
        po_sr_no: 1,
        po_no: 1,
        po_transaction_dt: moment().format("YYYY-MM-DD"),
        po_invoice_dt: new Date(),
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
      invoiceInitVal: {
        pi_sr_no: 1,
        pi_no: 1,
        pi_transaction_dt: moment().format("YYYY-MM-DD"),
        pi_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
      challanInitVal: {
        pc_sr_no: 1,
        pc_no: 1,
        pc_transaction_dt: moment().format("YYYY-MM-DD"),
        pc_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
    };
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

  lstPOInvoice = () => {
    getPOInvoiceList()
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

  getLastPurchaseOrderSerialNo = () => {
    getLastPOInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { initVal } = this.state;
          initVal["po_sr_no"] = res.count;
          initVal["po_no"] = res.serialNo;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {});
  };

  getLastPurchaseChallanSerialNo = () => {
    getLastPOChallanInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { challanInitVal } = this.state;
          challanInitVal["pc_sr_no"] = res.count;
          challanInitVal["pc_no"] = res.serialNo;
          this.setState({
            opendiv: false,
            ConvertIntoInvoice: false,
            ConvertIntoChallan: true,
            challanInitVal: challanInitVal,
          });
        }
      })
      .catch((error) => {});
  };

  getLastPurchaseInvoiceSerialNo = () => {
    getLastPurchaseInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { invoiceInitVal } = this.state;
          invoiceInitVal["pi_sr_no"] = res.count;
          invoiceInitVal["pi_no"] = res.serialNo;
          this.setState({
            opendiv: false,
            ConvertIntoChallan: false,
            ConvertIntoInvoice: true,
            invoiceInitVal: invoiceInitVal,
          });
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
  handlePurchaseBillsSelection = (id, sundry_creditor_id, status) => {
    let {
      selectetPOBills,
      purchaseInvoiceLst,
      selectetSCIds,
      supplierCodeLst,
      supplierNameLst,
      invoiceInitVal,
      challanInitVal,
    } = this.state;

    if (status == true) {
      if (selectetPOBills.length == 0) {
        if (!selectetPOBills.includes(id)) {
          selectetPOBills = [...selectetPOBills, id];
        }

        invoiceInitVal["supplierCodeId"] = getSelectValue(
          supplierCodeLst,
          sundry_creditor_id + ""
        );
        invoiceInitVal["supplierNameId"] = getSelectValue(
          supplierNameLst,
          sundry_creditor_id + ""
        );
        challanInitVal["supplierCodeId"] = getSelectValue(
          supplierCodeLst,
          sundry_creditor_id + ""
        );
        challanInitVal["supplierNameId"] = getSelectValue(
          supplierNameLst,
          sundry_creditor_id + ""
        );
        this.setState({ selectetSCIds: sundry_creditor_id });
      } else {
        if (selectetSCIds == sundry_creditor_id) {
          if (!selectetPOBills.includes(id)) {
            selectetPOBills = [...selectetPOBills, id];
          }
        } else {
          ShowNotification("Error", "You have selected different supplier");
        }
      }
    } else {
      if (selectetSCIds == sundry_creditor_id) {
        if (!selectetPOBills.includes(id)) {
          selectetPOBills = [...selectetPOBills, id];
        } else {
          selectetPOBills = selectetPOBills.filter((v) => v != id);
        }
      }
    }

    this.setState(
      {
        isAllChecked:
          selectetPOBills.length == 0
            ? false
            : selectetPOBills.length === purchaseInvoiceLst.length
            ? true
            : false,
        selectetPOBills: selectetPOBills,
        invoiceInitVal: invoiceInitVal,
        challanInitVal: challanInitVal,
      },
      () => {
        if (this.state.selectetPOBills.length == 0) {
          invoiceInitVal["supplierCodeId"] = "";
          invoiceInitVal["supplierNameId"] = "";
          challanInitVal["supplierCodeId"] = "";
          challanInitVal["supplierNameId"] = "";
          this.setState({
            invoiceInitVal: invoiceInitVal,
            challanInitVal: challanInitVal,
            selectetSCIds: "",
          });
        }
      }
    );
  };

  handlePurchaseBillsSelectionAll = (status) => {
    let { purchaseInvoiceLst, selectetSCIds, invoiceInitVal, challanInitVal } =
      this.state;

    let lstSelected = [];
    let selectetsundryId = "";
    if (status == true) {
      purchaseInvoiceLst.map((v) => {
        if (
          v.sundry_creditor_id == selectetSCIds &&
          v.purchase_order_status == "opened"
        ) {
          lstSelected.push(v.id);
        }
      });
      selectetsundryId = selectetSCIds;
    } else {
      invoiceInitVal["supplierCodeId"] = "";
      invoiceInitVal["supplierNameId"] = "";
      challanInitVal["supplierCodeId"] = "";
      challanInitVal["supplierNameId"] = "";
    }

    this.setState(
      {
        isAllChecked: status,
        selectetPOBills: lstSelected,
        selectetSCIds: selectetsundryId,
        invoiceInitVal: invoiceInitVal,
        challanInitVal: challanInitVal,
      },
      () => {
        if (this.state.selectetPOBills.length == 0) {
          this.setState({ selectetSCIds: "" });
        }
      }
    );
  };

  setInitVal = () => {
    this.setState({
      show: false,
      showDiv: false,
      opendiv: false,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],
      selectetSCIds: "",
      selectetPOBills: [],
      ConvertIntoChallan: false,
      selectedOrderToInvoice: [],
      isAllChecked: false,
      convshow: false,
      convshowInvoice: false,
      ConvertIntoInvoice: false,
      initVal: {
        po_sr_no: 1,
        po_no: 1,
        po_transaction_dt: moment().format("YYYY-MM-DD"),
        po_invoice_dt: new Date(),
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
      invoiceInitVal: {
        pi_sr_no: 1,
        pi_no: 1,
        pi_transaction_dt: moment().format("YYYY-MM-DD"),
        pi_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
      challanInitVal: {
        pc_sr_no: 1,
        pc_no: 1,
        pc_transaction_dt: moment().format("YYYY-MM-DD"),
        pc_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
    });
  };

  componentDidMount() {
    this.getLastPurchaseOrderSerialNo();
    this.lstPurchaseAccounts();
    this.lstSundryCreditors();
    this.lstPOInvoice();
  }

  pageReload = () => {
    this.setInitVal();
    this.componentDidMount();
  };

  render() {
    const {
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      purchaseInvoiceLst,
      initVal,
      isAllChecked,
      opendiv,
      selectetPOBills,
      ConvertIntoChallan,
      ConvertIntoInvoice,
      challanInitVal,
      invoiceInitVal,
      selectetSCIds,
    } = this.state;

    return (
      <>
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Purchase Order</h4>
              <Formik
                innerRef={this.po_ref}
                validateOnChange={false}
                enableReinitialize={true}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  po_sr_no: Yup.string()
                    .trim()
                    .required("po serial no is required"),
                  po_no: Yup.string().trim().required("po no is required"),
                  po_transaction_dt: Yup.string().required(
                    "po date is required"
                  ),
                  purchaseId: Yup.object().required("Select Purchase Account."),
                  po_invoice_dt: Yup.string().required(
                    "Order date is required"
                  ),
                  supplierCodeId: Yup.object().required("Select supplier code"),
                  supplierNameId: Yup.object().required("Select supplier name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  eventBus.dispatch("page_change", {
                    from: "tranx_purchase_order_list",
                    to: "tranx_purchase_order_create",
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
                            Order Sr
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="po_sr_no"
                            id="po_sr_no"
                            onChange={handleChange}
                            value={values.po_sr_no}
                            isValid={touched.po_sr_no && !errors.po_sr_no}
                            isInvalid={!!errors.po_sr_no}
                            readOnly={true}
                          />

                          <span className="text-danger errormsg">
                            {errors.po_sr_no}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Transaction Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            readOnly={true}
                            type="date"
                            className="pl-2"
                            name="po_transaction_dt"
                            id="po_transaction_dt"
                            onChange={handleChange}
                            value={values.po_transaction_dt}
                            isValid={
                              touched.po_transaction_dt &&
                              !errors.po_transaction_dt
                            }
                            isInvalid={!!errors.po_transaction_dt}
                          />

                          <span className="text-danger errormsg">
                            {errors.po_transaction_dt}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Order #
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            readOnly={true}
                            type="text"
                            placeholder="Order No."
                            name="po_no"
                            id="po_no"
                            onChange={handleChange}
                            value={values.po_no}
                            isValid={touched.po_no && !errors.po_no}
                            isInvalid={!!errors.po_no}
                          />

                          <span className="text-danger errormsg">
                            {errors.po_no}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Order Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <MyDatePicker
                            name="po_invoice_dt"
                            placeholderText="DD/MM/YYYY"
                            id="po_invoice_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("po_invoice_dt", date);
                            }}
                            selected={values.po_invoice_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />

                          <span className="text-danger errormsg">
                            {errors.po_invoice_dt}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Purchase A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
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
                              setFieldValue("supplierNameId", v);
                              if (v != null) {
                                setFieldValue(
                                  "supplierCodeId",
                                  getSelectValue(supplierCodeLst, v.value)
                                );
                              } else {
                                setFieldValue("supplierCodeId", "");
                              }
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
                              } else {
                                setFieldValue("supplierNameId", "");
                              }
                            }}
                            value={values.supplierCodeId}
                          />

                          <span className="text-danger errormsg">
                            {errors.supplierCodeId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="7" className="mt-4 pt-1 btn_align">
                        <Button className="submit-btn" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            this.po_ref.current.resetForm();
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
                innerRef={this.po_challan_ref}
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={challanInitVal}
                validationSchema={Yup.object().shape({
                  pc_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  pc_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  pc_transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  purchaseId: Yup.object().required("Select Purchase Acc."),
                  pc_invoice_dt: Yup.string().required("Bill dt is required"),
                  supplierCodeId: Yup.object().required("select client name"),
                  supplierNameId: Yup.object().required("select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  values["selectedCounterSales"] = selectetPOBills;

                  eventBus.dispatch("page_change", {
                    to: "tranx_purchase_order_to_challan",
                    prop_data: values,
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
                            Challan Sr.No.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="pc_sr_no"
                            id="pc_sr_no"
                            onChange={handleChange}
                            value={values.pc_sr_no}
                            isValid={touched.pc_sr_no && !errors.pc_sr_no}
                            isInvalid={!!errors.pc_sr_no}
                            readOnly={true}
                          />

                          <span className="text-danger errormsg">
                            {errors.pc_sr_no}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Transaction Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            readOnly={true}
                            type="date"
                            name="pc_transaction_dt"
                            id="pc_transaction_dt"
                            onChange={handleChange}
                            value={values.pc_transaction_dt}
                            isValid={
                              touched.pc_transaction_dt &&
                              !errors.pc_transaction_dt
                            }
                            isInvalid={!!errors.pc_transaction_dt}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pc_transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Challan #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            readOnly={true}
                            type="text"
                            placeholder="pc_no"
                            name="pc_no"
                            id="pc_no"
                            onChange={handleChange}
                            value={values.pc_no}
                            isValid={touched.pc_no && !errors.pc_no}
                            isInvalid={!!errors.pc_no}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.pc_no}
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
                            name="pc_invoice_dt"
                            placeholderText="DD/MM/YYYY"
                            id="pc_invoice_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("pc_invoice_dt", date);
                            }}
                            selected={values.pc_invoice_dt}
                            minDate={new Date()}
                            className="date-style"
                          />

                          <span className="text-danger errormsg">
                            {errors.pc_invoice_dt}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Purchase A/c{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={purchaseAccLst}
                            borderRadius="0px"
                            colors="#729"
                            placeholder="Select"
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
                            isDisabled={true}
                            className="selectTo"
                            styles={customStylesWhite}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="supplierNameId"
                            onChange={(v) => {
                              setFieldValue("supplierNameId", v);
                              if (v != null) {
                                setFieldValue(
                                  "supplierCodeId",
                                  getSelectValue(supplierCodeLst, v.value)
                                );
                              } else {
                                setFieldValue("supplierCodeId", "");
                              }
                            }}
                            value={values.supplierNameId}
                          />

                          <span className="text-danger">
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
                            isDisabled={true}
                            className="selectTo"
                            styles={customStylesWhite}
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
                              } else {
                                setFieldValue("supplierNameId", "");
                              }
                            }}
                            value={values.supplierCodeId}
                          />

                          <span className="text-danger">
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
                            this.po_challan_ref.current.resetForm();
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
                innerRef={this.po_invoice_ref}
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={invoiceInitVal}
                validationSchema={Yup.object().shape({
                  pi_sr_no: Yup.string()
                    .trim()
                    .required("Invoice serial no is required"),
                  pi_no: Yup.string()
                    .trim()
                    .required("Inovoice no is required"),
                  pi_transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  purchaseId: Yup.object().required("select sales account"),
                  pi_invoice_dt: Yup.string().required("Bill dt is required"),
                  supplierCodeId: Yup.object().required("select client name"),
                  supplierNameId: Yup.object().required("select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  values["selectedCounterSales"] = selectetPOBills;
                  eventBus.dispatch("page_change", {
                    from: "tranx_purchase_order_list",
                    to: "tranx_purchase_order_to_invoice",
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
                            Invoice Sr. #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>{" "}
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
                          <Form.Control
                            readOnly={true}
                            type="date"
                            name="pi_transaction_dt"
                            id="pi_transaction_dt"
                            onChange={handleChange}
                            value={values.pi_transaction_dt}
                            isValid={
                              touched.pi_transaction_dt &&
                              !errors.pi_transaction_dt
                            }
                            isInvalid={!!errors.pi_transaction_dt}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pi_transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Invoice No.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            readOnly={true}
                            type="text"
                            placeholder="pi_no"
                            name="pi_no"
                            id="pi_no"
                            onChange={handleChange}
                            value={values.pi_no}
                            isValid={touched.pi_no && !errors.pi_no}
                            isInvalid={!!errors.pi_no}
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
                            minDate={new Date()}
                            className="date-style"
                          />

                          <span className="text-danger errormsg">
                            {errors.pi_invoice_dt}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Purchase A/c{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={purchaseAccLst}
                            borderRadius="0px"
                            colors="#729"
                            placeholder="Select"
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
                            isDisabled={true}
                            className="selectTo"
                            styles={customStylesWhite}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="supplierNameId"
                            onChange={(v) => {
                              setFieldValue("supplierNameId", v);
                              if (v != null) {
                                setFieldValue(
                                  "supplierCodeId",
                                  getSelectValue(supplierCodeLst, v.value)
                                );
                              } else {
                                setFieldValue("supplierCodeId", "");
                              }
                            }}
                            value={values.supplierNameId}
                          />

                          <span className="text-danger">
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
                            isDisabled={true}
                            className="selectTo"
                            styles={customStylesWhite}
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
                              } else {
                                setFieldValue("supplierNameId", "");
                              }
                            }}
                            value={values.supplierCodeId}
                          />

                          <span className="text-danger">
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
                            this.po_invoice_ref.current.resetForm();
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
          {!opendiv && !ConvertIntoChallan && !ConvertIntoInvoice && (
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
                    maxDate={new Date()}
                    className="date-style text_center mt-1"
                  />
                </InputGroup>
              </Col>

              <Col md="4" className="mt-2 text-end">
                {selectetPOBills.length == 0 && !opendiv && (
                  <>
                    <Button
                      className="create-btn mr-2"
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   this.setState({ opendiv: !opendiv });
                      //   this.getLastPurchaseOrderSerialNo();
                      // }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          isActionExist("tranx_sales_challan_list", "create")
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
                    <Button
                      className="ml-2 refresh-btn"
                      type="button"
                      onClick={() => {
                        this.pageReload();
                      }}
                    >
                      Refresh
                    </Button>
                  </>
                )}
                {selectetPOBills.length > 0 && !ConvertIntoChallan && (
                  <Button
                    className="create-btn mr-2"
                    onClick={(e) => {
                      e.preventDefault();
                      this.getLastPurchaseChallanSerialNo();
                    }}
                    aria-controls="example-collapse-text"
                    aria-expanded={ConvertIntoChallan}
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
                {selectetPOBills.length > 0 && !ConvertIntoInvoice && (
                  <Button
                    className="create-btn mr-2"
                    onClick={(e) => {
                      e.preventDefault();
                      this.getLastPurchaseInvoiceSerialNo();
                    }}
                    aria-controls="example-collapse-text"
                    aria-expanded={ConvertIntoInvoice}
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
              </Col>
            </Row>
          )}

          <div className="table_wrapper row-inside">
            <Table hover size="sm" className="tbl-font mt-2">
              <thead>
                <tr>
                  <th className="counter-s-checkbox pl-0">
                    {selectetSCIds != "" ? (
                      <Form.Group
                        controlId="formBasicCheckbox"
                        className="ml-1 mb-1"
                      >
                        <Form.Check
                          type="checkbox"
                          checked={isAllChecked === true ? true : false}
                          onChange={(e) => {
                            this.handlePurchaseBillsSelectionAll(
                              e.target.checked
                            );
                          }}
                          label=" #."
                        />
                      </Form.Group>
                    ) : (
                      " #."
                    )}
                  </th>
                  <th>Tranx Status</th>
                  <th>Order #.</th>
                  <th>Transaction Date</th>
                  <th>Order Date</th>
                  <th>Purchase Account</th>
                  <th>Supplier Name</th>
                  <th className="btn_align right_col">Total Amount</th>
                </tr>
                {/* </div> */}
              </thead>
              <tbody className="tabletrcursor">
                {purchaseInvoiceLst.length > 0 ? (
                  purchaseInvoiceLst.map((v, i) => {
                    return (
                      <tr>
                        <td style={{ width: "5%" }}>
                          <Form.Group
                            controlId="formBasicCheckbox1"
                            className="ml-1 pmt-allbtn"
                          >
                            <Form.Check
                              disabled={v.purchase_order_status == "closed"}
                              type="checkbox"
                              checked={selectetPOBills.includes(parseInt(v.id))}
                              onChange={(e) => {
                                this.handlePurchaseBillsSelection(
                                  v.id,
                                  v.sundry_creditor_id,
                                  e.target.checked
                                );
                              }}
                              label={i + 1}
                            />
                          </Form.Group>
                        </td>
                        <td style={{ width: "10%" }}>
                          {v.purchase_order_status}
                        </td>
                        <td>{v.invoice_no}</td>
                        <td>
                          {moment(v.transaction_date).format("DD-MM-YYYY")}
                        </td>
                        <td>{moment(v.invoice_date).format("DD-MM-YYYY")}</td>

                        <td>{v.purchase_account_name}</td>
                        <td>{v.sundry_creditor_name}</td>
                        <td className="btn_align right_col">
                          {v.total_amount}
                        </td>
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
