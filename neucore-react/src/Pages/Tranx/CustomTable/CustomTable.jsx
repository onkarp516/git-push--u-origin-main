import React, { Component } from 'react';

import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';
import { Table, Row, Col, Form, Button, Collapse } from 'react-bootstrap';
import refresh from '@render/assets/images/refresh.png';
import Footer from '@render/pages/Layout/Footer.jsx';
import moment from 'moment';
import { Formik } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import {
  getSelectValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
} from '@render/helpers';

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});
const defaultOptions = [
  createOption('One'),
  createOption('Two'),
  createOption('Three'),
];

export default class CreatableAdvanced extends Component {
  state = {
    isLoading: false,
    options: defaultOptions,
    value: undefined,
  };
  constructor(props, context) {
    super(props, context);
    this.tableManager = React.createRef(null);

    this.state = {
      show: false,
      showDiv: true,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],
      opendiv: false,
      initValue: {
        associates_id: '',
        associates_group_name: '',
        underId: '',
      },
      undervalue: [],
      associategroupslst: [],
      initVal: {
        purchase_sr_no: 1,
        transaction_dt: moment().format('YYYY-MM-DD'),
        purchaseId: '',
        invoice_no: '',
        invoice_dt: '',
        supplierCodeId: '',
        supplierNameId: '',
      },
    };
    this.open = this.open.bind(this);
  }
  open() {
    const { showDiv } = this.state;
    this.setState({
      showDiv: !showDiv,
    });
  }
  setLastPurchaseSerialNo = () => {
    getLastPurchaseInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          initVal['purchase_sr_no'] = res.count;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        // console.log("res", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ purchaseAccLst: opt });
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  render() {
    const {
      isLoading,
      options,
      value,
      opendiv,
      initVal,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      purchaseInvoiceLst,
    } = this.state;

    return (
      <div className="wrapper_div" style={{ height: 'auto' }}>
        <div className="cust_table">
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
            <Col md="7"></Col>
            <Col md="2" className="mainbtn_create">
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
              &nbsp;
              <Button className="ml-2 alterbtn" type="submit">
                Refresh
                {/* <img src={refresh} alt="Refresh"></img> */}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="">
                <button class="btn-1">
                  Create <img src={refresh} alt="Refresh"></img>
                </button>
                <div class="flex dark">
                  <button class="bttn-dark">Refresh</button>
                </div>

                <div className="new_btn3">
                  <button class="button">
                    <span>Create </span>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
          <Collapse in={opendiv}>
            <div id="example-collapse-text">
              <div className="institute-head mb-2 mt-3 purchasescreen">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  initialValues={initVal}
                  validationSchema={Yup.object().shape({
                    purchase_sr_no: Yup.string()
                      .trim()
                      .required('Purchase no is required'),
                    transaction_dt: Yup.string().required(
                      'Transaction date is required'
                    ),
                    purchaseId: Yup.object().required(
                      'select purchase account'
                    ),
                    invoice_no: Yup.string()
                      .trim()
                      .required('invoice no is required'),
                    invoice_dt: Yup.string().required('invoice dt is required'),
                    supplierCodeId: Yup.object().required(
                      'select supplier code'
                    ),
                    supplierNameId: Yup.object().required(
                      'select supplier name'
                    ),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    // console.log("values", values);

                    // console.log({ values });
                    window.electron.ipcRenderer.webPageChange({
                      from: 'tranx_purchase_invoice_list',
                      to: 'tranx_purchase_invoice_create',
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
                      <div className="mb-2 purchasescreen">
                        <Row>
                          <Col md="2">
                            <Form.Group>
                              <Form.Label>
                                Pur Sr.#.
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>{' '}
                              </Form.Label>
                              <Form.Control
                                type="text"
                                className="pl-2"
                                placeholder=" "
                                name="purchase_sr_no"
                                id="purchase_sr_no"
                                onChange={handleChange}
                                value={values.purchase_sr_no}
                                isValid={
                                  touched.purchase_sr_no &&
                                  !errors.purchase_sr_no
                                }
                                isInvalid={!!errors.purchase_sr_no}
                                readOnly={true}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.purchase_sr_no}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md="3">
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
                          </Col>
                          <Col md="4">
                            <Form.Group className="createnew">
                              <Form.Label>
                                Purchase Acc.{' '}
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
                                  setFieldValue('purchaseId', v);
                                }}
                                value={values.purchaseId}
                              />

                              <span className="text-danger errormsg">
                                {errors.purchaseId}
                              </span>
                            </Form.Group>
                          </Col>

                          <Col md="3">
                            <Form.Group>
                              <Form.Label>
                                Invoice #.{' '}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Invoice No."
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
                        </Row>

                        <Row>
                          <Col md="2">
                            <Form.Group>
                              <Form.Label>
                                Invoice Date{' '}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <MyDatePicker
                                name="invoice_dt"
                                id="invoice_dt"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                  setFieldValue('invoice_dt', date);
                                }}
                                selected={values.invoice_dt}
                                maxDate={new Date()}
                                className="newdate"
                              />

                              {/* <Form.Control.Feedback type="invalid">
                                {errors.invoice_dt}
                              </Form.Control.Feedback> */}
                              <span className="text-danger errormsg">
                                {errors.invoice_dt}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col md="3">
                            <Form.Group className="createnew">
                              <Form.Label>
                                Supplier Code{' '}
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
                                  setFieldValue('supplierCodeId', v);
                                  if (v != null) {
                                    setFieldValue(
                                      'supplierNameId',
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
                          <Col md="4">
                            <Form.Group className="createnew">
                              <Form.Label>
                                Supplier Name{' '}
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
                          <Col md="3" className="btn_align mt-1">
                            <Button
                              className="createbtn mt-4 pt-1"
                              type="submit"
                            >
                              Submit
                            </Button>
                            <Button className="alterbtn mt-4 pt-1">
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </Collapse>
        </div>

        <Form>
          <Table bordered hover size="sm" className="new_tbldesign" responsive>
            <thead>
              <div className="scrollbar_hd">
                <tr>
                  {this.state.showDiv && (
                    <th style={{ width: '7%' }}>
                      {' '}
                      <Form.Group
                        controlId="formBasicCheckbox"
                        className="ml-1 mb-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="Sr. No." />
                      </Form.Group>
                    </th>
                  )}
                  <th>Tranx Status Name</th>
                  <th>Order No</th>
                  <th>Transaction Date</th>
                  <th>Supplier Name</th>
                  <th>Purchase Account</th>
                  <th className="btn_align">Total Amount</th>
                </tr>
              </div>
            </thead>
            <tbody>
              <div className="scrollban_new">
                <tr className="search_newtxt">
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="srno"
                        id="srno"
                        style={{ border: 'none' }}
                      />
                    </td>
                  )}
                  <td>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="srno"
                      id="srno"
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="srno"
                      id="srno"
                    />
                  </td>{' '}
                  <td>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="srno"
                      id="srno"
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="srno"
                      id="srno"
                    />
                  </td>{' '}
                  <td>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="srno"
                      id="srno"
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="srno"
                      id="srno"
                    />
                  </td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox1"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      {' '}
                      <Form.Group
                        controlId="formBasicCheckbox2"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      {' '}
                      <Form.Group
                        controlId="formBasicCheckbox3"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>{' '}
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
                <tr>
                  {this.state.showDiv && (
                    <td style={{ width: '7%' }}>
                      <Form.Group
                        controlId="formBasicCheckbox4"
                        className="ml-1 pmt-allbtn"
                      >
                        <Form.Check type="checkbox" label="01" />
                      </Form.Group>
                    </td>
                  )}
                  <td>Redmi A1</td>
                  <td>OR1234</td>
                  <td>01-12-21</td>
                  <td>Rajesh Nayar</td>
                  <td>Vishwa Enterprizes</td>
                  <td className="btn_align">4000.00/-</td>
                </tr>
              </div>
            </tbody>
          </Table>
          {/* <div className="pagination_ul">
            <Row>
              <Col md="6">
                <div className="tot_rows">
                  <p>Total Rows | 20</p>
                </div>
              </Col>
              <Col md="6">
                <div class="pagination-wrapper">
                  <div class="pagination">
                    <a class="prev page-numbers" href="javascript:;">
                      prev
                    </a>
                    <a class="page-numbers" href="javascript:;">
                      1
                    </a>
                    <span aria-current="page" class="page-numbers current">
                      2
                    </span>

                    <a class="page-numbers" href="javascript:;">
                      3
                    </a>

                    <a class="next page-numbers" href="javascript:;">
                      next
                    </a>
                  </div>
                </div>
              </Col>
            </Row>

          </div> */}
          <div className="tbl_ul">
            {/* <div className="tbl_head">
              <div className="tbl_col_width">
                <div className="tbl_head1">
                  {this.state.showDiv && (
                    <div className="tbl_col" style={{ width: '7%' }}>
                      <p>
                        {' '}
                        <Form.Group
                          controlId="formBasicCheckbox4"
                          className="ml-1 pmt-allbtn"
                        >
                          <Form.Check type="checkbox" label="Sr. No." />
                        </Form.Group>
                      </p>
                    </div>
                  )}
                  <div className="tbl_col">Tranx Status Name</div>
                  <div className="tbl_col">Order No</div>
                  <div className="tbl_col">Transaction Date</div>
                  <div className="tbl_col">Supplier Name</div>
                  <div className="tbl_col">Purchase A/C</div>
                  <div className="tbl_col tbl_total_rightalign">Total Amt</div>
                </div>
                <div className="tbl_records">
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          {' '}
                          <Form.Group
                            controlId="formBasicCheckbox4"
                            className="ml-1 pmt-allbtn"
                          >
                            <Form.Check type="checkbox" label="01" />
                          </Form.Group>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="srno"
                        id="srno"
                      />
                    </div>
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Vijay Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Jayesh Shravan Mangodekar</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                  <div className="tbl_head2">
                    {this.state.showDiv && (
                      <div className="tbl_dt" style={{ width: '7%' }}>
                        <p>
                          <p>
                            {' '}
                            <Form.Group
                              controlId="formBasicCheckbox4"
                              className="ml-1 pmt-allbtn"
                            >
                              <Form.Check type="checkbox" label="01" />
                            </Form.Group>
                          </p>
                        </p>
                      </div>
                    )}
                    <div className="tbl_dt">
                      <p>Redmi A1</p>
                    </div>
                    <div className="tbl_dt">
                      <p>OR4321</p>
                    </div>
                    <div className="tbl_dt">
                      <p>01-12-21</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Siddharth Mhalotra</p>
                    </div>
                    <div className="tbl_dt">
                      <p>Vishwa Enterprises</p>
                    </div>
                    <div className="tbl_dt tbl_dt_rightalign">
                      <p>5000.00/-</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>*/}

            {/* <Button onClick={this.open}>Open Modal</Button> */}
          </div>
        </Form>
        <Footer />
      </div>
    );
  }
}
