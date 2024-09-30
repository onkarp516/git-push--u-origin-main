import React, { Component } from 'react';
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
} from 'react-bootstrap';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import moment from 'moment';
import {
  getSalesAccounts,
  getSundryDebtors,
  authenticationService,
  getPurchaseInvoiceList,
  getTranxCreditNoteLast,
  getTranxCreditNoteListInvoiceBillSC,
  getTranxSalesProductListBillNo,
} from '@render/services/api_functions';
import {
  getHeader,
  ShowNotification,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  getSelectValue,
} from '@render/helpers';
import Select from 'react-select';
import axios from 'axios';

import refresh from '@render/assets/images/refresh.png';
export default class TranxCreditNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      opendiv: false,
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      data: [],
      initVal: {
        credit_note_sr: 1,
        transaction_dt: moment().format('YYYY-MM-DD'),
        salesId: '',
        invoice_no: '',
        invoice_dt: '',
        to_date: '',
        supplierCodeId: '',
        supplierNameId: '',
        sales_return_invoice: '',
        outstanding: '',
      },

      invoiceLstSC: [],
      selected_values: '',
      lst_products: [],
    };
  }

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
        console.log('error', error);
      });
  };
  lstSundrydebtors = () => {
    getSundryDebtors()
      .then((response) => {
        // console.log("res", response);

        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return {
              label: v.name,
              value: v.id,
              code: v.ledger_code,
              state: v.state,
              ledger_balance: v.ledger_balance,
              ledger_balance_type: v.ledger_balance_type,
            };
          });
          let codeopt = res.list.map((v, i) => {
            return {
              label: v.ledger_code,
              value: v.id,
              name: v.name,
              state: v.state,
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
      .catch((error) => {
        console.log('error', error);
      });
  };

  setLastCreditNoteNo = () => {
    getTranxCreditNoteLast()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;

          initVal['credit_note_sr'] = res.count;
          initVal['sales_return_invoice'] = res.salesReturnNo;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  handleSubmitSCList = (value) => {
    console.log('value', value);
    this.setState({ initVal: value });

    let reqData = new FormData();
    reqData.append('sundry_debtors_id', value.supplierCodeId.value);
    getTranxCreditNoteListInvoiceBillSC(reqData)
      .then((response) => {
        // console.log('before response', response);
        let res = response.data;
        if (res.responseStatus == 200) {
          // console.log('response', response);
          let lst = res.data;
          if (lst.length > 0) {
            this.setState({
              invoiceLstSC: lst,
              selected_values: value,
              show: true,
            });
          } else {
            ShowNotification('Error', 'Data not found');
          }
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  handleRowClick = (v) => {
    let prop_data = {
      returnIntiVal: this.state.initVal,
      returnData: v,
    };

    window.electron.ipcRenderer.webPageChange({
      from: 'tranx_credit_note',
      to: 'tranx_credit_note_product_list',
      isNewTab: false,
      prop_data: prop_data,
    });
  };

  pageReload() {
    if (AuthenticationCheck()) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstSalesAccounts();
      this.lstSundrydebtors();
      this.setLastCreditNoteNo();
    }
  }

  render() {
    const columns = [
      {
        id: 'unit_name', // database column name
        field: 'unitName', // response parameter name
        label: 'Unit Name',
        resizable: true,
      },
      {
        id: 'unit_code', // database column name
        field: 'unitCode', // response parameter name
        label: 'Unit Code',
        resizable: true,
      },
    ];

    const {
      show,
      data,
      initVal,
      salesAccLst,
      supplierNameLst,
      supplierCodeLst,
      opendiv,
      groupModalShow,
      debitnoteModalShow,
      invoiceLstSC,
    } = this.state;
    return (
      <div className="">
        <div className="wrapper_div" style={{ height: '700px' }}>
          <div className="cust_table">
            <Collapse in={opendiv}>
              <div
                id="example-collapse-text"
                className="institute-head m-0 mb-2 purchasescreen"
              >
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  initialValues={initVal}
                  validationSchema={Yup.object().shape({
                    credit_note_sr: Yup.string()
                      .trim()
                      .required('Purchase no is required'),
                    transaction_dt: Yup.string().required(
                      'Transaction date is required'
                    ),
                    salesId: Yup.object().required('Select sales account'),
                    sales_return_invoice: Yup.string()
                      .trim()
                      .required('Sales_return_invoice no is required'),
                    supplierCodeId: Yup.object().required(
                      'Select supplier code'
                    ),
                    supplierNameId: Yup.object().required(
                      'Select supplier name'
                    ),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    console.log('values ', values);
                    this.handleSubmitSCList(values);
                  }}
                >
                  {({
                    values,
                    errors,
                    setFieldValue,
                    touched,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    resetForm,
                  }) => (
                    <div className="institute-head m-0 mb-2 purchasescreen">
                      <Form onSubmit={handleSubmit}>
                        {/* {JSON.stringify(values)} */}

                        <Row>
                          <Col md="1">
                            <Form.Group>
                              <Form.Label>
                                Credit Note #.
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Invoice No."
                                name="credit_note_sr"
                                id="credit_note_sr"
                                onChange={handleChange}
                                value={values.credit_note_sr}
                                isValid={
                                  touched.credit_note_sr &&
                                  !errors.credit_note_sr
                                }
                                isInvalid={!!errors.credit_note_sr}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.credit_note_sr}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <Form.Label>
                                Transaction Date{' '}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="date"
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
                          </Col>

                          <Col md="2" className="">
                            <Form.Group>
                              <Form.Label>
                                Sales Return Invoice #.{' '}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Invoice No."
                                name="sales_return_invoice"
                                id="sales_return_invoice"
                                onChange={handleChange}
                                value={values.sales_return_invoice}
                                isValid={
                                  touched.sales_return_invoice &&
                                  !errors.sales_return_invoice
                                }
                                isInvalid={!!errors.sales_return_invoice}
                                readOnly
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.sales_return_invoice}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md="3">
                            <Form.Group className="createnew">
                              <Form.Label>
                                Sales A/c.{' '}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Select
                                autoFocus
                                className="selectTo"
                                styles={customStyles}
                                isClearable
                                options={salesAccLst}
                                borderRadius="0px"
                                colors="#729"
                                name="salesId"
                                onChange={(v) => {
                                  setFieldValue('salesId', v);
                                }}
                                value={values.salesId}
                              />

                              <span className="text-danger errormsg">
                                {errors.salesId}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col md="4">
                            <Form.Group className="createnew">
                              <Form.Label>
                                Client Name{' '}
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
                                      'supplierCodeId',
                                      getSelectValue(supplierCodeLst, v.value)
                                    );
                                  }
                                  setFieldValue('supplierNameId', v);
                                }}
                                value={values.supplierNameId}
                              />

                              <span className="text-danger errormsg">
                                {errors.supplierNameId}
                              </span>
                            </Form.Group>
                          </Col>

                          <Col md="3">
                            <Form.Group>
                              <Form.Label>
                                Ledger Balance{' '}
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
                                    ' ' +
                                    values.supplierNameId.ledger_balance_type
                                }
                                readOnly
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.outstanding}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md="9" className="btn_align mt-4">
                            <Button className="createbtn mt-1" type="submit">
                              Submit
                            </Button>
                            <Button
                              className="ml-2 mt-1 alterbtn"
                              type="submit"
                              className="alterbtn"
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
                  {!opendiv && (
                    <Button
                      className="createbtn mr-2"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ opendiv: !opendiv });
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
                        class="bi bi-plus-square-dotted"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                      </svg>
                    </Button>
                  )}
                  &nbsp;
                  <Button
                    className="ml-2 alterbtn"
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
          </div>
          <Form>
            <div className="table_wrapper">
              <Table
                bordered
                hover
                size="sm"
                className="new_tbldesign"
                //responsive
              >
                <thead>
                  {/* <div className="scrollbar_hd"> */}
                  <tr>
                    {/* {this.state.showDiv && ( */}
                    <th style={{ width: '4%' }}>Sr. #.</th>
                    {/* )} */}
                    <th>Voucher #.</th>
                    <th>Date</th>
                    <th>Supplier Name</th>
                    <th>Narration</th>
                    <th className="btn_align">Amount</th>
                  </tr>
                  {/* </div> */}
                </thead>
                {/* <tbody>
                  <tr
                    onClick={(e) => {
                      this.setUpdateValue(v);
                    }}
                  >
                    <td style={{ width: '4%' }}>1</td>
                    <td>V12212021</td>
                    <td>21-12-2021</td>
                    <td>Rajesh Devakar</td>
                    <td>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </td>
                    <td className="btn_align">4400.00</td>
                  </tr>
                  
                </tbody> */}
              </Table>
            </div>
          </Form>
        </div>

        <Modal
          show={show}
          size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ show: false })}
          aria-labelledby="contained-modal-title-vcenter"
          animation={false}
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Credit Note
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
            <div className="purchasescreen">
              {invoiceLstSC.length > 0 && (
                <div className="all_bills">
                  <div className="bills_dt">
                    <div className="institutetbl pb-2 pt-0 pl-2 pr-2">
                      <div className="table_wrapper1">
                        <Table className="serialnotbl mb-0">
                          <thead>
                            <tr>
                              <th className="" style={{ textAlign: 'left' }}>
                                {' '}
                                #.
                              </th>
                              <th style={{ textAlign: 'left' }}>Bill No</th>

                              <th style={{ textAlign: 'left' }}>Bill Date</th>
                              <th style={{ textAlign: 'left' }}>Bill Amt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceLstSC.map((v, i) => {
                              return (
                                <tr
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log('v', v);
                                    this.handleRowClick(v);
                                  }}
                                >
                                  <td>{i + 1}</td>
                                  <td>{v.invoice_no}</td>

                                  <td>
                                    {moment(v.invoice_date).format(
                                      'DD/MM/YYYY'
                                    )}
                                  </td>
                                  <td>{v.total_amount}</td>
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
    );
  }
}
