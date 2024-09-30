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
import view_icon_3 from "@/assets/images/3x/view_icon_3.svg";

import {
  getSalesAccounts,
  getSundryDebtors,
  authenticationService,
  getSalesInvoiceList,
  getLastSalesInvoiceNo,
} from "@/services/api_functions";

import {
  getSelectValue,
  AuthenticationCheck,
  MyDatePicker,
  getHeader,
  CustomDTHeader,
  customStyles,
  eventBus,
  isActionExist,
  MyNotifications,
  numberWithCommasIN,
  ShowNotification,
} from "@/helpers";
import { date } from "yup/lib/locale";

export default class TranxSalesInvoiceList extends React.Component {
  constructor(props) {
    super(props);
    this.tableManager = React.createRef(null);
    this.state = {
      show: false,
      opendiv: false,
      showDiv: false,
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      salesInvoiceLst: [],
      edit_data: "",
      initVal: {
        sales_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        bill_no: "",
        bill_dt: new Date(),
        clientCodeId: "",
        clientNameId: "",
        orgData: [],
        startDate: "",
        endDate: "",
        end: "",
      },
    };
  }

  setLastSalesSerialNo = () => {
    getLastSalesInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          initVal["sales_sr_no"] = res.count;
          initVal["bill_no"] = res.serialNo;
          this.setState({ initVal: initVal });
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

  lstSalesfromtodate = () => {
    let { startDate, endDate } = this.state;
    const startDatecon = moment(startDate).format("YYYY-MM-DD");
    const endDatecon = moment(endDate).format("YYYY-MM-DD");
    console.log("Outer StartDate:", startDatecon);
    console.log("Outer EndDate:", endDatecon);
    let dates = new FormData();
    dates.append("currentDate", startDatecon);
    dates.append("endDate", endDatecon);
    getSalesInvoiceList(dates)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ salesInvoiceLst: res.data, orgData: res.data });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceLst: [] });
      });
  };

  lstSalesInvoice = () => {
    getSalesInvoiceList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ salesInvoiceLst: res.data, orgData: res.data });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceLst: [] });
      });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstSalesAccounts();
      this.lstSundrydebtors();
      this.lstSalesInvoice();
    }
  }

  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let lstSales_F = orgData.filter(
      (v) =>
        (v.sundry_debtor_name != "" &&
          v.invoice_no != "" &&
          v.total_amount != "" &&
          v.invoice_date != "" &&
          v.sundry_debtor_name.toLowerCase().includes(vi.toLowerCase())) ||
        v.invoice_no.toString().toLowerCase().includes(vi.toLowerCase()) ||
        v.total_amount.toString().includes(vi) ||
        v.invoice_date.toString(moment().format("DD-MM-YYYY")).includes(vi)
    );
    this.setState({
      salesInvoiceLst: lstSales_F.length > 0 ? lstSales_F : orgData,
    });
  };
  render() {
    const {
      show,
      salesAccLst,
      opendiv,
      supplierNameLst,
      supplierCodeLst,
      salesInvoiceLst,
      showDiv,
      initVal,
      startDate,
      endDate,
      edit_data,
      end,
    } = this.state;

    return (
      <div className="">
        <div className="wrapper_div" style={{ height: "700px" }}>
          <div className="cust_table">
            <div className="institutetbl">
              <Collapse in={opendiv}>
                <div
                  id="example-collapse-text"
                  className="p-invoice-modal create_box"
                >
                  <div className="institute-head m-0 purchasescreen mb-2">
                    <Formik
                      validateOnChange={false}
                      validateOnBlur={false}
                      enableReinitialize={true}
                      initialValues={initVal}
                      validationSchema={Yup.object().shape({
                        sales_sr_no: Yup.string()
                          .trim()
                          .required("Purchase no is required"),
                        transaction_dt: Yup.string().required(
                          "Transaction date is required"
                        ),
                        salesAccId: Yup.object().required(
                          "Select sales account"
                        ),
                        bill_no: Yup.string()
                          .trim()
                          .required("bill no is required"),
                        bill_dt: Yup.string().required("Bill dt is required"),
                        clientNameId:
                          Yup.object().required("Select client name"),
                      })}
                      onSubmit={(values, { setSubmitting, resetForm }) => {
                        console.log("values", values);

                        // window.electron.ipcRenderer.webPageChange({
                        //   from: "tranx_sales_invoice_list",
                        //   to: "tranx_sales_invoice_create",
                        //   prop_data: values,
                        //   isNewTab: false,
                        // });
                        eventBus.dispatch("page_change", {
                          from: "tranx_sales_invoice_list",
                          to: "tranx_sales_invoice_create",
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
                        <div className="institute-head purchasescreen m-0 mb-2">
                          {/* {JSON.stringify(errors)}; */}
                          <Form onSubmit={handleSubmit} noValidate>
                            <Row>
                              <Col md="1">
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
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label>
                                    Invoice Date{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
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
                                    className="newdate"
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

                              {/* <Col md="2">
                                <Form.Group>
                                  <Form.Label>
                                    Invoice Date{' '}
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
                                    isValid={touched.bill_dt && !errors.bill_dt}
                                    isInvalid={!!errors.bill_dt}
                                    readOnly={true}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.bill_dt}
                                  </span>
                                </Form.Group>
                              </Col> */}
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

                              <Col md="12" className="btn_align mt-2">
                                <Button
                                  className="createbtn mt-1"
                                  type="submit"
                                >
                                  Submit
                                </Button>

                                <Button
                                  className="ml-2 mt-1 alterbtn"
                                  type="submit"
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
                        </div>
                      )}
                    </Formik>
                  </div>
                </div>
              </Collapse>

              {!opendiv && (
                <Row className="mb-3 ">
                  <Col md="3">
                    <div className="ms-2 mt-2">
                      <Form>
                        <Form.Group
                          className="search_btn_style mt-1"
                          controlId="formBasicSearch"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Search"
                            className="main_search"
                            onChange={(e) => {
                              this.handleSearch(e.target.value);
                            }}
                          />
                          {/* <Button type="submit">x</Button> */}
                        </Form.Group>
                      </Form>
                    </div>
                  </Col>
                  {/* <Col md="4"></Col> */}
                  <Col md="7">
                    <InputGroup className="justify-content-end mt-3">
                      <MyDatePicker
                        // placeholderText="DD/MM/YYYY"
                        id="startDate"
                        name="startDate"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="FROM DATE"
                        onChange={(newDate) => {
                          // let con=Date.parse((moment(newDate).format("YYYY-MM-DD")))
                          this.setState({ startDate: newDate });
                        }}
                        selected={startDate}
                        value={startDate}
                        className="newdate text_center "
                      />
                      <InputGroup.Text id="basic-addon2" className=" ">
                        <i class="fa fa-arrow-right" aria-hidden="true"></i>
                      </InputGroup.Text>
                      <MyDatePicker
                        // placeholderText="DD/MM/YYYY"
                        id="endDate"
                        name="endDate"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="TO DATE"
                        onChange={(date) => {
                          if (startDate != null) {
                            this.setState({ endDate: date }, () => {
                              this.lstSalesfromtodate();
                            });
                          } else {
                            this.setState({ endDate: "" });
                          }
                        }}
                        selected={endDate}
                        value={endDate}
                        className="newdate text_center "
                      />
                    </InputGroup>
                  </Col>
                  <Col md="2" className="mainbtn_create mt-1">
                    {/* {this.state.hide == 'true'} */}
                    {!opendiv && (
                      <Button
                        className="ml-2 alterbtn mt-1"
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            isActionExist("tranx_sales_invoice_list", "create")
                          ) {
                            this.setState({ opendiv: !opendiv });
                            this.setLastSalesSerialNo();
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
                        Create &nbsp;
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-plus-square-dotted"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                        </svg>
                      </Button>
                    )}
                    &nbsp;
                    <Button
                      className="ml-2 alterbtn mt-1"
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        this.componentDidMount();
                      }}
                    >
                      Refresh
                    </Button>
                  </Col>
                </Row>
              )}

              {/* <GridTable
                  components={{ Header: CustomDTHeader }}
                  columns={columns}
                  onRowsRequest={this.onRowsRequest}
                  onRowClick={(
                    { rowIndex, data, column, isEdit, event },
                    tableManager
                  ) => !isEdit}
                  //  onRowClick={this.handleRowClick}
                  //  onKeyDown={this.handleKeyDown}
                  minSearchChars={0}
                  additionalProps={{
                    header: {
                      // addBtn: this.addBtn,
                      addBtn1: this.addBtn1,
                      refreshBtn: this.refreshBtn,
                    },
                  }}
                  // isVirtualScroll={true}
                  // isVirtualScroll={false}
                  // isPaginated={true}
                  // isPaginated={false}
                  selectAllMode={'all'}
                  tabIndex="0"
                  onLoad={this.setTableManager.bind(this)}
                /> */}
            </div>

            <Modal
              show={show}
              size="lg"
              className="mt-5 mainmodal"
              onHide={() => this.setState({ show: false })}
              // dialogClassName="modal-400w"
              // aria-labelledby="example-custom-modal-styling-title"
              aria-labelledby="contained-modal-title-vcenter"
              //centered
            >
              <Modal.Header
                // closeButton
                className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
              >
                <Modal.Title
                  id="example-custom-modal-styling-title"
                  className=""
                >
                  Sales Invoice
                </Modal.Title>
                <CloseButton
                  variant="white"
                  className="pull-right"
                  onClick={this.handleClose}
                  //onClick={() => this.handelPurchaseacModalShow(false)}
                />
              </Modal.Header>
              <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
                <div className="institute-head purchasescreen">
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={initVal}
                    validationSchema={Yup.object().shape({
                      sales_sr_no: Yup.string()
                        .trim()
                        .required("Purchase no is required"),
                      transaction_dt: Yup.string().required(
                        "Transaction date is required"
                      ),
                      salesAccId: Yup.object().required("select sales account"),
                      // bill_no: Yup.string()
                      //   .trim()
                      //   .required('bill no is required'),
                      bill_dt: Yup.string().required("Bill dt is required"),
                      // clientCodeId: Yup.object().required("select client code"),
                      clientNameId: Yup.object().required("select client name"),
                      transport: Yup.string(),
                      gr_lr: Yup.string(),
                      delivery_date: Yup.string(),
                      gr_lr_date: Yup.string(),
                      challan: Yup.string(),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      // console.log('values', values);
                      // this.props.history.push({
                      //   pathname: '/SalesInvoiceCreate',
                      //   state: values,
                      // });
                      // window.electron.ipcRenderer.webPageChange({
                      //   from: "tranx_sales_invoice_list",
                      //   to: "tranx_sales_invoice_create",
                      //   prop_data: values,
                      //   isNewTab: false,
                      // });
                      eventBus.dispatch("page_change", {
                        from: "tranx_sales_invoice_list",
                        to: "tranx_sales_invoice_create",
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
                        <Row className="md-2">
                          <Col md="2">
                            <Form.Group>
                              <Form.Label>
                                Sales Invoice Sr. #.{" "}
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
                          {/*}<Col md="3">
                            <Form.Group>
                              <Form.Label>
                                Transaction Date{' '}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="date"
                                className="pl-2"
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
                              <Form.Control.Feedback type="invalid">
                                {errors.transaction_dt}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col> */}
                          <Col md="3">
                            <Form.Group className="createnew">
                              <Form.Label>
                                Sales Acc.{" "}
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

                          <Col md="4">
                            <Form.Group>
                              <Form.Label>
                                Invoice No.{" "}
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
                                readOnly
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors.bill_no}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md="3">
                            <Form.Group>
                              <Form.Label>
                                Invoice Date{" "}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              {/*}<Form.Control
                                type="date"
                                name="bill_dt"
                                id="bill_dt"
                                onChange={handleChange}
                                value={values.bill_dt}
                                // isValid={
                                //   touched.bill_dt && !errors.bill_dt
                                // }
                                // isInvalid={!!errors.bill_dt}
                                max={moment(new Date()).format('YYYY-MM-DD')}
                                // minLength={new Date()}
                              />*/}
                              <MyDatePicker
                                name="bill_dt"
                                id="bill_dt"
                                className="newdate"
                                // dateFormat="dd-MM-yyyy"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                  setFieldValue("bill_dt", date);
                                }}
                                selected={values.bill_dt}
                              />
                              {/* <Form.Control.Feedback type="invalid">
                                {errors.bill_dt}
                              </Form.Control.Feedback> */}
                              <span className="text-danger errormsg">
                                {errors.bill_dt}
                              </span>
                            </Form.Group>
                          </Col>
                          {/* <Col md="3">
                            <Form.Group className="createnew">
                              <Form.Label>
                                Client Code{" "}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Select
                                className="selectTo"
                                styles={customStyles}
                                isClearable
                                options={supplierCodeLst}
                                borderRadius="0px"
                                colors="#729"
                                name="clientCodeId"
                                onChange={(v) => {
                                  setFieldValue("clientCodeId", v);
                                  if (v != null) {
                                    setFieldValue(
                                      "clientNameId",
                                      getSelectValue(supplierNameLst, v.value)
                                    );
                                  }
                                }}
                                value={values.clientCodeId}
                              />

                              <span className="text-danger errormsg">
                                {errors.clientCodeId}
                              </span>
                            </Form.Group>
                          </Col> */}
                          <Col md="4">
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
                          <Col md="2">
                            <Form.Group>
                              <Form.Label>
                                Salesman.{" "}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Salesman Name.."
                                name="invoice_no"
                                id="invoice_no"
                                onChange={handleChange}
                                value={values.invoice_no}
                                isValid={
                                  touched.invoice_no && !errors.invoice_no
                                }
                                isInvalid={!!errors.invoice_no}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.invoice_no}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md="4">
                            <Form.Group>
                              <Form.Label>
                                Sales Invoice Transport
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="transport"
                                name="transportsdf"
                                id="transportsdf"
                                onChange={handleChange}
                                //value={values.transport}
                                isValid={touched.transport && !errors.transport}
                                isInvalid={!!errors.transport}
                                // readOnly
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors.transport}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md="3">
                            <Form.Group>
                              <Form.Label>
                                GR/LR
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="gr_lr"
                                id="gr_lr"
                                onChange={handleChange}
                                // value={values.transport}
                                isValid={touched.gr_lr && !errors.gr_lr}
                                isInvalid={!!errors.gr_lr}
                                // readOnly/
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors.gr_lr}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md="3">
                            <Form.Group>
                              <Form.Label>
                                GR/LR Date{" "}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              {/*}<Form.Control
                                type="date"
                                name="bill_dt"
                                id="bill_dt"
                                onChange={handleChange}
                                value={values.bill_dt}
                                // isValid={
                                //   touched.bill_dt && !errors.bill_dt
                                // }
                                // isInvalid={!!errors.bill_dt}
                                max={moment(new Date()).format('YYYY-MM-DD')}
                                // minLength={new Date()}
                              />*/}
                              <MyDatePicker
                                name="gr_lr_date"
                                id="gr_lr_date"
                                className="newdate"
                                // dateFormat="dd-MM-yyyy"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                  setFieldValue("gr_lr_date", date);
                                }}
                                selected={values.gr_lr_date}
                              />
                              {/* <Form.Control.Feedback type="invalid">
                                {errors.bill_dt}
                              </Form.Control.Feedback> */}
                              <span className="text-danger errormsg">
                                {errors.gr_lr_date}
                              </span>
                            </Form.Group>
                          </Col>

                          <Col md="3">
                            <Form.Group>
                              <Form.Label>
                                Challan
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="challan"
                                id="challan"
                                onChange={handleChange}
                                // value={values.transport}
                                isValid={touched.challan && !errors.challan}
                                isInvalid={!!errors.challan}
                                // readOnly/
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors.challan}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md="3">
                            <Form.Group>
                              <Form.Label>
                                Delivery Date{" "}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              {/*}<Form.Control
                                type="date"
                                name="bill_dt"
                                id="bill_dt"
                                onChange={handleChange}
                                value={values.bill_dt}
                                // isValid={
                                //   touched.bill_dt && !errors.bill_dt
                                // }
                                // isInvalid={!!errors.bill_dt}
                                max={moment(new Date()).format('YYYY-MM-DD')}
                                // minLength={new Date()}
                              />*/}
                              <MyDatePicker
                                name="delivery_date"
                                id="delivery_date"
                                className="newdate"
                                // dateFormat="dd-MM-yyyy"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                  setFieldValue("delivery_date", date);
                                }}
                                selected={values.delivery_date}
                              />
                              {/* <Form.Control.Feedback type="invalid">
                                {errors.bill_dt}
                              </Form.Control.Feedback> */}
                              <span className="text-danger errormsg">
                                {errors.delivery_date}
                              </span>
                            </Form.Group>
                          </Col>

                          <Col md="2">
                            <div>
                              <Form.Label style={{ color: "#fff" }}>
                                blank
                                <br />
                              </Form.Label>
                            </div>

                            {/* <Link
                              to="/PurchaseInvoice"
                              className="nav-link anchorbtn"
                            >
                              Submit
                            </Link> */}
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
          </div>

          <div className="table_wrapper denomination-style">
            <Table
              hover
              size="sm"
              className="new_tbldesign"
              //responsive
            >
              <thead>
                {/* <div className="scrollbar_hd"> */}
                <tr>
                  <th>Sr. #.</th>
                  <th>Invoice #.</th>
                  <th>Sales Invoice Date</th>
                  <th style={{ width: "21%" }}>Customer Name</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Action</th>
                </tr>
                {/* </div> */}
              </thead>
              <tbody style={{ borderTop: "2px solid transparent" }}>
                {/* <div className="scrollban_new"> */}
                {/* {JSON.stringify(salesInvoiceLst)} */}
                {salesInvoiceLst.length > 0 ? (
                  salesInvoiceLst.map((v, i) => {
                    return (
                      <tr
                      // onDoubleClick={(e) => {
                      //   e.preventDefault();
                      //   // console.log("v", v);

                      //   // window.electron.ipcRenderer.webPageChange({
                      //   //   from: 'tranx_sales_invoice_list',
                      //   //   to: 'tranx_sales_invoice_edit',
                      //   //   prop_data: v.id,
                      //   //   isNewTab: false,
                      //   // });
                      //   eventBus.dispatch("page_change", {
                      //     from: "tranx_sales_invoice_list",
                      //     to: "tranx_sales_invoice_edit",
                      //     prop_data: v.id,
                      //     isNewTab: false,
                      //   });
                      // }}
                      >
                        <td>{i + 1}</td>
                        <td>{v.invoice_no}</td>
                        <td>{moment(v.invoice_date).format("DD-MM-YYYY")}</td>
                        {/* <td>{v.sale_account_name}</td> */}
                        <td style={{ width: "21%" }}>{v.sundry_debtor_name}</td>
                        <td>{numberWithCommasIN(v.total_amount, true, 2)}</td>
                        <td>{numberWithCommasIN(0, true, 2)}</td>
                        <td
                          style={{
                            width: "7%",
                            borderBottom: "1px solid #dee2e6",
                          }}
                          onClick={(e) => {
                            // if (isActionExist("ledger-list", "view"))
                            {
                              // this.setUpdateValue(v.id);
                              let prop_data = {
                                id: v.id,
                                sale_serial_number: v.sale_serial_number,
                                invoice_no: v.invoice_no,
                                invoice_date: v.invoice_date,
                              };
                              eventBus.dispatch("page_change", {
                                from: "tranx_sales_invoice_list",
                                to: "salesinvoicedetail",
                                prop_data: prop_data,
                                isNewTab: false,
                              });
                            }
                            // else {
                            //   MyNotifications.fire({
                            //     show: true,
                            //     title: "Error",
                            //     icon: "error",
                            //     msg: "Permission is denied!",
                            //     is_button_show: true,
                            //   });
                            // }
                          }}
                        >
                          {" "}
                          <img src={view_icon_3} title="View" />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
                {/* </div> */}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
