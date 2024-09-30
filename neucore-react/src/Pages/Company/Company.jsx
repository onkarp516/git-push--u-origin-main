import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Collapse,
  FormControl,
} from "react-bootstrap";
import {
  authenticationService,
  createCompany,
  getIndianState,
  getIndiaCountry,
  get_companies_super_admin,
  getGSTTypes,
  getCompanyById,
  updateCompany,
} from "@/services/api_functions";

import Select from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  EMAILREGEXP,
  numericRegExp,
  urlRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
} from "@/helpers";
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import arrowicon from "@/assets/images/3x/arrowicon.png";
import cancel_icon from "@/assets/images/3x/cancel_icon.png";
import refresh_iconblack from "@/assets/images/3x/refresh_iconblack.png";
import excel from "@/assets/images/3x/excel.png";
import print from "@/assets/images/3x/print.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const CustomClearText = () => "clear all";
const ClearIndicator = (props) => {
  const {
    children = <CustomClearText />,
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;
  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles("clearIndicator", props)}
    >
      <div style={{ padding: "0px 5px" }}>{children}</div>
    </div>
  );
};

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

const Currencyopt = [{ label: "INR", value: "INR" }];

export default class Company extends React.Component {
  constructor() {
    super();
    this.state = {
      toggle: false,
      opendiv: false,
      opInstituteList: [],
      opBranchList: [],
      data: [],
      stateOpt: [],
      countryOpt: [],
      GSTopt: [],
      CompanyInitVal: {
        id: "",
        companyName: "",
        companyCode: "",
        registeredAddress: "",
        corporateAddress: "",
        pincode: "",
        mobileNumber: "",
        whatsappNumber: "",
        email: "",
        website: "",
        gstApplicable: "",
        panCard: "",
        gstIn: "",
        gstType: "",
        gstApplicableDate: "",
        country_id: "",
        state_id: "",
        currency: "",
      },
    };
    this.ref = React.createRef();
  }

  lstState = () => {
    getIndianState()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // console.log("response state", response);
          let opt = d.map((v) => {
            return { label: v.stateName, value: v.id };
          });
          this.setState({ stateOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstCountry = () => {
    getIndiaCountry()
      .then((response) => {
        // console.log("country res", response);
        let opt = [];
        let res = { label: response.data.name, value: response.data.id };
        opt.push(res);
        this.setState({ countryOpt: opt });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  listGetCompany = () => {
    get_companies_super_admin()
      .then((response) => {
        // console.log('response', response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          this.setState({ data: data });
        }
      })
      .catch((error) => {
        this.setState({ opCompanyList: [] });
        console.log("error", error);
      });
  };

  listGSTTypes = () => {
    getGSTTypes()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.map((v) => {
            return { label: v.gstType, value: v.id };
          });
          this.setState({ GSTopt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  setInitValues = () => {
    this.ref.current.resetForm();
    this.setState({
      toggle: false,
      opendiv: false,
      CompanyInitVal: {
        id: "",
        companyName: "",
        companyCode: "",
        registeredAddress: "",
        corporateAddress: "",
        pincode: "",
        mobileNumber: "",
        whatsappNumber: "",
        email: "",
        website: "",
        gstApplicable: "no",
        panCard: "",
        gstIn: "",
        gstType: "",
        gstApplicableDate: "",
        country_id: "",
        state_id: "",
        currency: "",
        manageOutlets: "",
      },
    });
  };
  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstState();
      this.lstCountry();
      this.listGetCompany();
      this.listGSTTypes();
      this.setInitValues();
      mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      mousetrap.bindGlobal("ctrl+c", this.setInitValues);
    }
  }

  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+s", this.handleSubmitForm);
    mousetrap.unbindGlobal("ctrl+c", this.setInitValues);
  }

  setEditData = (companyId) => {
    const { stateOpt, countryOpt, prop_data, isDataSet, GSTopt } = this.state;
    let reqData = new FormData();
    reqData.append("id", companyId);
    getCompanyById(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let CompanyInitVal = {
            id: d.id,
            companyName: d.companyName ? d.companyName : "",
            companyCode: d.companyCode ? d.companyCode : "",
            registeredAddress: d.registeredAddress ? d.registeredAddress : "",
            corporateAddress: d.corporateAddress ? d.corporateAddress : "",
            pincode: d.pincode ? d.pincode : "",
            mobileNumber: d.mobileNumber ? d.mobileNumber : "",
            whatsappNumber: d.whatsappNumber ? d.whatsappNumber : "",
            email: d.email ? (d.email != "NA" ? d.email : "") : "",
            website: d.website ? (d.website != "NA" ? d.website : "") : "",
            country_id: d.country_id ? getValue(countryOpt, d.country_id) : "",
            state_id: d.state_id ? getValue(stateOpt, d.state_id) : "",
            currency: d.currency ? getValue(Currencyopt, d.currency) : "",
            manageOutlets: d.manageOutlets == true ? "yes" : "no",
            gstApplicable: d.gstApplicable == false ? "no" : "yes",
            panCard: "",
            gstIn: "",
            gstType: "",
            gstApplicableDate: "",
            bankName: d.bankName ? d.bankName : "",
            accountNo: d.accountNo ? d.accountNo : "",
            ifsc: d.ifsc ? d.ifsc : "",
            branchName: d.branchName ? d.branchName : "",
          };
          if (d.gstApplicable == true) {
            CompanyInitVal["gstIn"] = d.gstIn ? d.gstIn : "";
            CompanyInitVal["gstApplicableDate"] = d.gstApplicableDate
              ? new Date(d.gstApplicableDate)
              : "";
            CompanyInitVal["gstType"] = d.gstType
              ? getValue(GSTopt, d.gstType)
              : "";
          }

          this.setState({
            toggle: d.gstApplicable,
            CompanyInitVal: CompanyInitVal,
            opendiv: true,
          });
        }
        console.log("response", response);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  render() {
    const {
      data,
      stateOpt,
      opendiv,
      countryOpt,
      GSTopt,
      CompanyInitVal,
      toggle,
    } = this.state;

    return (
      <div className="">
        <Collapse in={opendiv}>
          <div
            id="example-collapse-text"
            className="common-form-style mt-2 p-2"
          >
            <div className="main-div mb-2 m-0">
              <h4 className="form-header"> Company</h4>
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                enableReinitialize={true}
                initialValues={CompanyInitVal}
                innerRef={this.ref}
                validationSchema={Yup.object().shape({
                  companyName: Yup.string()
                    .trim()
                    .required("Company name is required"),
                  companyCode: Yup.string()
                    .trim()
                    .required("Company code is required"),
                  registeredAddress: Yup.string()
                    .trim()
                    .required("Registered address is required"),
                  corporateAddress: Yup.string()
                    .trim()
                    .required("Corporate address is required"),
                  pincode: Yup.string().trim().required("Pincode is required"),
                  mobileNumber: Yup.string()
                    .trim()
                    .matches(numericRegExp, "Enter valid mobile number")
                    .required("Mobile Number is required"),
                  whatsappNumber: Yup.string()
                    .trim()
                    .matches(numericRegExp, "Enter valid mobile number")
                    .required("Whatsapp number is required"),
                  email: Yup.lazy((v) => {
                    if (v != undefined) {
                      return Yup.string()
                        .trim()
                        .matches(EMAILREGEXP, "Enter valid email id")
                        .required("Email is required");
                    }
                    return Yup.string().notRequired();
                  }),
                  panCard: Yup.lazy((v) => {
                    if (v != undefined) {
                      return Yup.string().required("Website is required");
                    }
                    return Yup.string().notRequired();
                  }),
                  gstIn: Yup.lazy((v) => {
                    if (v != undefined) {
                      return Yup.string().required("GST in is required");
                    }
                    return Yup.string().notRequired();
                  }),
                  gstType: Yup.lazy((v) => {
                    if (v != undefined) {
                      return Yup.object().required("GST type is required");
                    }
                    return Yup.object().notRequired();
                  }),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let keys = Object.keys(CompanyInitVal);
                  // console.log('keys', keys);
                  let requestData = new FormData();
                  keys.map((v) => {
                    // console.log("v", v, "values", values[v]);
                    if (
                      values[v] != "" &&
                      v != "state_id" &&
                      v != "country_id" &&
                      v != "currency" &&
                      v != "gstType" &&
                      v != "gstApplicableDate" &&
                      v != "bankName" &&
                      v != "accountNumber" &&
                      v != "ifsc" &&
                      v != "bankBranch"
                    ) {
                      requestData.append(v, values[v]);
                    }
                  });
                  requestData.append(
                    "instituteId",
                    authenticationService.currentUserValue &&
                      authenticationService.currentUserValue.instituteId
                  );

                  requestData.append("bank_name", values.bankName);
                  requestData.append("account_number", values.accountNo);
                  requestData.append("ifsc", values.ifsc);
                  requestData.append("bank_branch", values.bankBranch);

                  requestData.append(
                    "gstApplicable",
                    toggle == true ? "yes" : "no"
                  );
                  if (toggle == true) {
                    requestData.append("gstType", values.gstType.value);

                    if (values.gstApplicableDate != "") {
                      requestData.append(
                        "gstApplicableDate",
                        moment(values.gstApplicableDate).format("yyyy-MM-DD")
                      );
                    }
                  }

                  requestData.append("state_id", values.state_id.value);
                  requestData.append("country_id", values.country_id.value);
                  if (values.website == "") {
                    requestData.append("website", "");
                  }
                  requestData.append("currency", values.currency.value);
                  setSubmitting(true);
                  // for (let [name, value] of requestData) {
                  //   console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                  // }

                  if (values.id == "") {
                    createCompany(requestData)
                      .then((response) => {
                        resetForm();
                        setSubmitting(false);
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          resetForm();
                          this.pageReload();
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {
                        setSubmitting(false);
                        console.log("error", error);
                      });
                  } else {
                    updateCompany(requestData)
                      .then((response) => {
                        resetForm();
                        setSubmitting(false);
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          resetForm();
                          this.pageReload();
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {
                        setSubmitting(false);
                        console.log("error", error);
                      });
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
                  <Form onSubmit={handleSubmit} className="form-style">
                    <div className="common-form-style m-0 mb-2">
                      <Row className="mt-4 row-border">
                        <Col md="12" className="mb-2">
                          <h5 className="title-style">Institute Details</h5>

                          <Row className="row-inside">
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Company Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Company Name"
                                  name="companyName"
                                  id="companyName"
                                  onChange={handleChange}
                                  value={values.companyName}
                                  isValid={
                                    touched.companyName && !errors.companyName
                                  }
                                  isInvalid={!!errors.companyName}
                                />
                                {/* <Form.Control.Feedback type="invalid"> */}
                                <span className="text-danger errormsg">
                                  {errors.companyName}
                                </span>
                                {/* </Form.Control.Feedback> */}
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Company Code</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Company Code"
                                  name="companyCode"
                                  id="companyCode"
                                  onChange={handleChange}
                                  value={values.companyCode}
                                  isValid={
                                    touched.companyCode && !errors.companyCode
                                  }
                                  isInvalid={!!errors.companyCode}
                                />
                                {/* <Form.Control.Feedback type="invalid"> */}
                                <span className="text-danger errormsg">
                                  {errors.companyCode}
                                </span>
                                {/* </Form.Control.Feedback> */}
                              </Form.Group>
                            </Col>
                            <Col md="4">
                              <Form.Group>
                                <Form.Label>Register Address</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={1}
                                  name="registeredAddress"
                                  id="registeredAddress"
                                  onChange={handleChange}
                                  value={values.registeredAddress}
                                  isValid={
                                    touched.registeredAddress &&
                                    !errors.registeredAddress
                                  }
                                  isInvalid={!!errors.registeredAddress}
                                />
                                {/* <Form.Control.Feedback type="invalid"> */}
                                <span className="text-danger errormsg">
                                  {errors.registeredAddress}
                                </span>
                                {/* </Form.Control.Feedback> */}
                              </Form.Group>
                            </Col>
                            <Col md="4">
                              <Form.Group>
                                <Form.Label>Corporate Address</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={1}
                                  name="corporateAddress"
                                  id="corporateAddress"
                                  onChange={handleChange}
                                  value={values.corporateAddress}
                                  isValid={
                                    touched.corporateAddress &&
                                    !errors.corporateAddress
                                  }
                                  isInvalid={!!errors.corporateAddress}
                                />
                                {/* <Form.Control.Feedback type="invalid"> */}
                                <span className="text-danger errormsg">
                                  {errors.corporateAddress}
                                </span>
                                {/* </Form.Control.Feedback> */}
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="mt-4 row-border">
                        <Col md="12">
                          <h5 className="title-style">Correspondence</h5>

                          <Row className="row-inside">
                            {/* <Col md="5">
                                <Row className="cmygst1"> */}
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Pincode</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Pincode"
                                  name="pincode"
                                  id="pincode"
                                  onChange={handleChange}
                                  value={values.pincode}
                                  isValid={touched.pincode && !errors.pincode}
                                  isInvalid={!!errors.pincode}
                                  maxLength={6}
                                />
                                {/* <Form.Control.Feedback type="invalid"> */}
                                <span className="text-danger errormsg">
                                  {errors.pincode}
                                </span>
                                {/* </Form.Control.Feedback> */}
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Email"
                                  name="email"
                                  id="email"
                                  // placeholder="email"
                                  onChange={handleChange}
                                  value={values.email}
                                  isValid={touched.email && !errors.email}
                                  isInvalid={!!errors.email}
                                />
                                {/* <Form.Control.Feedback type="invalid"> */}
                                <span className="text-danger errormsg">
                                  {errors.email}
                                </span>
                                {/* </Form.Control.Feedback> */}
                              </Form.Group>
                            </Col>

                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Mobile No.</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder=" Mobile No"
                                  name="mobileNumber"
                                  id="mobileNumber"
                                  // placeholder="mobileNumber"
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    let mob = e.target.value;
                                    setFieldValue("mobileNumber", mob);
                                    setFieldValue("whatsappNumber", mob);
                                  }}
                                  value={values.mobileNumber}
                                  isValid={
                                    touched.mobileNumber && !errors.mobileNumber
                                  }
                                  isInvalid={!!errors.mobileNumber}
                                  maxLength={10}
                                />
                                {/* <Form.Control.Feedback type="invalid"> */}
                                <span className="text-danger errormsg">
                                  {errors.mobileNumber}
                                </span>
                                {/* </Form.Control.Feedback> */}
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Whatsapp No.</Form.Label>

                                <Form.Control
                                  type="text"
                                  placeholder="Whatsapp No."
                                  name="whatsappNumber"
                                  id="whatsappNumber"
                                  // placeholder="whatsappNumber"
                                  onChange={handleChange}
                                  value={values.whatsappNumber}
                                  isValid={
                                    touched.whatsappNumber &&
                                    !errors.whatsappNumber
                                  }
                                  isInvalid={!!errors.whatsappNumber}
                                  maxLength={10}
                                />
                                {/* <Form.Control.Feedback type="invalid"> */}
                                <span className="text-danger errormsg">
                                  {errors.whatsappNumber}
                                </span>
                                {/* </Form.Control.Feedback> */}
                              </Form.Group>
                            </Col>

                            {/* <Col md="6"></Col> */}
                            {/* </Row> */}
                            {/* </Col>
                              <Col md="7">
                                <Row className="cmygst"> */}
                            <Col md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Country</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  closeMenuOnSelect={true}
                                  components={{ ClearIndicator }}
                                  onChange={(v) => {
                                    setFieldValue("country_id", v);
                                  }}
                                  name="country_id"
                                  value={values.country_id}
                                  options={countryOpt}
                                />
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group className="createnew">
                                <Form.Label>State</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  closeMenuOnSelect={true}
                                  components={{ ClearIndicator }}
                                  onChange={(v) => {
                                    setFieldValue("state_id", v);
                                  }}
                                  name="state_id"
                                  value={values.state_id}
                                  options={stateOpt}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mt-3 row-inside">
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Website</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Website"
                                  aria-describedby="inputGroupPrepend"
                                  name="website"
                                  id="website"
                                  onChange={handleChange}
                                  value={values.website}
                                  isValid={touched.website && !errors.website}
                                  isInvalid={!!errors.website}
                                />
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group className="mb-2">
                                <Form.Label className="mb-0">
                                  GST Applicability
                                </Form.Label>
                                <Row>
                                  <Col>
                                    <Form.Check
                                      type="radio"
                                      label="Yes"
                                      className="pr-3"
                                      name="gstApplicable"
                                      id="GSTYes"
                                      onClick={() => {
                                        this.setState({
                                          toggle: true,
                                        });
                                        setFieldValue("gstApplicable", "yes");
                                      }}
                                      value="yes"
                                      checked={
                                        values.gstApplicable == "yes"
                                          ? true
                                          : false
                                      }
                                    />{" "}
                                  </Col>
                                  <Col className="me-5">
                                    {" "}
                                    <Form.Check
                                      type="radio"
                                      label="No"
                                      name="gstApplicable"
                                      id="GSTNo"
                                      onClick={() => {
                                        this.setState({
                                          toggle: false,
                                        });
                                        setFieldValue("gstApplicable", "no");
                                      }}
                                      value="no"
                                      checked={
                                        values.gstApplicable == "no"
                                          ? true
                                          : false
                                      }
                                    />
                                  </Col>{" "}
                                </Row>
                                {/* <Form.Check
                                  type="radio"
                                  label="Yes"
                                  className="pr-3"
                                  name="gstApplicable"
                                  id="GSTYes"
                                  onClick={() => {
                                    this.setState({
                                      toggle: true,
                                    });
                                    setFieldValue("gstApplicable", "yes");
                                  }}
                                  value="yes"
                                  checked={
                                    values.gstApplicable == "yes" ? true : false
                                  }
                                />{" "}
                                <Form.Check
                                  type="radio"
                                  label="No"
                                  name="gstApplicable"
                                  id="GSTNo"
                                  onClick={() => {
                                    this.setState({
                                      toggle: false,
                                    });
                                    setFieldValue("gstApplicable", "no");
                                  }}
                                  value="no"
                                  checked={
                                    values.gstApplicable == "no" ? true : false
                                  }
                                /> */}
                              </Form.Group>
                            </Col>
                            {toggle == true ? (
                              <>
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>GSTIN</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="GSTIN"
                                      name="gstIn"
                                      id="gstIn"
                                      onChange={handleChange}
                                      value={values.gstIn}
                                      isValid={touched.gstIn && !errors.gstIn}
                                      isInvalid={!!errors.gstIn}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>GST Type</Form.Label>
                                    <Select
                                      className="selectTo"
                                      styles={customStyles}
                                      closeMenuOnSelect={true}
                                      components={{ ClearIndicator }}
                                      onChange={(v) => {
                                        setFieldValue("gstType", v);
                                      }}
                                      name="gstType"
                                      value={values.gstType}
                                      options={GSTopt}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>
                                      Applicable From Date
                                    </Form.Label>
                                    <MyDatePicker
                                      name="gstApplicableDate"
                                      placeholderText="DD/MM/YYYY"
                                      dateFormat="dd/MM/yyyy"
                                      id="gstApplicableDate"
                                      className="date-style"
                                      onChange={(date) => {
                                        setFieldValue(
                                          "gstApplicableDate",
                                          date
                                        );
                                      }}
                                      selected={values.gstApplicableDate}
                                    />
                                  </Form.Group>
                                </Col>
                              </>
                            ) : (
                              ""
                            )}
                            <Col md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Currency</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  closeMenuOnSelect={true}
                                  components={{ ClearIndicator }}
                                  // styles={{
                                  //   clearIndicator: ClearIndicatorStyles,
                                  // }}
                                  // defaultValue={[colourOptions[4], colourOptions[5]]}
                                  // isMulti
                                  onChange={(v) => {
                                    //   console.log(e);
                                    setFieldValue("currency", v);
                                  }}
                                  name="currency"
                                  value={values.currency}
                                  options={Currencyopt}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      <Row className="mt-4 row-border">
                        <Col md="12">
                          <h5 className="title-style">Bank Details</h5>

                          <Row className="row-inside">
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Bank Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Bank Name"
                                  name="bankName"
                                  id="bankName"
                                  onChange={handleChange}
                                  value={values.bankName}
                                  isValid={touched.bankName && !errors.bankName}
                                  isInvalid={!!errors.bankName}
                                  maxLength={6}
                                />
                                <span className="text-danger errormsg">
                                  {errors.bankName}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Account No.</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Account No."
                                  name="accountNo"
                                  id="accountNo"
                                  onChange={handleChange}
                                  value={values.accountNo}
                                  isValid={
                                    touched.accountNo && !errors.accountNo
                                  }
                                  isInvalid={!!errors.accountNo}
                                />
                                <span className="text-danger errormsg">
                                  {errors.accountNo}
                                </span>
                              </Form.Group>
                            </Col>

                            <Col md="2">
                              <Form.Group>
                                <Form.Label>IFSC</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="IFSC"
                                  name="ifsc"
                                  id="ifsc"
                                  onChange={handleChange}
                                  value={values.ifsc}
                                  isValid={touched.ifsc && !errors.ifsc}
                                  isInvalid={!!errors.ifsc}
                                />
                                <span className="text-danger errormsg">
                                  {errors.ifsc}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>Branch Name</Form.Label>

                                <Form.Control
                                  type="text"
                                  placeholder="Branch Name"
                                  name="branchName"
                                  id="branchName"
                                  onChange={handleChange}
                                  value={values.branchName}
                                  isValid={
                                    touched.branchName && !errors.branchName
                                  }
                                  isInvalid={!!errors.branchName}
                                />
                                <span className="text-danger errormsg">
                                  {errors.branchName}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* <h5>Formation</h5> */}
                      <Row className="mt-5">
                        <Col md="12" className="btn_align ">
                          <Button
                            className="submit-btn"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {values.id == "" ? "Submit" : "Update"}
                            <img src={arrowicon} className="btnico ms-1"></img>
                          </Button>
                          <Button
                            className="cancel-btn"
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              // console.log("reset");

                              this.pageReload();
                            }}
                          >
                            Cancel
                            <img
                              src={cancel_icon}
                              className="ms-1"
                              style={{ height: "14px" }}
                            ></img>
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
        <div className="wrapper_div">
          {/* <h6>Group</h6> */}

          <div className="cust_table p-2">
            <Row style={{ padding: "8px" }}>
              <Col lg={2} md={3} xs={12} className="mb-2">
                <Row>
                  <Col>
                    <Form.Label>Result Per Page</Form.Label>
                  </Col>
                  <Col>
                    <Select
                      className="selectTo"
                      styles={customStyles}
                      name="currency"
                      placeholder="10"
                    />
                  </Col>
                </Row>
              </Col>

              <Col lg={6} md="2"></Col>
              <Col lg={2} md={3} xs={12}>
                <Form.Label
                  htmlFor="inlineFormInputGroup"
                  visuallyHidden
                ></Form.Label>
                <InputGroup className="mb-2 headt">
                  <FormControl
                    id="inlineFormInputGroup"
                    placeholder="Search"
                    type="search"
                    aria-label="Search"
                    className="search-conrol"
                  />
                  <InputGroup.Text
                    style={{
                      borderLeft: "none",
                      background: "white",
                      borderTop: "none",
                      borderRight: "none",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="faIcon-style"
                    ></FontAwesomeIcon>
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col lg={2} md={3} xs={12} className="btn_align mainbtn_create">
                {/* {this.state.hide == 'true'} */}
                {!opendiv && (
                  <Button
                    className="create-btn me-2"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ opendiv: !opendiv });
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
                )}
                <Button
                  className="ml-1"
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: "2px",
                  }}
                  type="button"
                  onClick={() => {
                    this.pageReload();
                  }}
                >
                  <img src={refresh_iconblack} className="iconstable"></img>
                </Button>
                <Button
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: "2px",
                  }}
                >
                  <img src={print} className="iconstable"></img>
                </Button>
                <Button
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: "2px",
                  }}
                >
                  <img src={excel} className="iconstable"></img>
                </Button>
              </Col>
            </Row>
            {/* {data.length > 0 && ( */}
            <div className="table_wrapper p-2 denomination-style">
              <Table size="sm" hover className="tbl-font">
                <thead>
                  <tr>
                    <th>#.</th>
                    <th>Company Name</th>
                    <th>Company Code</th>
                    <th>Registered Address</th>
                    <th>Corporate Address</th>
                  </tr>
                </thead>
                <tbody
                  className="tabletrcursor"
                  style={{ borderTop: "transparent" }}
                >
                  {data.length > 0 ? (
                    data.map((v, i) => {
                      return (
                        <tr
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            this.setEditData(v.id);
                          }}
                        >
                          <td>{i + 1}</td>
                          <td>{v.companyName}</td>
                          <td>{v.companyCode}</td>
                          <td>{v.registeredAddress}</td>
                          <td>{v.corporateAddress}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
    );
  }
}
