import React from "react";
import { Button, Col, Row, Form, FormControl, Tab } from "react-bootstrap";
import { Formik } from "formik";
import save from "@/assets/images/3x/save.png";
import cancel from "@/assets/images/3x/cancel.png";
import arrowicon from "@/assets/images/3x/arrowicon.png";
import previous from "@/assets/images/3x/previous.png";
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
  updateStudent,
  getStudentRegisterbyId,
  findStudent,
} from "@/services/api_functions";

import moment from "moment";

import {
  isActionExist,
  eventBus,
  MyNotifications,
  getSelectValue,
  getValue,
} from "@/helpers";

export default class StudentAdmissionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      active_tab: "1",
      step: 1,
      initVal: {
        // Step1
        id: "",
        branchId: "",
        fullName: "",
        firstName: "",
        middleName: "",
        lastName: "",
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

        // Step2
        fatherName: "",
        fatherOccupation: "",
        motherName: "",
        motherOccupation: "",
        officeAddress: "",
        currentAddress: "",
        sameAsCurrentAddress: "",
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
      studEditData: "",
      isEditDataSet: false,

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
          firstName: Yup.string().trim().required("First Name is Required !"),
          lastName: Yup.string().trim().required("LastName is Required !"),
        }),
        2: Yup.object().shape({}),
        3: Yup.object().shape({
          firstName: Yup.string().trim().required("First Name is Required !"),
          lastName: Yup.string().trim().required("Last Name is Required"),
        }),
      },
      isReqSent: false,
    };
  }

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
          this.setState({ opBranchList: Opt });
        }
      })
      .catch((error) => {
        this.setState({ opBranchList: [] });
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

  getCasteData = (religionId, casteId = null, studObj = null) => {
    let requestData = new FormData();
    requestData.append("religionId", religionId);
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
            this.setState({ opCasteList: Opt }, () => {
              if (casteId != null) {
                let { initVal } = this.state;
                initVal["casteId"] = getSelectValue(Opt, parseInt(casteId));
                this.setState({ initVal: initVal }, () => {
                  if (studObj.subCasteId != null && studObj.subCasteId != "") {
                    this.getSubCasteData(casteId, studObj.subCasteId);
                  }
                });
              }
            });
          }
        }
      })
      .catch((error) => {
        this.setState({ opCasteList: [] });
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

  getSubCasteData = (casteId, subCasteId = null, studObj = null) => {
    console.log({ casteId, subCasteId, studObj });
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
            this.setState({ opSubCasteList: Opt }, () => {
              if (subCasteId != null) {
                let { initVal } = this.state;
                initVal["subCasteId"] = getSelectValue(
                  Opt,
                  parseInt(subCasteId)
                );
                this.setState({ initVal: initVal });
              }
            });
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

  handleStateData = (object) => {
    this.setState(object);
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

  setStudEditData = () => {
    if (this.state.studEditData) {
      this.setState({ isReqSent: true }, () => {
        let id = this.state.studEditData.id;
        let formData = new FormData();

        formData.append("id", id);

        getStudentRegisterbyId(formData)
          .then((response) => {
            console.log("response", response);

            let res1 = response.data;
            console.log("res1", res1);
            if (res1.responseStatus == 200) {
              const {
                opBranchList,
                opMotherTongueList,
                nationality_options,
                opReligionList,
                result_options,
                options,
                typeoptions,
                studentTypeOptions,
                studentGroupOptions,
              } = this.state;
              let res = res1.data;
              console.log(
                "result==========------------------->>>>>>>>>>>>>>>>>",
                res
              );

              let data = {
                id: res.id,
                branchId: res.branchId
                  ? getSelectValue(opBranchList, res.branchId)
                  : "",
                firstName: res.firstName ? res.firstName : "",
                middleName: res.middleName ? res.middleName : "",
                lastName: res.lastName ? res.lastName : "",

                gender: res.gender ? res.gender : "",
                dob: res.dob ? moment(res.dob).toDate() : "",
                age: res.age ? res.age : "",
                birthPlace: res.birthplace ? res.birthplace : "",
                motherTongueId: res.motherTongueId
                  ? getSelectValue(
                      opMotherTongueList,
                      parseInt(res.motherTongueId)
                    )
                  : "",
                nationalityId:
                  res.nationalityId != null
                    ? getSelectValue(
                        nationality_options,
                        parseInt(res.nationalityId)
                      )
                    : "",
                religionId:
                  res.religionId != null
                    ? getSelectValue(opReligionList, parseInt(res.religionId))
                    : "",
                casteId: res.casteId != null ? res.casteId : "",
                subCasteId: res.subCasteId != null ? res.subCasteId : "",
                categoryId:
                  res.categoryId != null
                    ? getSelectValue(opReligionList, parseInt(res.categoryId))
                    : "",
                hometown: res.hometown != null ? res.hometown : "",
                saralId: res.saralId != null ? res.saralId : "",
                aadharNo: res.aadharNo != null ? res.aadharNo : "",
                studentImage: "",

                // // // Step2
                fatherName: res.fatherName != null ? res.fatherName : "",
                fatherOccupation:
                  res.fatherOccupation != null ? res.fatherOccupation : "",
                motherName: res.motherName != null ? res.motherName : "",
                motherOccupation:
                  res.motherOccupation != null ? res.motherOccupation : "",
                officeAddress:
                  res.officeAddress != null ? res.officeAddress : "",
                currentAddress:
                  res.currentAddress != null ? res.currentAddress : "",
                sameAsCurrentAddress:
                  res.sameAsCurrentAddress != true ? true : false,
                permanentAddress: res.permanentAddress
                  ? res.permanentAddress
                  : "",
                phoneNoHome: res.phoneNoHome ? res.phoneNoHome : "",
                alternativeMobileNo:
                  res.alternativeMobileNo != null
                    ? res.alternativeMobileNo
                    : "",
                mobileNo: res.mobileNo != null ? res.mobileNo : "",
                emailId: res.emailId != null ? res.emailId : "",
                fatherImage: "",
                motherImage: "",
                // // // Step3
                generalRegisterNo:
                  res.generalRegisterNo != null ? res.generalRegisterNo : "",
                nameOfPrevSchool:
                  res.nameOfPrevSchool != null ? res.nameOfPrevSchool : "",
                stdInPrevSchool:
                  res.stdInPrevSchool != null ? res.stdInPrevSchool : "",
                result:
                  res.result != null
                    ? getSelectValue(result_options, res.result)
                    : "",
                doa:
                  res.dateOfAdmission != null && res.dateOfAdmission != ""
                    ? moment(res.dateOfAdmission).toDate()
                    : "",
                academicYearId:
                  res.academicYearId != null ? res.academicYearId : "",
                admittedStandardId:
                  res.admittedStandardId != null ? res.admittedStandardId : "",
                currentStandardId:
                  res.currentStandardId != null ? res.currentStandardId : "",
                divisionId: res.divisionId != null ? res.divisionId : "",
                studentType:
                  res.studType != null
                    ? getSelectValue(studentTypeOptions, parseInt(res.studType))
                    : "",
                studentGroup:
                  res.studentGroup != null
                    ? getSelectValue(
                        studentGroupOptions,
                        parseInt(res.studentGroup)
                      )
                    : "",
                isHostel:
                  res.isHostel != null
                    ? getSelectValue(options, res.isHostel)
                    : "",
                isBusConcession:
                  res.isBusConcession != null
                    ? getSelectValue(options, res.isBusConcession)
                    : "",
                isVacation:
                  res.isVacation != null
                    ? getSelectValue(options, res.isVacation)
                    : "",

                busConcessionAmount:
                  res.busConcessionAmount != null
                    ? res.busConcessionAmount
                    : "",
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
              console.log("data===----->>>????", data);

              this.setState(
                {
                  initVal: data,
                  isEditDataSet: true,
                  isReqSent: false,
                },
                () => {
                  this.getAcademicYearData(
                    data.branchId.value,
                    data.academicYearId,
                    data
                  );
                  this.getStandardData(
                    data.branchId.value,
                    data.currentStandardId,
                    data.admittedStandardId,
                    data
                  );

                  if (data.religionId != null && data.religionId != "") {
                    this.getCasteData(
                      data.religionId.value,
                      data.casteId,
                      data
                    );
                  }
                }
              );
            }
          })
          .catch((error) => {
            this.setState({ isReqSent: false });
            console.log("error");
          });
      });
    }
  };
  componentDidMount() {
    this.getBranchData();
    this.getMothertongueData();
    this.getReligionData();

    console.log("this.props ", this.props);
    const { prop_data } = this.props.block;
    console.log("props_data", prop_data);
    this.setState({ studEditData: prop_data });
  }

  componentDidUpdate() {
    const {
      opBranchList,
      studEditData,
      isEditDataSet,
      opMotherTongueList,
      nationality_options,
      opReligionList,
      result_options,
      options,
      typeoptions,
      studentTypeOptions,
      studentGroupOptions,
      isReqSent,
    } = this.state;
    if (
      opBranchList.length > 0 &&
      opMotherTongueList.length > 0 &&
      nationality_options.length > 0 &&
      opReligionList.length > 0 &&
      result_options.length > 0 &&
      options.length > 0 &&
      typeoptions.length > 0 &&
      studentTypeOptions.length > 0 &&
      studentGroupOptions.length > 0 &&
      isEditDataSet == false &&
      isReqSent == false &&
      studEditData != ""
    ) {
      this.setStudEditData();
      // this.EditData();
    }
  }

  render() {
    let {
      active_tab,
      nationality_options,
      step,
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
      VALIDATION,
      studentTypeOptions,
      studentGroupOptions,
      studEditData,
    } = this.state;

    return (
      <div>
        <div id="example-collapse-text" className="common-form-style m-2">
          <div className="main-div mb-2 m-0">
            <h4 className="form-header"> Student Admission {step}</h4>
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
              enableReinitialize={true}
              initialValues={initVal}
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
                      v != "studentGroup"
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

                  updateStudent(requestData)
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
                        // eventBus.dispatch("page_change", "studentList");

                        eventBus.dispatch("page_change", {
                          from: "studentadmissionedit",
                          to: "studentList",
                          prop_data: studEditData,
                          isNewTab: false,
                        });
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
                    {/* {JSON.stringify(values)} */}
                    <Tab.Content className="p-5 pt-0">
                      <Tab.Pane eventKey="1">
                        <SStep1
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                          values={values}
                          errors={errors}
                          touched={touched}
                          is_edit={false}
                          findStudentData={this.findStudentData}
                          opBranchList={opBranchList}
                          opMotherTongueList={opMotherTongueList}
                          opCasteList={opCasteList}
                          opSubCasteList={opSubCasteList}
                          opCategoryList={opCategoryList}
                          nationality_options={nationality_options}
                          opReligionList={opReligionList}
                          getCasteData={this.getCasteData}
                          getAge={this.getAge}
                          getSubCasteData={this.getSubCasteData}
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
                          touched={touched}
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
                          touched={touched}
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
                          // eventBus.dispatch("page_change", "studentList");

                          eventBus.dispatch("page_change", {
                            from: "studentadmissionedit",
                            to: "studentList",
                            prop_data: studEditData,
                            isNewTab: false,
                          });
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

/*
{step == 3 && Object.keys(errors).length > 0 ? (
                      <>
                        <div className="text-center mb-2"></div>
                        <div className={"alert alert-danger"}>
                          Please fill-up FirstName & LastName fields
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    {step != 1 && (
                      <>
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
                          <img
                            src={previous}
                            alt=""
                            className="btsubmit "
                          ></img>
                        </Button>
                      </>
                    )}
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
                        eventBus.dispatch("page_change", "studentList");
                        // if (isActionExist("productlist", "create")) {
                        // } else {
                        //   MyNotifications.fire({
                        //     show: true,
                        //     icon: "error",
                        //     title: "Error",
                        //     msg: "Permission is denied!",
                        //     is_button_show: true,
                        //   });
                        // }
                      }}
                    >
                      Cancel
                      <img src={cancel} alt="" className="btsubmit "></img>
                    </Button>


*/
