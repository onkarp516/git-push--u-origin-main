import React, { Component } from 'react';
import {
  Row,
  Col,
  Form,
  Modal,
  Button,
  CloseButton,
  FloatingLabel,
} from 'react-bootstrap';

import Select from 'react-select';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  ShowNotification,
  AuthenticationCheck,
  customStyles,
  MyDatePicker,
  getValue,
} from '@/helpers';

import {
  get_hsn,
  createHSN,
  getAllHSN,
  updateHSN,
} from '@/services/api_functions';

const typeoption = [
  { label: 'Services', value: 'Services' },
  { label: 'Goods', value: 'Goods' },
];

export default class HSNSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      optHSNList: [],
      optTaxList: [],
      HSNshow: false,
      isLoading: false,
      initVal: {
        id: '',
        hsnNumber: '',
        igst: '',
        cgst: '',
        sgst: '',
        description: '',
      },
    };
  }
  handleClose = () => {
    this.setState({ show: false });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstHSN();
    }
  }

  setInitValue = () => {
    let initVal = {
      id: '',
      hsnNumber: '',
      igst: '',
      cgst: '',
      sgst: '',
      description: '',
    };
    this.setState({ initVal: initVal });
  };

  handleGstChange = (value, element, setFieldValue) => {
    let flag = false;
    if (element == 'igst') {
      if (value != '') {
        let igst = parseFloat(value);
        let hgst = parseFloat(igst / 2);
        setFieldValue('igst', igst);
        setFieldValue('cgst', hgst);
        setFieldValue('sgst', hgst);
      } else {
        flag = true;
      }
    } else {
      if (value != '') {
        let hgst = parseFloat(value);
        let igst = hgst + hgst;
        setFieldValue('igst', igst);
        setFieldValue('cgst', hgst);
        setFieldValue('sgst', hgst);
      } else {
        flag = true;
      }
    }

    if (flag == true) {
      setFieldValue('igst', '');
      setFieldValue('cgst', '');
      setFieldValue('sgst', '');
    }
  };
 

  lstHSN = (id = null) => {
    getAllHSN()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data1 = res.responseObject;
          let options = data1.map(function (data) {
            return {
              value: data.id,
              label: data.hsnno,
              hsndesc: data.hsndesc,
              igst: data.igst,
              cgst: data.cgst,
              sgst: data.sgst,
            };
          });
          this.setState({ optHSNList: options }, () => {
            if (id != null) {
              let optSelected = getValue(options, parseInt(id));
              this.props.setFieldValue('hsnId', optSelected);
            }
          });
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  handleChange = (v) => {
    this.props.setFieldValue('hsnId', v);
  };

  handleModalStatus = (status) => {
    this.setState({ show: status });
  };

  render() {
    let initVal = {
      id: '',
      hsnNumber: '',
      description: '',
      type: getValue(typeoption, 'Goods'),
      igst: '',
      cgst: '',
      sgst: '',
    };
    const { optHSNList, optTaxList, data, isLoading, show } = this.state;

    return (
      <>
        <Form.Group>
          <Form.Label>
            HSN
            <a
              href="#."
              onClick={() => {
                this.setState({ show: true });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                class="bi bi-plus-square-dotted svg-style"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
              </svg>{' '}
            </a>
          </Form.Label>
          <Select
            className="selectTo"
            isClearable={false}
            isDisabled={isLoading}
            isLoading={isLoading}
            onChange={this.handleChange}
            options={optHSNList}
            value={this.props.value}
            styles={customStyles}
            placeholder="Select"
          />
          <span className="text-danger">{this.props.errors.hsnId}</span>
        </Form.Group>

        {/* HSN modal */}
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
            <Modal.Title id="example-custom-modal-styling-title" className="">
              HSN
            </Modal.Title>
            <CloseButton
              variant="white"
              className="pull-right"
              onClick={this.handleClose}
              //onClick={() => this.handelPurchaseacModalShow(false)}
            />
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
            <div className="institute-head m-0 purchasescreen mb-2">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  hsnNumber: Yup.string()
                    .trim()
                    .required('HSN number is required'),
                  description: Yup.string()
                    .trim()
                    .required('HSN description is required'),
                  type: Yup.object().required('Select type').nullable(),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // console.log("values", values);
                  let keys = Object.keys(values);
                  let requestData = new FormData();

                  keys.map((v) => {
                    if (v != 'type') {
                      requestData.append(v, values[v] ? values[v] : '');
                    } else if (v == 'type') {
                      requestData.append('type', values.type.value);
                    }
                  });
                  if (values.id == '') {
                    createHSN(requestData)
                      .then((response) => {
                        resetForm();
                        setSubmitting(false);
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          this.handleModalStatus(false);
                          ShowNotification('Success', res.message);
                          this.lstHSN(response.data.responseObject);
                          resetForm();
                        } else {
                          ShowNotification('Error', res.message);
                        }
                      })
                      .catch((error) => {
                        setSubmitting(false);
                        console.log('error', error);
                      });
                  } else {
                  }
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
                    <div className="purchasescreen mb-2">
                      <Row>
                        <Col md="2">
                          <Form.Group>
                            <Form.Label>HSN</Form.Label>
                            <Form.Control
                              autoFocus="true"
                              type="text"
                              placeholder="HSN No"
                              name="hsnNumber"
                              id="hsnNumber"
                              onChange={handleChange}
                              value={values.hsnNumber}
                              isValid={touched.hsnNumber && !errors.hsnNumber}
                              isInvalid={!!errors.hsnNumber}
                            />
                            {/* <Form.Control.Feedback type="invalid"> */}
                            <span className="text-danger errormsg">
                              {errors.hsnNumber}
                            </span>
                            {/* </Form.Control.Feedback> */}
                          </Form.Group>
                        </Col>
                        <Col md="4">
                          <Form.Group>
                            <Form.Label>HSN Description</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="HSN Description"
                              name="description"
                              id="description"
                              onChange={handleChange}
                              value={values.description}
                              isValid={
                                touched.description && !errors.description
                              }
                              isInvalid={!!errors.description}
                            />
                            {/* <Form.Control.Feedback type="invalid"> */}
                            <span className="text-danger errormsg">
                              {errors.description}
                            </span>
                            {/* </Form.Control.Feedback> */}
                          </Form.Group>
                        </Col>
                        <Col md="2">
                          <Form.Group className="createnew">
                            <Form.Label>Type</Form.Label>
                            <Select
                              className="selectTo"
                              id="type"
                              placeholder="Select Type"
                              styles={customStyles}
                              isClearable
                              options={typeoption}
                              name="type"
                              onChange={(value) => {
                                setFieldValue('type', value);
                              }}
                              value={values.type}
                            />
                            <span className="text-danger errormsg">
                              {errors.type}
                            </span>
                          </Form.Group>
                        </Col>

                        <Col md="4" className="mt-4 btn_align">
                          <Button className="createbtn" type="submit">
                            {values.id == '' ? 'Submit' : 'Update'}
                          </Button>
                          <Button
                            className="ml-2 alterbtn"
                            type="submit"
                            className="alterbtn"
                            onClick={(e) => {
                              e.preventDefault();
                              this.setState({ show: false });
                            }}
                          >
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Modal.Body>
        </Modal>
        {/* HSN modal end */}
      </>
    );
  }
}
