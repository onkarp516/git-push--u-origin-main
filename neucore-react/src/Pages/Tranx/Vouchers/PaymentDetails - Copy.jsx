import React, { Component } from 'react';
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
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
//import TranxDebitNote1 from './TranxDebitNote1';
import refresh from '@render/assets/images/refresh.png';
const products = [
  { value: 'Product 1', label: 'Product 1' },
  { value: 'Washing Machine', label: 'Washing Machine' },
];
const drcrtype = [
  { value: 'Dr', label: 'Dr' },
  { value: 'Cr', label: 'Cr' },
];
// function handleShow(breakpoint) {
//   setFullscreen(breakpoint);
//   setShow(true);
// }
export default class TranxDebitNote extends Component {
  constructor(props) {
    super(props);
    this.tableManager = React.createRef(null);
    this.state = {
      show: false,
      fullscreen: false,
      amtledgershow: false,
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

  addBtn = (
    <Button
      className="nav-link createbtn"
      // onClick={() => {
      //   this.setState({ show: true });
      // }}
    >
      Create
    </Button>
  );

  refreshBtn = (
    <Button
      className="nav-link createbtn"
      onClick={() => {
        this.pageReload();
      }}
    >
      <img src={refresh} alt="Refresh icon" />
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
    // const customStyles = {
    //   control: (base) => ({
    //     ...base,
    //     height: 30,
    //     minHeight: 30,
    //     borderTop: 'none',
    //     borderRight: 'none',
    //     borderTop: 'none',
    //     borderLeft: 'none',
    //     fontSize: '13px',
    //     //borderBottom: "1px solid #1e3989",
    //     padding: '0 6px',
    //     boxShadow: 'none',
    //     //lineHeight: "10",
    //     '&:focus': {
    //       borderBottom: '1px solid #1e3989',
    //     },
    //   }),
    // };
    const customStyles1 = {
      control: (base) => ({
        ...base,
        height: 30,
        minHeight: 30,
        fontSize: '13px',
        border: 'none',
        padding: '0 6px',
        fontFamily: 'MontserratRegular',
        boxShadow: 'none',
        //lineHeight: "10",
        //background: 'transparent',
        borderBottom: 'none',
        // '&:focus': {
        //   borderBottom: '1px solid #1e3989',
        // },
      }),
    };
    const columns = [
      {
        id: 'voucher_no', // database column name
        field: 'voucherno', // response parameter name
        label: 'Vocher No.',
        resizable: true,
      },
      {
        id: 'v_date', // database column name
        field: 'date', // response parameter name
        label: 'Date',
        resizable: true,
      },
      {
        id: 'supplier_name', // database column name
        field: 'suppliername', // response parameter name
        label: 'Supplier Name',
        resizable: true,
      },
      {
        id: 'amount', // database column name
        field: 'amount', // response parameter name
        label: 'Amount',
        resizable: true,
      },
      {
        id: 'narration', // database column name
        field: 'narration', // response parameter name
        label: 'Narration',
        resizable: true,
      },
    ];

    const {
      show,
      data,
      fullscreen,
      initVal,
      amtledgershow,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      groupModalShow,
      debitnoteModalShow,
    } = this.state;
    return (
      <div className="">
        <div className="dashboardpg institutepg">
          <div className="d-bg i-bg" style={{ height: '700px' }}>
            <div className="institute-head p-2">
              <GridTable
                components={{ Header: CustomDTHeader }}
                columns={columns}
                onRowsRequest={this.onRowsRequest}
                // onRowClick={(
                //   { rowIndex, data, column, isEdit, event },
                //   tableManager
                // ) => !isEdit}
                onRowClick={this.handleRowClick}
                onKeyDown={this.handleKeyDown}
                minSearchChars={0}
                additionalProps={{
                  header: {
                    addBtn: this.addBtn,
                    refreshBtn: this.refreshBtn,
                  },
                }}
                isVirtualScroll={false}
                isPaginated={false}
                selectAllMode={'all'}
                tabIndex="1"
                onLoad={this.setTableManager.bind(this)}
              />
            </div>
            <Modal
              show={show}
              size="fullscreen"
              //fullscreen={'xl-down'}
              className="groupnewmodal mainmodal"
              onHide={this.handleClose}
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
                  Payment Voucher
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
                      <div className="institute-head purchasescreen">
                        <Row>
                          <Col md="2" className="">
                            <Form.Group controlId="exampleForm.ControlInput1">
                              <Form.Label>Vouncher Sr. #.</Form.Label>
                              <Form.Control type="text" placeholder="22" />
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

                              <span className="text-danger errormsg">
                                {errors.invoice_dt}
                              </span>
                            </Form.Group>
                          </Col>

                          <Col md="2">
                            <Button className="createbtn mt-4" type="submit">
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </div>
                      <div className="institutetbl">
                        <Table hover size="sm" className="key mb-0">
                          <thead>
                            <tr>
                              <th style={{ width: '5%' }}>Type</th>
                              <th>Particulars</th>
                              <th style={{ width: '8%', textAlign: 'center' }}>
                                Debit
                              </th>
                              <th style={{ width: '57%' }} className="pl-4">
                                Credit
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="entryrow">
                              <td>
                                <Form.Control as="select">
                                  <option>Dr</option>
                                  <option>Cr</option>
                                </Form.Control>
                              </td>
                              <td
                                style={{ width: '30%', background: '#f5f5f5' }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({ amtledgershow: true });
                                }}
                                // onClick={(e) => {
                                //   e.preventDefault();
                                //   this.setState({ billadjusmentmodalshow: true });
                                // }}
                              >
                                <Form.Control type="text" placeholder="" />
                              </td>
                              <td
                                style={{
                                  textAlign: 'right',
                                  paddingRight: '39px',
                                }}
                              >
                                {' '}
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  style={{ textAlign: 'right' }}
                                />
                              </td>
                              <td>
                                {' '}
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  style={{ textAlign: 'right', width: '8%' }}
                                />
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td>
                                <Form.Control as="select">
                                  <option></option>
                                  <option>Dr</option>
                                  <option>Cr</option>
                                </Form.Control>
                              </td>
                              <td
                                style={{ width: '30%', background: '#f5f5f5' }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({ amtledgershow: true });
                                }}
                              >
                                <Form.Control type="text" placeholder="" />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                              <td>
                                {' '}
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ bankchequeshow: true });
                                  }}
                                  style={{ textAlign: 'right' }}
                                />
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td>
                                <Form.Control as="select">
                                  <option></option>
                                  <option>Dr</option>
                                  <option>Cr</option>
                                </Form.Control>
                              </td>
                              <td
                                style={{ width: '30%', background: '#f5f5f5' }}
                              >
                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={customStyles}
                                  components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  name="groupId"
                                  options={products}
                                  placeholder=""
                                />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td>
                                <Form.Control as="select">
                                  <option></option>
                                  <option>Dr</option>
                                  <option>Cr</option>
                                </Form.Control>
                              </td>
                              <td
                                style={{ width: '30%', background: '#f5f5f5' }}
                              >
                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={customStyles}
                                  components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  name="groupId"
                                  options={products}
                                  placeholder=""
                                />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td>
                                <Form.Control as="select">
                                  <option></option>
                                  <option>Dr</option>
                                  <option>Cr</option>
                                </Form.Control>
                              </td>
                              <td
                                style={{ width: '30%', background: '#f5f5f5' }}
                              >
                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={customStyles}
                                  components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  name="groupId"
                                  options={products}
                                  placeholder=""
                                />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td>
                                <Form.Control as="select">
                                  <option></option>
                                  <option>Dr</option>
                                  <option>Cr</option>
                                </Form.Control>
                              </td>
                              <td
                                style={{ width: '30%', background: '#f5f5f5' }}
                              >
                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={customStyles}
                                  components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  name="groupId"
                                  options={products}
                                  placeholder=""
                                />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td>
                                <Form.Control as="select">
                                  <option></option>
                                  <option>Dr</option>
                                  <option>Cr</option>
                                </Form.Control>
                              </td>
                              <td
                                style={{ width: '30%', background: '#f5f5f5' }}
                              >
                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={customStyles}
                                  components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  name="groupId"
                                  options={products}
                                  placeholder=""
                                />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td>
                                <Form.Control as="select">
                                  <option></option>
                                  <option>Dr</option>
                                  <option>Cr</option>
                                </Form.Control>
                              </td>
                              <td
                                style={{ width: '30%', background: '#f5f5f5' }}
                              >
                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={customStyles}
                                  components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  name="groupId"
                                  options={products}
                                  placeholder=""
                                />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td>
                                <Form.Control as="select">
                                  <option></option>
                                  <option>Dr</option>
                                  <option>Cr</option>
                                </Form.Control>
                              </td>
                              <td
                                style={{ width: '30%', background: '#f5f5f5' }}
                              >
                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={customStyles}
                                  components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  name="groupId"
                                  options={products}
                                  placeholder=""
                                />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                            </tr>
                            <tr className="entryrow">
                              <td>
                                <Form.Control as="select">
                                  <option></option>
                                  <option>Dr</option>
                                  <option>Cr</option>
                                </Form.Control>
                              </td>
                              <td
                                style={{ width: '30%', background: '#f5f5f5' }}
                              >
                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={customStyles}
                                  components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  name="groupId"
                                  options={products}
                                  placeholder=""
                                />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                              <td>
                                {' '}
                                <Form.Control type="text" placeholder="" />
                              </td>
                            </tr>
                            <tr style={{ background: '#f5f5f5' }}>
                              <td></td>
                              <td
                                className="pr-2"
                                style={{
                                  background: '#eee',
                                  textAlign: 'right',
                                }}
                              >
                                {' '}
                                Total Qty
                              </td>
                              <td
                                style={{
                                  textAlign: 'right',
                                  paddingRight: '39px',
                                }}
                              >
                                <Form.Control
                                  style={{
                                    textAlign: 'right',
                                    // width: "8%",
                                    background: 'transparent',
                                    border: 'none',
                                  }}
                                  type="text"
                                  placeholder=""
                                  value="000.00"
                                  readonly
                                />
                              </td>
                              <td>
                                {' '}
                                <Form.Control
                                  style={{
                                    textAlign: 'right',
                                    width: '8%',
                                    background: 'transparent',
                                    border: 'none',
                                  }}
                                  type="text"
                                  placeholder=""
                                  value="000.00"
                                  readonly
                                />
                              </td>
                              <td style={{ background: '#eee' }}></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                      {/* <div className="all_bills">
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
                      </div> */}
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>
            {/* Bank ledger modal start */}
            <Modal
              show={amtledgershow}
              //size="sm"
              className="mt-5 mainmodal"
              onHide={() => this.setState({ amtledgershow: false })}
              // dialogClassName="modal-400w"
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
                  Ledger
                </Modal.Title>
                <CloseButton
                  variant="white"
                  className="pull-right"
                  onClick={this.handleClose}
                  //  onClick={() => this.handelPurchaseacModalShow(false)}
                />
              </Modal.Header>
              <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
                <div className="pmt-select-ledger">
                  <Table className="mb-2">
                    <tr>
                      <th className="pl-2">
                        <span className="pt-2 mt-2">Ledgers</span>
                      </th>
                      <th className="pl-2">Amt</th>
                    </tr>
                    <tbody>
                      <tr>
                        <td className="p-1">Bank</td>
                        <td className="p-1">10,000/- Dr</td>
                      </tr>
                      <tr>
                        <td className="p-1">Bank</td>
                        <td className="p-1">10,000/- Dr</td>
                      </tr>
                      <tr>
                        <td className="p-1">Bank</td>
                        <td className="p-1">10,000/- Dr</td>
                      </tr>
                      <tr>
                        <td className="p-1">Bank</td>
                        <td className="p-1">10,000/- Dr</td>
                      </tr>
                      <tr>
                        <td className="p-1">Bank</td>
                        <td className="p-1">10,000/- Dr</td>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr className="pmt-total">
                        <td className="p-1">Total</td>
                        <td className="p-1">20,000/- Dr</td>
                      </tr>
                    </tbody>
                  </Table>

                  <div className="pmt-select-all mb-1">
                    <Row>
                      {/* <Col md="6">
                        {" "}
                        
                        <Button variant="secondary">ctrl+l</Button>
                      </Col> */}
                      <Col md="12">
                        <Button
                          variant="secondary"
                          className="pull-right createbtn "
                        >
                          Submit
                        </Button>{' '}
                      </Col>
                    </Row>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            {/* Bank ledger modal end */}
          </div>
        </div>
      </div>
    );
  }
}
