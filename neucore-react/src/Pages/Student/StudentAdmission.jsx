import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  FormControl,
  Tab,
  Modal,
  CloseButton,
} from "react-bootstrap";
import { Formik } from "formik";
import save from "@/assets/images/3x/save.png";
import cancel from "@/assets/images/3x/cancel.png";
import arrowicon from "@/assets/images/3x/arrowicon.png";
import previous from "@/assets/images/3x/previous.png";
import cancel_icon from "@/assets/images/3x/cancel_icon.png";
import * as Yup from "yup";

import "./stepper.scss";
import SStep1 from "@/Pages/Student/steps/SStep1";
import SStep2 from "@/Pages/Student/steps/SStep2";
import SStep3 from "@/Pages/Student/steps/SStep3";

import {
  authenticationService,
  getAcademicYearByBranch,
  getBranchesByInstitute,
  getStandardsByBranch,
  getDivisionsByStandard,
  getMothertongue,
  getCastesByReligion,
  getCategoryBySubCaste,
  getReligion,
  getSubCasteByCaste,
  createStudent,
  findStudent,
  createReligion,
} from "@/services/api_functions";

import moment from "moment";

import {
  isActionExist,
  eventBus,
  getSelectValue,
  MyNotifications,
} from "@/helpers";

export default class StudentAdmission extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      active_tab: "1",
      foundStudent: "",

      step: 1,
      initVal: {
        // Step1
        branchId: "",
        firstName: "",
        middleName: "",
        lastName: "",
        fullName: "",
        gender: "",
        dob: "",
        age: 0,
        birthPlace: "",
        motherTongueId: "",
        nationalityId: "",
        religionId: "",
        casteId: "",
        subCasteId: "",
        categoryId: "",
        hometown: "",
        saralId: "",
        aadharNo: "",
        studentImage: "",
        religion_data: "",
        religionModalShow: false,

        // Step2
        fatherName: "",
        fatherOccupation: "",
        motherName: "",
        motherOccupation: "",
        officeAddress: "",
        currentAddress: "",
        sameAsCurrentAddress: false,
        permanentAddress: "",
        phoneNoHome: "",
        alternativeMobileNo: "",
        mobileNo: "",
        emailId: "",
        fatherImage: "",
        motherImage: "",

        // Step3
        generalRegisterNo: "",
        nameOfPrevSchool: "",
        stdInPrevSchool: "",
        result: "",
        doa: "",
        academicYearId: "",
        admittedStandardId: "",
        currentStandardId: "",
        divisionId: "",
        studentType: "",
        isHostel: "",
        isBusConcession: "",
        busConcessionAmount: "",
        isScholarship: "",
        studentIsOld: "",
        nts: "",
        concession: "",
        isVacation: "",
        foundation: "",
        mts: "",
      },

      opAcademicYearList: [],
      opBranchList: [],
      opStandardList: [],
      opMotherTongueList: [],
      opDivisionId: [],
      opCasteList: [],
      opSubCasteList: [],
      opStudTypeList: [],
      opCategoryList: [],
      opReligionList: [],

      nationality_options: [
        { label: "Indian", value: 1 },
        { label: "Other", value: 2 },
      ],
      result_options: [
        { label: "Pass", value: true },
        { label: "Fail", value: false },
      ],
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      typeoptions: [
        { label: "New", value: 1 },
        { label: "Old", value: 2 },
      ],
      studentTypeOptions: [
        { label: "Day School", value: 1 },
        { label: "Residential", value: 2 },
      ],
      studentGroupOptions: [
        { label: "PCM", value: 1 },
        { label: "PCB", value: 2 },
      ],
      VALIDATION: {
        1: Yup.object().shape({
          firstName: Yup.string()
            .trim()
            // .matches(only_alphabets, "FirstName Should Contain Only Alphabets")
            .required("First Name is Required"),

          lastName: Yup.string()
            .trim()
            // .matches(only_alphabets, "LastName Should Contain Only Alpabets")
            .required("Last Name is Required"),
        }),
        2: Yup.object().shape({}),
        3: Yup.object().shape({
          firstName: Yup.string()
            .trim()
            // .matches(only_alphabets, "FirstName Should Contain Only Alphabets")
            .required("First Name is Required"),

          lastName: Yup.string()
            .trim()
            // .matches(only_alphabets, "LastName Should Contain Only Alpabets")
            .required("Last Name is Required"),
        }),
      },
    };
  }

  handleReligionModalShow = (status) => {
    let { religion_data } = this.state;

    this.setState({ religionModalShow: status });
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
        console.log("res", res);
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
            console.log({ branchId });
            this.myRef.current.setFieldValue("branchId", branchId);
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
        console.log("res", res);
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
        console.log("res", res);
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

  getMothertongueData = () => {
    getMothertongue()
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.motherTongueName };
            });
            this.setState({ opMotherTongueList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opMotherTongueList: [] });
        console.log("error", error);
      });
  };

  getCasteData = (id) => {
    let requestData = new FormData();
    requestData.append("religionId", id);
    getCastesByReligion(requestData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.casteName };
            });
            this.setState({ opCasteList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opCasteList: [] });
        console.log("error", error);
      });
  };

  findStudentData = (id, firstName, middleName, lastName, setFieldValue) => {
    let requestData = new FormData();
    requestData.append("id", id);
    requestData.append("firstName", firstName);
    requestData.append("middleName", middleName);
    requestData.append("lastName", lastName);
    findStudent(requestData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          MyNotifications.fire({
            is_button_show: true,
            show: true,
            icon: "error",
            title: "Warning",
            msg: "Student is already registered with same name!",
          });
          console.log("Student already registered");
          setFieldValue("firstName", "");
          setFieldValue("middleName", "");
          setFieldValue("lastName", "");
        } else {
          setFieldValue("firstName", firstName);
          setFieldValue("middleName", middleName);
          setFieldValue("lastName", lastName);
        }
      })
      .catch((error) => {
        this.setState({ foundStudent: "" });
        console.log("error", error);
      });
  };

  getCategoryData = (id) => {
    let requestData = new FormData();
    requestData.append("subCasteId", id);
    getCategoryBySubCaste(requestData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.categoryName };
            });
            this.setState({ opCategoryList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opCategoryList: [] });
        console.log("error", error);
      });
  };

  getReligionData = () => {
    getReligion()
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.religionName };
            });
            this.setState({ opReligionList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opReligionList: [] });
        console.log("error", error);
      });
  };

  getSubCasteData = (casteId) => {
    let reqData = new FormData();
    reqData.append("casteId", casteId);
    getSubCasteByCaste(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.SubCasteName };
            });
            this.setState({ opSubCasteList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opSubCasteList: [] });
        console.log("error", error);
      });
  };

  goToNextPage = (values) => {
    let { step } = this.state;
    this.setState({ initVal: values, step: step + 1 });
  };

  getAge = (dateString, setFieldValue) => {
    console.log({ dateString });
    let today = new Date();
    dateString = moment(dateString).format("YYYY-MM-DD");
    console.log({ dateString });
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    // console.log({ age });
    if (age < 18) {
      console.log("hello he is below 18");
      this.setState({ ageStatus: age });
    }
    setFieldValue("age", age);
    return age;
  };

  handleStateData = (object) => {
    this.setState(object);
  };
  componentDidMount() {
    this.getBranchData();
    this.getMothertongueData();
    this.getReligionData();

    let { initVal, options } = this.state;
    initVal["isHostel"] = options[1];
    initVal["isBusConcession"] = options[1];
    initVal["isVacation"] = options[1];
    initVal["isScholarship"] = options[1];
    initVal["nts"] = options[1];
    initVal["foundation"] = options[1];
    initVal["mts"] = options[1];
    this.setState({ initVal: initVal });
  }
  render() {
    let {
      active_tab,
      nationality_options,
      step,
      religionModalShow,
      opAcademicYearList,
      opBranchList,
      opMotherTongueList,
      opCasteList,
      opReligionList,
      opCategoryList,
      opSubCasteList,
      opStudTypeList,
      opStandardList,
      opDivisionList,
      result_options,
      options,
      typeoptions,
      initVal,
      religion_data,
      VALIDATION,
      studentTypeOptions,
      studentGroupOptions,
    } = this.state;

    return (
      <div>
        <div className="common-form-style m-2">
          <div className="main-div mb-2 m-0">
            <h4 className="form-header"> Student Admission </h4>
            <div class="row" style={{ justifyContent: "center" }}>
              <div class="col-md-7">
                <ul class="stepper stepper-horizontal">
                  <li
                    // class={"completed-step"}
                    class={`${
                      step == 1
                        ? "active-step"
                        : step == 2
                        ? "completed-step"
                        : step == 3
                        ? "completed-step"
                        : "active-step"
                    }`}
                  >
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ step: 1 });
                      }}
                    >
                      <span class="circle">Step 1</span>
                      <br />
                      <span class="label">Student Information</span>
                    </a>
                  </li>

                  <li
                    // class={"active-step"}
                    class={`${
                      step == 2
                        ? "active-step"
                        : step == 3
                        ? "completed-step"
                        : "deactive-step"
                    }`}
                  >
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ step: 2 });
                      }}
                    >
                      <span class="circle">Step 2</span>
                      <br />
                      <span class="label">Family Information</span>
                    </a>
                  </li>

                  <li
                    // class={"deactive-step"}
                    class={`${step == 3 ? "active-step" : "deactive-step"}`}
                  >
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ step: 3 });
                      }}
                    >
                      <span class="circle">Step 3</span>
                      <br />
                      <span class="label">Last School Life</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <Formik
              innerRef={this.myRef}
              enableReinitialize={true}
              initialValues={initVal}
              validateOnChange={false}
              validateOnBlur={true}
              validationSchema={VALIDATION[step]}
              onSubmit={(values, { resetForm, setStatus, setSubmitting }) => {
                console.log({ step });
                if (step < 3) {
                  this.goToNextPage(values);
                } else if (step == 3) {
                  this.setState({ isLoading: true });
                  let keys = Object.keys(initVal);
                  console.log("values", values);
                  console.log("keys", keys);
                  let requestData = new FormData();

                  keys.map((v) => {
                    console.log("v", v);
                    if (
                      values[v] != "" &&
                      v != "branchId" &&
                      v != "motherTongueId" &&
                      v != "nationalityId" &&
                      v != "casteId" &&
                      v != "religionId" &&
                      v != "subCasteId" &&
                      v != "categoryId" &&
                      v != "result" &&
                      v != "academicYearId" &&
                      v != "admittedStandardId" &&
                      v != "currentStandardId" &&
                      v != "divisionId" &&
                      v != "studentType" &&
                      v != "isHostel" &&
                      v != "isBusConcession" &&
                      v != "isVacation" &&
                      v != "isScholarship" &&
                      v != "studentIsOld" &&
                      v != "nts" &&
                      v != "dob" &&
                      v != "doa" &&
                      v != "studentGroup" &&
                      v != "foundation" &&
                      v != "mts"
                    ) {
                      requestData.append(v, values[v]);
                    }
                  });

                  if (values.dob != null && values.dob != "") {
                    requestData.append(
                      "dob",
                      moment(values.dob).format("yyyy-MM-DD")
                    );
                  }

                  if (values.saralId != null && values.saralId != "") {
                    requestData.append("saralId", values.saralId);
                  }

                  if (
                    values.generalRegisterNo != null &&
                    values.generalRegisterNo != ""
                  ) {
                    requestData.append(
                      "generalRegisterNo",
                      values.generalRegisterNo
                    );
                  }

                  if (values.doa != null && values.doa != "") {
                    requestData.append(
                      "doa",
                      moment(values.doa).format("yyyy-MM-DD")
                    );
                  }
                  requestData.append("branchId", values.branchId.value);
                  if (
                    values.motherTongueId != "" &&
                    values.motherTongueId != null &&
                    values.motherTongueId != undefined
                  ) {
                    requestData.append(
                      "motherTongueId",
                      values.motherTongueId.value
                    );
                  }

                  if (
                    values.nationalityId != "" &&
                    values.nationalityId != null &&
                    values.nationalityId != undefined
                  ) {
                    requestData.append(
                      "nationalityId",
                      values.nationalityId.value
                    );
                  }
                  if (
                    values.religionId != "" &&
                    values.religionId != null &&
                    values.religionId != undefined
                  ) {
                    requestData.append("religionId", values.religionId.value);
                  }
                  if (
                    values.casteId != "" &&
                    values.casteId != null &&
                    values.casteId != undefined
                  ) {
                    requestData.append("casteId", values.casteId.value);
                  }
                  if (
                    values.subCasteId != "" &&
                    values.subCasteId != null &&
                    values.subCasteId != undefined
                  ) {
                    requestData.append("subCasteId", values.subCasteId.value);
                  }
                  if (
                    values.categoryId != "" &&
                    values.categoryId != null &&
                    values.categoryId != undefined
                  ) {
                    requestData.append("categoryId", values.categoryId.value);
                  }
                  if (values.result != null && values.result != "") {
                    requestData.append("result", values.result.value);
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
                    values.studentIsOld != "" &&
                    values.studentIsOld != null &&
                    values.studentIsOld != undefined
                  ) {
                    requestData.append(
                      "studentIsOld",
                      values.studentIsOld.value
                    );
                  }
                  if (
                    values.studentIsOld != null &&
                    values.studentIsOld != "" &&
                    values.studentIsOld.value == 1
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
                  requestData.append("isHostel", values.isHostel.value);
                  requestData.append(
                    "isBusConcession",
                    values.isBusConcession.value
                  );
                  requestData.append("isVacation", values.isVacation.value);

                  requestData.append(
                    "isScholarship",
                    values.isScholarship.value
                  );
                  requestData.append("nts", values.nts.value);
                  requestData.append("foundation", values.foundation.value);
                  requestData.append("mts", values.mts.value);

                  if (
                    values.studentGroup != null &&
                    values.studentGroup != ""
                  ) {
                    requestData.append(
                      "studentGroup",
                      values.studentGroup.value
                    );
                  }

                  // List key/value pairs
                  for (let [name, value] of requestData) {
                    console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                  }

                  createStudent(requestData)
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
                        eventBus.dispatch("page_change", "studentList");
                      } else {
                        setSubmitting(false);
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: response.data.message,
                          is_timeout: true,
                          delay: 1000,
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
                }
              }}
              render={({
                errors,
                status,
                touched,
                isSubmitting,
                handleChange,
                handleSubmit,
                handleReset,
                setFieldValue,
                values,
              }) => (
                <Form
                  autoComplete="off"
                  onSubmit={handleSubmit}
                  // onReset={handleReset}
                >
                  <Tab.Container
                    id="left-tabs-example"
                    defaultActiveKey={step}
                    activeKey={step}
                  >
                    <Tab.Content className="p-5 pt-0 ">
                      {/* <Tab.Content className="p-5 pt-0 pb-0 overflow-auto"> */}
                      <Tab.Pane eventKey="1">
                        <SStep1
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                          values={values}
                          errors={errors}
                          touched={touched}
                          religionModalShow={religionModalShow}
                          is_edit={false}
                          religion_data={religion_data}
                          opBranchList={opBranchList}
                          opMotherTongueList={opMotherTongueList}
                          opCasteList={opCasteList}
                          opSubCasteList={opSubCasteList}
                          opCategoryList={opCategoryList}
                          nationality_options={nationality_options}
                          opReligionList={opReligionList}
                          findStudentData={this.findStudentData}
                          getCasteData={this.getCasteData}
                          getAge={this.getAge}
                          getSubCasteData={this.getSubCasteData}
                          handleReligionModalShow={this.handleReligionModalShow}
                          getCategoryData={this.getCategoryData}
                          handleStateData={this.handleStateData}
                          getStandardData={this.getStandardData}
                          getAcademicYearData={this.getAcademicYearData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey="2">
                        <SStep2
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                          values={values}
                          errors={errors}
                          is_edit={false}
                          handleStateData={this.handleStateData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey="3">
                        <SStep3
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                          values={values}
                          errors={errors}
                          is_edit={false}
                          result_options={result_options}
                          opAcademicYearList={opAcademicYearList}
                          opStandardList={opStandardList}
                          opDivisionList={opDivisionList}
                          opStudTypeList={opStudTypeList}
                          options={options}
                          typeoptions={typeoptions}
                          studentTypeOptions={studentTypeOptions}
                          studentGroupOptions={studentGroupOptions}
                          getDivisionData={this.getDivisionData}
                          handleStateData={this.handleStateData}
                        />
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>

                  <hr className="horizontalline"></hr>
                  <div className="p-2 text-center fourbtnfeestrans">
                    <>
                      {step == 3 && Object.keys(errors).length > 0 ? (
                        <>
                          <div className="text-center mb-2"></div>
                          <div className={"alert alert-danger"}>
                            Please fill-up First Name & Last Name fields
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      <Button
                        type="submit"
                        className="submitbtn formbtn affiliated"
                        onClick={(e) => {
                          e.preventDefault();
                          if (step != 1) {
                            let { step } = this.state;
                            let nstep = step - 1;
                            this.setState({ step: nstep });
                          }
                        }}
                      >
                        Prev
                        <img src={previous} alt="" className="btsubmit "></img>
                      </Button>
                    </>
                    {step != 3 && (
                      <Button
                        type="submit"
                        className="submitbtn formbtn affiliated"
                      >
                        Next
                        <img src={arrowicon} alt="" className="btnico"></img>
                      </Button>
                    )}{" "}
                    {step == 3 && (
                      <>
                        <Button
                          type="submit"
                          className="submitbtn formbtn affiliated"
                        >
                          Save
                          <img src={save} alt="" className="btsubmit "></img>
                        </Button>
                      </>
                    )}
                    <Button
                      className="submitbtn cancelbtn formbtn affiliated"
                      variant="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        if (isActionExist("student-list", "create")) {
                          eventBus.dispatch("page_change", "studentList");
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
                      Cancel
                      <img src={cancel} alt="" className="btsubmit "></img>
                    </Button>
                  </div>
                </Form>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}
