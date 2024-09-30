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
  createScholarShip,
  getAllScholarShip,
  getScholarShipDetailsById,
  updateScholarShip,
  deleteScholarShip,
  getBranchesByInstitute,
  getAcademicYearByBranch,
  getStandardsByBranch,
  getDivisionsByStandard,
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
  MyNotifications,
  getSelectValue,
} from "@/helpers";
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import refresh_iconblack from "@/assets/images/3x/refresh_iconblack.png";
import arrowicon from "@/assets/images/3x/arrowicon.png";
import cancel_icon from "@/assets/images/3x/cancel_icon.png";
import excel from "@/assets/images/3x/excel.png";
import delete_ico from "@/assets/images/3x/delete_ico.png";
import edit_ico from "@/assets/images/3x/edit_ico.png";
import print from "@/assets/images/3x/print.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import delete_ from "@/assets/images/3x/delete_.png";
import edit_ from "@/assets/images/3x/edit_.png";
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

export default class ScholarShip extends React.Component {
  constructor(props) {
    super(props);
    this.busRef = React.createRef();
    this.state = {
      data: [],
      opBranchList: [],
      opAcademicYearList: [],
      opStandardList: [],
      opendiv: false,
      isLoading: true,
      initVal: {
        id: "",
        standardId: "",
        divisionId: "",
        branchId: "",
        academicYearId: "",
        scholarShipFees: "",
      },
    };
  }

  getAllScholarShipData = () => {
    getAllScholarShip()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          if (d.length > 0) {
            this.setState({ data: d });
          }
        }
      })
      .catch((error) => {
        this.setState({ data: [] });
        console.log("error", error);
      });
  };

  getDivisionData = (id, initVal = "") => {
    let requestData = new FormData();
    requestData.append("standardId", id);
    getDivisionsByStandard(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.divName };
            });
            this.setState({ opDivisionList: Opt }, () => {
              if (initVal != "") {
                initVal["divisionId"] = getSelectValue(Opt, initVal.divisionId);

                this.setState({ initVal: initVal, opendiv: true });
              }
            });
          }
        }
      })
      .catch((error) => {
        this.setState({ opDivisionList: [] });
        console.log("error", error);
      });
  };

  deleteScholar = (id) => {
    let requestData = new FormData();
    requestData.append("scholarShipId", id);

    deleteScholarShip(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: "Deleted Scholarship Record Succesfully !",
            is_timeout: true,
            delay: 1000,
          });
        }
        this.componentDidMount();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // getScholarDetailsById = (id) => {
  //   let { opBranchList, opAcademicYearList, opStandardList, opDivisionList } =
  //     this.state;
  //   let reqData = new FormData();
  //   reqData.append("id", id);
  //   getScholarShipDetailsById(reqData)
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         let result = res.response;
  //         let initVal = {
  //           id: result.id,
  //           branchId: getSelectValue(opBranchList, parseInt(res.branchId)),
  //           academicYearId: getSelectValue(
  //             opAcademicYearList,
  //             parseInt(res.academicYearId)
  //           ),
  //           standardId: getSelectValue(
  //             opStandardList,
  //             parseInt(res.standardId)
  //           ),
  //           divisionId: getSelectValue(
  //             opDivisionList,
  //             parseInt(res.divisionId)
  //           ),
  //           scholarShipFees: result.scholarShipFees,
  //         };
  //         this.setState({ initVal: initVal, opendiv: true });
  //       }
  //       // this.setState({ initVal: res.responseObject });
  //     })
  //     .catch((error) => {
  //       this.setState({ data: [] });
  //       console.log("error", error);
  //     });
  // };

  getScholarDetailsById = (id) => {
    let { opBranchList } = this.state;
    let reqData = new FormData();
    reqData.append("id", id);
    getScholarShipDetailsById(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let ob = res.response;

          let initVal = {
            id: ob.id,
            branchId: getSelectValue(opBranchList, ob.branchId),
            academicYearId: ob.academicYearId,
            standardId: ob.standardId,
            divisionId: ob.divisionId,
            scholarShipFees: ob.scholarShipFees,
          };
          this.getAcademicYearData(initVal.branchId.value, initVal);
          // this.setState({ initVal: initVal, opendiv: true });
        }
      })
      .catch((error) => {
        this.setState({ data: [] });
        console.log("error", error);
      });
  };

  DeleteNoFun = (id) => {
    console.log("scholarshipId", id);
  };

  setInitValAndLoadData() {
    this.getAllScholarShipData();
    this.setState({
      initVal: {
        id: "",
        standardId: "",
        divisionId: "",
        branchId: "",
        academicYearId: "",
        scholarShipFees: "",
      },
      opendiv: false,
    });
  }

  getBranchData = () => {
    let requestData = new FormData();
    // console.log("authenticationService.currentUserValue.companyId", 1);
    requestData.append("outletId", 1);
    getBranchesByInstitute(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;

          let Opt = d.map(function (values) {
            return { value: values.id, label: values.branchName };
          });
          this.setState({ opBranchList: Opt }, () => {
            // let branchId = getSelectValue(
            //   Opt,
            //   authenticationService.currentUserValue.branchId
            // );
            // this.SpromotionRef.current.setFieldValue("branchId", branchId);
            // this.getAcademicYearData(branchId.value);
            // this.getStandardData(branchId.value);
          });
        }
      })
      .catch((error) => {
        this.setState({ opBranchList: [] });
        console.log("error", error);
      });
  };

  getAcademicYearData = (branchId, initVal = "") => {
    // console.log("initVal", initVal);
    let reqData = new FormData();
    reqData.append("branchId", branchId);
    getAcademicYearByBranch(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.academicYear };
            });
            this.setState({ opAcademicYearList: Opt }, () => {
              if (initVal != "") {
                initVal["academicYearId"] = getSelectValue(
                  Opt,
                  initVal["academicYearId"]
                );
                this.getStandardData(initVal.branchId.value, initVal);
                // divisionId: getSelectValue(opDivisionList, ob.divisionId),
              }
            });
          }
        }
      })
      .catch((error) => {
        this.setState({ opAcademicYearList: [] });
        console.log("error", error);
      });
  };

  getStandardData = (id, initVal = "") => {
    let requestData = new FormData();
    requestData.append("branchId", id);
    getStandardsByBranch(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.standardName };
            });
            this.setState({ opStandardList: Opt }, () => {
              if (initVal != "") {
                initVal["standardId"] = getSelectValue(
                  Opt,
                  initVal["standardId"]
                );

                this.getDivisionData(initVal.standardId.value, initVal);
                // divisionId: getSelectValue(opDivisionList, ob.divisionId),
              }
            });
          }
        }
      })
      .catch((error) => {
        this.setState({ opStandardList: [] });
        console.log("error", error);
      });
  };

  setInitValue() {
    let { opBranchList } = this.state;
    this.setState({
      initVal: {
        branchId: getSelectValue(
          opBranchList,
          authenticationService.currentUserValue.branchId
        ),
        id: "",
        studStandard: "",
        scholarShipFees: "",
      },
      opendiv: false,
    });
  }
  componentDidMount() {
    this.getAllScholarShipData();
    if (AuthenticationCheck()) {
      this.getBranchData();
    }
  }

  pageReload = () => {
    this.componentDidMount();
  };

  render() {
    const {
      data,
      initVal,
      opendiv,
      opBranchList,
      opAcademicYearList,
      opStandardList,
      opDivisionList,
    } = this.state;

    return (
      <div className="">
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style p-1">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Student ScholarShip</h4>
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                enableReinitialize={true}
                initialValues={initVal}
                // innerRef={this.busRef}
                validationSchema={Yup.object().shape({
                  standardId: Yup.object().required(
                    "Student Standard is required"
                  ),

                  scholarShipFees: Yup.string()
                    .trim()
                    .required("ScholarShip Fee is Required"),
                })}
                onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                  this.setState({ isLoading: true });
                  setStatus();
                  console.log({ values });

                  // let keys = Object.keys(initVal);
                  let requestData = new FormData();

                  // keys.map((v) => {
                  //   if (values[v] != "") {
                  //     requestData.append(v, values[v]);
                  //   }
                  // });

                  requestData.append("branchId", values.branchId.value);
                  requestData.append("outletId", 1);
                  requestData.append("standardId", values.standardId.value);
                  requestData.append("divisionId", values.divisionId.value);
                  requestData.append(
                    "academicYearId",
                    values.academicYearId.value
                  );
                  requestData.append("scholarShipFees", values.scholarShipFees);

                  if (values.id == "") {
                    createScholarShip(requestData)
                      .then((response) => {
                        this.setState({ isLoading: false });
                        if (response.data.responseStatus === 200) {
                          setSubmitting(false);
                          MyNotifications.fire({
                            show: true,
                            icon: "success",
                            title: "Success",
                            msg: response.data.message,
                            is_timeout: true,
                            delay: 1000,
                          });
                          resetForm();
                          this.setInitValAndLoadData();
                          // onAddModalShow(false);
                          // tableManager.current.asyncApi.resetRows();
                        } else {
                          setSubmitting(false);
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "This Standard Is Already Exists",
                            is_button_show: true,
                            response,
                          });
                        }
                      })
                      .catch((error) => {
                        this.setState({ isLoading: false });
                        setSubmitting(false);
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",

                          is_button_show: true,
                        });

                        console.log("errors", error);
                      });
                  } else {
                    requestData.append("id", values.id);
                    updateScholarShip(requestData)
                      .then((response) => {
                        this.setState({ isLoading: false });
                        if (response.data.responseStatus === 200) {
                          setSubmitting(false);
                          MyNotifications.fire({
                            show: true,
                            icon: "success",
                            title: "Success",
                            msg: response.message,
                            is_timeout: true,
                            delay: 1000,
                          });
                          resetForm();
                          this.setInitValAndLoadData();
                        } else {
                          setSubmitting(false);
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: response.message,
                            is_button_show: true,
                            response,
                          });
                        }
                      })
                      .catch((error) => {
                        this.setState({ isLoading: false });
                        setSubmitting(false);
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",

                          is_button_show: true,
                        });

                        console.log("errors", error);
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
                    {/* {JSON.stringify(errors)} */}
                    <div className="common-form-style m-0 mb-2">
                      <Row>
                        <Col md="12" className="mb-2">
                          {/* <h5 className="title-style">Mother Tongue</h5> */}

                          <Row className="row-inside">
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Branch</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable={true}
                                  // isDisabled={true}
                                  onChange={(v) => {
                                    setFieldValue("branchId", "");

                                    setFieldValue("standardId", "");
                                    setFieldValue("academicYearId", "");
                                    setFieldValue("divisionId", "");
                                    if (v != null) {
                                      setFieldValue("branchId", v);

                                      this.getStandardData(v.value);
                                      this.getAcademicYearData(v.value);
                                    } else {
                                      this.setState({
                                        opStandardList: [],
                                        opAcademicYearList: [],
                                      });
                                    }
                                  }}
                                  name="branchId"
                                  options={opBranchList}
                                  value={values.branchId}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group>
                                <Form.Label>Year</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable={true}
                                  onChange={(v) => {
                                    setFieldValue("academicYearId", v);
                                  }}
                                  name="academicYearId"
                                  options={opAcademicYearList}
                                  value={values.academicYearId}
                                />
                                <span className="text-danger errormsg">
                                  {errors.academicYearId}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Standard</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable={true}
                                  onChange={(v) => {
                                    setFieldValue("standardId", "");
                                    setFieldValue("divisionId", "");
                                    if (v != null) {
                                      setFieldValue("standardId", v);
                                      this.getDivisionData(v.value);
                                    } else {
                                      this.setState({
                                        opDivisionList: [],
                                      });
                                    }
                                  }}
                                  name="standardId"
                                  options={opStandardList}
                                  value={values.standardId}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Division</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable={true}
                                  name="divisionId"
                                  options={opDivisionList}
                                  value={values.divisionId}
                                  onChange={(v) => {
                                    setFieldValue("divisionId", "");
                                    if (v != null) {
                                      setFieldValue("divisionId", v);
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Col>{" "}
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>ScholarShip Fee</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Scholar Ship Fee"
                                  name="scholarShipFees"
                                  id="scholarShipFees"
                                  onChange={handleChange}
                                  value={values.scholarShipFees}
                                  isValid={
                                    touched.scholarShipFees &&
                                    !errors.scholarShipFees
                                  }
                                  isInvalid={!!errors.scholarShipFees}
                                />
                                {/* <Form.Control.Feedback type="invalid"> */}
                                <span className="text-danger errormsg">
                                  {errors.scholarShipFees}
                                </span>
                                {/* </Form.Control.Feedback> */}
                              </Form.Group>
                            </Col>
                            <Col md="8"></Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* <h5>Formation</h5> */}
                      <Row>
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

                              this.setInitValAndLoadData();
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
                    className="search-conrol"
                    type="search"
                    aria-label="Search"
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
              <Col lg={2} md="3" xs={12} className="btn_align mainbtn_create">
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
                    <th className="tableno">#.</th>
                    <th>Branch</th>
                    <th>Year</th>
                    <th>Standard</th>
                    <th>ScholarShip Fee</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length > 0 ? (
                    data.map((v, i) => {
                      return (
                        <tr>
                          <td>{i + 1}</td>

                          <td>{v.branchId}</td>
                          <td>{v.academicYearId}</td>
                          <td>{v.standardName}</td>
                          <td>{v.scholarShipFees}</td>

                          <td>
                            <a
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                this.getScholarDetailsById(v.id);
                              }}
                            >
                              <img
                                src={edit_ico}
                                alt=""
                                className="marico"
                              ></img>
                            </a>
                            <a
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                console.log("delete clicked");
                                MyNotifications.fire({
                                  show: true,
                                  icon: "confirm",
                                  title: "confirm",
                                  msg: "Are you sure want to Delete ?",
                                  is_button_show: true,

                                  handleFn: () => {
                                    this.deleteScholar(v.id);
                                  },
                                  handleFailureFun: () => {
                                    this.DeleteNoFun(v.id);
                                  },
                                });
                                // this.DeleteFeesTransactions(
                                //   v.transactionId,
                                //   v.receiptNo
                                // );
                              }}
                            >
                              <img
                                src={delete_}
                                alt=""
                                className="marico"
                              ></img>
                            </a>
                          </td>

                          {/* <td>
                              <Link to="/Branch">Go to Institute</Link>
                            </td> */}
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="text-center">
                      <td colspan={6}>No Data Found</td>
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
