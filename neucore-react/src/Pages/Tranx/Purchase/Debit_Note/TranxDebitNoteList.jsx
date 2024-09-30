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
} from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";

import moment from "moment";
import Select from "react-select";
import {
  getPurchaseAccounts,
  getSundryCreditors,
  authenticationService,
  getPurchaseInvoiceList,
  getLastPurchaseInvoiceNo,
  getTranxDebitNoteLast,
  getTranxDebitNoteListInvoiceBillSC,
  getTranxPurchaseProductListBillNo,
  getPurchaseReturnLst,
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
export default class TranxDebitNoteList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],
      initVal: {
        debit_note_sr: 1,
        transaction_dt: moment().format("YYYY-MM-DD"),
        purchaseId: "",
        invoice_no: "",
        invoice_dt: "",
        from_date: "",
        to_date: "",
        supplierCodeId: "",
        supplierNameId: "",
        purchase_return_invoice: "",
        outstanding: "",
      },
      opendiv: false,
      modal: false,
      errormodal: false,
      name: "",
      modalInputName: "",
      invoiceLstSC: [],
      selected_values: "",
      lst_products: [],
      debitnoteModalShow: false,
      supplier_name: "",
    };

    this.myRef = React.createRef();
  }
  handeldebitnoteModalShow = (status) => {
    this.setState({ debitnoteModalShow: status });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(e) {
    this.setState({ name: this.state.modalInputName });
    this.modalClose();
  }

  modalOpen() {
    this.setState({ modal: true });
  }
  errorModal() {
    this.setState({ errormodal: true });
  }
  recordsavemodal() {
    this.setState({ recordsavemodal: true });
  }
  modalClose() {
    this.setState({
      modalInputName: "",
      modal: false,
      errormodal: false,
      recordsavemodal: false,
    });
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
  getPurchase_ReturnLst = () => {
    getPurchaseReturnLst()
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
    getTranxDebitNoteLast()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;

          initVal["debit_note_sr"] = res.count;
          initVal["purchase_return_invoice"] = res.purReturnNo;
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
              ledger_balance: v.ledger_balance,
              ledger_balance_type: v.ledger_balance_type,
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
              ledger_balance: v.ledger_balance,
              ledger_balance_type: v.ledger_balance_type,
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
      // this.lstPurchaseInvoice();
      this.setLastPurchaseSerialNo();
      this.getPurchase_ReturnLst();
    }
  }
  handleCreateBtn = () => {
    this.setState({ show: true });
  };

  handleSubmitSCList = (value) => {
    this.setState({ initVal: value });

    let reqData = new FormData();
    reqData.append("sundry_creditor_id", value.supplierCodeId.value);

    getTranxDebitNoteListInvoiceBillSC(reqData)
      .then((response) => {
        // console.log('before response', response);
        let res = response.data;
        if (res.responseStatus == 200) {
          // console.log('response', response);
          let lst = res.data;
          this.setState({
            invoiceLstSC: lst,
            selected_values: value,
            show: true,
          });
        }
      })
      .catch((error) => {});
  };

  handleRowClick = (v) => {
    let prop_data = {
      returnIntiVal: this.state.initVal,
      returnData: v,
    };

    eventBus.dispatch("page_change", {
      from: "tranx_debit_note_list",
      to: "tranx_debit_note_product_list",
      isNewTab: false,
      prop_data: prop_data,
    });
  };

  render() {
    const {
      show,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      purchaseInvoiceLst,
      initVal,
      invoiceLstSC,
      selected_values,
      debitnoteModalShow,
      supplier_name,
      lst_products,
      opendiv,
    } = this.state;

    return (
      <div className="">
        <div className="">
          <div className="wrapper_div" style={{ height: "700px" }}>
            <div className="institutetbl pb-2 pt-0 pl-2 pr-2">
              <div className="cust_table">
                <Collapse in={opendiv}>
                  <div
                    id="example-collapse-text"
                    className="p-invoice-modal create_box"
                  >
                    <div className="m-0 institute-head purchasescreen mb-2">
                      <Formik
                        validateOnChange={false}
                        validateOnBlur={false}
                        initialValues={initVal}
                        validationSchema={Yup.object().shape({
                          debit_note_sr: Yup.string()
                            .trim()
                            .required("Purchase no is required"),
                          transaction_dt: Yup.string().required(
                            "Transaction date is required"
                          ),
                          purchaseId: Yup.object().required(
                            "Select purchase account"
                          ),
                          purchase_return_invoice: Yup.string()
                            .trim()
                            .required("purchase_return_invoice no is required"),
                          supplierCodeId: Yup.object().required(
                            "Select supplier code"
                          ),
                          supplierNameId: Yup.object().required(
                            "Select supplier name"
                          ),
                        })}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                          this.handleSubmitSCList(values);
                          // console.log({ values });
                          // window.electron.ipcRenderer.webPageChange({
                          //   from: 'tranx_purchase_invoice_list',
                          //   to: 'tranx_purchase_invoice_create',
                          //   prop_data: values,
                          //   isNewTab: false,
                          // });
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
                          <div className="m-0  purchasescreen mb-2">
                            <Form onSubmit={handleSubmit} noValidate>
                              <Row>
                                <Col md="1">
                                  <Form.Group>
                                    <Form.Label>
                                      Pur_Return #.
                                      <span className="pt-1 pl-1 req_validation">
                                        *
                                      </span>{" "}
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      className="pl-2"
                                      placeholder=" "
                                      name="debit_note_sr"
                                      id="debit_note_sr"
                                      onChange={handleChange}
                                      value={values.debit_note_sr}
                                      isValid={
                                        touched.debit_note_sr &&
                                        !errors.debit_note_sr
                                      }
                                      isInvalid={!!errors.debit_note_sr}
                                      readOnly={true}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.debit_note_sr}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>
                                      Transaction Date{" "}
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
                                </Col>{" "}
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>
                                      Pur_Return Invoice #.{" "}
                                      <span className="pt-1 pl-1 req_validation">
                                        *
                                      </span>
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Invoice No."
                                      name="purchase_return_invoice"
                                      id="purchase_return_invoice"
                                      onChange={handleChange}
                                      value={values.purchase_return_invoice}
                                      isValid={
                                        touched.purchase_return_invoice &&
                                        !errors.purchase_return_invoice
                                      }
                                      isInvalid={
                                        !!errors.purchase_return_invoice
                                      }
                                      readOnly
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.purchase_return_invoice}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="4">
                                  <Form.Group className="createnew">
                                    <Form.Label>
                                      Purchase A/c
                                      <span className="pt-1 pl-1 req_validation">
                                        *
                                      </span>
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
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>
                                      Supplier Code{" "}
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
                                      name="supplierCodeId"
                                      onChange={(v) => {
                                        setFieldValue("supplierCodeId", v);
                                        if (v != null) {
                                          setFieldValue(
                                            "supplierNameId",
                                            getSelectValue(
                                              supplierNameLst,
                                              v.value
                                            )
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
                              </Row>

                              <Row>
                                <Col md="4">
                                  <Form.Group className="createnew">
                                    <Form.Label>
                                      Supplier Name{" "}
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
                                      name="supplierNameId"
                                      onChange={(v) => {
                                        if (v != null) {
                                          setFieldValue(
                                            "supplierCodeId",
                                            getSelectValue(
                                              supplierCodeLst,
                                              v.value
                                            )
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
                                  <Form.Group>
                                    <Form.Label>
                                      Ledger Balance{" "}
                                      <span className="pt-1 pl-1 req_validation">
                                        *
                                      </span>
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Ledger Balance"
                                      name="outstanding"
                                      id="outstanding"
                                      onChange={handleChange}
                                      value={
                                        values.supplierNameId &&
                                        values.supplierNameId.ledger_balance +
                                          " " +
                                          values.supplierNameId
                                            .ledger_balance_type
                                      }
                                      readOnly
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.outstanding}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="6" className="btn_align mt-4">
                                  <Button
                                    className="createbtn mt-3"
                                    type="submit"
                                  >
                                    Submit
                                  </Button>

                                  <Button
                                    className="ml-2 mt-3 alterbtn"
                                    type="submit"
                                    //className="alterbtn"
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
                  <Row>
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
                            <Button type="submit">x</Button>
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
                          className="newdate text_center mt-1"
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
                          className="newdate text_center mt-1"
                        />
                      </InputGroup>
                    </Col>
                    <Col md="4" className="mainbtn_create">
                      {/* {this.state.hide == 'true'} */}
                      {!opendiv && (
                        <Button
                          className="createbtn mr-2"
                          onClick={(e) => {
                            e.preventDefault();
                            if (
                              isActionExist("voucher_debit_note_List", "create")
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
                          Create &nbsp;
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-plus-square-dotted"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                          </svg>
                        </Button>
                      )}
                      &nbsp;
                      <Button className="ml-2 alterbtn" type="submit">
                        Refresh
                      </Button>
                    </Col>
                  </Row>
                )}
              </div>

              {purchaseInvoiceLst.length > 0 && (
                <div className="table_wrapper">
                  <Table className="new_tbldesign key" hover>
                    <thead>
                      <tr>
                        <th style={{ width: "5%" }}>Sr. #.</th>
                        <th>Pur_Return.#.</th>
                        <th>Transaction Date</th>
                        {/* <th>Purchase Account</th> */}
                        <th>Reference Invoice</th>
                        <th>Supplier Name</th>
                        <th className="btn_align right_col">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseInvoiceLst.map((v, i) => {
                        return (
                          <tr
                          // onClick={(e) => {
                          //   e.preventDefault();

                          //   // this.props.history.push({
                          //   //   pathname: '/PurchaseInvoiceEdit',
                          //   //   state: v,
                          //   // });
                          //   window.electron.ipcRenderer.webPageChange({
                          //     from: 'tranx_purchase_invoice_list',
                          //     to: 'tranx_purchase_invoice_edit',
                          //     prop_data: v,
                          //     isNewTab: false,
                          //   });
                          // }}
                          >
                            <td style={{ width: "5%" }}>{i + 1}</td>
                            <td>{v.pur_return_no}</td>
                            <td>
                              {moment(v.transaction_date).format("DD-MM-YYYY")}
                            </td>
                            {/* <td>{v.purchase_account_name}</td> */}
                            <td>{v.invoice_no}</td>
                            <td>{v.sundry_creditor_name}</td>
                            <td className="btn_align right_col">
                              {v.total_amount}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
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
              animation={false}
            >
              <Modal.Header
                //closeButton
                className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
              >
                <Modal.Title
                  id="example-custom-modal-styling-title"
                  className=""
                >
                  Invoice List
                </Modal.Title>
                <CloseButton
                  variant="white"
                  className="pull-right"
                  onClick={this.handleClose}
                  // onClick={() => this.handlesupplierdetailsModalShow(false)}
                />
              </Modal.Header>
              <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
                <div className="purchasescreen">
                  {invoiceLstSC.length > 0 && (
                    <div className="all_bills">
                      {/* <h6>Bills</h6> */}
                      <div className="bills_dt">
                        <div className="institutetbl pb-2 pt-0 pl-2 pr-2">
                          <div className="table_wrapper1">
                            <Table className="serialnotbl  mb-0">
                              <thead>
                                <tr>
                                  <th
                                    style={{ textAlign: "left" }}
                                    className=""
                                  >
                                    {" "}
                                    #.
                                  </th>
                                  <th
                                    style={{ textAlign: "left" }}
                                    className=""
                                  >
                                    Bill #.
                                  </th>
                                  <th
                                    style={{ textAlign: "left" }}
                                    className=""
                                  >
                                    Bill Amt
                                  </th>
                                  <th
                                    style={{ textAlign: "left" }}
                                    className=""
                                  >
                                    Bill Date
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoiceLstSC.map((v, i) => {
                                  return (
                                    <tr
                                      onClick={(e) => {
                                        e.preventDefault();

                                        this.handleRowClick(v);
                                      }}
                                    >
                                      <td>{i + 1}</td>
                                      <td>{v.invoice_no}</td>
                                      <td>{v.total_amount}</td>
                                      <td>
                                        {moment(v.invoice_date).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Modal.Body>
            </Modal>
          </div>

          {/* Debit Note Create Modal */}
          <Modal
            fullscreen
            show={debitnoteModalShow}
            size="xl"
            className="groupnewmodal mt-5 mainmodal"
            onHide={() => this.handeldebitnoteModalShow(false)}
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header
              //closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                {supplier_name && supplier_name}
              </Modal.Title>
              <CloseButton
                variant="white"
                className="pull-right"
                //onClick={this.handleClose}
                onClick={() => this.handeldebitnoteModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className=" p-2 p-invoice-modal">
              <div
                className="institutetbl pb-2 pt-0 pl-2 pr-2"
                //style={{ height: '410px' }}
              >
                <Table
                  size="lg"
                  className="key mb-0 purchacetbl"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>
                        <Form.Group
                          controlId="formBasicCheckbox"
                          className="ml-1 pmt-allbtn"
                        >
                          <Form.Check
                            type="checkbox"
                            label="Sr. #."
                            className="pt-1"
                          />
                        </Form.Group>
                      </th>
                      <th>Particulars</th>
                      <th>Qty</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="unithead">
                      <td></td>
                      <td></td>
                      <td>
                        <tr>
                          <td>
                            <Form.Control
                              type="text"
                              placeholder="H"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              placeholder="M"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            {" "}
                            <Form.Control
                              type="text"
                              placeholder="L"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                        </tr>
                      </td>
                      {/* <td></td> */}
                      <td>
                        <tr>
                          <td>
                            <Form.Control
                              type="text"
                              placeholder="H"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            {" "}
                            <Form.Control
                              type="text"
                              placeholder="M"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            {" "}
                            <Form.Control
                              type="text"
                              placeholder="L"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                        </tr>
                      </td>
                    </tr>
                    {lst_products.length > 0 &&
                      lst_products.map((v, i) => {
                        return (
                          <tr>
                            <td>
                              <Form.Group
                                controlId="formBasicCheckbox"
                                className="ml-1 pmt-allbtn"
                              >
                                <Form.Check
                                  type="checkbox"
                                  label="Sr. #."
                                  className="pt-1"
                                />
                              </Form.Group>
                            </td>
                            <td>{v.product_name}</td>
                            <td>{v.qtyH}</td>
                            <td>{v.qtyM}</td>
                            <td>{v.qtyL}</td>
                            <td>{v.rateH}</td>
                            <td>{v.rateM}</td>
                            <td>{v.rateL}</td>
                          </tr>
                        );
                      })}
                    {/*{rows.map((v, i) => {
                      return (
                        <TRowComponent
                          i={i}
                          setFieldValue={setFieldValue}
                          setElementValue={this.setElementValue.bind(this)}
                          handleChangeArrayElement={this.handleChangeArrayElement.bind(
                            this
                          )}
                          productLst={productLst}
                          handlePlaceHolder={this.handlePlaceHolder.bind(
                            this
                          )}
                          handleUnitLstOptLength={this.handleUnitLstOptLength.bind(
                            this
                          )}
                          isDisabled={false}
                          handleClearProduct={this.handleClearProduct.bind(
                            this
                          )}
                        />
                      );
                    })}*/}
                  </tbody>
                </Table>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}
