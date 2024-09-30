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
} from 'react-bootstrap';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import {
  createUnit,
  getAllUnit,
  updateUnit,
  get_units,
} from '@render/services/api_functions';
import {
  getHeader,
  CustomDTHeader,
  ShowNotification,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
} from '@render/helpers';
import GridTable from '@nadavshaar/react-grid-table';
import Select from 'react-select';
import { DTUnitURL } from '@render/services/api';
import axios from 'axios';
import TranxDebitNote1 from './TranxDebitNote1';
import refresh from '@render/assets/images/refresh.png';
export default class TranxDebitNote extends Component {
  constructor(props) {
    super(props);
    this.tableManager = React.createRef(null);
    this.state = {
      show: false,
      opendiv: false,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      data: [],
      initVal: {
        id: '',
        unitName: '',
        unitCode: '',
      },
    };
  }

  setTableManager = (tm) => (this.tableManager.current = tm);

  handleClose = () => {
    this.setState({ show: false }, () => {
      this.pageReload();
    });
  };
  handleModal = (status) => {
    if (status == true) {
      this.setInitValue();
    }
    this.setState({ show: status }, () => {
      this.pageReload();
    });
  };
  lstUnit = () => {
    getAllUnit()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            this.setState({ data: data });
          }
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  setInitValue = () => {
    let initVal = {
      id: '',
      unitName: '',
      unitCode: '',
    };
    this.setState({ initVal: initVal });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstUnit();
      this.setInitValue();
    }
  }
  setUpdateData = (v) => {
    let initVal = {
      id: v.id,
      unitName: v.unitName,
      unitCode: v.unitCode,
    };
    this.setState({ initVal: initVal, show: true });
  };

  onRowsRequest = async (requestData, tableManager) => {
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
    };
    const response = await axios({
      url: DTUnitURL(),
      method: 'POST',
      headers: getHeader(),
      data: JSON.stringify(req),
    })
      .then((response) => response.data)
      .catch((e) => {
        console.log('e--->', e);
      });

    if (!response?.rows) return;

    return {
      rows: response.rows,
      totalRows: response.totalRows,
    };
  };
  pageReload = () => {
    this.componentDidMount();
    this.tableManager.current.asyncApi.resetRows();
    this.tableManager.current.searchApi.setSearchText('');
  };
  callOpenDiv = () => {
    const { opendiv } = this.state;
    this.setState({ opendiv: !opendiv });
  };
  addBtn = (
    <Button
      className="nav-link createbtn"
      onClick={() => {
        this.setState({ show: true });
      }}
    >
      open
    </Button>
  );
  addBtn1 = (
    <Button
      className="nav-link createbtn"
      onClick={(e) => {
        e.preventDefault();
        this.callOpenDiv();
      }}
      // aria-controls="example-collapse-text"
      // aria-expanded={opendiv}
    >
      Create &nbsp;&nbsp;&nbsp;
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-plus-square-dotted"
        viewBox="0 0 16 16"
      >
        <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
      </svg>{' '}
    </Button>
  );
  refreshBtn = (
    <Button
      className="nav-link alertbtn"
      onClick={() => {
        this.pageReload();
      }}
    >
      Refresh
      {/* <img src={refresh} alt="Refresh icon" /> */}
    </Button>
  );

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }

  setUpdateData = (v) => {
    let initVal = {
      id: v.id,
      unitName: v.unitName,
      unitCode: v.unitCode,
    };
    this.setState({ initVal: initVal, show: true });
  };
  handleKeyDown = (event) => {
    event.stopPropagation();
    console.log({ event });
    console.log('event key==>', event.key);
    const { rowVirtualizer, config, id } = this.tableManager.current;
    const { scrollToOffset, scrollToIndex } = rowVirtualizer;
    const { header } = config.additionalProps;
    const { currentScrollPosition, setcurrentscrollposition } = header;
    let scrollPosition = 0;
    switch (event.key) {
      case 'ArrowUp':
        console.log('event id==>', id);
        let elem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
        if (elem != undefined && elem != null) {
          let up_row_id = elem.getAttribute('data-row-id');
          let up_id = elem.getAttribute('data-row-index');
          let uprowIndex = parseInt(up_id) - 1;
          console.log({ uprowIndex });
          if (uprowIndex > 0) {
            document
              .querySelectorAll(`#${id} .rgt-row-focus`)
              .forEach((cell) => cell.classList.remove('rgt-row-focus'));

            document
              .querySelectorAll(`#${id} .rgt-row-${uprowIndex}`)
              .forEach((cell) => cell.classList.add('rgt-row-focus'));
            scrollToIndex(uprowIndex - 3);
          }
        }

        break;

      case 'ArrowDown':
        let downelem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
        if (downelem != undefined && downelem != null) {
          let d_id = downelem.getAttribute('data-row-index');
          let rowIndex = parseInt(d_id) + 1;
          console.log({ rowIndex });
          document
            .querySelectorAll(`#${id} .rgt-row-focus`)
            .forEach((cell) => cell.classList.remove('rgt-row-focus'));
          document
            .querySelectorAll(`#${id} .rgt-row-${rowIndex}`)
            .forEach((cell) => cell.classList.add('rgt-row-focus'));
          scrollToIndex(rowIndex + 2);
        }
        break;
      case 'e':
        console.log('event id==>', id);
        if (id != undefined && id != null) {
          console.log('edit functionality calling');
          let downelem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
          if (downelem != undefined && downelem != null) {
            let d_index_id = downelem.getAttribute('data-row-index');
            let data_id = downelem.getAttribute('data-row-id');
            console.log('row data id ', { d_index_id, data_id });
            let rowIndex = parseInt(d_index_id) + 1;

            this.handleFetchData(data_id);
          }
        }
        break;

      default:
        console.log('default');
        break;
    }
  };

  handleRowClick = ({ rowIndex }) => {
    console.log('rowIndex ', rowIndex);
    const { id } = this.tableManager.current;
    console.log({ id });
    document
      .querySelectorAll(`#${id} .rgt-row-focus`)
      .forEach((cell) => cell.classList.remove('rgt-row-focus'));

    document
      .querySelectorAll(`#${id} .rgt-row-${rowIndex}`)
      .forEach((cell) => cell.classList.add('rgt-row-focus'));
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append('id', id);
    get_units(reqData)
      .then((response) => {
        let result = response.data;
        console.log('response ', response);
        if (result.responseStatus == 200) {
          this.setUpdateData(result.responseObject);
        } else {
          console.log('error');
          ShowNotification('Error', result.message);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  handeldebitnoteModalShow = (status) => {
    this.setState({ debitnoteModalShow: status });
  };

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
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      groupModalShow,
      opendiv,
      debitnoteModalShow,
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
                <div className="">
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={initVal}
                    validationSchema={Yup.object().shape({
                      unitName: Yup.string()
                        .trim()
                        .required('unitName is required'),
                      unitCode: Yup.string()
                        .trim()
                        .required('unitCode is required'),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      let requestData = new FormData();
                      requestData.append('unitName', values.unitName);
                      requestData.append('unitCode', values.unitCode);
                      if (values.id == '') {
                        createUnit(requestData)
                          .then((response) => {
                            let res = response.data;
                            if (res.responseStatus == 200) {
                              this.handleModal(false);
                              ShowNotification('Success', res.message);
                              resetForm();
                              this.props.handleRefresh(true);
                              this.tableManager.current.asyncApi.resetRows();
                            } else {
                              ShowNotification('Error', res.message);
                            }
                          })
                          .catch((error) => {
                            console.log('error', error);
                          });
                      } else {
                        requestData.append('id', values.id);
                        updateUnit(requestData)
                          .then((response) => {
                            let res = response.data;
                            if (res.responseStatus == 200) {
                              ShowNotification('Success', res.message);
                              this.lstUnit();
                              this.handleModal(false);
                              this.setInitValue();
                              resetForm();
                            } else {
                              ShowNotification('Error', res.message);
                            }
                          })
                          .catch((error) => {
                            console.log('error', error);
                          });
                      }
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
                      <Form onSubmit={handleSubmit}>
                        <div className="mb-2 purchasescreen">
                          <Row>
                            <Col md="2" className="">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Debit note #.</Form.Label>
                                <Form.Control type="text" placeholder="22" />
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
                                <MyDatePicker
                                  name="invoice_dt"
                                  id="invoice_dt"
                                  dateFormat="dd/MM/yyyy"
                                  onChange={(date) => {
                                    setFieldValue('transaction_dt', date);
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
                              <Form.Group>
                                <Form.Label>
                                  Pur. Return Invoice #.{' '}
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
                            <Col md="4">
                              <Form.Group className="createnew">
                                <Form.Label>
                                  Purchase A/c.{' '}
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
                            <Col md="5">
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
                            <Col md="2" className="">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Outstanding</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="2200.00"
                                />
                              </Form.Group>
                            </Col>
                            <Col md="2" className="mt-4 pt-1 btn_align">
                              <Button className="createbtn" type="submit">
                                Submit
                              </Button>
                              <Button className="ml-2 alterbtn" type="submit">
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
              <Col md="6"></Col>
              <Col md="3" className="mainbtn_create">
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
                {/* <Button
                  className="createbtn"
                  // to="/TranxDebitNote1"
                  tabIndex={0}
                  onClick={() => {
                    this.setState({ show: true });
                  }}
                >
                  open
                </Button> */}
                <Button className="ml-2 alterbtn" type="submit">
                  Refresh
                </Button>
              </Col>
            </Row>
            <Modal
              show={show}
              size="lg"
              className="groupnewmodal mt-5 mainmodal"
              onHide={this.handleClose}
              dialogClassName="modal-400w"
              // aria-labelledby="example-custom-modal-styling-title"
              aria-labelledby="contained-modal-title-vcenter"
              //centered
            >
              <Modal.Header
                //closeButton
                className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
              >
                <Modal.Title
                  id="example-custom-modal-styling-title"
                  className=""
                >
                  Debit Note
                </Modal.Title>
                <CloseButton
                  variant="white"
                  className="pull-right"
                  onClick={this.handleClose}
                  //  onClick={() => this.handelPurchaseacModalShow(false)}
                />
              </Modal.Header>
              <Modal.Body className=" p-2 p-invoice-modal">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  initialValues={initVal}
                  validationSchema={Yup.object().shape({
                    unitName: Yup.string()
                      .trim()
                      .required('unitName is required'),
                    unitCode: Yup.string()
                      .trim()
                      .required('unitCode is required'),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    let requestData = new FormData();
                    requestData.append('unitName', values.unitName);
                    requestData.append('unitCode', values.unitCode);
                    if (values.id == '') {
                      createUnit(requestData)
                        .then((response) => {
                          let res = response.data;
                          if (res.responseStatus == 200) {
                            this.handleModal(false);
                            ShowNotification('Success', res.message);
                            resetForm();
                            this.props.handleRefresh(true);
                            this.tableManager.current.asyncApi.resetRows();
                          } else {
                            ShowNotification('Error', res.message);
                          }
                        })
                        .catch((error) => {
                          console.log('error', error);
                        });
                    } else {
                      requestData.append('id', values.id);
                      updateUnit(requestData)
                        .then((response) => {
                          let res = response.data;
                          if (res.responseStatus == 200) {
                            ShowNotification('Success', res.message);
                            this.lstUnit();
                            this.handleModal(false);
                            this.setInitValue();
                            resetForm();
                          } else {
                            ShowNotification('Error', res.message);
                          }
                        })
                        .catch((error) => {
                          console.log('error', error);
                        });
                    }
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
                    <Form onSubmit={handleSubmit}>
                      <div className="all_bills">
                        <fieldset>
                          <legend>Bills</legend>
                          <div className="bills_dt">
                            <Row>
                              <Col md="5">
                                <Form.Group as={Row}>
                                  <Form.Label column sm="6">
                                    Select From Date{' '}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <Col sm="6">
                                    <MyDatePicker
                                      name="from_dt"
                                      id="from_dt"
                                      dateFormat="dd/MM/yyyy"
                                      onChange={(date) => {
                                        setFieldValue('transaction_dt', date);
                                      }}
                                      selected={values.from_dt}
                                      maxDate={new Date()}
                                      className="newdate"
                                    />
                                    <span className="text-danger errormsg">
                                      {errors.from_dt}
                                    </span>
                                  </Col>
                                </Form.Group>
                              </Col>
                              <Col md="5">
                                <Form.Group as={Row}>
                                  <Form.Label column sm="5">
                                    Select To Date{' '}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <Col sm="6">
                                    <MyDatePicker
                                      name="to_dt"
                                      id="to_dt"
                                      dateFormat="dd/MM/yyyy"
                                      onChange={(date) => {
                                        setFieldValue('to_dt', date);
                                      }}
                                      selected={values.to_dt}
                                      maxDate={new Date()}
                                      className="newdate"
                                    />
                                    <span className="text-danger errormsg">
                                      {errors.to_dt}
                                    </span>
                                  </Col>
                                </Form.Group>
                              </Col>
                            </Row>
                            <div className="institutetbl pb-2 pt-0 pl-2 pr-2">
                              <div className="purchase-head mb-2"></div>

                              <Table className="allbill_tbl mb-0">
                                <thead>
                                  <tr>
                                    <th className="pt-0 pb-0">
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
                                    <th className="pb-1 pt-0">Bill #.</th>
                                    <th className="pb-1 pt-0">Bill Amt</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      onClick={(e) => {
                                        this.handeldebitnoteModalShow(true);
                                      }}
                                    >
                                      {' '}
                                      <Form.Check
                                        type="checkbox"
                                        label="01"
                                        value="01"
                                      />
                                    </td>
                                    <td>01</td>
                                    <td>80,095/-</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      {' '}
                                      <Form.Check
                                        type="checkbox"
                                        label="02"
                                        value="02"
                                      />
                                    </td>
                                    <td>02</td>
                                    <td>50,590/-</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      {' '}
                                      <Form.Check
                                        type="checkbox"
                                        label="01"
                                        value="01"
                                      />
                                    </td>
                                    <td>03</td>
                                    <td>500/-</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      {' '}
                                      <Form.Check
                                        type="checkbox"
                                        label="01"
                                        value="01"
                                      />
                                    </td>
                                    <td>04</td>
                                    <td>12,000/-</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      {' '}
                                      <Form.Check
                                        type="checkbox"
                                        label="01"
                                        value="01"
                                      />
                                    </td>
                                    <td>05</td>
                                    <td>1000/-</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>

            {/* Debit Note Create Modal */}
            <Modal
              show={debitnoteModalShow}
              size="lg"
              className="groupnewmodal mt-5 mainmodal"
              onHide={() => this.handeldebitnoteModalShow(false)}
              dialogClassName="modal-400w"
              // aria-labelledby="example-custom-modal-styling-title"
              aria-labelledby="contained-modal-title-vcenter"
              //centered
            >
              <Modal.Header
                //closeButton
                className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
              >
                <Modal.Title
                  id="example-custom-modal-styling-title"
                  className=""
                >
                  Shri Pharma Medical
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
                  <Table className="scrolldown allbill_tbl mb-0">
                    <thead>
                      <tr>
                        <th className="pt-0 pb-0">
                          <Form.Group
                            controlId="formBasicCheckbox"
                            className="ml-1 pmt-allbtn"
                          >
                            <Form.Check
                              type="checkbox"
                              className="pt-1"
                              label="Sr. No."
                            />
                          </Form.Group>
                        </th>
                        <th className="pt-0">Products</th>
                        <th className="pt-0">Qty</th>
                        <th className="pt-0">Unit</th>
                        <th className="pt-0">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          onClick={(e) => {
                            this.handeldebitnoteModalShow(true);
                          }}
                        >
                          {' '}
                          <Form.Check type="checkbox" label="01" value="01" />
                        </td>
                        <td>Mobile</td>
                        <td>2</td>
                        <td>Piece</td>
                        <td>20,000/-</td>
                      </tr>
                      <tr>
                        <td
                          onClick={(e) => {
                            this.handeldebitnoteModalShow(true);
                          }}
                        >
                          {' '}
                          <Form.Check type="checkbox" label="01" value="01" />
                        </td>
                        <td>Mobile</td>
                        <td>1</td>
                        <td>Piece</td>
                        <td>20,000/-</td>
                      </tr>
                      <tr>
                        <td
                          onClick={(e) => {
                            this.handeldebitnoteModalShow(true);
                          }}
                        >
                          {' '}
                          <Form.Check type="checkbox" label="01" value="01" />
                        </td>
                        <td>Mobile</td>
                        <td>1</td>
                        <td>Piece</td>
                        <td>20,000/-</td>
                      </tr>
                      <tr>
                        <td
                          onClick={(e) => {
                            this.handeldebitnoteModalShow(true);
                          }}
                        >
                          {' '}
                          <Form.Check type="checkbox" label="01" value="01" />
                        </td>
                        <td>Mobile</td>
                        <td>1</td>
                        <td>Piece</td>
                        <td>20,000/-</td>
                      </tr>
                      <tr>
                        <td
                          onClick={(e) => {
                            this.handeldebitnoteModalShow(true);
                          }}
                        >
                          {' '}
                          <Form.Check type="checkbox" label="01" value="01" />
                        </td>
                        <td>Mobile</td>
                        <td>1</td>
                        <td>Piece</td>
                        <td>20,000/-</td>
                      </tr>
                      <tr>
                        <td
                          onClick={(e) => {
                            this.handeldebitnoteModalShow(true);
                          }}
                        >
                          {' '}
                          <Form.Check type="checkbox" label="01" value="01" />
                        </td>
                        <td>Mobile</td>
                        <td>1</td>
                        <td>Piece</td>
                        <td>20,000/-</td>
                      </tr>
                      <tr>
                        <td
                          onClick={(e) => {
                            this.handeldebitnoteModalShow(true);
                          }}
                        >
                          {' '}
                          <Form.Check type="checkbox" label="01" value="01" />
                        </td>
                        <td>Mobile</td>
                        <td>1</td>
                        <td>Piece</td>
                        <td>20,000/-</td>
                      </tr>
                    </tbody>
                    <tbody style={{ background: '#eee' }}>
                      <tr className="pmt-total">
                        <td className="p-1">Total</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="p-1">00,000/- Dr</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Button
                    className="createbtn mt-1"
                    to="/TranxDebitNote1"
                    tabIndex={0}
                    // onClick={() => {
                    //   this.handleCreateBtn();
                    // }}
                  >
                    Submit
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
          <Form>
            <div className="table_wrapper">
              <Table
                bordered
                hover
                size="sm"
                className="new_tbldesign"
                // responsive
              >
                <thead>
                  {/* <div className="scrollbar_hd"> */}
                  <tr>
                    {/* {this.state.showDiv && ( */}
                    <th style={{ width: '4%' }}>Sr. #.</th>
                    {/* )} */}
                    <th>Voucher No.</th>
                    <th>Date</th>
                    <th>Supplier Name</th>
                    <th>Narration</th>
                    <th className="btn_align">Amount</th>
                  </tr>
                  {/* </div> */}
                </thead>
                <tbody>
                  {/* <div className="scrollban_new"> */}
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
                  {/* </div> */}
                </tbody>
              </Table>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
