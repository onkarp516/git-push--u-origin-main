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
  listOfCompanies,
  authenticationService,
  getAcademicYearByBranch,
  getBranchesByInstitute,
  getStandardsByBranch,
  getDivisionsByStandard,
  getStudentListForTransaction,
  getStandardWiseStudentData,
} from "@/services/api_functions";

import moment from "moment";
import excel from "@/assets/images/3x/excel.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { exportOutstandingListURL } from "@/services/api";

import Select from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  AuthenticationCheck,
  customStyles,
  getSelectValue,
  MyNotifications,
  eventBus,
  ordinal_suffix_of,
  MyDatePicker,
  isActionExist,
  getHeader,
  numberWithCommasIN,
} from "@/helpers";

import "mousetrap-global-bind";
import arrowicon from "@/assets/images/3x/arrowicon.png";
import edit from "@/assets/images/3x/edit.png";
import cancel from "@/assets/images/3x/cancel.png";
import exit from "@/assets/images/3x/exit.png";
import save from "@/assets/images/3x/save.png";
import reset from "@/assets/images/reset.png";
const CustomClearText = () => "clear all";

export default class OutstandingList extends React.Component {
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
      orgData: [],
      optRollno: [],
      payheadList: [],
      installments: [],
      concessions: [],
      installArray: [],
      initVal: {
        id: "",
        instituteId: "",
        transactionDate: new Date(),
        branchId: "",
        academicYearId: "",
        standardId: "",
        divisionId: "",
        studentId: "",
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
      },
      studentTypeOptions: [
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


  getStandardWiseStudentList = () => {
    let { branchId, academicYearId, standardId, divisionId, studentType } =
      this.state.initVal;
    let requestData = new FormData();
    requestData.append("branchId", branchId.value);
    requestData.append("academicYearId", academicYearId.value);
    requestData.append("standardId", standardId.value);
    requestData.append("divisionId", divisionId.value);
    requestData.append(
      "studentType",
      studentType != "" && studentType != null ? studentType.value : 0
    );

    getStandardWiseStudentData(requestData).then((response) => {
      let res = response.data;
      console.log("res", res);
      let d = res.response;
      if ((res.responseStatus = 200)) {
        let opt = d.map(function (values) {
          return { value: values.outstanding, label: values.studentName };
        });
        console.log("opt", d);
        this.setState(
          {
            opStudentList: d,
            orgData: d,
          },
          () => {
            this.transFormRef.current.setFieldValue("search", "");
          }
        );
      }
    });
  };

  exportOutstandingListData = (opStudentList) => {
    if (opStudentList.length > 0) {
      let { standardId } = this.transFormRef.current.values;
      let { divisionId } = this.transFormRef.current.values;
      let { studentType } = this.transFormRef.current.values;
      let { academicYearId } = this.transFormRef.current.values;

      let requestData = {
        studentList: JSON.stringify(opStudentList),
        branchId: authenticationService.currentUserValue.branchId,
        academicYearId:
          academicYearId != null && academicYearId != ""
            ? academicYearId.value
            : "",

        standardId:
          standardId != null && standardId != "" ? standardId.value : "",
        divisionId:
          divisionId != null && divisionId != "" ? divisionId.value : "",
        studentType:
          studentType != null && studentType != "" ? studentType.label : "",
      };

      const requestOption = {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(requestData),
      };

      let branchName = authenticationService.currentUserValue.branchName;
      let standardName =
        standardId != null && standardId != "" ? standardId.label : "";

      let divisionName =
        divisionId != null && divisionId != "" ? divisionId.label : "";

      let filename =
        "Outstanding_list_" +
        branchName +
        "_" +
        standardName +
        "_" +
        divisionName +
        ".xlsx";

      // let filename =
      //   "Oustanding_List_" + moment().format("YYYY-MM-DD HH:MM:ss") + ".xlsx";

      return fetch(exportOutstandingListURL(), requestOption)
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

  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let f_opstudentlist = orgData.filter(
      (v) =>
        v.firstName != null &&
        v.lastName != null &&
        v.fatherName != null &&
        v.mobileNo != null &&
        (v.firstName.toLowerCase().includes(vi.toLowerCase()) ||
          v.lastName.toLowerCase().includes(vi.toLowerCase()) ||
          v.mobileNo.includes(vi) ||
          v.fatherName.toLowerCase().includes(vi.toLowerCase()))
      //  ||
      // v.mobileNo + "".toLowerCase().includes(vi))
    );
    this.setState({
      opStudentList: f_opstudentlist.length > 0 ? f_opstudentlist : orgData,
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
        divisionId: "",
        studentType: "",
        divName: "",
        studentName: "",
        outstanding: "",
        totalFees: "",
        payment: "",
        installmentNo: "",
      },
      opStudentList: [],
    });
  }

  componentDidMount() {
    if (AuthenticationCheck()) {

      this.getBranchData();
    }
  }

  pageReload = () => {
    this.componentDidMount();
  };

  getTbody = () => {
    let { payheadList } = this.state;
    return (
      <>
        <tbody>
          {payheadList &&
            payheadList.length > 0 &&
            payheadList[0]["installmentData"].map((vi, ii) => {
              return (
                <>
                  <tr>
                    <td>{ii + 1}</td>
                    <td>{vi.payHeadName}</td>
                    <td>{vi.priority}</td>
                    {Array(payheadList.length)
                      .fill(0)
                      .map((v, i) => {
                        return (
                          <>
                            <td>
                              {
                                payheadList[i]["installmentData"][ii][
                                "totalFees"
                                ]
                              }
                            </td>
                            <td>
                              {/* {payheadList[i]["installmentData"][ii]["paid"]} */}
                              {
                                payheadList[i]["installmentData"][ii][
                                "prevPaid"
                                ]
                              }
                            </td>{" "}
                            <td>
                              {payheadList[i]["installmentData"][ii]["balance"]}
                            </td>{" "}
                          </>
                        );
                      })}
                  </tr>
                </>
              );
            })}
        </tbody>
      </>
    );
  };

  getFooter = () => {
    let { payheadList } = this.state;
    return (
      <>
        <tfoot>
          <tr>
            <th></th>
            <th>Total</th>
            <th></th>
            {payheadList &&
              payheadList.length > 0 &&
              payheadList.map((vi, ii) => {
                return (
                  <>
                    <th>{vi.totalFee}</th>
                    <th>{vi.totalPaid}</th>
                    <th>{vi.totalBalance}</th>
                  </>
                );
              })}
            <th></th>
          </tr>
        </tfoot>
      </>
    );
  };

  render() {
    const {
      initVal,
      opBranchList,
      orgData,
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
    } = this.state;

    return (
      <div className="">
        <Formik
          innerRef={this.transFormRef}
          initialValues={initVal}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            academicYearId: Yup.object()
              .nullable()
              .required("Academic Year is Required !"),
            divisionId: Yup.object().nullable().required("Divsion is Required"),
            studentType: Yup.object()
              .nullable()
              .required("Student Type is Required"),
            standardId: Yup.object()
              .nullable()
              .required("Standard Is Required"),
          })}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            // this.setState({ isLoading: true });
            setSubmitting(false);
            this.setState({ initVal: values }, () => {
              this.getStandardWiseStudentList();
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
                          <Col lg={2} md={4} xs={12}>
                            <Form.Label
                              htmlFor="inlineFormInputGroup"
                              visuallyHidden
                            ></Form.Label>
                            <InputGroup className="mb-2 headt">
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
                          {/* <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Transaction Date</Form.Label>
                              <MyDatePicker
                                className="datepic form-control"
                                styles={customStyles}
                                name="transactionDate"
                                placeholderText="dd/MM/yyyy"
                                id="transactionDate"
                                dateFormat="dd/MM/yyyy"
                                value={values.transactionDate}
                                onChange={(date) => {
                                  setFieldValue("transactionDate", date);
                                }}
                                selected={values.transactionDate}
                                maxDate={new Date()}
                              />
                            </Form.Group>
                          </Col> */}
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
                                id="standardId"
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
                              <span className="text-danger errormsg">
                                {errors.standardId && errors.standardId}
                              </span>
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
                              <span className="text-danger errormsg">
                                {errors.divisionId && errors.divisionId}
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
                                id="studentType"
                                options={studentTypeOptions}
                                value={values.studentType}
                                onChange={(v) => {
                                  setFieldValue("studentType", "");
                                  if (v != null) {
                                    setFieldValue("studentType", v);
                                  }
                                  this.getTransactionListByStandards(
                                    values.academicYearId,
                                    values.standardId,
                                    v
                                  );
                                }}
                              />
                              <span className="text-danger errormsg">
                                {errors.studentType && errors.studentType}
                              </span>
                            </Form.Group>
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
                                this.exportOutstandingListData(opStudentList);
                              }}
                            >
                              Export Data
                              <img src={excel} className="btnico ms-1"></img>
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    <div className="table_wrapper denomination-style">
                      <Table hover size="sm" className="tbl-font">
                        <thead>
                          <tr>
                            <th>#.</th>
                            <th>Student Name</th>
                            <th>Mobile No</th>
                            <th>Student Type</th>
                            <th>Standard</th>
                            <th>Total Fees</th>
                            <th>Paid Amount</th>
                            <th>Outstanding</th>
                          </tr>
                        </thead>
                        <tbody className="tabletrcursor">
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
                                  onDoubleClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  <td>{i + 1}</td>
                                  {/* <td>
                                    {v.lastName +
                                      " " +
                                      v.firstName +
                                      " " +
                                      v.fatherName}
                                  </td> */}
                                  <td>{studName}</td>
                                  <td>{v.mobileNo}</td>
                                  <td>{v.studentType}</td>
                                  <td>{v.standard}</td>
                                  <td>
                                    {numberWithCommasIN(v.totalFees, true, 2)}
                                  </td>
                                  <td>
                                    {numberWithCommasIN(v.paidAmount, true, 2)}
                                  </td>
                                  <td>
                                    {numberWithCommasIN(v.outstanding, true, 2)}
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
