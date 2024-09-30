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
  getTransactionList,
  getBranchesByInstitute,
  authenticationService,
  getStandardsByBranch,
  getAcademicYearByBranch,
  getTransactionListByStandard,
  getStudentlistforBusTransport,
  createStudentTransport,
  getAllBusStop,
} from "@/services/api_functions";
import { Formik } from "formik";
import * as Yup from "yup";

import Select from "react-select";
import {
  customStyles,
  isActionExist,
  MyNotifications,
  eventBus,
  getSelectValue,
} from "@/helpers";
import "mousetrap-global-bind";
import refresh_iconblack from "@/assets/images/3x/refresh_iconblack.png";
import excel from "@/assets/images/3x/excel.png";
import print from "@/assets/images/3x/print.png";
import arrowicon from "@/assets/images/3x/arrowicon.png";

import delete_ from "@/assets/images/3x/delete_.png";
import edit_ from "@/assets/images/3x/edit_.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import right from "@/assets/images/right.png";
import left from "@/assets/images/left.png";

export default class StudentPaymentList extends React.Component {
  constructor(props) {
    super(props);
    this.studentBusRef = React.createRef();
    this.state = {
      data: [],
      studentOpt: [],
      opbranchList: [],
      opstandList: [],
      opBusStopList: [],
      selectedStudent: [],
      removeStudent: [],
      selectedStudentForTransport: [],

      orgData: [],
      opAcademicYearList: [],
      initVal: {
        standardId: "",
        branchId: "",
        studentType: "",
        id: "",
        academicYearId: "",
        busStopId: "",
      },
      isLoading: true,
      studentTypeOptions: [
        { label: "Day School", value: 1 },
        { label: "Residential", value: 2 },
      ],
    };
  }

  createStudentTransportData = (values, selectedStudentForTransport) => {
    // let { branchId } = this.state.initVal;
    // console.log("this.state.initval", {
    //   values
    //   selectedStudentForTransport,
    // });

    if (values.busStopId != "" && selectedStudentForTransport.length > 0) {
      let requestData = new FormData();

      requestData.append(
        "busStopId",
        values.busStopId != "" && values.busStopId != null
          ? values.busStopId.value
          : 0
      );
      requestData.append(
        "branchId",
        authenticationService.currentUserValue.branchId
      );
      requestData.append(
        "academicYearId",
        values.academicYearId != "" && values.academicYearId != null
          ? values.academicYearId.value
          : 0
      );
      requestData.append(
        "standardId",
        values.standardId != "" && values.standardId != null
          ? values.standardId.value
          : 0
      );

      requestData.append(
        "studentlist",
        JSON.stringify(selectedStudentForTransport)
      );
      requestData.append(
        "studentType",
        values.studentType != "" && values.studentType != null
          ? values.studentType.value
          : 0
      );

      createStudentTransport(requestData).then((response) => {
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
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please give bus stop input ",
        is_timeout: true,
        delay: 1000,
      });
    }
  };

  getStudentlistforTransport = (academicYearId, standardId, studentType) => {
    // let { branchId } = this.state.initVal;
    console.log("this.state.initval", {
      academicYearId,
      standardId,
      studentType,
    });
    let requestData = new FormData();
    requestData.append(
      "branchId",
      authenticationService.currentUserValue.branchId
    );
    requestData.append(
      "academicYearId",
      academicYearId != "" && academicYearId != null ? academicYearId.value : 0
    );
    // requestData.append(
    //   "standardId",
    //   standardId != "" && standardId != null ? standardId.value : 0
    // );
    requestData.append(
      "studentType",
      studentType != "" && studentType != null ? studentType.value : 0
    );
    getStudentlistforBusTransport(requestData).then((response) => {
      let res = response.data;
      console.log("res", res);
      if (res.responseStatus == 200) {
        let d = res.responseObject;
        this.setState({ studentOpt: d, orgData: d }, () => {
          this.studentBusRef.current.setFieldValue("search", "");
        });
      }
    });
  };
  getBranchData = (outletId, initObj = null, branchId = null) => {
    let reqData = new FormData();
    console.log("outletId", outletId);
    reqData.append(
      "outletId",
      authenticationService.currentUserValue.companyId
    );
    getBranchesByInstitute(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.branchName };
            });

            this.setState({ opbranchList: Opt }, () => {
              if (initObj != null && branchId != null) {
                initObj["branchId"] = getSelectValue(Opt, parseInt(branchId));
                this.setState({ initVal: initObj }, () => {
                  // console.log(" caste data initObj ", initObj);
                  this.getStandardByBranchData(
                    branchId,
                    initObj,
                    initObj.standardId
                  );
                });
              } else {
                let branchId = getSelectValue(
                  Opt,
                  authenticationService.currentUserValue.branchId
                );
                this.studentBusRef.current.setFieldValue("branchId", branchId);
                this.getAcademicYearData(branchId.value);

                this.getStandardByBranchData(branchId.value);
              }
            });
          }
        }
      })
      .catch((error) => {
        this.setState({ opbranchList: [] });
        console.log("error", error);
      });
  };

  setInitValAndLoadData() {
    let { opBranchList } = this.state;

    this.setState({
      initVal: {
        standardId: "",
        branchId: "",
        studentType: "",
        id: "",
        academicYearId: "",
        busStopId: "",
      },
      studentOpt: [],
      removeStudent: [],
      selectedStudentForTransport: [],
      selectedStudent: [],

      opendiv: false,
    });
  }
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

  removeStudentForTransport = (id, status) => {
    let { removeStudent, selectedStudentForTransport } = this.state;
    let f_selectedStudents = removeStudent;
    console.log("Remove", removeStudent);
    console.log("selectedStudentForTransport  ", selectedStudentForTransport);
    let f_students = selectedStudentForTransport;
    if (status == true) {
      if (removeStudent.length > 0) {
        if (!removeStudent.includes(id)) {
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
      removeStudent: f_selectedStudents,
      selectedStudentForTransport: f_students,
    });
  };

  studentRightArrow = () => {
    let { selectedStudent, selectedStudentForTransport, studentOpt } =
      this.state;
    console.log({ selectedStudent, selectedStudentForTransport, studentOpt });
    if (selectedStudent.length > 0) {
      let f_studentOpt = studentOpt;
      this.setState({ selectedStudentForTransport: [] });
      console.log({ selectedStudent });
      selectedStudent.map((studentId) => {
        studentOpt.map((v, i) => {
          if (v.id == studentId) {
            selectedStudentForTransport.push(v);

            f_studentOpt = f_studentOpt.filter((v, i) => v.id != studentId);
          }
        });
      });

      console.log({ f_studentOpt, selectedStudentForTransport });
      this.setState({
        selectedStudentForTransport: selectedStudentForTransport.sort(
          (a, b) => a.id - b.id
        ),
        studentOpt: f_studentOpt,
        selectedStudent: [],
      });
    } else {
      MyNotifications.fire("PLease Check Student");
    }
  };

  studentLeftArrow = () => {
    let { removeStudent, selectedStudentForTransport, studentOpt } = this.state;
    if (removeStudent.length > 0) {
      let f_studentOpt = selectedStudentForTransport;
      this.setState({ studentOpt: [] });
      console.log({ removeStudent });
      removeStudent.map((studentId) => {
        selectedStudentForTransport.map((v, i) => {
          if (v.id == studentId) {
            studentOpt.push(v);
            f_studentOpt = f_studentOpt.filter((v, i) => v.id != studentId);
          }
        });
      });

      console.log({ f_studentOpt, studentOpt });
      this.setState({
        studentOpt: studentOpt.sort((a, b) => a.id - b.id),
        selectedStudentForTransport: f_studentOpt,
        removeStudent: [],
      });
    } else if (selectedStudentForTransport.length == 0) {
      MyNotifications.fire("No Found Data");
    } else {
      MyNotifications.fire("Please Check Student");
    }
  };

  getAllBusStopData = () => {
    getAllBusStop()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.busStopName };
            });
            this.setState({ opBusStopList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ data: [] });
        console.log("error", error);
      });
  };
  getAcademicYearData = (branchId) => {
    let reqData = new FormData();
    reqData.append("branchId", branchId);
    getAcademicYearByBranch(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
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

  getStandardByBranchData = (branchId, initObj = null, standardId = null) => {
    console.log("branchId ", branchId);
    let reqData = new FormData();
    reqData.append("branchId", branchId);
    getStandardsByBranch(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.standardName };
            });
            this.setState({ opstandList: Opt }, () => {
              console.log({ initObj, Opt });
              if (initObj != null && standardId != null) {
                initObj["standardId"] = getSelectValue(
                  Opt,
                  parseInt(standardId)
                );
                console.log({ initObj });
                this.setState({ initVal: initObj, opendiv: true });
              }
              // else if (initObj != null && subCasteId == null) {
              //   let { initVal } = this.state;
              //   initVal["subCasteId"] = getSelectValue(
              //     Opt,
              //     parseInt(initObj.sbct)
              //   );
              //   this.setState({ initVal: initVal, opendiv: true });
              // }
            });
          }
        }
      })
      .catch((error) => {
        this.setState({ opstandList: [] });
        console.log("error", error);
      });
  };

  getTransactionListByStandards = (academicYearId, standardId, studentType) => {
    console.log("this.state.initval", {
      academicYearId,
      standardId,
      studentType,
    });
    let requestData = new FormData();
    requestData.append(
      "branchId",
      authenticationService.currentUserValue.branchId
    );

    // requestData.append(
    //   "standardId",
    //   standardId != "" && standardId != null ? standardId.value : 0
    // );
    requestData.append(
      "studentType",
      studentType != "" && studentType != null ? studentType.value : 0
    );
    requestData.append(
      "academicYearId",
      academicYearId != "" && academicYearId != null ? academicYearId.value : 0
    );
    getTransactionListByStandard(requestData).then((response) => {
      let res = response.data;
      console.log("res", res);
      if (res.responseStatus == 200) {
        let d = res.responseObject;
        this.setState({ data: d });
      }
    });
  };

  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (value) =>
        value.firstName.toLowerCase().includes(vi.toLowerCase()) ||
        value.lastName.toLowerCase().includes(vi.toLowerCase())
    );
    this.setState({
      studentOpt: orgData_F.length > 0 ? orgData_F : orgData,
    });
  };

  componentDidMount() {
    this.getAllBusStopData();
    let companyId = authenticationService.currentUserValue.companyId;
    this.getBranchData(companyId);
  }

  pageReload = () => {
    this.componentDidMount();
  };

  render() {
    const {
      // data,
      studentOpt,
      initVal,
      opBusStopList,
      selectedStudent,
      removeStudent,
      selectedStudentForTransport,
      opstandList,
      studentTypeOptions,
      opAcademicYearList,
    } = this.state;
    return (
      <div className="">
        <div className="wrapper_div">
          <div className="main-div mb-2 m-0 company-from">
            <Formik
              validateOnChange={false}
              // validateOnBlur={false}
              enableReinitialize={true}
              initialValues={initVal}
              innerRef={this.studentBusRef}
              validationSchema={Yup.object().shape({
                branchId: Yup.object()
                  .required("Branch is required")
                  .nullable(),
                studentType: Yup.object()
                  .required("student Type is required")
                  .nullable(),
                academicYearId: Yup.object()
                  .required("Academic Year is Required ")
                  .nullable(),
                busStopId: Yup.object()
                  .required("Bus Stop is Required !")
                  .nullable(),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                this.setState({ initVal: values }, () => {
                  this.getStudentlistforTransport(
                    values.academicYearId,
                    values.standardId,
                    values.studentType
                  );
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
                <Form onSubmit={handleSubmit} className="form-style">
                  {/* {JSON.stringify(errors)} */}
                  <div className="mb-2 m-0 company-from">
                    <Row style={{ padding: "8px" }}>
                      {/* <Col lg={5} md="2"></Col> */}

                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Bus Route</Form.Label>
                          <Select
                            // className="selectTo formbg"
                            styles={customStyles}
                            isClearable={true}
                            onChange={(v) => {
                              setFieldValue("busStopId", "");

                              if (v != null) {
                                setFieldValue("busStopId", v);
                              }
                            }}
                            name="busStopId"
                            options={opBusStopList}
                            value={values.busStopId}
                          />
                          <span className="text-danger errormsg">
                            {errors.busStopId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Academic Year</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            isClearable={true}
                            onChange={(v) => {
                              setFieldValue("academicYearId", "");
                              if (v != null) {
                                setFieldValue("academicYearId", v);
                              }
                            }}
                            name="academicYearId"
                            id="academicYearId"
                            options={opAcademicYearList}
                            value={values.academicYearId}
                          />
                          <span className="text-danger errormsg">
                            {errors.academicYearId}
                          </span>
                        </Form.Group>
                      </Col>

                      {/* <Col md="2">
                        <Form.Group>
                          <Form.Label>Standard</Form.Label>

                          <Select
                            isClearable={true}
                            className="selectTo"
                            styles={customStyles}
                            options={opstandList}
                            onChange={(v) => {
                              setFieldValue("standardId", "");
                              if (v != null) {
                                setFieldValue("standardId", v);
                              }
                            }}
                            name="standardId"
                            id="standardId"
                            value={values.standardId}
                            invalid={errors.standardId ? true : false}
                          />
                          <span className="text-danger errormsg">
                            {errors.standardId}
                          </span>
                        </Form.Group>
                      </Col> */}

                      <Col md="2">
                        <Form.Group className="createnew">
                          <Form.Label>Student Type</Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            // isDisabled={true}
                            isClearable={true}
                            name="studentType"
                            options={studentTypeOptions}
                            value={values.studentType}
                            id="studentType"
                            onChange={(v) => {
                              setFieldValue("studentType", 1);
                              if (v != null) {
                                setFieldValue("studentType", v);
                              }
                            }}
                          />
                          <span className="text-danger errormsg">
                            {errors.studentType}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md={4} xs={12} className="">
                        <Button type="submit" className="submitbtn me-2">
                          Get Student
                          <img src={arrowicon} className="btnico ms-1"></img>
                        </Button>
                        <Button
                          type="button"
                          className="btn submitbtn me-2"
                          onClick={(e) => {
                            e.preventDefault();
                            this.createStudentTransportData(
                              values,
                              selectedStudentForTransport
                            );
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          className="btn  submitbtn cancelbtn formbtn me-2"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "studentbuslist");
                          }}
                        >
                          Cancel
                        </Button>

                        <Button
                          type="button"
                          className="btn  submitbtn cancelbtn formbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            // this.studentBusRef.current.resetForm();
                            this.setInitValAndLoadData();
                            // this.pageReload();
                            console.log("pagereload called");
                          }}
                        >
                          Reset
                        </Button>
                      </Col>

                      <Col lg={2} md={4} xs={12}>
                        <Form.Label
                          htmlFor="inlineFormInputGroup"
                          visuallyHidden
                        ></Form.Label>
                        <InputGroup className="mb-2 headt">
                          <FormControl
                            id="search"
                            placeholder="Search"
                            type="search"
                            aria-label="Search"
                            className="search-conrol"
                            onChange={(e) => {
                              let v = e.target.value;
                              console.log({ v });
                              setFieldValue("search", v);
                              this.handleSearch(v);
                            }}
                            value={values.search}
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
                    </Row>

                    <Row>
                      <Col md="5">
                        <div className="cust_table p-2">
                          <div className="table_wrapper denomination-style">
                            <Table
                              size="sm"
                              hover
                              className="tbl-font text-center mb-0"
                              style={{
                                border: "1px solid #e8ecef",
                                maxHeight: "73vh",
                              }}
                            >
                              <thead>
                                <tr>
                                  <th>#.</th>
                                  {/* <th>Roll No</th> */}
                                  <th>Student Name</th>
                                  <th>MobileNo</th>
                                  <th>standard</th>
                                  <th>Select</th>
                                </tr>
                              </thead>

                              {studentOpt &&
                                studentOpt.map((value, key) => {
                                  return (
                                    <>
                                      <tbody>
                                        <tr>
                                          <td className="text-center">
                                            {key + 1}
                                          </td>
                                          {/* <td className="text-center">
                                            {value.id}
                                          </td> */}
                                          {/* <td>{value.studentName}</td> */}
                                          <td>
                                            {" "}
                                            {value.firstName +
                                              " " +
                                              value.lastName}
                                          </td>

                                          <td>{value.mobileNo}</td>
                                          <td>{value.standardName}</td>
                                          <td>
                                            <div key={`inline-checkbox`}>
                                              <Form.Check
                                                inline
                                                name="checked"
                                                id={`checked_` + key}
                                                type="checkbox"
                                                checked={
                                                  selectedStudent.includes(
                                                    value.id
                                                  ) == true
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
                                          {/* <td>
                                            <div className="form-check form-check-inline">
                                              <CustomInput
                                                type="checkbox"
                                                name="checked"
                                                id={`checked_` + key}
                                                checked={
                                                  selectedEmp.includes(
                                                    value.id
                                                  ) == true
                                                    ? true
                                                    : false
                                                }
                                                value={value.checked}
                                                onChange={(e) => {
                                                  this.addSelectionEmployees(
                                                    value.id,
                                                    e.target.checked
                                                  );
                                                }}
                                              />
                                            </div>
                                          </td> */}
                                        </tr>
                                      </tbody>
                                    </>
                                  );
                                })}
                            </Table>
                          </div>
                        </div>
                      </Col>
                      <Col md="2">
                        <div className="busarrow">
                          <div className="mb-3">
                            <Button
                              type="button"
                              className="btn arrowbtn"
                              onClick={(e) => {
                                e.preventDefault();
                                this.studentRightArrow();
                              }}
                            >
                              <img src={right} alt="rightarrow"></img>
                            </Button>
                          </div>
                          <div>
                            <Button
                              type="button"
                              className="btn arrowbtn"
                              onClick={(e) => {
                                e.preventDefault();
                                this.studentLeftArrow();
                              }}
                            >
                              <img src={left} alt="leftarrow"></img>
                            </Button>
                          </div>
                        </div>
                      </Col>
                      <Col md="5">
                        {/* {JSON.stringify(removeStudent)}
                        {JSON.stringify(selectedStudentForTransport)} */}
                        <div className="cust_table p-2">
                          <div className="table_wrapper denomination-style">
                            <Table
                              size="sm"
                              hover
                              className="tbl-font text-center mb-0"
                              style={{
                                border: "1px solid #e8ecef",
                                maxHeight: "73vh",
                              }}
                            >
                              <thead>
                                <tr>
                                  <th>Select</th>
                                  <th>#.</th>
                                  {/* <th>Roll No</th> */}
                                  <th>Student Name</th>
                                  <th>MobileNo</th>
                                  <th>standard</th>
                                </tr>
                              </thead>
                              {selectedStudentForTransport &&
                                selectedStudentForTransport.map(
                                  (value, key) => {
                                    return (
                                      <>
                                        <tbody>
                                          <tr>
                                            <td>
                                              <div key={`inline-checkbox`}>
                                                <Form.Check
                                                  inline
                                                  name="checked"
                                                  id={`checked_` + key}
                                                  type="checkbox"
                                                  checked={
                                                    removeStudent.includes(
                                                      value.id
                                                    ) == true
                                                      ? true
                                                      : false
                                                  }
                                                  value={value.checked}
                                                  onChange={(e) => {
                                                    this.removeStudentForTransport(
                                                      value.id,
                                                      e.target.checked
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </td>
                                            <td className="text-center">
                                              {key + 1}
                                            </td>
                                            {/* <td className="text-center">
                                              {value.id}
                                            </td> */}
                                            {/* <td>{value.studentName}</td> */}
                                            {value.firstName +
                                              " " +
                                              value.lastName}
                                            <td>{value.mobileNo}</td>
                                            <td>{value.standardName}</td>
                                          </tr>
                                        </tbody>
                                      </>
                                    );
                                  }
                                )}
                            </Table>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}
