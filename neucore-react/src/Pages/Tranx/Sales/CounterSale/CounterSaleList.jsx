import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
  Collapse,
} from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";
//import "./css/purchace.scss";
// import "../../assets/scss/style.scss";
import moment from "moment";
import {
  getCounterSaleLastInvoice,
  getSalesAccounts,
  getLastSalesInvoiceNo,
  getSundryDebtors,
} from "@/services/api_functions";
import Select from "react-select";

import {
  MyDatePicker,
  customStyles,
  eventBus,
  isActionExist,
  MyNotifications,
} from "@/helpers";

export default class CounterSaleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      opendiv: false,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      salesAccLst: [],
      counterSalesInvoiceLst: [],
      initVal: {
        counter_sales_no: 1,
        transaction_dt: new Date(),
        customer_name: "",
        customer_mobile: "",
      },
      convInitVal: {
        sales_sr_no: 1,
        transaction_dt: moment().format("YYYY-MM-DD"),
        salesId: "",
        bill_no: "",
        bill_dt: "",
        clientCodeId: "",
        clientNameId: "",
        selectedCounterSales: [],
      },
      selectedCounterSalesBills: [],
      isAllChecked: false,
      convshow: false,
    };
  }

  pageReload = () => {
    this.componentDidMount();
  };

  setLastSalesSerialNo = () => {
    getLastSalesInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { convInitVal } = this.state;
          convInitVal["sales_sr_no"] = res.count;
          this.setState({ convInitVal: convInitVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  setCounterSaleLastInvoice = () => {
    getCounterSaleLastInvoice()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          initVal["counter_sales_no"] = res.count;
          this.setState({ initVal: initVal });
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

  handleConvertBill = () => {
    const { id, rowSelectionApi } = this.tableManager.current;
    console.log({ id });
    console.log(
      "rowSelectionApi.selectedRowsIds ",
      rowSelectionApi.selectedRowsIds
    );
    this.setState({
      selectedCounterSalesBills: rowSelectionApi.selectedRowsIds,
    });
    let { selectedCounterSalesBills } = this.state;
    console.log({ selectedCounterSalesBills });
    this.setState({ convshow: true });
  };

  componentDidMount() {
    this.setCounterSaleLastInvoice();
    this.lstSundrydebtors();
    this.lstSalesAccounts();
    this.setLastSalesSerialNo();
  }

  render() {
    const {
      show,
      counterSalesInvoiceLst,
      initVal,
      opendiv,
      isAllChecked,
      selectedCounterSalesBills,
      convshow,
      salesAccLst,
      supplierNameLst,
      convInitVal,
    } = this.state;

    return (
      <div className="">
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Sales Quotation</h4>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={initVal}
                enableReinitialize={true}
                // validationSchema={Yup.object().shape({
                //   counter_sales_no: 1,
                //   transaction_dt: moment().format('YYYY-MM-DD'),
                //   customer_name: '',
                //   customer_mobile: '',
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  console.log("values", values);

                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_countersale_list",
                    to: "tranx_sales_countersale_create",
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
                          <Form.Label>Bill #.</Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="counter_sales_no"
                            id="counter_sales_no"
                            onChange={handleChange}
                            value={values.counter_sales_no}
                            isValid={
                              touched.counter_sales_no &&
                              !errors.counter_sales_no
                            }
                            isInvalid={!!errors.counter_sales_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.counter_sales_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="1">
                        <Form.Group>
                          <Form.Label>Bill Date</Form.Label>

                          <MyDatePicker
                            name="transaction_dt"
                            placeholderText="DD/MM/YYYY"
                            id="transaction_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("transaction_dt", date);
                            }}
                            selected={values.transaction_dt}
                            value={values.transaction_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="4">
                        <Form.Group>
                          <Form.Label>Customer Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Customer Name"
                            name="customer_name"
                            id="customer_name"
                            onChange={handleChange}
                            value={values.customer_name}
                            isValid={
                              touched.customer_name && !errors.customer_name
                            }
                            isInvalid={!!errors.customer_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.customer_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>Mobile No.</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Mobile No."
                            name="customer_mobile"
                            id="customer_mobile"
                            onChange={handleChange}
                            value={values.customer_mobile}
                            isValid={
                              touched.customer_mobile && !errors.customer_mobile
                            }
                            isInvalid={!!errors.customer_mobile}
                            maxLength={10}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.customer_mobile}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="3" className="btn_align mt-4">
                        <Button className="create-btn" type="submit">
                          Submit
                        </Button>
                        <Button variant="secondary cancel-btn">Cancel</Button>
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
                {!opendiv && (
                  <Button
                    className="create-btn mr-2"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        isActionExist("tranx_sales_countersale_list", "create")
                      ) {
                        this.setState({ opendiv: !opendiv });
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
                  onClick={(e) => {
                    e.preventDefault();
                    this.pageReload();
                  }}
                >
                  Refresh
                </Button>
              </Col>
            </Row>
          )}

          <div className="table_wrapper row-inside">
            <Table hover size="sm" className="tbl-font mt-2">
              <thead>
                {/* <div className="scrollbar_hd"> */}
                <tr>
                  {/* {this.state.showDiv && ( */}
                  <th style={{ width: "4%" }}>Sr. #.</th>
                  {/* )} */}
                  <th>Bill #.</th>
                  <th>Transaction Date</th>
                  <th>Mobile No.</th>
                  <th>Customer Name</th>
                  <th className="btn_align">Total Amt</th>
                </tr>
                {/* </div> */}
              </thead>
              <tbody>
                {/* <div className="scrollban_new"> */}
                <tr>
                  <td style={{ width: "4%" }}>1</td>
                  <td>V12212021</td>
                  <td>21-12-2021</td>
                  <td>+91 9878675645</td>
                  <td>Siddharth</td>

                  <td className="btn_align">4400.00</td>
                </tr>
                {/* </div> */}
              </tbody>
            </Table>
          </div>
          <Modal
            show={show}
            size="lg"
            className="mainmodal mt-5"
            onHide={() => this.setState({ show: false })}
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header
              closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Counter Sale
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
              <div className="institute-head purchasescreen">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  initialValues={initVal}
                  // validationSchema={Yup.object().shape({
                  //   counter_sales_no: 1,
                  //   transaction_dt: moment().format("YYYY-MM-DD"),
                  //   customer_name: "",
                  //   customer_mobile: "",
                  // })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    console.log("values", values);

                    eventBus.dispatch("page_change", {
                      from: "tranx_sales_countersale_list",
                      to: "tranx_sales_countersale_create",
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
                    <Form onSubmit={handleSubmit} noValidate>
                      <Row>
                        <Col md="2">
                          <Form.Group>
                            <Form.Label>Bill No.</Form.Label>
                            <Form.Control
                              type="text"
                              className="pl-2"
                              placeholder=" "
                              name="counter_sales_no"
                              id="counter_sales_no"
                              onChange={handleChange}
                              value={values.counter_sales_no}
                              isValid={
                                touched.counter_sales_no &&
                                !errors.counter_sales_no
                              }
                              isInvalid={!!errors.counter_sales_no}
                              readOnly={true}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.counter_sales_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>Bill Date</Form.Label>
                            <Form.Control
                              type="date"
                              className="pl-2"
                              name="transaction_dt"
                              id="transaction_dt"
                              onChange={handleChange}
                              value={values.transaction_dt}
                              isValid={
                                touched.transaction_dt && !errors.transaction_dt
                              }
                              isInvalid={!!errors.transaction_dt}
                              readOnly={true}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.transaction_dt}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md="4">
                          <Form.Group>
                            <Form.Label>Customer Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Customer Name"
                              name="customer_name"
                              id="customer_name"
                              onChange={handleChange}
                              value={values.customer_name}
                              isValid={
                                touched.customer_name && !errors.customer_name
                              }
                              isInvalid={!!errors.customer_name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.customer_name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>Mobile No.</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Mobile No."
                              name="customer_mobile"
                              id="customer_mobile"
                              onChange={handleChange}
                              value={values.customer_mobile}
                              isValid={
                                touched.customer_mobile &&
                                !errors.customer_mobile
                              }
                              isInvalid={!!errors.customer_mobile}
                              maxLength={10}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.customer_mobile}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="2">
                          <Button className="createbtn" type="submit">
                            Submit
                          </Button>
                          {/* <Button className="alterbtn">Alter</Button> */}
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </div>
            </Modal.Body>
          </Modal>

          <Modal
            show={convshow}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ convshow: false })}
            // dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header
              closeButton
              closeVariant="white"
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Sales Invoice
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal ">
              <div className="purchasescreen">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  initialValues={convInitVal}
                  validationSchema={Yup.object().shape({
                    sales_sr_no: Yup.string()
                      .trim()
                      .required("Purchase no is required"),
                    transaction_dt: Yup.string().required(
                      "Transaction date is required"
                    ),
                    salesAccId: Yup.object().required("select sales account"),
                    bill_no: Yup.string()
                      .trim()
                      .required("bill no is required"),
                    bill_dt: Yup.string().required("Bill dt is required"),
                    // clientCodeId: Yup.object().required("select client code"),
                    clientNameId: Yup.object().required("select client name"),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    console.log("values", values);
                    values["selectedCounterSales"] = selectedCounterSalesBills;

                    eventBus.dispatch("page_change", {
                      from: "tranx_sales_countersale_list",
                      to: "tranx_sales_countersale_to_invoice",
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
                    <Form onSubmit={handleSubmit} noValidate>
                      <Row>
                        <Col md="2">
                          <Form.Group>
                            <Form.Label>
                              Sales Sr. #.{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>{" "}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              className="pl-2"
                              placeholder=" "
                              name="sales_sr_no"
                              id="sales_sr_no"
                              onChange={handleChange}
                              value={values.sales_sr_no}
                              isValid={
                                touched.sales_sr_no && !errors.sales_sr_no
                              }
                              isInvalid={!!errors.sales_sr_no}
                              readOnly={true}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.sales_sr_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="4">
                          <Form.Group className="createnew">
                            <Form.Label>
                              Sales A/c.{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
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

                        <Col md="3">
                          <Form.Group>
                            <Form.Label>
                              Bill #.{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Bill No."
                              name="bill_no"
                              id="bill_no"
                              onChange={handleChange}
                              value={values.bill_no}
                              isValid={touched.bill_no && !errors.bill_no}
                              isInvalid={!!errors.bill_no}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.bill_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md="3">
                          <Form.Group>
                            <Form.Label>
                              Bill Date{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="bill_dt"
                              id="bill_dt"
                              onChange={handleChange}
                              value={values.bill_dt}
                              // isValid={
                              //   touched.bill_dt && !errors.bill_dt
                              // }
                              // isInvalid={!!errors.bill_dt}
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              // minLength={new Date()}
                            />
                            {/* <Form.Control.Feedback type="invalid">
                                {errors.bill_dt}
                              </Form.Control.Feedback> */}
                            <span className="text-danger errormsg">
                              {errors.bill_dt}
                            </span>
                          </Form.Group>
                        </Col>

                        <Col md="5">
                          <Form.Group className="createnew">
                            <Form.Label>
                              Client Name{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Select
                              className="selectTo"
                              styles={customStyles}
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

                        <Col md="7" className="btn_align mt-4">
                          <Button className="createbtn mt-1" type="submit">
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
        </div>
      </div>
    );
  }
}
