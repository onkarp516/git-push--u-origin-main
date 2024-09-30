import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
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
  getPOChallanInvoiceList,
  getLastPurchaseInvoiceNo,
  getLastPOChallanInvoiceNo,
} from "@/services/api_functions";
import {
  ShowNotification,
  MyDatePicker,
  customStyles,
  getSelectValue,
  eventBus,
  customStylesWhite,
  isActionExist,
  MyNotifications,
} from "@/helpers";
export default class POChallanList extends React.Component {
  constructor(props) {
    super(props);
    this.pc_ref = React.createRef();
    this.po_invoice_ref = React.createRef();
    this.state = {
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],
      selectedPCBills: [],
      ConvertIntoInvoice: false,
      isAllChecked: false,
      opendiv: false,
      selectetSCId: "",
      initVal: {
        pc_sr_no: 1,
        pc_no: 1,
        pc_transaction_dt: moment().format("YYYY-MM-DD"),
        pc_invoice_date: new Date(),
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

  lstPOChallanInvoice = () => {
    getPOChallanInvoiceList()
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

  getLastPurchaseChallanSerialNo = () => {
    getLastPOChallanInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { initVal } = this.state;
          initVal["pc_sr_no"] = res.count;
          initVal["pc_no"] = res.serialNo;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {});
  };

  getLastPurchaseInvoiceSerialNo = () => {
    getLastPurchaseInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoiceInitVal } = this.state;
          invoiceInitVal["pi_sr_no"] = res.count;
          invoiceInitVal["pi_no"] = res.serialNo;
          this.setState({
            invoiceInitVal: invoiceInitVal,
            ConvertIntoInvoice: true,
            opendiv: false,
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

  handlePurchaseChallanSelection = (id, sundry_creditor_id, status) => {
    let {
      selectedPCBills,
      purchaseInvoiceLst,
      selectetSCId,
      supplierCodeLst,
      supplierNameLst,
      invoiceInitVal,
    } = this.state;
    if (status == true) {
      if (selectedPCBills.length == 0) {
        if (!selectedPCBills.includes(id)) {
          selectedPCBills = [...selectedPCBills, id];
        }

        invoiceInitVal["supplierCodeId"] = getSelectValue(
          supplierCodeLst,
          sundry_creditor_id + ""
        );
        invoiceInitVal["supplierNameId"] = getSelectValue(
          supplierNameLst,
          sundry_creditor_id + ""
        );
        this.setState({ selectetSCId: sundry_creditor_id });
      } else {
        if (selectetSCId == sundry_creditor_id) {
          if (!selectedPCBills.includes(id)) {
            selectedPCBills = [...selectedPCBills, id];
          }
        } else {
          ShowNotification("Error", "You have selected different supplier");
        }
      }
    } else {
      if (selectetSCId == sundry_creditor_id) {
        if (!selectedPCBills.includes(id)) {
          selectedPCBills = [...selectedPCBills, id];
        } else {
          selectedPCBills = selectedPCBills.filter((v) => v != id);
        }
      }
    }
    // this.setState({
    //   selectedPCBills: selectedPCBills,
    // });

    this.setState(
      {
        isAllChecked:
          selectedPCBills.length == 0
            ? false
            : selectedPCBills.length === purchaseInvoiceLst.length
            ? true
            : false,
        selectedPCBills: selectedPCBills,
        invoiceInitVal: invoiceInitVal,
      },
      () => {
        if (this.state.selectedPCBills.length == 0) {
          invoiceInitVal["supplierCodeId"] = "";
          invoiceInitVal["supplierNameId"] = "";
          this.setState({
            invoiceInitVal: invoiceInitVal,
            selectetSCId: "",
          });
        }
      }
    );
  };

  handlePurchaseChallanSelectionAll = (status) => {
    let { purchaseInvoiceLst, selectetSCId, invoiceInitVal } = this.state;

    let lstSelected = [];
    let selectetsundryId = "";
    if (status == true) {
      purchaseInvoiceLst.map((v) => {
        if (
          v.sundry_creditor_id == selectetSCId &&
          v.purchase_challan_status == "opened"
        ) {
          lstSelected.push(v.id);
        }
      });
      selectetsundryId = selectetSCId;
    } else {
      invoiceInitVal["supplierCodeId"] = "";
      invoiceInitVal["supplierNameId"] = "";
    }

    this.setState(
      {
        isAllChecked: status,
        selectedPCBills: lstSelected,
        selectetSCId: selectetsundryId,
        invoiceInitVal: invoiceInitVal,
      },
      () => {
        if (this.state.selectedPCBills.length == 0) {
          this.setState({ selectetSCId: "" });
        }
      }
    );
  };

  setInitVal = () => {
    this.setState({
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],
      selectedPCBills: [],
      ConvertIntoInvoice: false,
      isAllChecked: false,
      opendiv: false,
      selectetSCId: "",
      initVal: {
        pc_sr_no: 1,
        pc_no: 1,
        pc_transaction_dt: moment().format("YYYY-MM-DD"),
        pc_invoice_date: new Date(),
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
    });
  };

  pageReload = () => {
    this.setInitVal();
    this.componentDidMount();
  };

  handleKeyDown = (event) => {
    event.stopPropagation();
    const { rowVirtualizer, config, id } = this.tableManager.current;
    const { scrollToOffset, scrollToIndex } = rowVirtualizer;
    const { header } = config.additionalProps;
    const { currentScrollPosition, setcurrentscrollposition } = header;
    let scrollPosition = 0;
    switch (event.key) {
      case "ArrowUp":
        let elem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
        if (elem != undefined && elem != null) {
          let up_row_id = elem.getAttribute("data-row-id");
          let up_id = elem.getAttribute("data-row-index");
          let uprowIndex = parseInt(up_id) - 1;
          if (uprowIndex > 0) {
            document
              .querySelectorAll(`#${id} .rgt-row-focus`)
              .forEach((cell) => cell.classList.remove("rgt-row-focus"));

            document
              .querySelectorAll(`#${id} .rgt-row-${uprowIndex}`)
              .forEach((cell) => cell.classList.add("rgt-row-focus"));
            scrollToIndex(uprowIndex - 3);
          }
        }

        break;

      case "ArrowDown":
        let downelem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
        if (downelem != undefined && downelem != null) {
          let d_id = downelem.getAttribute("data-row-index");
          let rowIndex = parseInt(d_id) + 1;
          document
            .querySelectorAll(`#${id} .rgt-row-focus`)
            .forEach((cell) => cell.classList.remove("rgt-row-focus"));
          document
            .querySelectorAll(`#${id} .rgt-row-${rowIndex}`)
            .forEach((cell) => cell.classList.add("rgt-row-focus"));
          scrollToIndex(rowIndex + 2);
        }
        break;
      case "e":
        if (id != undefined && id != null) {
          let downelem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
          if (downelem != undefined && downelem != null) {
            let d_index_id = downelem.getAttribute("data-row-index");
            let data_id = downelem.getAttribute("data-row-id");
            let rowIndex = parseInt(d_index_id) + 1;

            eventBus.dispatch("page_change", {
              from: "tranx_purchase_challan_list",
              to: "tranx_purchase_challan_edit",
              isNewTab: false,
              prop_data: data_id,
            });
          }
        }
        break;
      default:
        break;
    }
  };

  componentDidMount() {
    this.lstPurchaseAccounts();
    this.lstSundryCreditors();
    this.lstPOChallanInvoice();
  }

  render() {
    const {
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      purchaseInvoiceLst,
      opendiv,
      initVal,
      invoiceInitVal,
      isAllChecked,
      selectedPCBills,
      ConvertIntoInvoice,
      selectetSCId,
      selectetPCBills,
    } = this.state;

    return (
      // <div className="">
      //   <div className="dashboardpg institutepg">
      //     {/* <h6>Purchase</h6> */}
      //     <div className="wrapper_div">
      //       <div className="cust_table">

      <>
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Purchase Challan</h4>
              <Formik
                innerRef={this.pc_ref}
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  pc_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  pc_transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  purchaseId: Yup.object().required("Select purchase account"),
                  pc_no: Yup.string().trim().required("invoice no is required"),
                  pc_invoice_date: Yup.string().required(
                    "Challan date is required"
                  ),
                  supplierCodeId: Yup.object().required("Select supplier code"),
                  supplierNameId: Yup.object().required("Select supplier name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // window.electron.ipcRenderer.webPageChange({
                  //   to: "tranx_purchase_challan_create",
                  //   prop_data: values,
                  //   isNewTab: false,
                  // });
                  eventBus.dispatch("page_change", {
                    to: "tranx_purchase_challan_create",
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
                    {/* {JSON.stringify(values, undefined, 2)}
                            {JSON.stringify(errors, undefined, 2)} */}
                    <Row>
                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Challan Sr.
                            <span className="pt-1 pl-1 req_validation">
                              *
                            </span>{" "}
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
                          <Form.Control.Feedback type="invalid">
                            {errors.pc_sr_no}
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
                            type="date"
                            className="pl-2"
                            name="pc_transaction_dt"
                            id="pc_transaction_dt"
                            onChange={handleChange}
                            value={values.pc_transaction_dt}
                            isValid={
                              touched.pc_transaction_dt &&
                              !errors.pc_transaction_dt
                            }
                            isInvalid={!!errors.pc_transaction_dt}
                            readOnly={true}
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
                            type="text"
                            placeholderText="Challan No."
                            name="pc_no"
                            id="pc_no"
                            onChange={handleChange}
                            value={values.pc_no}
                            isValid={touched.pc_no && !errors.pc_no}
                            isInvalid={!!errors.pc_no}
                            readOnly={true}
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
                            placeholderText="DD/MM/YYYY"
                            name="pc_invoice_date"
                            id="pc_invoice_date"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("pc_invoice_date", date);
                            }}
                            selected={values.pc_invoice_date}
                            minDate={new Date()}
                            className="date-style"
                          />

                          <span className="text-danger errormsg">
                            {errors.pc_invoice_date}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="4">
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
                      <Col md="7" className="btn_align mt-4">
                        <Button className="create-btn" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            this.pc_ref.current.resetForm();
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
                  values["selectedCounterSales"] = selectedPCBills;
                  // window.electron.ipcRenderer.webPageChange({
                  //   to: "tranx_purchase_challan_to_invoice",
                  //   prop_data: values,
                  //   isNewTab: false,
                  // });
                  eventBus.dispatch("page_change", {
                    to: "tranx_purchase_challan_to_invoice",
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
                            readOnly={true}
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
                            placeholder="pi_no"
                            name="pi_no"
                            id="pi_no"
                            onChange={handleChange}
                            value={values.pi_no}
                            isValid={touched.pi_no && !errors.pi_no}
                            isInvalid={!!errors.pi_no}
                            readOnly={true}
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
                            placeholderText="dd/MM/yyyy"
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

                      <Col md="4">
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
                      <Col md="7" className="btn_align mt-4">
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
                {selectedPCBills.length == 0 && !opendiv && (
                  <>
                    <Button
                      className="create-btn mr-2"
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   this.setState({ opendiv: !opendiv });
                      //   this.getLastPurchaseChallanSerialNo();
                      // }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          isActionExist("tranx_purchase_challan_list", "create")
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
                      // onClick={this.open}
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
                      onClick={() => {
                        this.pageReload();
                      }}
                    >
                      Refresh
                    </Button>
                  </>
                )}
                {selectedPCBills.length > 0 && !ConvertIntoInvoice && (
                  <Button
                    className="create-btn mr-2"
                    onClick={(e) => {
                      e.preventDefault();
                      this.getLastPurchaseInvoiceSerialNo();
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
              </Col>
            </Row>
          )}

          {/* {purchaseInvoiceLst.length > 0 && ( */}
          <div className="table_wrapper row-inside">
            <Table bordered hover size="sm" className="tbl-font mt-2">
              <thead>
                <tr>
                  <th
                    style={{ width: "5%" }}
                    className="counter-s-checkbox pl-0"
                  >
                    {selectetSCId != "" ? (
                      <Form.Group
                        controlId="formBasicCheckbox"
                        className="ml-1 mb-1"
                      >
                        <Form.Check
                          type="checkbox"
                          checked={isAllChecked === true ? true : false}
                          onChange={(e) => {
                            this.handlePurchaseChallanSelectionAll(
                              e.target.checked
                            );
                          }}
                          label="Sr.#."
                        />
                      </Form.Group>
                    ) : (
                      "Sr.#."
                    )}
                  </th>
                  <th>Tranx Status</th>
                  <th>Challan #.</th>
                  <th>Transaction Date</th>
                  <th>Challan Date</th>
                  <th>Purchase Account</th>
                  <th>Supplier Name</th>
                  <th className="btn_align right_col">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* <div className="scrollban_new"> */}
                {purchaseInvoiceLst.length > 0 ? (
                  purchaseInvoiceLst.map((v, i) => {
                    return (
                      <tr
                      // onDoubleClick={(e) => {
                      //   e.preventDefault();
                      //   window.electron.ipcRenderer.webPageChange({
                      //     from: 'tranx_purchase_challan_list',
                      //     to: 'tranx_purchase_challan_edit',
                      //     prop_data: v.id,
                      //     isNewTab: false,
                      //   });
                      // }}
                      >
                        <td style={{ width: "5%" }}>
                          <Form.Group
                            controlId="formBasicCheckbox1"
                            className="ml-1 pmt-allbtn"
                          >
                            <Form.Check
                              disabled={v.purchase_challan_status == "closed"}
                              type="checkbox"
                              checked={selectedPCBills.includes(parseInt(v.id))}
                              onChange={(e) => {
                                this.handlePurchaseChallanSelection(
                                  v.id,
                                  v.sundry_creditor_id,
                                  e.target.checked
                                );
                              }}
                              label={i + 1}
                            />
                          </Form.Group>
                        </td>
                        <td>{v.purchase_challan_status}</td>
                        <td>{v.invoice_no}</td>
                        <td>
                          {moment(v.transaction_date).format("DD-MM-YYYY")}
                        </td>
                        <td>{moment(v.invoice_date).format("DD-MM-YYYY")}</td>
                        <td>{v.purchase_account_name}</td>
                        <td>{v.sundry_creditor_name}</td>
                        <td style={{ width: "15%" }} className="btn_align">
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
                {/* </div> */}
              </tbody>
            </Table>
          </div>
        </div>
      </>
    );
  }
}
