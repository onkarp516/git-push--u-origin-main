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
} from "react-bootstrap";
import {
  getTransactionList,
  getBranchesByInstitute,
  authenticationService,
  getStandardsByBranch,
  getStudentListByStandard,
  getAcademicYearByBranch,
  getTransactionListByStandard,
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
  numberWithCommasIN,
  LoadingComponent,
} from "@/helpers";
import "mousetrap-global-bind";
import refresh_iconblack from "@/assets/images/3x/refresh_iconblack.png";
import excel from "@/assets/images/3x/excel.png";
import print from "@/assets/images/3x/print.png";
import delete_ from "@/assets/images/3x/delete_.png";
import edit_ from "@/assets/images/3x/edit_.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default class StudentPaymentList extends React.Component {
  constructor(props) {
    super(props);
    this.paymentRef = React.createRef();
    this.state = {
      data: [],
      orgData: [],
      opbranchList: [],
      opstandList: [],
      opAcademicYearList: [],
      initVal: {
        standardId: "",
        branchId: "",
        id: "",
        academicYearId: "",

        studentType: "",
      },
      showloader: true,
      studentTypeOptions: [
        { label: "Day School", value: 1 },
        { label: "Residential", value: 2 },
      ],
    };
  }
  getBranchData = (outletId, initObj = null, branchId = null) => {
    let reqData = new FormData();
    // console.log("outletId", outletId);
    reqData.append(
      "outletId",
      authenticationService.currentUserValue.companyId
    );
    getBranchesByInstitute(reqData)
      .then((response) => {
        let res = response.data;
        // console.log("res", res);
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
                this.paymentRef.current.setFieldValue("branchId", branchId);
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

  handleSearch = (vi) => {
    let { orgData } = this.state;
    // console.log({ orgData });
    let f_opstudentlist = orgData.filter(
      (v) =>
        v.firstName != null &&
        v.lastName != null &&
        v.fatherName != null &&
        (v.firstName.toLowerCase().includes(vi.toLowerCase()) ||
          v.lastName.toLowerCase().includes(vi.toLowerCase()) ||
          v.standard.includes(vi) ||
          v.fatherName.toLowerCase().includes(vi.toLowerCase()))
      //  ||
      // v.mobileNo + "".toLowerCase().includes(vi))
    );
    this.setState({
      data: f_opstudentlist.length > 0 ? f_opstudentlist : orgData,
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
              // console.log({ initObj, Opt });
              if (initObj != null && standardId != null) {
                initObj["standardId"] = getSelectValue(
                  Opt,
                  parseInt(standardId)
                );
                // console.log({ initObj });
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

  getTransactionListByStandards = (
    academicYearId = null,
    standardId = null,
    studentType = null
  ) => {
    this.setState({ showloader: true });
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
      "standardId",
      standardId != "" && standardId != null ? standardId.value : 0
    );
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
      // console.log("res", res);
      if (res.responseStatus == 200) {
        let d = res.responseObject;
        this.setState({ data: d, orgData: d, showloader: false }, () => {
          this.paymentRef.current.setFieldValue("search", "");
        });
      }
    });
  };

  getTransactionListFun = () => {
    getTransactionList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ data: res.responseObject });
        } else {
          this.setState({ data: [] });
        }
      })
      .catch((error) => {
        this.setState({ data: [] });
        console.log("error", error);
      });
  };

  componentDidMount() {
    // this.getTransactionListFun();
    let companyId = authenticationService.currentUserValue.companyId;
    this.getBranchData(companyId);
    this.getTransactionListByStandards();
    // eventBus.dispatch("showloader", true);
    // setTimeout(() => {
    //   eventBus.dispatch("showloader", false);
    // }, 50000000);
  }

  pageReload = () => {
    this.componentDidMount();
  };

  render() {
    const {
      data,
      initVal,
      opstandList,
      studentTypeOptions,
      opAcademicYearList,
      showloader,
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
              innerRef={this.paymentRef}
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
                              // console.log({ v });
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
                      <Col md={2}>
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
                              this.getTransactionListByStandards(
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
                            name="standardId"
                            id="standardId"
                            options={opstandList}
                            value={values.standardId}
                            onChange={(v) => {
                              setFieldValue("standardId", "");
                              if (v != null) {
                                setFieldValue("standardId", v);
                              }
                              this.getTransactionListByStandards(
                                values.academicYearId,
                                v,
                                values.studentType
                              );
                              // this.getTransactionListByStandards(
                              //   values.academicYearId,
                              //   v.value
                              // );
                            }}
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
                        </Form.Group>
                      </Col>

                      <Col md={2} xs={12} className="">
                        <Button
                          className="create-btn me-2"
                          onClick={(e) => {
                            e.preventDefault();
                            if (isActionExist("fees-payment", "create")) {
                              eventBus.dispatch(
                                "page_change",
                                "studentfeespayment"
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
            <div className="table_wrapper denomination-style">
              {isActionExist("fees-payment", "list") && (
                <Table size="sm" hover className="tbl-font">
                  <thead>
                    <tr>
                      <th>#.</th>
                      <th>Student</th>
                      <th>Branch</th>
                      <th>Academic Year</th>
                      <th>STD / DIV</th>
                      <th>Student Type</th>
                      {/* <th>Student Group</th> */}
                      <th>Fees(Branch/Hostel)</th>
                      <th>Paid Fees(Branch/Hostel)</th>
                      <th>Total Paid(Conc. AMT)</th>
                      <th>Outstanding</th>
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
                        if (v.middleName != null) {
                          studName = studName + " " + v.middleName;
                        }
                        return (
                          <tr>
                            <td>{i + 1}</td>
                            <td>{studName}</td>
                            <td>{v.branchName}</td>
                            <td>{v.academicYear}</td>
                            <td>{v.standard + " / " + v.division}</td>
                            <td>{v.studentType}</td>
                            {/* <td>{v.studentGroup}</td> */}
                            <td>
                              {numberWithCommasIN(
                                v.totalFeeExceptHostel,
                                true,
                                2
                              ) +
                                " / " +
                                numberWithCommasIN(v.hostelFee, true, 2)}
                            </td>
                            <td>
                              {numberWithCommasIN(
                                v.paidFeeExceptHostel,
                                true,
                                2
                              ) +
                                " / " +
                                numberWithCommasIN(v.paidHostelFee, true, 2)}
                            </td>

                            <td>
                              {numberWithCommasIN(v.totalPaid, true, 2)}{" "}
                              {v.concessionAmount > 0 &&
                                "(" +
                                  numberWithCommasIN(
                                    v.concessionAmount,
                                    true,
                                    2
                                  ) +
                                  ")"}
                            </td>
                            <td>
                              {numberWithCommasIN(v.outstanding, true, 2)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <>
                        <tr>
                          <td colSpan={10} className="text-center">
                            No Data Found
                          </td>
                        </tr>

                        {showloader == true && LoadingComponent(showloader)}
                      </>
                    )}
                  </tbody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
