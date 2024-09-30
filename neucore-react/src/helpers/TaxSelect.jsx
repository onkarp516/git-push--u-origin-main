import React, { Component } from "react";
import { Row, Col, Form, Modal, Button, CloseButton } from "react-bootstrap";

import Select from "react-select";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  ShowNotification,
  AuthenticationCheck,
  customStyles,
  getValue,
  MyDatePicker,
} from "@/helpers";
import { createTax, get_taxOutlet } from "@/services/api_functions";

export default class TaxSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      opendiv: false,
      optHSNList: [],
      optTaxList: [],
      HSNshow: false,
      isLoading: false,
      initVal: {
        id: "",
        gst_per: "",
        sratio: "50%",
        igst: "",
        cgst: "",
        sgst: "",
      },
    };
  }
  handleClose = () => {
    this.setState({ show: false });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstTAX();
    }
  }
  setInitValue = () => {
    let initVal = {
      id: "",
      gst_per: "",
      sratio: "50%",
      igst: "",
      cgst: "",
      sgst: "",
    };
    this.setState({ initVal: initVal, opendiv: false });
  };

  handleGstChange = (value, element, valObject, setFieldValue) => {
    let flag = false;
    let igst = 0;
    if (element == "gst_per") {
      if (value != "") {
        let gst_per = value;
        igst = value.replace("%", "");

        setFieldValue("gst_per", gst_per);
        setFieldValue("igst", igst);
      } else {
        setFieldValue("gst_per", "");
        setFieldValue("igst", "");
      }
    }

    if (valObject.sratio != "") {
      // if (value != '') {
      igst = igst > 0 ? igst : valObject.igst;
      let sratio = parseFloat(valObject.sratio);
      let per = parseFloat((igst * sratio) / 100);
      let rem = parseFloat(igst - per);
      setFieldValue("sratio", sratio);
      setFieldValue("cgst", per);
      setFieldValue("sgst", rem);
      // } else {
      //   setFieldValue('sratio', '');
      //   setFieldValue('cgst', '');
      //   setFieldValue('sgst', '');
      // }
    }
  };

  lstTAX = (id = null) => {
    get_taxOutlet()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data1 = res.responseObject;
          let options = data1.map(function (data) {
            return {
              value: data.id,
              label: data.gst_per,
              sratio: data.ratio,
              igst: data.igst,
              cgst: data.cgst,
              sgst: data.sgst,
            };
          });

          this.setState({ optTaxList: options }, () => {
            if (id != null) {
              let optSelected = getValue(options, parseInt(id));
              this.props.setFieldValue("taxMasterId", optSelected);
            }
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleChangeTax = (v) => {
    this.props.setFieldValue("taxMasterId", v);
  };

  handleModalStatus = (status) => {
    this.setState({ show: status });
  };

  render() {
    const { optHSNList, optTaxList, data, isLoading, show, initVal, opendiv } =
      this.state;

    return (
      <>
        <Col md="2">
          <Form.Group className="ml-2 createnew">
            <Form.Label>
              Tax
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
                </svg>{" "}
              </a>
            </Form.Label>
            <Select
              className="selectTo"
              isClearable={false}
              isDisabled={isLoading}
              isLoading={isLoading}
              onChange={this.handleChangeTax}
              options={optTaxList}
              value={this.props.value}
              styles={customStyles}
            />
            <span className="text-danger">{this.props.errors.taxMasterId}</span>
          </Form.Group>
        </Col>

        <Col md="2">
          <Form.Group>
            <Form.Label>IGST</Form.Label>
            <Form.Control
              type="text"
              placeholder="IGST"
              readOnly={true}
              value={
                this.props.value != "" && this.props.value != undefined
                  ? this.props.value.igst
                  : ""
              }
            />
          </Form.Group>
        </Col>

        <Col md="2">
          <Form.Group>
            <Form.Label>CGST</Form.Label>
            <Form.Control
              type="text"
              placeholder="CGST"
              readOnly={true}
              value={
                this.props.value != "" && this.props.value != undefined
                  ? this.props.value.cgst
                  : ""
              }
            />
          </Form.Group>
        </Col>

        <Col md="2">
          <Form.Group>
            <Form.Label>SGST</Form.Label>
            <Form.Control
              type="text"
              placeholder="SGST"
              readOnly={true}
              value={
                this.props.value != "" && this.props.value != undefined
                  ? this.props.value.sgst
                  : ""
              }
            />
          </Form.Group>
        </Col>

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
              Tax
            </Modal.Title>
            <CloseButton
              variant="white"
              className="pull-right"
              onClick={this.handleClose}
              //onClick={() => this.handelPurchaseacModalShow(false)}
            />
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
            <div className="purchasescreen">
              <div className="institute-head m-0 purchasescreen mb-2">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={initVal}
                  validationSchema={Yup.object().shape({
                    gst_per: Yup.string()
                      .trim()
                      .required("HSN number is required"),
                    igst: Yup.string().trim().required("Igst is required"),
                    cgst: Yup.string().trim().required("Cgst is required"),
                    sgst: Yup.string().trim().required("Sgst is required"),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    let requestData = new FormData();
                    if (values.id != "") {
                      requestData.append("id", values.id);
                    }
                    requestData.append("gst_per", values.gst_per);
                    requestData.append("sratio", values.sratio);
                    requestData.append("igst", values.igst);
                    requestData.append("cgst", values.cgst);
                    requestData.append("sgst", values.sgst);
                    requestData.append(
                      "applicable_date",
                      moment(values.applicable_date).format("yyyy-MM-DD")
                    );

                    if (values.id == "") {
                      createTax(requestData)
                        .then((response) => {
                          resetForm();
                          setSubmitting(false);
                          let res = response.data;
                          if (res.responseStatus == 200) {
                            this.handleModalStatus(false);
                            ShowNotification("Success", res.message);
                            this.lstTAX(response.data.responseObject);
                            resetForm();
                          } else {
                            ShowNotification("Error", res.message);
                          }
                        })
                        .catch((error) => {
                          setSubmitting(false);
                          console.log("error", error);
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
                              <Form.Label>GST %</Form.Label>
                              <Form.Control
                                autoFocus="true"
                                type="text"
                                placeholder="GST %"
                                name="gst_per"
                                id="gst_per"
                                // onChange={handleChange}
                                onChange={(e) => {
                                  this.handleGstChange(
                                    e.target.value,
                                    "gst_per",
                                    values,
                                    setFieldValue
                                  );
                                }}
                                value={values.gst_per}
                                isValid={touched.gst_per && !errors.gst_per}
                                isInvalid={!!errors.gst_per}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.gst_per}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md="2">
                            <Form.Group>
                              <Form.Label>IGST</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="IGST"
                                name="igst"
                                id="igst"
                                // onChange={handleChange}
                                onChange={(e) => {
                                  this.handleGstChange(
                                    e.target.value,
                                    "igst",
                                    values,
                                    setFieldValue
                                  );
                                }}
                                value={values.igst}
                                isValid={touched.igst && !errors.igst}
                                isInvalid={!!errors.igst}
                              />{" "}
                              <Form.Control.Feedback type="invalid">
                                {errors.igst}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <Form.Label>CGST</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="CGST"
                                name="cgst"
                                id="cgst"
                                onChange={(e) => {
                                  this.handleGstChange(
                                    e.target.value,
                                    "cgst",
                                    values,
                                    setFieldValue
                                  );
                                }}
                                value={values.cgst}
                                isValid={touched.cgst && !errors.cgst}
                                isInvalid={!!errors.cgst}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.cgst}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <Form.Label>SGST</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="SGST"
                                name="sgst"
                                id="sgst"
                                onChange={(e) => {
                                  this.handleGstChange(
                                    e.target.value,
                                    "sgst",
                                    values,
                                    setFieldValue
                                  );
                                }}
                                value={values.sgst}
                                isValid={touched.sgst && !errors.sgst}
                                isInvalid={!!errors.sgst}
                              />{" "}
                              <Form.Control.Feedback type="invalid">
                                {errors.sgst}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <Form.Label>
                                Applicable Date{" "}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <MyDatePicker
                                name="applicable_date"
                                placeholderText="DD/MM/YYYY"
                                id="applicable_date"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                  setFieldValue("applicable_date", date);
                                }}
                                selected={values.applicable_date}
                                maxDate={new Date()}
                                className="newdate"
                              />
                              {/* <span className="text-danger errormsg">{errors.bill_dt}</span> */}
                            </Form.Group>
                          </Col>

                          <Col md="12" className="mt-4 btn_align">
                            <Button className="createbtn mt-2" type="submit">
                              {values.id == "" ? "Submit" : "Update"}
                            </Button>
                            <Button
                              className="ml-2 alterbtn"
                              type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ opendiv: !opendiv }, () => {
                                  this.pageReload();
                                });
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
            </div>
          </Modal.Body>
        </Modal>
        {/* HSN modal end */}
      </>
    );
  }
}
