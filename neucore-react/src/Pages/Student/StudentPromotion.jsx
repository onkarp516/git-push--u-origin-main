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
  Modal,
  CloseButton,
} from "react-bootstrap";
import {
  authenticationService,
  getBranchesByInstitute,
  getStandardsByBranch,
  getDivisionsByStandard,
  getAcademicYearByBranch,
  createStudentPromotion,
  getStudentListforStudentPromotion,
} from "@/services/api_functions";

import Select from "react-select";
import { Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import {
  EMAILREGEXP,
  numericRegExp,
  urlRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  MyDatePicker,
  isActionExist,
  customStyles,
  getSelectValue,
  eventBus,
  MyNotifications,
} from "@/helpers";
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import refresh_iconblack from "@/assets/images/3x/refresh_iconblack.png";
import arrowicon from "@/assets/images/3x/arrowicon.png";
import cancel_icon from "@/assets/images/3x/cancel_icon.png";
import reset from "@/assets/images/reset.png";
import excel from "@/assets/images/3x/excel.png";
import print from "@/assets/images/3x/print.png";
import edit from "@/assets/images/3x/edit.png";
import save from "@/assets/images/3x/save.png";
import cancel from "@/assets/images/3x/cancel.png";
import upgrade from "@/assets/images/3x/upgrade.png";
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

export default class StudentPromotion extends React.Component {
  constructor() {
    super();
    this.SpromotionRef = React.createRef();
    this.state = {
      show: false,
      toggle: false,
      opendiv: false,
      opInstituteList: [],
      selectedStudent: [],
      selectedStudentPromotion: [],
      opBranchList: [],
      opAcademicYearList: [],
      opStandardList: [],
      opDivisionId: [],
      opStudentList: [],
      data: [],
      stateOpt: [],
      countryOpt: [],
      studentOpt: [],

      GSTopt: [],
      initVal: {
        id: "",
        instituteId: "",
        transactionDate: new Date(),
        branchId: "",
        academicYearId: "",
        macademicYearId: "",
        mstandardId: "",
        mdivisionId: "",
        mstudentType: "",
        standardId: "",
        divisionId: "",
        studentId: "",

        studentType: "",
      },
      studentTypeOptions: [
        { label: "Day School", value: 1 },
        { label: "Residential", value: 2 },
      ],
    };
  }

  handleShow = () => {
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };

  getBranchData = () => {
    let requestData = new FormData();
    requestData.append(
      "outletId",
      authenticationService.currentUserValue.companyId
    );
    getBranchesByInstitute(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;

          let Opt = d.map(function (values) {
            return { value: values.id, label: values.branchName };
          });
          this.setState({ opBranchList: Opt }, () => {
            let branchId = getSelectValue(
              Opt,
              authenticationService.currentUserValue.branchId
            );
            this.SpromotionRef.current.setFieldValue("branchId", branchId);
            this.getAcademicYearData(branchId.value);
            this.getStandardData(branchId.value);
          });
        }
      })
      .catch((error) => {
        this.setState({ opBranchList: [] });
        console.log("error", error);
      });
  };

  getStandardData = (id) => {
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
            this.setState({ opStandardList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opStandardList: [] });
        console.log("error", error);
      });
  };

  getDivisionData = (id) => {
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
            this.setState({ opDivisionList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opDivisionList: [] });
        console.log("error", error);
      });
  };

  getAcademicYearData = (branchId) => {
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
            this.setState({ opAcademicYearList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opAcademicYearList: [] });
        console.log("error", error);
      });
  };

  createStudentPromotionData = (values, selectedStudentPromotion) => {
    // let { branchId } = this.state.initVal;
    // console.log("this.state.initval", {
    //   values
    //   selectedStudentForTransport,
    // });

    if (selectedStudentPromotion.length > 0) {
      let requestData = new FormData();

      requestData.append(
        "branchId",
        authenticationService.currentUserValue.branchId
      );
      requestData.append(
        "academicYearId",
        values.macademicYearId != "" && values.macademicYearId != null
          ? values.macademicYearId.value
          : 0
      );
      requestData.append(
        "standardId",
        values.mstandardId != "" && values.mstandardId != null
          ? values.mstandardId.value
          : 0
      );
      requestData.append(
        "divisionId",
        values.mdivisionId != "" && values.mdivisionId != null
          ? values.mdivisionId.value
          : 0
      );

      requestData.append(
        "studentlist",
        JSON.stringify(selectedStudentPromotion)
      );
      requestData.append(
        "studentType",
        values.studentType != "" && values.studentType != null
          ? values.studentType.value
          : 0
      );

      createStudentPromotion(requestData).then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: response.message,
            is_timeout: true,
            delay: 1000,
          });
          this.pageReload();
          this.setInitValAndLoadData();
        }
      });
    }
  };

  getStudentDataforStudentPromotion = () => {
    let { branchId, academicYearId, standardId, divisionId, studentType } =
      this.state.initVal;
    let requestData = new FormData();
    requestData.append("branchId", branchId.value);
    requestData.append("academicYearId", academicYearId.value);
    requestData.append("standardId", standardId.value);
    requestData.append("divisionId", divisionId.value);
    requestData.append("studentType", studentType.value);

    getStudentListforStudentPromotion(requestData).then((response) => {
      let res = response.data;
      console.log("res", res);
      let d = res.responseObject;
      if (res.responseStatus == 200) {
        // console.log("opt", d);
        // let Opt = d.map(function (values) {
        //   return { value: values.id, label: values.firstName };
        // });
        this.setState({ studentOpt: d });
      }
    });
  };

  setInitValues = () => {
    let { opBranchList } = this.state;

    this.setState({
      toggle: false,
      opendiv: false,
      initVal: {
        branchId: getSelectValue(
          opBranchList,
          authenticationService.currentUserValue.branchId
        ),
        id: "",
        instituteId: "",
        transactionDate: new Date(),
        academicYearId: "",
        macademicYearId: "",
        mstandardId: "",
        mdivisionId: "",
        mstudentType: "",
        standardId: "",
        divisionId: "",
        studentId: "",
        studentType: "",
      },
      selectedStudent: [],
      studentOpt: [],
      selectedStudentPromotion: [],
      opStudentList: [],
    });
  };

  addSelectionStudent = (id, status) => {
    let { selectedStudent, studentOpt } = this.state;
    let f_selectedStudents = selectedStudent;
    let f_students = studentOpt;
    if (status == true) {
      if (selectedStudent.length > 0) {
        if (!selectedStudent.includes(id)) {
          f_selectedStudents = [...f_selectedStudents, id];
        }
      } else {
        f_selectedStudents = [...f_selectedStudents, id];
      }
    } else {
      f_selectedStudents = f_selectedStudents.filter((v, i) => v != id);
    }

    this.setState({
      isAllChecked:
        f_students.length == f_selectedStudents.length ? true : false,
      selectedStudent: f_selectedStudents,
      studentOpt: f_students,
    });
  };

  CheckedStudent = () => {
    let { selectedStudent, selectedStudentPromotion, studentOpt } = this.state;
    console.log({ selectedStudent, selectedStudentPromotion, studentOpt });
    if (selectedStudent.length > 0) {
      let f_studentOpt = studentOpt;
      this.setState({ selectedStudentPromotion: [] });
      console.log({ selectedStudent });
      selectedStudent.map((studentId) => {
        studentOpt.map((v, i) => {
          if (v.id == studentId) {
            selectedStudentPromotion.push(v);

            f_studentOpt = f_studentOpt.filter((v, i) => v.id != studentId);
          }
        });
      });

      console.log({ f_studentOpt, selectedStudentPromotion });
      this.setState({
        selectedStudentPromotion: selectedStudentPromotion.sort(
          (a, b) => a.id - b.id
        ),
        studentOpt: f_studentOpt,
        selectedStudent: [],
      });
    } else {
      MyNotifications.fire("PLease Check Student");
    }
  };

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  componentDidMount() {
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
      opStudentList,
      studentOpt,
      opendiv,
      opAcademicYearList,
      opstandList,
      studentTypeOptions,
      opBranchList,
      opStandardList,
      opDivisionList,
      initVal,
      toggle,
      selectedStudent,
      selectedStudentPromotion,
      show,
    } = this.state;

    return (
      <div className="">
        <Form in={opendiv}>
          <div id="example-collapse-text" className="common-form-style mt-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Student Promotion</h4>
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                innerRef={this.SpromotionRef}
                enableReinitialize={true}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  academicYearId: Yup.object().required(
                    "Academic Year  is required"
                  ),
                  standardId: Yup.object().required("Standard is required"),
                  divisionId: Yup.object().required("Division is required"),
                  studentType: Yup.object().required("studentType is required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setSubmitting(false);
                  // this.setState({ initVal: values }, () => {
                  //   this.getStudentDataforStudentPromotion();
                  //   console.log("studentdata called");
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
                  <Form
                    autoComplete="off"
                    onSubmit={handleSubmit}
                    className="form-style"
                  >
                    <div
                      id="example-collapse-text"
                      className="common-form-style mt-2 p-2"
                    >
                      <div className=" mb-2 m-0">
                        <div className="common-form-style m-0 mb-2">
                          {/* {JSON.stringify(values)} */}
                          <Row className="">
                            <Col md="12" className="mb-2">
                              <Row className="row-inside">
                                <Col lg="2" md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Branch</Form.Label>
                                    <Select
                                      className="selectTo"
                                      styles={customStyles}
                                      isClearable={true}
                                      isDisabled={true}
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
                                  <Form.Group className="createnew">
                                    <Form.Label>Student Type</Form.Label>
                                    <Select
                                      className="selectTo"
                                      styles={customStyles}
                                      isClearable={true}
                                      name="studentType"
                                      options={studentTypeOptions}
                                      value={values.studentType}
                                      id="studentType"
                                      onChange={(v) => {
                                        setFieldValue("studentType", "");
                                        if (v != null) {
                                          setFieldValue("studentType", v);
                                        }
                                      }}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg="8"></Col>
                                <Col
                                  lg="4"
                                  md="2"
                                  xs={12}
                                  className="add-btn-style text-end"
                                >
                                  <Button
                                    type="button"
                                    className="submitbtn me-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.setState({ initVal: values }, () => {
                                        this.getStudentDataforStudentPromotion();
                                      });
                                    }}
                                  >
                                    Submit
                                    <img
                                      src={arrowicon}
                                      className="btnico ms-1"
                                    ></img>
                                  </Button>

                                  <Button
                                    type="button"
                                    className="cancelbtn submitbtn me-2"
                                    variant="secondary"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // this.SpromotionRef.current.resetForm();
                                      this.setInitValues();
                                    }}
                                  >
                                    Reset
                                    <img
                                      src={reset}
                                      className="btnico ms-1"
                                    ></img>
                                  </Button>

                                  <Button
                                    type="button"
                                    className="cancelbtn submitbtn"
                                    variant="secondary"
                                    onClick={(e) => {
                                      console.log("hello");
                                      e.preventDefault();
                                      eventBus.dispatch("page_change", {
                                        from: "studentpromotion",
                                        to: "studentpromotionlist",
                                        isNewTab: false,
                                      });
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                          </Row>

                          {/* {JSON.stringify(opStudentList)} */}
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Form>
        <div className="wrapper_div heightdiv mb-0">
          <div className="cust_table p-2">
            <div
              className="table_wrapper denomination-style"
              style={{ height: "60vh", overflow: "auto", overflowX: "hidden" }}
            >
              <Table hover size="sm" className="tbl-font">
                <thead>
                  <tr>
                    <th className="tableno">Select</th>
                    <th>#.</th>
                    <th>Acdemic Year</th>
                    <th>Student Name</th>
                    <th>Standard</th>
                    <th>Student Type</th>
                    <th>Gender</th>
                    <th>Mobile No</th>
                    <th>Date pf Admission</th>
                  </tr>
                </thead>
                <tbody className="tabletrcursor">
                  {studentOpt.length > 0 ? (
                    studentOpt.map((value, key) => {
                      return (
                        <tr
                          onDoubleClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <td>
                            <div key={`inline-checkbox`}>
                              <Form.Check
                                inline
                                name="checked"
                                id={`checked_` + key}
                                type="checkbox"
                                checked={
                                  selectedStudent.includes(value.id) == true
                                    ? true
                                    : false
                                }
                                value={value.checked}
                                onChange={(e) => {
                                  this.addSelectionStudent(
                                    value.id,
                                    e.target.checked
                                  );
                                }}
                              />
                            </div>
                          </td>
                          <td>{key + 1}</td>
                          <td>{value.academicYear}</td>
                          <td>{value.firstName + " " + value.lastName}</td>
                          <td>{value.standardName}</td>
                          <td>{value.studentType}</td>
                          <td>{value.gender}</td>
                          <td>{value.mobileNo}</td>
                          <td>
                            {moment(value.dateOfAdmission).format("DD-MM-yyyy")}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <div className="p-2 text-center fourbtnfeestrans ">
          <Button
            type="submit"
            className="submitbtn formbtn affiliated"
            onClick={() => this.handleShow()}
          >
            Promote Student
            <img src={upgrade} alt="" className="btsubmit "></img>
          </Button>

          <Button
            type="submit"
            className="submitbtn cancelbtn formbtn affiliated"
            variant="secondary"
          >
            Cancel
            <img src={cancel} alt="" className="btsubmit "></img>
          </Button>
        </div>
        {/* <div className="wrapper_div heightdiv">
          {/* <h6>Group</h6> */}

        {/*<div className="cust_table p-2">
            <div
              className="table_wrapper denomination-style"
              style={{ height: "45vh", overflow: "auto", overflowX: "hidden" }}
            ></div> */}
        {/* <div className="p-2 text-center fourbtnfeestrans">
              <Button
                type="submit"
                className="submitbtn formbtn affiliated"
                onClick={() => {
                  this.CheckedStudent();
                  this.handleShow();
                }}
              >
                Promote Student
                <img src={upgrade} alt="" className="btsubmit "></img>
              </Button>

              <Button
                type="submit"
                className="submitbtn formbtn affiliated"
                onClick={() => {
                  // this.setState({ initVal: values }, () => {
                  //   this.getStudentDataforStudentPromotion();
                  //   console.log("studentdata called");
                  // });
                }}
              >
                Cancel
                <img src={cancel} alt="" className="btsubmit "></img>
              </Button>
            </div> */}
        {/* )} */}
        <>
          <Modal
            show={show}
            // {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header className="form-header pt-0 pb-0">
              <h6 className="pt-2">Promote Student</h6>
              <CloseButton
                variant="black"
                className="pull-right closemodal icons"
                onClick={this.handleClose}
              />
            </Modal.Header>
            <Modal.Body>
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                innerRef={this.SpromotionRef}
                // enableReinitialize={true}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  macademicYearId: Yup.object().required(
                    "Academic Year  is required"
                  ),
                  mstandardId: Yup.object().required("Standard is required"),
                  mdivisionId: Yup.object().required("Division is required"),
                  mstudentType: Yup.object().required(
                    "studentType is required"
                  ),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setSubmitting(false);

                  // this.setState({ initVal: values }, () => {
                  //   this.getStudentDataforStudentPromotion();
                  //   console.log("studentdata called");
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
                  <Form>
                    <div className="common-form-style m-0 mb-2">
                      <Row className="">
                        <Col md="12" className="mb-2">
                          <Row className="row-inside">
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Branch</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable={true}
                                  isDisabled={true}
                                  onChange={(v) => {
                                    setFieldValue("branchId", "");

                                    setFieldValue("mstandardId", "");
                                    setFieldValue("macademicYearId", "");
                                    setFieldValue("mdivisionId", "");
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
                                  id="macademicYearId"
                                  onChange={(v) => {
                                    setFieldValue("macademicYearId", v);
                                  }}
                                  name="macademicYearId"
                                  options={opAcademicYearList}
                                  value={values.macademicYearId}
                                />
                                <span className="text-danger errormsg">
                                  {errors.macademicYearId}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Standard</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  id="mstandardId1"
                                  isClearable={true}
                                  onChange={(v) => {
                                    setFieldValue("mstandardId", "");
                                    setFieldValue("mdivisionId", "");
                                    if (v != null) {
                                      setFieldValue("mstandardId", v);
                                      this.getDivisionData(v.value);
                                    } else {
                                      this.setState({
                                        opDivisionList: [],
                                      });
                                    }
                                  }}
                                  name="mstandardId"
                                  options={opStandardList}
                                  value={values.mstandardId}
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
                                  name="mdivisionId"
                                  id="mdivisionId1"
                                  options={opDivisionList}
                                  value={values.mdivisionId}
                                  onChange={(v) => {
                                    setFieldValue("mdivisionId", "");
                                    if (v != null) {
                                      setFieldValue("mdivisionId", v);
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Col>{" "}
                            <Col md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Student Type</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable={true}
                                  name="mstudentType"
                                  options={studentTypeOptions}
                                  value={values.mstudentType}
                                  id="mstudentType"
                                  onChange={(v) => {
                                    setFieldValue("mstudentType", "");
                                    if (v != null) {
                                      setFieldValue("mstudentType", v);
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Col>
                            <Col
                              lg="4"
                              md="2"
                              xs={12}
                              className="add-btn-style mt-4"
                            ></Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* <h5>Formation</h5> */}
                      <Row className="">
                        <Col md="12" className="btn_align ">
                          <Button
                            className="submitbtn me-2"
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              this.createStudentPromotionData(
                                values,
                                selectedStudentPromotion
                              );
                            }}

                            // onClick={() => this.handleClose()}
                            // // disabled={isSubmitting}
                          >
                            Submit
                            <img src={arrowicon} className="btnico ms-1"></img>
                          </Button>
                          <Button
                            className="cancelbtn submitbtn"
                            variant="secondary"
                            onClick={() => this.handleClose()}
                          >
                            Cancel
                            <img
                              src={cancel_icon}
                              className="ms-1 btnico"
                              style={{ height: "14px" }}
                            ></img>
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        </>
      </div>
      //{" "}
    );
  }
}
