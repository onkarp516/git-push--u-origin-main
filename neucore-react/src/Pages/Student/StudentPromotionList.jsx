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
  getStudentList,
  getBranchesByInstitute,
  authenticationService,
  getStandardsByBranch,
  getStudentListByStandard,
  getAcademicYearByBranch,
  deleteStudent,
  getStudentPaidReceipts,
  cancelStudentAdmission,
  getStudentDataForPromotion,
  getDivisionsByStandard,
  promoteStudent,
} from "@/services/api_functions";
import { exportExcelStudentDataURL } from "@/services/api";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";

import Select from "react-select";
import {
  getHeader,
  customStyles,
  isActionExist,
  getSelectValue,
  eventBus,
  MyNotifications,
  MyDatePicker,
} from "@/helpers";
import "mousetrap-global-bind";
import refresh_iconblack from "@/assets/images/3x/refresh_iconblack.png";
import excel from "@/assets/images/3x/excel.png";
import print from "@/assets/images/3x/print.png";
import delete_ from "@/assets/images/3x/delete_.png";
import edit_ from "@/assets/images/3x/edit_.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default class StudentPromotionList extends React.Component {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
    this.state = {
      data: [],
      orgData: [],
      isLoading: true,
      opbranchList: [],
      opstandList: [],
      opAcademicYearList: [],

      opBranchList: [],
      opStandardList: [],
      opDivisionId: [],
      opStudTypeList: [],
      StudentStatus: false,
      sId: "",

      initVal: {
        academicYearId: "",
        standardId: "",
        branchId: "",
        studentType: "",
        id: "",
        isHostel: "",
        isBusConcession: "",
        busConcessionAmount: "",
        isScholarship: "",
        studentGroup: "",
        divisionId: "",
        generalRegisterNo: "",
        nameOfPrevSchool: "",
        stdInPrevSchool: "",
        studentName: "",
        result: "",
        doa: "",
        admittedStandardId: "",
        currentStandardId: "",
        studentIsOld: "",
        nts: "",
        concession: "",
      },

      studentTypeOptions: [
        { label: "Day School", value: 1 },
        { label: "Residential", value: 2 },
      ],
      studentGroupOptions: [
        { label: "PCM", value: 1 },
        { label: "PCB", value: 2 },
      ],
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      typeoptions: [
        { label: "New", value: 1 },
        { label: "Old", value: 2 },
      ],

      receiptModalShow: false,
      receiptRows: [],
      studentId: "",
    };
  }

  getStudentListlst = () => {
    getStudentList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          this.setState({ data: d });
        }
      })
      .catch((error) => {
        this.setState({ data: [] });
        console.log("error", error);
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
                this.searchRef.current.setFieldValue("branchId", branchId);
                this.getStandardByBranchData(branchId.value);
                this.getAcademicYearData(branchId.value);
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
  getAcademicYearData = (branchId, academicYearId = null) => {
    console.log({ branchId, academicYearId });
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
            this.setState({ opAcademicYearList: Opt }, () => {
              if (academicYearId != null && academicYearId != "") {
                let { initVal } = this.state;
                initVal["academicYearId"] = getSelectValue(
                  Opt,
                  parseInt(academicYearId)
                );
                this.setState({ initVal: initVal });
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

  getStandardData = (
    branchId,
    currentStandardId = null,
    admittedStandardId = null,
    studObj = null
  ) => {
    console.log({
      branchId,
      currentStandardId,
      admittedStandardId,
      studObj,
    });
    let requestData = new FormData();
    requestData.append("branchId", branchId);
    getStandardsByBranch(requestData)
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
            this.setState({ opStandardList: Opt }, () => {
              let { initVal } = this.state;
              if (currentStandardId != null && currentStandardId != "") {
                initVal["currentStandardId"] = getSelectValue(
                  Opt,
                  parseInt(currentStandardId)
                );
              }

              if (admittedStandardId != null && admittedStandardId != "") {
                initVal["admittedStandardId"] = getSelectValue(
                  Opt,
                  parseInt(admittedStandardId)
                );
              }
              console.log({ studObj });
              // debugger;
              this.setState({ initVal: initVal }, () => {
                if (
                  studObj.currentStandardId != null &&
                  studObj.currentStandardId != ""
                ) {
                  this.getDivisionData(
                    currentStandardId,
                    studObj.divisionId,
                    studObj
                  );
                }
              });
            });
          }
        }
      })
      .catch((error) => {
        this.setState({ opStandardList: [] });
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
            });
          }
        }
      })
      .catch((error) => {
        this.setState({ opstandList: [] });
        console.log("error", error);
      });
  };

  getStudentListbyStandards = (
    academicYearId = 0,
    standardId = 0,
    studentType = 0
  ) => {
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
    requestData.append(
      "standardId",
      standardId != "" && standardId != null ? standardId.value : 0
    );
    requestData.append(
      "studentType",
      studentType != "" && studentType != null ? studentType.value : 0
    );
    getStudentListByStandard(requestData).then((response) => {
      let res = response.data;
      console.log("res", res);
      if (res.responseStatus == 200) {
        let d = res.responseObject;
        this.setState({ data: d, orgData: d }, () => {
          this.searchRef.current.setFieldValue("search", "");
        });
      }
    });
  };

  getStudentFeesDetails = (object) => {
    // console.log({ object });
    let requestData = new FormData();
    requestData.append("studentId", object.id);
    getStudentPaidReceipts(requestData).then((response) => {
      let res = response.data;
      console.log("res", res);
      if (res.responseStatus == 200) {
        this.setState({
          studentId: object.id,
          receiptRows: res.response,
          receiptModalShow: true,
        });
        //   MyNotifications.fire({
        //     show: true,
        //     icon: "success",
        //     title: "Success",
        //     msg: response.message,
        //     is_timeout: true,
        //     delay: 1000,
        //   });
      }
    });
  };

  deleteStudentFun = (studentId) => {
    let requestData = new FormData();
    requestData.append("studentId", studentId);
    deleteStudent(requestData).then((response) => {
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

        this.getStudentListbyStandards();
      } else {
        MyNotifications.fire({
          show: true,
          icon: "error",
          title: "Error",
          msg: response.message,
          is_button_show: true,
          response,
        });
      }
    });
  };

  exportStudentDataAsExcel = (data) => {
    if (data.length > 0) {
      let reqData = {
        studentList: JSON.stringify(this.state.data),
      };
      const requestOption = {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(reqData),
      };

      let filename =
        "student_data_" + moment().format("YYYY-MM-DD HH:MM:ss") + ".xlsx";

      return fetch(exportExcelStudentDataURL(), requestOption)
        .then((response) => response.blob())
        .then((blob) => {
          // 1. Convert the data into 'blob'
          console.log({ blob });

          // 2. Create blob link to download
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${filename}`);
          // 3. Append to html page
          document.body.appendChild(link);
          // 4. Force download
          link.click();
          // 5. Clean up and remove the link
          link.parentNode.removeChild(link);
          return true;
        });
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        msg: "Data should be Exist !",
        is_button_show: false,
        title: "Error",
      });
    }
  };

  componentDidMount() {
    // this.getStudentListlst();
    this.getStudentListbyStandards();
    let companyId = authenticationService.currentUserValue.companyId;
    this.getBranchData(companyId);
  }

  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        v.firstName != null &&
        v.lastName != null &&
        v.fatherName != null &&
        v.motherName != null &&
        (v.firstName.toLowerCase().includes(vi.toLowerCase()) ||
          v.motherName.toLowerCase().includes(vi.toLowerCase()) ||
          v.fatherName.toLowerCase().includes(vi.toLowerCase()) ||
          v.lastName.toLowerCase().includes(vi.toLowerCase()))
    );
    this.setState({ data: orgData_F.length > 0 ? orgData_F : orgData });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  setReceiptModalShow = (status) => {
    this.setState({
      receiptModalShow: status,
    });
  };

  getDivisionData = (currentStandardId, divisionId = null, studObj = null) => {
    let requestData = new FormData();
    requestData.append("standardId", currentStandardId);
    getDivisionsByStandard(requestData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.divName };
            });
            this.setState({ opDivisionList: Opt }, () => {
              if (divisionId != null && divisionId != "") {
                let { initVal } = this.state;
                initVal["divisionId"] = getSelectValue(
                  Opt,
                  parseInt(divisionId)
                );
                this.setState({ initVal: initVal });
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

  getStudentData = (sid) => {
    const id = sid;
    console.log("Student Id-->", id);
    let requestData = new FormData();
    requestData.append("studentAdmissionId", id);
    getStudentDataForPromotion(requestData).then((response) => {
      let res1 = response.data;
      if (res1.responseStatus == 200) {
        const {
          opAcademicYearList,
          opstandList,
          // opDivisionList
          opbranchList,
          result_options,
          options,
          typeoptions,
          studentTypeOptions,
          studentGroupOptions,
        } = this.state;
        let res = res1.data;
        console.log("Data for Promotion->", res, opstandList);

        let data = {
          id: res.studentAdmissionId,
          studentId: res.studentId,
          studentAdmissionId: res.studentAdmissionId,
          branchId: res.branchId
            ? getSelectValue(opbranchList, res.branchId)
            : "",

          doa:
            res.dateOfAdmission != null && res.dateOfAdmission != ""
              ? moment(res.dateOfAdmission).toDate()
              : "",
          isVacation:
            res.isVacation != null
              ? getSelectValue(options, res.isVacation)
              : "",
          academicYearId:
            res.academicYearId != null
              ? getSelectValue(opAcademicYearList, parseInt(res.academicYearId))
              : "",

          admittedStandardId:
            res.admittedStandardId != null
              ? getSelectValue(opstandList, parseInt(res.admittedStandardId))
              : "",

          currentStandardId:
            res.currentStandardId != null
              ? getSelectValue(opstandList, parseInt(res.currentStandardId))
              : "",
          divisionId: res.divisionId,

          studentType:
            res.studType != null
              ? getSelectValue(studentTypeOptions, parseInt(res.studType))
              : "",
          studentGroup:
            res.studentGroup != null
              ? getSelectValue(studentGroupOptions, parseInt(res.studentGroup))
              : "",
          isHostel:
            res.isHostel != null ? getSelectValue(options, res.isHostel) : "",
          studentName: res.studentName,
          isBusConcession:
            res.isBusConcession != null
              ? getSelectValue(options, res.isBusConcession)
              : "",
          busConcessionAmount:
            res.busConcessionAmount != null ? res.busConcessionAmount : "",
          isScholarship:
            res.isScholarship != null
              ? getSelectValue(options, res.isScholarship)
              : "",
          studentIsOld:
            res.studentIsOld != null
              ? getSelectValue(typeoptions, parseInt(res.studentIsOld))
              : "",
          nts: res.nts != null ? getSelectValue(options, res.nts) : "",
          concession: res.concession != null ? res.concession : "",
        };

        console.log({ data });
        this.setState(
          {
            initVal: data,
            StudentStatus: true,
          },
          () => {
            // this.getAcademicYearData(
            //   data.branchId.value,
            //   data.academicYearId,
            //   data
            // );
            // this.getStandardData(
            //   data.branchId && data.branchId.value,
            //   data.currentStandardId && data.currentStandardId.value,
            //   data.admittedStandardId && data.admittedStandardId.value,
            //   data
            // );
            this.getDivisionData(
              data.currentStandardId.value,
              res.divisionId,
              data
            );
          }
        );
      }
    });
  };

  render() {
    const {
      data,
      initVal,
      opstandList,
      typeoptions,
      opStandardList,
      getDivisionData,
      opDivisionList,
      studentGroupOptions,
      handleChange,
      options,
      opAcademicYearList,
      studentTypeOptions,
      receiptRows,
      receiptModalShow,
      StudentStatus,
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
              innerRef={this.searchRef}
              validationSchema={Yup.object().shape({
                branchId: Yup.object()
                  .required("Branch is required")
                  .nullable(),
                standardId: Yup.object()
                  .required("standard is required")
                  .nullable(),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log("value", values);
                let keys = Object.keys(initVal);
                let requestData = new FormData();
                keys.map((v) => {
                  if (
                    values[v] != "" &&
                    v != "companyId" &&
                    v != "branchId" &&
                    v != "standardId"
                  ) {
                    requestData.append(v, values[v]);
                  }
                });
                // requestData.append("companyId", values.companyId.value);
                requestData.append("branchId", values.branchId.value);
                requestData.append("standardId", values.standardId.value);

                setSubmitting(true);

                getBranchesByInstitute(requestData)
                  .then((response) => {
                    let res = response.data;
                    if (res.responseStatus == 200) {
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
                      // this.getAcademicYearlst();
                      // this.setInitValAndLoadData();
                    } else {
                      //   ShowNotification("Error", res.message);
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
                    setSubmitting(false);
                    console.log("error", error);
                    MyNotifications.fire({
                      show: true,
                      icon: "error",
                      title: "Error",

                      is_button_show: true,
                    });
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
                  <div className="mb-2 m-0 company-from">
                    {/* {JSON.stringify(values)}
                      {JSON.stringify(errors)} */}
                    <Row style={{ padding: "8px" }}>
                      <Col md={2} xs={12} className="mb-2">
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

                      <Col lg={2} md={4} xs={12}>
                        <Form.Label
                          htmlFor="inlineFormInputGroup"
                          visuallyHidden
                        ></Form.Label>
                        <InputGroup className="mt-4 headt">
                          <FormControl
                            // id="inlineFormInputGroup"
                            placeholder="Search"
                            type="text"
                            name="search"
                            id="search"
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

                      {/* <Col lg={2} md="2"></Col> */}
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
                              this.getStudentListbyStandards(
                                v,
                                values.standardId,
                                values.studentType
                              );
                            }}
                            name="academicYearId"
                            id="academicYearId"
                            options={opAcademicYearList}
                            value={values.academicYearId}
                          />
                        </Form.Group>
                      </Col>

                      <Col md="2">
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
                              this.getStudentListbyStandards(
                                values.academicYearId,
                                v,
                                values.studentType
                              );
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
                      </Col>

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
                              this.getStudentListbyStandards(
                                values.academicYearId,
                                values.standardId,
                                v
                              );
                            }}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={2} xs={12} className="btn_align mainbtn_create">
                        <Button
                          className="create-btn me-2"
                          onClick={(e) => {
                            e.preventDefault();
                            if (isActionExist("student-list", "create")) {
                              eventBus.dispatch(
                                "page_change",
                                "studentpromotion"
                              );
                            } else {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: "Permission is denied!",
                                is_button_show: true,
                              });
                            }
                          }}
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
                          <img
                            src={refresh_iconblack}
                            className="iconstable"
                          ></img>
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
                          onClick={(e) => {
                            e.preventDefault();
                            this.exportStudentDataAsExcel(data);
                          }}
                        >
                          <img src={excel} className="iconstable"></img>
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="cust_table p-2">
            {/* {data.length > 0 && ( */}
            <div className="table_wrapper denomination-style">
              <Table size="sm" hover className="tbl-font">
                <thead>
                  <tr>
                    <th>#.</th>

                    <th>Student Name</th>
                    <th>Standard</th>
                    <th>DOB</th>
                    <th>Mobile No.</th>
                    <th>Mother Name</th>
                    <th>Student Type</th>
                    <th>Date of Admission</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody
                  className="tabletrcursor"
                  style={{ borderTop: "transparent" }}
                >
                  {data.length > 0 ? (
                    data.map((v, i) => {
                      let studName = "";

                      if (v.lastName != null) {
                        studName = v.lastName;
                      }
                      if (v.firstName != null) {
                        studName = studName + " " + v.firstName;
                      }
                      if (v.fatherName != null) {
                        studName = studName + " " + v.fatherName;
                      }
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          {/* <td>{v.id}</td> */}

                          {/* <td>
                            {v.firstName +
                              " " +
                              v.fatherName +
                              " " +
                              v.lastName}
                          </td> */}
                          <td>{studName}</td>
                          <td>{v.standardName}</td>
                          <td>
                            {v.birthDate != ""
                              ? moment(v.birthDate).format("DD-MM-YYYY")
                              : ""}
                          </td>
                          <td>{v.mobileNo}</td>
                          <td>{v.motherName}</td>
                          <td>{v.studentType}</td>
                          <td>
                            {v.dateOfAdmission != ""
                              ? moment(v.dateOfAdmission).format("DD-MM-YYYY")
                              : ""}
                          </td>
                          <td>
                            {" "}
                            <a
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                console.log({ v });
                                // eventBus.dispatch("page_change", {
                                //   from: "studentpromotionlist",
                                //   to: "studentadmissionedit",
                                //   prop_data: v.id,
                                //   isNewTab: false,
                                // });
                                this.getStudentData(v.studentAdmissionId);
                              }}
                            >
                              <img src={edit_} alt="" className="marico"></img>
                            </a>
                            <a
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                console.log({ v });

                                MyNotifications.fire({
                                  show: true,
                                  icon: "confirm",
                                  title: "confirm",
                                  msg: "Are you sure want to Delete ?",
                                  is_button_show: true,

                                  handleFn: () => {
                                    this.deleteStudentFun(v.id);
                                  },
                                  handleFailureFun: () => {},
                                });
                              }}
                            >
                              <img
                                src={delete_}
                                alt=""
                                className="marico"
                              ></img>
                            </a>
                            {/* <a
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                console.log({ v });
                                this.getStudentFeesDetails(v);
                              }}
                            >
                              Admission Cancel
                            </a> */}
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
            {/* )} */}
          </div>
        </div>

        <Modal
          show={receiptModalShow}
          size="lg"
          className="groupnewmodal mt-5 mainmodal"
          onHide={() => this.setReceiptModalShow(false)}
          dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
            //closeButton
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup form-header"
            style={{ paddingLeft: "0px" }}
          >
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="form-header"
            >
              Stuent Receipt List
            </Modal.Title>
            <CloseButton
              // variant="white"
              className="pull-right"
              //onClick={this.handleClose}
              onClick={() => this.setReceiptModalShow(false)}
            />
          </Modal.Header>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              refundAmount: "",
              reason: "",
            }}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              refundAmount: Yup.string()
                .nullable()

                .trim()
                .required("Refund amount required"),
              reason: Yup.string()
                .nullable()
                .trim()
                .required("Reason required"),
            })}
            onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
              setStatus();
              console.log({ values });

              let requestData = new FormData();
              requestData.append("refundAmount", values.refundAmount);
              requestData.append("reason", values.reason);
              requestData.append("studentId", this.state.studentId);

              cancelStudentAdmission(requestData)
                .then((response) => {
                  if (response.data.responseStatus === 200) {
                    setSubmitting(false);
                    // resetForm();
                    // this.setReceiptModalShow(false);
                    // setisLoading(false);
                  } else {
                    setSubmitting(false);
                  }
                })
                .catch((error) => {
                  setSubmitting(false);
                });
            }}
            render={({
              errors,
              status,
              touched,
              isSubmitting,
              handleChange,
              handleSubmit,
              setFieldValue,
              values,
            }) => (
              <Form autoComplete="off" onSubmit={handleSubmit}>
                {/* {JSON.stringify(values)} */}
                <Modal.Body className="p-4 p-invoice-modal common-form-style">
                  <Row className="row-inside">
                    <Table size="sm" hover className="tbl-font">
                      <thead>
                        <tr>
                          <th>#.</th>
                          <th>Receipt No</th>
                          <th>Transaction Date</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody
                        className="tabletrcursor"
                        style={{ borderTop: "transparent" }}
                      >
                        {receiptRows.length > 0 ? (
                          receiptRows.map((v, i) => {
                            return (
                              <tr>
                                <td>{i + 1}</td>
                                <td>{v.receiptNo}</td>
                                <td>
                                  {moment(v.transactionDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td>{v.paidAmount}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Row>

                  <Row className="row-inside">
                    <Col md="4">
                      <Form.Group>
                        <Form.Label>Refund Amount</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Refund Amount"
                          name="refundAmount"
                          id="refundAmount"
                          onChange={handleChange}
                          value={values.refundAmount}
                          isValid={touched.refundAmount && !errors.refundAmount}
                          styles={customStyles}
                          isInvalid={!!errors.refundAmount}
                        />

                        <span className="text-danger errormsg">
                          {errors.refundAmount}
                        </span>
                      </Form.Group>
                    </Col>
                    <Col md="8">
                      <Form.Group>
                        <Form.Label>Reason for admission cancel</Form.Label>
                        <Form.Control
                          type="textarea"
                          placeholder="Reason for admission cancel"
                          name="reason"
                          id="reason"
                          onChange={handleChange}
                          value={values.reason}
                          isValid={touched.reason && !errors.reason}
                          styles={customStyles}
                          isInvalid={!!errors.reason}
                        />

                        <span className="text-danger errormsg">
                          {errors.reason}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer className="p-2">
                  <Button
                    type="submit"
                    className="mainbtn1 mainhoverbtn text-white submitbtn formbtn"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>

                  <Button
                    className="mainbtn1 modalcancelbtn submitbtn cancelbtn formbtn"
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      this.setReceiptModalShow(null);
                    }}
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          />
        </Modal>

        <Modal
          show={StudentStatus}
          size="xl"
          isOpen={StudentStatus}
          onHide={() => this.setState({ StudentStatus: false })}
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header
            closeButton
            closeVariant="black"
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Student Promotion
            </Modal.Title>
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            // initialValues={{ receivedDate: "" }}
            initialValues={this.state.initVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              doa: Yup.string().required("Required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              console.log({ values });

              this.setState({ isLoading: true });
              let keys = Object.keys(initVal);
              console.log("key", keys);
              console.log("values", values);

              let requestData = new FormData();
              keys.map((v) => {
                console.log("v->", v);
                if (
                  values[v] != "" &&
                  v != "branchId" &&
                  v != "academicYearId" &&
                  v != "isVacation" &&
                  v != "admittedStandardId" &&
                  v != "currentStandardId" &&
                  v != "divisionId" &&
                  v != "studentType" &&
                  v != "isHostel" &&
                  v != "isBusConcession" &&
                  v != "isScholarship" &&
                  v != "studentIsOld" &&
                  v != "nts" &&
                  v != "doa" &&
                  v != "studentGroup"
                ) {
                  requestData.append(v, values[v]);
                }
              });
              if (values.doa != null && values.doa != "") {
                requestData.append(
                  "doa",
                  moment(values.doa).format("yyyy-MM-DD")
                );
              }
              if (
                values.academicYearId != "" &&
                values.academicYearId != null &&
                values.academicYearId != undefined
              ) {
                requestData.append(
                  "academicYearId",
                  values.academicYearId.value
                );
              }
              if (
                values.branchId != "" &&
                values.branchId != null &&
                values.branchId != undefined
              ) {
                requestData.append("branchId", values.branchId.value);
              }

              if (
                values.studentIsOld != "" &&
                values.studentIsOld != null &&
                values.studentIsOld != undefined
              ) {
                requestData.append("studentIsOld", values.studentIsOld.value);
              }
              if (
                values.admittedStandardId != null &&
                values.admittedStandardId != "" &&
                values.admittedStandardId != undefined
              ) {
                requestData.append(
                  "admittedStandardId",
                  values.admittedStandardId.value
                );
              }

              if (
                values.currentStandardId != "" &&
                values.currentStandardId != null &&
                values.currentStandardId != undefined
              ) {
                requestData.append(
                  "currentStandardId",
                  values.currentStandardId.value
                );
              }

              if (values.divisionId != null && values.divisionId != "") {
                requestData.append("divisionId", values.divisionId.value);
              }
              if (values.studentType != "" && values.studentType != null) {
                requestData.append("studentType", values.studentType.value);
              }

              if (values.isHostel != "" && values.isHostel != null) {
                requestData.append("isHostel", values.isHostel.value);
              }

              if (
                values.isBusConcession != "" &&
                values.isBusConcession != null
              ) {
                requestData.append(
                  "isBusConcession",
                  values.isBusConcession.value
                );
              }

              if (values.isVacation != "" && values.isVacation != null) {
                requestData.append("isVacation", values.isVacation.value);
              }

              if (values.isScholarship != "" && values.isScholarship != null) {
                requestData.append("isScholarship", values.isScholarship.value);
              }

              if (values.nts != "" && values.nts != null) {
                requestData.append("nts", values.nts.value);
              }

              if (values.studentGroup != null && values.studentGroup != "") {
                requestData.append("studentGroup", values.studentGroup.value);
              }
              promoteStudent(requestData)
                .then((response) => {
                  console.log("response.data ", response.data);
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
                    this.pageReload();
                    this.setState({ StudentStatus: false });
                  } else {
                    setSubmitting(false);
                    MyNotifications.fire({
                      show: true,
                      icon: "error",
                      title: "Error",
                      msg: response.data.message,
                      is_timeout: true,
                      delay: 2000,
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
                    msg: error,
                    is_timeout: true,
                    delay: 1000,
                  });
                  console.log("errors", error);
                });
            }}
          >
            {({ values, errors, handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit} style={{ background: "#ffffff" }}>
                <Modal.Body className="purchaseumodal p-2">
                  <div className="purchasescreen">
                    {/* <div>
                      <p className="subheading mt-2 ps-5">Student Data</p>
                    </div> */}
                    <Col lg="2">
                      <Form.Group>
                        <Form.Label>Student Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Aadhar No."
                          name="studentName"
                          value={values.studentName}
                          onChange={handleChange}
                          className="formbg"
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Row className="mb-4 mt-5">
                      <Col lg="2">
                        <Form.Label className="formlabelsize">
                          Date Of Admission
                        </Form.Label>
                        <br />

                        <MyDatePicker
                          className="datepic form-control"
                          styles={customStyles}
                          value={values.doa}
                          name="doa"
                          placeholderText="dd/MM/yyyy"
                          id="doa"
                          dateFormat="dd/MM/yyyy"
                          onChange={(date) => {
                            setFieldValue("doa", date);
                          }}
                          selected={values.doa}
                          // maxDate={new Date()}
                        />
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
                            options={opAcademicYearList}
                            value={values.academicYearId}
                          />
                        </Form.Group>
                      </Col>

                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Student IS Old</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            options={typeoptions}
                            isClearable={true}
                            onChange={(v) => {
                              setFieldValue("studentIsOld", "");
                              setFieldValue("admittedStandardId", "");
                              if (v != null) {
                                setFieldValue("studentIsOld", v);
                              }
                            }}
                            name="studentIsOld"
                            value={values.studentIsOld}
                          />
                        </Form.Group>
                      </Col>

                      {values.studentIsOld &&
                        values.studentIsOld.value == 1 && (
                          <Col lg={2}>
                            <Form.Group className="createnew">
                              <Form.Label>STD Admitted</Form.Label>
                              <Select
                                // className="selectTo formbg"
                                styles={customStyles}
                                isClearable={true}
                                onChange={(v) => {
                                  setFieldValue("admittedStandardId", "");

                                  if (v != null) {
                                    setFieldValue("admittedStandardId", v);
                                  }
                                }}
                                name="admittedStandardId"
                                options={opstandList}
                                value={values.admittedStandardId}
                              />
                            </Form.Group>
                          </Col>
                        )}
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Current STD</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            isClearable={true}
                            onChange={(v) => {
                              setFieldValue("currentStandardId", "");
                              setFieldValue("studentGroup", "");
                              setFieldValue("divisionId", "");

                              if (v != null) {
                                setFieldValue("currentStandardId", v);
                                this.getDivisionData(v.value);
                              } else {
                                this.setState({
                                  opDivisionList: [],
                                });
                              }
                            }}
                            name="currentStandardId"
                            options={opstandList}
                            value={values.currentStandardId}
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Division</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            isClearable={true}
                            onChange={(v) => {
                              setFieldValue("divisionId", "");
                              if (v != null) {
                                setFieldValue("divisionId", v);
                              }
                            }}
                            name="divisionId"
                            options={opDivisionList}
                            value={values.divisionId}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Student Type</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            isClearable={true}
                            onChange={(v) => {
                              setFieldValue("studentType", "");
                              if (v != null) {
                                setFieldValue("studentType", v);
                              }
                            }}
                            name="studentType"
                            options={studentTypeOptions}
                            value={values.studentType}
                          />
                        </Form.Group>
                      </Col>
                      {values.currentStandardId &&
                      parseInt(values.currentStandardId.label) >= 11 ? (
                        <Col lg={2}>
                          <Form.Group className="createnew">
                            <Form.Label>Student Group</Form.Label>
                            <Select
                              className="selectTo formbg"
                              styles={customStyles}
                              isClearable={true}
                              onChange={(v) => {
                                setFieldValue("studentGroup", "");
                                if (v != null) {
                                  setFieldValue("studentGroup", v);
                                }
                              }}
                              name="studentGroup"
                              options={studentGroupOptions}
                              value={values.studentGroup}
                            />
                          </Form.Group>
                        </Col>
                      ) : (
                        ""
                      )}

                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Hostel Applicable</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            options={options}
                            isClearable={true}
                            onChange={(v) => {
                              setFieldValue("isHostel", "");
                              if (v != null) {
                                setFieldValue("isHostel", v);
                              }
                            }}
                            name="isHostel"
                            id="isHostel"
                            value={values.isHostel}
                          />
                        </Form.Group>
                      </Col>

                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Bus Applicable</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            options={options}
                            isClearable={true}
                            onChange={(v) => {
                              setFieldValue("isBusConcession", "");
                              if (v != null) {
                                setFieldValue("isBusConcession", v);
                              }
                            }}
                            name="isBusConcession"
                            value={values.isBusConcession}
                          />
                        </Form.Group>
                      </Col>
                      {(values.currentStandardId.label == "10" ||
                        values.currentStandardId.label == "9") && (
                        <Col lg={2}>
                          <Form.Group className="createnew">
                            <Form.Label>Vacation Applicable</Form.Label>
                            <Select
                              className="selectTo formbg"
                              styles={customStyles}
                              options={options}
                              isClearable={true}
                              onChange={(v) => {
                                setFieldValue("isVacation", "");
                                if (v != null) {
                                  setFieldValue("isVacation", v);
                                }
                              }}
                              name="isVacation"
                              value={values.isVacation}
                            />
                          </Form.Group>
                        </Col>
                      )}
                      {(values.currentStandardId.label === "5" ||
                        values.currentStandardId.label === "8") && (
                        <Col lg={2}>
                          <Form.Group className="createnew">
                            <Form.Label>Scholarship</Form.Label>
                            <Select
                              className="selectTo formbg"
                              styles={customStyles}
                              options={options}
                              isClearable={true}
                              onChange={(v) => {
                                setFieldValue("isScholarship", "");
                                if (v != null) {
                                  setFieldValue("isScholarship", v);
                                }
                              }}
                              name="isScholarship"
                              value={values.isScholarship}
                            />
                          </Form.Group>
                        </Col>
                      )}
                      {values.currentStandardId.label === "10" && (
                        <Col lg={2}>
                          <Form.Group className="createnew">
                            <Form.Label>NTS</Form.Label>
                            <Select
                              className="selectTo formbg"
                              styles={customStyles}
                              options={options}
                              isClearable={true}
                              onChange={(v) => {
                                setFieldValue("nts", "");
                                if (v != null) {
                                  setFieldValue("nts", v);
                                }
                              }}
                              name="nts"
                              value={values.nts}
                            />
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                    <Row>
                      {(values.currentStandardId.label === "8" ||
                        values.currentStandardId.label === "9") && (
                        <Col lg={2}>
                          <Form.Group className="createnew">
                            <Form.Label>MTS</Form.Label>
                            <Select
                              className="selectTo formbg"
                              styles={customStyles}
                              options={options}
                              isClearable={true}
                              onChange={(v) => {
                                setFieldValue("mts", "");
                                if (v != null) {
                                  setFieldValue("mts", v);
                                }
                              }}
                              name="mts"
                              value={values.mts}
                            />
                          </Form.Group>
                        </Col>
                      )}
                      {(values.currentStandardId.label === "8" ||
                        values.currentStandardId.label === "9" ||
                        values.currentStandardId.label === "10") && (
                        <Col lg={2}>
                          <Form.Group className="createnew">
                            <Form.Label>Foundation</Form.Label>
                            <Select
                              className="selectTo formbg"
                              styles={customStyles}
                              options={options}
                              isClearable={true}
                              onChange={(v) => {
                                setFieldValue("foundation", "");
                                if (v != null) {
                                  setFieldValue("foundation", v);
                                }
                              }}
                              name="foundation"
                              value={values.foundation}
                            />
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                  </div>
                </Modal.Body>
                <Modal.Footer className="p-1">
                  <div className="pe-5 p-3">
                    <Button className="nextbtn text-white me-2" type="submit">
                      Submit
                    </Button>

                    <Button
                      type="button"
                      className="ml-2  cancelbtn"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ StudentStatus: false });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Modal.Footer>{" "}
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    );
  }
}
