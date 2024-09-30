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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  authenticationService,
  getAcademicYearByBranch,
  getBranchesByInstitute,
  getStandardsByBranch,
  getDivisionsByStandard,
  getDailyCollection,
  deleteFeestransaction,
} from "@/services/api_functions";
import {
  exportDailycollectionDataURL,
  exportFeesPaymentSheetForTallyURL,
} from "@/services/api";
import excel from "@/assets/images/3x/excel.png";

import moment from "moment";

import Select from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  AuthenticationCheck,
  customStyles,
  getSelectValue,
  MyNotifications,
  eventBus,
  MyDatePicker,
  getHeader,
  isActionExist,
  numberWithCommasIN,
} from "@/helpers";

import "mousetrap-global-bind";
import arrowicon from "@/assets/images/3x/arrowicon.png";
import delete_ from "@/assets/images/3x/delete_.png";
import reset from "@/assets/images/reset.png";

export default class DailyCollection extends React.Component {
  constructor() {
    super();
    this.transFormRef = React.createRef();

    this.state = {
      opInstituteList: [],
      opBranchList: [],
      opAcademicYearList: [],
      opStandardList: [],
      opDivisionId: [],
      data: [],
      opStudentList: [],
      optRollno: [],
      payheadList: [],
      installments: [],
      concessions: [],
      installArray: [],
      searchOpt: [],
      searchVisible: false,
      initVal: {
        id: "",
        instituteId: "",
        transactionDate: new Date(),
        branchId: "",
        academicYearId: "",
        standardId: "",
        divisionId: "",
        studentId: "",
        fromDate: "",
        toDate: "",
        feesMasterId: "",
        transactionId: "",
        outstanding: "",
        totalFees: "",
        payable: "",
        studentType: "",
        installmentNo: "",
        IsInstallment: "no",
        concessionNo: "",
        isManual: "",
        studentType: "",
      },
      studentTypeOptions: [
        { label: "All", value: 3 },
        { label: "Day School", value: 1 },
        { label: "Residential", value: 2 },
      ],
      installmentNo: "",
      outstandingAmount: 0,
      isFirstTime: true,
    };
    this.ref = React.createRef();
  }

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  getDailyCollectionList = () => {
    let {
      branchId,
      fromDate,
      toDate,
      standardId,
      academicYearId,
      studentType,
    } = this.state.initVal;

    console.log("this.state.initVal ", {
      branchId,
      fromDate,
      toDate,
      standardId,
      academicYearId,
      studentType,
    });

    // let fd = moment(fromDate).format("YYYY-MM-DD");
    console.log("fd--->", fromDate);
    // let td = moment(toDate).format("YYYY-MM-DD");
    let requestData = new FormData();
    requestData.append("branchId", branchId.value);

    let fd = "";
    let td = "";

    if (fromDate != "") {
      fd = moment(fromDate).format("YYYY-MM-DD");
    }
    requestData.append("fromDate", fd);

    if (toDate != "") {
      td = moment(toDate).format("YYYY-MM-DD");
    }
    requestData.append("toDate", td);

    let sd = "";
    if (standardId != "") {
      sd = standardId.value;
    }
    requestData.append("standardId", sd);

    let ad = "";

    if (academicYearId != "") {
      ad = academicYearId.value;
    }
    requestData.append("academicyearId", ad);

    let studType = "";

    if (studentType != "") {
      studType = studentType.value;
    }
    requestData.append("studentType", studType);
    getDailyCollection(requestData).then((response) => {
      let res = response.data;
      console.log("res", res);
      let d = res.response;
      if (res.responseStatus === 200) {
        let opt = d.map(function (values) {
          return { value: values.paidAmount, label: values.studentName };
        });
        console.log("d", d);
        this.setState(
          {
            opStudentList: d,
            searchOpt: d,
          },
          () => {
            this.transFormRef.current.setFieldValue("search", "");

            if (this.state.opStudentList.length > 0) {
              this.setState({ searchVisible: true });
            }
          }
        );
      }
    });
  };

  handleSearch = (vi) => {
    let { searchOpt } = this.state;
    console.log({ searchOpt });
    let orgData_F = searchOpt.filter(
      (v) =>
        v.firstName != null &&
        v.lastName != null &&
        v.receiptNo != null &&
        (v.firstName.toLowerCase().includes(vi.toLowerCase()) ||
          v.lastName.toLowerCase().includes(vi.toLowerCase()) ||
          v.receiptNo.toLowerCase().includes(vi.toLowerCase()))
    );
    this.setState({
      opStudentList: orgData_F.length > 0 ? orgData_F : searchOpt,
    });
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
            this.transFormRef.current.setFieldValue("branchId", branchId);
            let { initVal } = this.state;
            initVal["branchId"] = branchId;
            this.setState(
              {
                initVal: initVal,
              },
              () => {
                this.getDailyCollectionList();
                this.getAcademicYearData(branchId.value);
                this.getStandardData(branchId.value);
              }
            );
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

            Opt = [
              {
                value: "all",
                label: "All",
              },
              ...Opt,
            ];
            this.setState({ opStandardList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opStandardList: [] });
        console.log("error", error);
      });
  };

  DeleteFeesTransactions = (transactionId, receiptNo) => {
    let requestData = new FormData();
    requestData.append("transactionId", transactionId);
    requestData.append("receiptNo", receiptNo);

    deleteFeestransaction(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: "Deleted Fees Record Succesfully !",
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

  DeleteNoFun = (transactionId, receiptNo) => {
    console.log({ transactionId, receiptNo });
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

  exportDailyCollectionData = (opStudentList) => {
    if (opStudentList.length > 0) {
      let requestData = {
        studentList: JSON.stringify(opStudentList),
      };

      const requestOption = {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(requestData),
      };

      let filename =
        "Daily_Collection_" + moment().format("YYYY-MM-DD HH:MM:ss") + ".xlsx";

      return fetch(exportDailycollectionDataURL(), requestOption)
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
        title: "Error",
        msg: "Data should be exists!",
        is_button_show: false,
      });
    }
  };

  exportFeesPaymentSheetForTally = (values) => {
    let requestData = {
      academicYearId: values.academicYearId.value,
      standardId: values.standardId.value,
      studentType: values.studentType.value,
      fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values.toDate).format("YYYY-MM-DD"),
    };

    let standardName =
      values.standardId != null && values.standardId != ""
        ? values.standardId.label
        : "";
    let sType = values.studentType;
    if (values.studentType.value == 1) {
      sType = "DES";
    } else {
      sType = "RES";
    }
    const requestOption = {
      method: "POST",
      headers: getHeader(),
      body: JSON.stringify(requestData),
    };

    let filename =
      // "tally_import_" + moment().format("YYYY-MM-DD HH:MM:ss") + ".xlsx";
      "tally_import_" + sType + "_" + standardName + "th" + ".xlsx";

    return fetch(exportFeesPaymentSheetForTallyURL(), requestOption)
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
  };

  setInitValue() {
    let { opBranchList } = this.state;
    this.setState({
      initVal: {
        id: "",
        // instituteId: "",
        branchId: getSelectValue(
          opBranchList,
          authenticationService.currentUserValue.branchId
        ),
        academicYearId: "",
        standardId: "",
        fromDate: "",
        toDate: "",
        divName: "",
        studentName: "",
        outstanding: "",
        totalFees: "",
        payment: "",
        installmentNo: "",
        studentType: "",
        searchVisible: false,
      },
      opStudentList: [],
    });
  }

  handleFilterData = (prop_data) => {
    if (prop_data != "") {
      this.setState({ filterDetails: prop_data.filterData }, () => {
        // console.log("props_data=-> ", prop_data.filterData);
        if (
          prop_data.filterData != undefined &&
          prop_data.filterData != "" &&
          prop_data.filterData.academicYearId != ""
        ) {
          this.transFormRef.current.setFieldValue(
            "academicYearId",
            prop_data.filterData.academicYearId
          );
        }
        if (
          prop_data.filterData != undefined &&
          prop_data.filterData != "" &&
          prop_data.filterData.standardId != ""
        ) {
          this.transFormRef.current.setFieldValue(
            "standardId",
            prop_data.filterData.standardId
          );
        }
        if (
          prop_data.filterData != undefined &&
          prop_data.filterData != "" &&
          prop_data.filterData.studentType != ""
        ) {
          this.transFormRef.current.setFieldValue(
            "studentType",
            prop_data.filterData.studentType
          );
        }
        if (
          prop_data.filterData != undefined &&
          prop_data.filterData != "" &&
          prop_data.filterData.fromDate != ""
        ) {
          this.transFormRef.current.setFieldValue(
            "fromDate",
            prop_data.filterData.fromDate
          );
        }
        if (
          prop_data.filterData != undefined &&
          prop_data.filterData != "" &&
          prop_data.filterData.toDate != ""
        ) {
          this.transFormRef.current.setFieldValue(
            "toDate",
            prop_data.filterData.toDate
          );
        }

        if (this.transFormRef.current) {
          setTimeout(() => {
            this.transFormRef.current.handleSubmit();
          }, 100);
          // if (
          //   prop_data.filterData != undefined &&
          //   prop_data.filterData != "" &&
          //   prop_data.filterData.search != ""
          // ) {
          //   setTimeout(() => {
          //     this.handleSearch(this.state.filterData.search);
          //   }, 2000);
          // }
        }
      });
    }
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getBranchData();
      // this.getDailyCollectionList();
      const { prop_data } = this.props.block;
      this.handleFilterData(prop_data);
    }
  }

  pageReload = () => {
    this.componentDidMount();
  };

  render() {
    const {
      initVal,
      opBranchList,
      opDivisionList,
      opStandardList,
      opAcademicYearList,
      opStudentList,
      payheadList,
      optRollno,
      studentTypeOptions,
      installments,
      concessions,
      installArray,
      searchVisible,
    } = this.state;

    return (
      <div className="">
        <Formik
          innerRef={this.transFormRef}
          initialValues={initVal}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            academicYearId: Yup.object().required("required"),
            standardId: Yup.object().required("required"),
            studentType: Yup.object().required("required"),
            fromDate: Yup.string().required("required"),
            toDate: Yup.string().required("required"),
          })}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            // this.setState({ isLoading: true });
            setSubmitting(false);
            this.setState({ initVal: values }, () => {
              this.getDailyCollectionList();
            });
            // console.log({ values });
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
              className="form-style"
            >
              <div
                id="example-collapse-text"
                className="common-form-style mt-2 p-2"
              >
                <div className="main-divform mb-2 m-0">
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
                                  setFieldValue("academicYearId", "");
                                  if (v != null) {
                                    setFieldValue("academicYearId", v);
                                  }
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
                                }}
                              />
                              <span className="text-danger errormsg">
                                {errors.studentType}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col lg="2" md="2">
                            <Form.Label className="formlabelsize">
                              From Date
                            </Form.Label>
                            <MyDatePicker
                              className="datepic form-control"
                              styles={customStyles}
                              name="fromDate"
                              placeholderText="dd/MM/yyyy"
                              id="fromDate"
                              dateFormat="dd/MM/yyyy"
                              value={values.fromDate}
                              onChange={(date) => {
                                setFieldValue("fromDate", date);
                                // getAge(date, setFieldValue);
                              }}
                              selected={values.fromDate}
                              maxDate={new Date()}
                            />
                            <span className="text-danger errormsg">
                              {errors.fromDate}
                            </span>
                          </Col>
                          <Col lg="2" md="2">
                            <Form.Label className="formlabelsize">
                              ToDate
                            </Form.Label>
                            <MyDatePicker
                              className="datepic form-control"
                              styles={customStyles}
                              name="toDate"
                              placeholderText="dd/MM/yyyy"
                              id="toDate"
                              dateFormat="dd/MM/yyyy"
                              value={values.toDate}
                              onChange={(date) => {
                                setFieldValue("toDate", date);
                                // getAge(date, setFieldValue);
                              }}
                              selected={values.toDate}
                              maxDate={new Date()}
                            />
                            <span className="text-danger errormsg">
                              {errors.toDate}
                            </span>
                          </Col>

                          <Col
                            lg="4"
                            md="2"
                            xs={12}
                            className="add-btn-style mt-4"
                          >
                            <Button type="submit" className="submitbtn me-2">
                              Submit
                              <img
                                src={arrowicon}
                                className="btnico ms-1"
                              ></img>
                            </Button>

                            <Button
                              type="button"
                              className="cancelbtn submitbtn"
                              variant="secondary"
                              onClick={(e) => {
                                e.preventDefault();
                                this.transFormRef.current.resetForm();
                                this.setInitValue();
                              }}
                            >
                              Reset
                              <img src={reset} className="btnico ms-1"></img>
                            </Button>

                            <Button
                              type="button"
                              className="cancelbtn submitbtn"
                              variant="secondary"
                              onClick={(e) => {
                                e.preventDefault();
                                this.exportDailyCollectionData(opStudentList);
                              }}
                            >
                              Export Data
                              <img src={excel} className="btnico ms-1"></img>
                            </Button>

                            <Button
                              type="button"
                              className="cancelbtn submitbtn"
                              variant="secondary"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  values.academicYearId != "" &&
                                  values.standardId != "" &&
                                  values.studentType != "" &&
                                  values.fromDate != "" &&
                                  values.toDate != ""
                                ) {
                                  this.exportFeesPaymentSheetForTally(values);
                                }
                              }}
                            >
                              Export Tally Data
                              <img src={excel} className="btnico ms-1"></img>
                            </Button>
                          </Col>
                          {opStudentList && opStudentList.length > 0 ? (
                            <>
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
                            </>
                          ) : (
                            ""
                          )}
                        </Row>
                      </Col>
                    </Row>

                    <div className="table_wrapper p-2 denomination-style">
                      <Table hover size="sm" className="tbl-font">
                        <thead>
                          <tr>
                            <th>#.</th>
                            <th>Student Name</th>
                            <th>ReceiptNo</th>
                            <th>Transaction Date</th>
                            <th>Standard</th>
                            <th>Concession Amount</th>
                            <th>Paid Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="tabletrcursor">
                          {/* {JSON.stringify(opStudentList)} */}

                          {opStudentList.length > 0 ? (
                            opStudentList.map((v, i) => {
                              let studName = "";

                              if (v.lastName != null) {
                                studName = v.lastName;
                              }
                              if (v.firstName != null) {
                                studName = studName + " " + v.firstName;
                              }
                              if (v.middleName != null) {
                                studName = studName + " " + v.middleName;
                              }
                              return (
                                <tr
                                  // onDoubleClick={(e) => {
                                  //   e.preventDefault();

                                  //   let propData = {
                                  //     transactionId: v.transactionId,
                                  //     lastReceiptNo: v.receiptNo,
                                  //   };
                                  //   eventBus.dispatch("page_change", {
                                  //     from: "dailycollection",
                                  //     to: "studentcopywithstructure",
                                  //     prop_data: propData,
                                  //     isNewTab: true,
                                  //   });
                                  // }}

                                  onDoubleClick={(e) => {
                                    e.preventDefault();

                                    let propData = {
                                      transactionId: v.transactionId,
                                      lastReceiptNo: v.receiptNo,
                                      filterData:
                                        this.transFormRef.current &&
                                        this.transFormRef.current.values,
                                    };
                                    eventBus.dispatch("page_change", {
                                      from: "dailycollection",
                                      to: "studentcopywithstructure",
                                      prop_data: propData,
                                      isNewTab: false,
                                    });
                                  }}
                                >
                                  <td>{i + 1}</td>
                                  {/* <td>{v.studentName}</td> */}
                                  {studName}
                                  <td>{v.receiptNo}</td>
                                  <td>
                                    {moment(v.transactionDate).format(
                                      "DD-MM-yyyy"
                                    )}
                                  </td>
                                  <td>{v.standard}</td>
                                  <td>
                                    {numberWithCommasIN(
                                      v.concession_amount,
                                      true,
                                      2
                                    )}
                                  </td>
                                  <td>
                                    {numberWithCommasIN(v.paidAmount, true, 2)}
                                  </td>
                                  {/* <td>{v.paidAmount}</td> */}
                                  <td>
                                    {" "}
                                    <a
                                      href="#."
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
                                            this.DeleteFeesTransactions(
                                              v.transactionId,
                                              v.receiptNo
                                            );
                                          },
                                          handleFailureFun: () => {
                                            this.DeleteNoFun(
                                              v.transactionId,
                                              v.receiptNo
                                            );
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
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={8} className="text-center">
                                No Data Found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        />
      </div>
    );
  }
}
