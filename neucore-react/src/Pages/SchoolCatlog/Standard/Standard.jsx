import React, { Component } from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  InputGroup,
  FormControl,
} from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";
import {
  authenticationService,
  get_companies_super_admin,
  getBranchesByInstitute,
  getAcademicYearByBranch,
  updateStandard,
  getStandardById,
  getAllStandards,
  createStandard,
} from "@/services/api_functions";
import Select from "react-select";
import {
  EMAILREGEXP,
  numericRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  customStyles,
  getSelectValue,
  isActionExist,
  MyNotifications,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import refresh_iconblack from "@/assets/images/3x/refresh_iconblack.png";
import excel from "@/assets/images/3x/excel.png";
import print from "@/assets/images/3x/print.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import delete_ from "@/assets/images/3x/delete_.png";
import edit_ from "@/assets/images/3x/edit_.png";
import arrowicon from "@/assets/images/3x/arrowicon.png";
import cancel from "@/assets/images/3x/cancel.png";
export default class Standard extends Component {
  constructor(props) {
    super(props);
    this.standardFormRef = React.createRef();
    this.state = {
      data: [],

      opbranchList: [],
      opacademicList: [],
      isLoading: true,
      initVal: {
        id: "",
        instituteId: "",
        branchId: "",

        standardName: "",
      },
    };
  }
  setInitValAndLoadData() {
    let { opbranchList } = this.state;

    this.getAllStandardslst();
    this.setState({
      initVal: {
        id: "",
        instituteId: "",
        branchId: getSelectValue(
          opbranchList,
          authenticationService.currentUserValue.branchId
        ),

        standardName: "",
      },
      opendiv: false,
    });
  }

  getBranchData = (outletId, initObj = null, sbct = null) => {
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
              if (initObj != null && Opt.length > 0) {
                // let { initVal } = this.state;
                initObj["branchId"] = getSelectValue(Opt, parseInt(sbct));
                this.setState({ initVal: initObj });
              } else {
                let branchId = getSelectValue(
                  Opt,
                  authenticationService.currentUserValue.branchId
                );
                this.standardFormRef.current.setFieldValue(
                  "branchId",
                  branchId
                );
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

  getstandardByIdFun = (id) => {
    let companyId = authenticationService.currentUserValue.companyId;
    console.log("companyId", companyId);

    let reqData = new FormData();
    reqData.append("id", id);

    getStandardById(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let ob = res.responseObject;
          let initVal = {
            id: ob.id,
            branchId: ob.branchId,
            // academicYearId: ob.academicYearId,
            standardName: ob.standardName ? ob.standardName : "",
          };
          console.log("initval", initVal);
          this.setState({ initVal: initVal, opendiv: true }, () => {
            this.getBranchData(initVal.companyId, initVal, ob.branchId);
          });
        }
      })
      .catch((error) => {
        this.setState({ data: [] });
        console.log("error", error);
      });
  };

  // getAcademicYearData = (branchId) => {
  //   let reqData = new FormData();
  //   reqData.append("branchId", branchId);
  //   getAcademicYearByBranch(reqData)
  //     .then((response) => {
  //       let res = response.data;
  //       console.log("res", res);
  //       if (res.responseStatus == 200) {
  //         let d = res.responseObject;
  //         if (d.length > 0) {
  //           let Opt = d.map(function (values) {
  //             return { value: values.id, label: values.academicYear };
  //           });
  //           this.setState({ opacademicList: Opt });
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       this.setState({ opacademicList: [] });
  //       console.log("error", error);
  //     });
  // };

  getAllStandardslst = () => {
    getAllStandards()
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

  componentDidMount() {
    this.getAllStandardslst();
    let companyId = authenticationService.currentUserValue.companyId;

    this.getBranchData(companyId);
  }

  setInitValue = () => {
    this.ref.current.resetForm();
    this.setState({
      opendiv: false,
    });
  };

  pageReload = () => {
    this.componentDidMount();
  };
  render() {
    const { opendiv, data, initVal, opbranchList, opacademicList } = this.state;
    return (
      <div className="">
        <Collapse in={opendiv}>
          <div
            id="example-collapse-text"
            className="common-form-style  mt-2 p-2 "
          >
            <div className="main-div mb-2 m-0 company-from">
              <h4 className="form-header">Academic Year</h4>
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                enableReinitialize={true}
                initialValues={initVal}
                innerRef={this.standardFormRef}
                validationSchema={Yup.object().shape({
                  standardName: Yup.string()
                    .trim()
                    .required("Academic Year is required"),
                  branchId: Yup.object()
                    .required("Branch is required")
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
                      v != "branchId"
                    ) {
                      requestData.append(v, values[v]);
                    }
                  });
                  // requestData.append("companyId", values.companyId.value);
                  requestData.append("branchId", values.branchId.value);

                  setSubmitting(true);
                  if (values.id == "") {
                    createStandard(requestData)
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
                          this.setInitValAndLoadData();
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
                  } else {
                    updateStandard(requestData)
                      .then((response) => {
                        setSubmitting(false);
                        let res = response.data;
                        if (res.responseStatus == 200) {
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
                          // this.getAcademicYearlst();
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
                    <div className="mb-2 m-0 company-from">
                      {/* {JSON.stringify(values)}
                      {JSON.stringify(errors)} */}
                      <Row className="">
                        <Col md="12" className="">
                          <Row className="row-inside">
                            <Col md="3">
                              <Form.Group className="createnew">
                                <Form.Label>Branch Name</Form.Label>
                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={customStyles}
                                  isDisabled={true}
                                  onChange={(v) => {
                                    if (v != null) {
                                      setFieldValue("branchId", v);
                                    } else {
                                      setFieldValue("branchId", "");
                                    }
                                  }}
                                  name="branchId"
                                  options={opbranchList}
                                  value={values.branchId}
                                  invalid={errors.branchId ? true : false}
                                />
                                <span className="text-danger errormsg">
                                  {errors.branchId && errors.branchId}
                                </span>
                              </Form.Group>
                            </Col>
                            {/* <Col md="3">
                              <Form.Group>
                                <Form.Label>Academic Year</Form.Label>

                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={customStyles}
                                  onChange={(v) => {
                                    if (v != null) {
                                      setFieldValue("academicYearId", v);
                                    } else {
                                      setFieldValue("academicYearId", "");
                                    }
                                  }}
                                  name="academicYearId"
                                  options={opacademicList}
                                  value={values.academicYearId}
                                  invalid={errors.academicYearId ? true : false}
                                />
                                <span className="text-danger errormsg">
                                  {errors.academicYearId}
                                </span>
                              </Form.Group>
                            </Col> */}
                            <Col md="3">
                              <Form.Group>
                                <Form.Label>Standard</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="standard"
                                  name="standardName"
                                  id="standardName"
                                  onChange={handleChange}
                                  value={values.standardName}
                                  isValid={
                                    touched.standardName && !errors.standardName
                                  }
                                  isInvalid={!!errors.standardName}
                                />
                                <span className="text-danger errormsg">
                                  {errors.standardName}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md="3"></Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="">
                        <Col md="12" className="btn_align">
                          <Button
                            className="submitbtn affiliated"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {values.id == "" ? "Submit" : "Update"}
                            <img src={arrowicon} className="btnico ms-1"></img>
                          </Button>
                          <Button
                            className="submitbtn cancelbtn"
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault();

                              this.setInitValAndLoadData();
                            }}
                          >
                            Cancel
                            <img
                              src={cancel}
                              alt=""
                              className="btsubmit"
                              style={{ height: "15px" }}
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
        <div className="wrapper_cat">
          <div className="cust_table">
            <Row style={{ padding: "8px" }} className="headpart">
              <Col lg={2} md={4} xs={12} className="mb-2">
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
              <Col lg={6} md="4"></Col>
              <Col lg={2} md={4} xs={12}>
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
              <Col lg={2} md={4} xs={12} className="btn_align mainbtn_create">
                {!opendiv && (
                  <Button
                    className="create-btn mr-2"
                    onClick={(e) => {
                      e.preventDefault();
                      if (isActionExist("standard", "create")) {
                        this.setState({ opendiv: !opendiv });
                      } else {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Permission is denied!",
                          is_button_show: true,
                        });
                      }
                      // this.setState({ opendiv: !opendiv });
                    }}
                    aria-controls="example-collapse-text"
                    aria-expanded={opendiv}
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
            <div className="table_wrapper denomination-style">
              {isActionExist("standard", "list") && (
                <Table hover size="sm" className="tbl-font">
                  <thead>
                    <tr>
                      <th>#.</th>
                      {/* <th>Institute Name</th>
                      <th>Branch Name</th> */}

                      <th>Standard</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="tabletrcursor">
                    {data.length > 0 ? (
                      data.map((v, i) => {
                        return (
                          <tr
                            onDoubleClick={(e) => {
                              e.preventDefault();
                              this.setUpdateData(v.id);
                            }}
                          >
                            <td>{i + 1}</td>
                            {/* <td>{v.outletName}</td>
                            <td>{v.branchName}</td> */}

                            <td>{v.standardName}</td>
                            <td>
                              {" "}
                              <a
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();

                                  if (isActionExist("standard", "edit")) {
                                    this.getstandardByIdFun(v.id);
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
                                <img
                                  src={edit_}
                                  alt=""
                                  className="marico"
                                ></img>
                              </a>
                              <a href="">
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
                        <td colSpan={7} className="text-center">
                          No Data Found
                        </td>
                      </tr>
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
