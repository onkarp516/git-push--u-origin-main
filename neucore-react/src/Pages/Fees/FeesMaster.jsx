import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Collapse,
  Container,
  Modal,
  FormControl,
} from "react-bootstrap";
import {
  authenticationService,
  get_companies_super_admin,
  getBranchesByInstitute,
  createFeesMaster,
  updateFeeHead,
  getStandardsByBranch,
  getAcademicYearByBranch,
  getDivisionsByStandard,
  getFeeHeadsByBranch,
  getSubFeeHeadsByFeeHead,
} from "@/services/api_functions";

import Select from "react-select";
import moment from "moment";

import { Formik } from "formik";
import * as Yup from "yup";
import {
  ShowNotification,
  customStyles,
  getSelectValue,
  MyNotifications,
  eventBus,
  isActionExist,
  numberWithCommasIN,
  MyDatePicker,
} from "@/helpers";
import "mousetrap-global-bind";

import delete_ from "@/assets/images/3x/delete_.png";
import cancel from "@/assets/images/3x/cancel.png";
import save from "@/assets/images/3x/save.png";
import Vector1 from "@/assets/images/3x/Vector1.png";
const CustomClearText = () => "clear all";

export default class FeesMaster extends React.Component {
  constructor(props) {
    super(props);
    this.fessmasterFormRef = React.createRef();
    this.state = {
      data: [],
      show: false,
      opbranchList: [],
      opFeeSubHeadIdList: [],
      opstandList: [],
      opDivisionList: [],
      opAcademicYearList: [],
      particularlist: [],
      opFeesHeadList: [],
      studentTypeOptions: [
        { label: "Day School", value: 1 },
        { label: "Residential", value: 2 },
      ],
      studentGroupOptions: [
        { label: "PCM", value: 1 },
        { label: "PCB", value: 2 },
      ],
      isLoading: true,
      initVal: {
        id: "",
        companyId: "",
        branchId: "",
        academicId: "",
        studentType: "",
        standardId: "",
        feesheadId: "",
        priority: "",
        minimumAmount: "0",
        noOfInstallment: "",
        expiryDate: "",
        boys: "",
        girls: "",
        amount: "",
        subboys: "",
        subgirls: "",
        subamount: "",
      },
    };
  }

  setInitValAndLoadData() {
    let { opbranchList } = this.state;
    this.setState(
      {
        initVal: {
          id: "",
          companyId: "",
          branchId: getSelectValue(
            opbranchList,
            authenticationService.currentUserValue.branchId
          ),
          academicId: "",
          studentType: "",
          standardId: "",
          feesheadId: "",
          noOfInstallment: "",
          expiryDate: "",
          minimumAmount: "",
          priority: "",
          boys: "",
          girls: "",
          amount: "",
          subboys: "",
          subgirls: "",
          subamount: "",
        },

        opendiv: false,
      },
      () => {
        // this.getAllFeeHeadslst();
      }
    );
  }

  handelModalShow = (status) => {
    this.setState({ show: status });
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
                let { initVal } = this.state;
                initVal["branchId"] = getSelectValue(
                  Opt,
                  parseInt(authenticationService.currentUserValue.branchId)
                );
                this.setState({ initVal: initVal }, () => {
                  this.getAcademicYearData(
                    authenticationService.currentUserValue.branchId
                  );
                  this.getStandardByBranchData(
                    authenticationService.currentUserValue.branchId
                  );
                });
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

  getAcademicYearData = (branchId) => {
    let reqData = new FormData();
    reqData.append("branchId", branchId);
    getAcademicYearByBranch(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          if (d.length > 0) {
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
  getSubFeeHeadsByFeeHeadlst = (feeHeadId) => {
    let reqData = new FormData();
    reqData.append("feeHeadId", feeHeadId);
    getSubFeeHeadsByFeeHead(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;

          let Opt = d.map(function (values) {
            return {
              value: values.id,
              label: values.subFeeHeadName,
              feeHeadId: values.feeHeadId,
            };
          });
          this.setState({ opFeeSubHeadIdList: Opt });
        }
      })
      .catch((error) => {
        this.setState({ opFeeSubHeadIdList: [] });
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
          if (d.length > 0) {
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

  getFeeHeadsByBranchlst = (branchId, studentType) => {
    let reqData = new FormData();
    console.log("in fess");
    reqData.append("branchId", branchId);
    reqData.append("studentType", studentType);
    getFeeHeadsByBranch(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          if (d.length > 0) {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.feeHeadName };
            });
            this.setState({ opFeesHeadList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opFeesHeadList: [] });
        console.log("error", error);
      });
  };

  addParticularList = (particular, setFieldValue) => {
    console.log({ particular });
    console.log(particular.priority);
    const { particularlist, opFeeSubHeadIdList } = this.state;
    console.log("particularlist", { particularlist });
    let { feesheadId, priority, boy, girl, amount, isSubHead } = particular;
    if (feesheadId != "" && priority != "") {
      let prod_data = {
        feesheadId: feesheadId,
        priority: priority,
        boy: boy,
        girl: girl,
        isSubHead: isSubHead,
        amount: amount,
        feeSubHeadList: opFeeSubHeadIdList,
      };

      let old_lst = particularlist;
      // console.log("old_lst", old_lst);
      let index_old = old_lst.findIndex(
        (x) => parseFloat(x.priority) === parseFloat(prod_data.priority)
      );
      // console.log("index_old===----->>>>", index_old);
      if (index_old != -1) {
        // console.log("prod_data", prod_data);
        old_lst = old_lst.map((v, i) => {
          if (i >= index_old) {
            let s = v["priority"].toString().split(".");
            console.log("s", s);
            let x = v["priority"];
            if (parseFloat(prod_data.isSubHead) != 0 && s.length >= 2) {
              let a = parseFloat(s[1]) + 1;
              x = s[0] + "." + a;
              v["priority"] = x;
            } else if (parseFloat(prod_data.isSubHead) == 0) {
              v["priority"] = parseFloat(v["priority"]) + 1;
            }
          }
          return v;
        });
      }

      let is_updated = false;
      let final_state = old_lst.map((item) => {
        if (item.feesheadId === prod_data.feesheadId) {
          is_updated = true;
          const updatedItem = prod_data;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...particularlist, prod_data];
      }

      // final_state.sort((a, b) => parseInt(a.priority) < parseInt(b.priority));
      final_state.sort((a, b) =>
        parseFloat(a.priority) > parseFloat(b.priority) ? 1 : -1
      );

      // console.log("final_state", final_state);
      this.setState({ particularlist: final_state });
      setFieldValue("feesheadId", "");
      setFieldValue("priority", "");
      setFieldValue("boys", "");
      setFieldValue("girls", "");
      setFieldValue("amount", "");
    }
  };

  getboysTotalAmount = () => {
    let { particularlist } = this.state;
    let boysamt = 0;
    particularlist.map((v) => {
      if (v.isSubHead == 0) {
        boysamt = parseFloat(boysamt) + parseFloat(v["boy"]);
      }
    });

    return isNaN(boysamt) ? 0 : numberWithCommasIN(boysamt, true, 2);
  };
  getgirlsTotalAmount = () => {
    let { particularlist } = this.state;
    let girlsamt = 0;
    particularlist.map((v) => {
      if (v.isSubHead == 0) {
        girlsamt = parseFloat(girlsamt) + parseFloat(v["girl"]);
      }
    });

    return isNaN(girlsamt) ? 0 : numberWithCommasIN(girlsamt, true, 2);
  };
  getTotalAmount = () => {
    let { particularlist } = this.state;
    let amt = 0;
    particularlist.map((v) => {
      if (v.isSubHead == 0) {
        amt = parseFloat(amt) + parseFloat(v["amount"]);
      }
    });

    return isNaN(amt) ? 0 : numberWithCommasIN(amt, true, 2);
  };

  removeParticularList = (index) => {
    const { particularlist } = this.state;
    const list = [...particularlist];
    list.splice(index, 1);
    this.setState({ particularlist: list });
  };

  componentDidMount() {
    let companyId = authenticationService.currentUserValue.companyId;
    this.getBranchData(companyId);
  }

  pageReload = () => {
    this.componentDidMount();
  };

  render() {
    const {
      initVal,
      opbranchList,
      opstandList,
      studentTypeOptions,
      studentGroupOptions,
      opFeesHeadList,
      opAcademicYearList,
      particularlist,
      opFeeSubHeadIdList,
    } = this.state;

    return (
      <div className="">
        <Formik
          validateOnChange={false}
          // validateOnBlur={false}
          enableReinitialize={true}
          initialValues={initVal}
          innerRef={this.ref}
          validationSchema={Yup.object().shape({
            // branchId: Yup.object().required("Branch is required").nullable(),
            // studentType: Yup.object()
            //   .required("student Type is required")
            //   .nullable(),
            // academicId: Yup.object()
            //   .required("Academic Year is required")
            //   .nullable(),
            // standardId: Yup.object()
            //   .required("Standard is required")
            //   .nullable(),
            // divisionId: Yup.object()
            //   .required("Division is required")
            //   .nullable(),
            // feesheadId: Yup.object()
            //   .required("fees head is required")
            //   .nullable(),
            // priority: Yup.string().trim().required("priority  is required"),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            let requestData = new FormData();
            console.log("particularlist", { values, particularlist });
            let frow = this.state.particularlist.map((v, i) => {
              if (v.feesheadId != "") {
                return {
                  paymentHeadId: v.feesheadId.value,
                  feeHeadId: v.isSubHead == 1 ? v.feesheadId.feeHeadId : 0,
                  priority: v.priority,
                  isSubHead: v.isSubHead,
                  amountForBoy: v.boy,
                  amountForGirl: v.girl,
                  amount: v.amount,
                };
              }
            });
            console.log("frow", frow);

            requestData.append("branchId", values.branchId.value);
            requestData.append("academicYearId", values.academicId.value);
            requestData.append("standardId", values.standardId.value);
            requestData.append("studentType", values.studentType.value);
            requestData.append("minimumAmount", values.minimumAmount);
            requestData.append("noOfInstallment", values.noOfInstallment);

            if (values.studentGroup != "" && values.studentGroup != null) {
              requestData.append("studentGroup", values.studentGroup.value);
            }

            requestData.append("row", JSON.stringify(frow));

            createFeesMaster(requestData)
              .then((response) => {
                resetForm();
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
                  console.log("in create");
                  this.pageReload();
                  eventBus.dispatch("page_change", "feesmasterlist");
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
              })
              .catch((error) => {
                setSubmitting(false);
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
              <div
                id="example-collapse-text"
                className="common-form-style mt-2 p-2"
              >
                {/* {JSON.stringify(values)} */}
                <div className="main-divform mb-2 m-0">
                  <div className="common-form-style m-0 mb-2">
                    <Row className="">
                      <Col md="12" className="mb-2">
                        <Row className="row-inside">
                          <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Branch</Form.Label>
                              <Select
                                isClearable={true}
                                className="selectTo"
                                isDisabled={true}
                                styles={customStyles}
                                onChange={(v) => {
                                  if (v != null) {
                                    setFieldValue("branchId", v);
                                    this.getAcademicYearData(v.value);
                                    this.getStandardByBranchData(v.value);
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
                          <Col lg="2" md="2">
                            <Form.Group>
                              <Form.Label>Year</Form.Label>
                              <Select
                                isClearable={true}
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  if (v != null) {
                                    setFieldValue("academicId", v);
                                  } else {
                                    setFieldValue("academicId", "");
                                  }
                                }}
                                name="academicId"
                                options={opAcademicYearList}
                                value={values.academicId}
                                invalid={errors.academicId ? true : false}
                              />
                              <span className="text-danger errormsg">
                                {errors.academicId && errors.academicId}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Standard</Form.Label>
                              <Select
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  if (v != null) {
                                    setFieldValue("standardId", v);
                                    this.getDivisionData(v.value);
                                  } else {
                                    setFieldValue("standardId", "");
                                  }
                                }}
                                name="standardId"
                                options={opstandList}
                                value={values.standardId}
                                invalid={errors.standardId ? true : false}
                              />
                              <span className="text-danger errormsg">
                                {errors.standardId && errors.standardId}
                              </span>
                            </Form.Group>
                          </Col>

                          {/* <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Division</Form.Label>
                              <Select
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  if (v != null) {
                                    setFieldValue("divisionId", v);
                                  } else {
                                    setFieldValue("divisionId", "");
                                  }
                                }}
                                name="divisionId"
                                options={opDivisionList}
                                value={values.divisionId}
                                invalid={errors.divisionId ? true : false}
                              />
                              <span className="text-danger errormsg">
                                {errors.divisionId && errors.divisionId}
                              </span>
                            </Form.Group>
                          </Col> */}
                          <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Student Type</Form.Label>
                              <Select
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  if (v != null) {
                                    setFieldValue("studentType", v);
                                    this.getFeeHeadsByBranchlst(
                                      values.branchId.value,
                                      v.value
                                    );
                                  } else {
                                    setFieldValue("studentType", "");
                                  }
                                }}
                                name="studentType"
                                options={studentTypeOptions}
                                value={values.studentType}
                                invalid={errors.studentType ? true : false}
                              />
                              <span className="text-danger errormsg">
                                {errors.studentType && errors.studentType}
                              </span>
                            </Form.Group>
                          </Col>
                          {values.standardId.label >= 11 ? (
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Student Group</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  onChange={(v) => {
                                    setFieldValue("studentGroup", "");
                                    if (v != null) {
                                      setFieldValue("studentGroup", v);
                                    }
                                  }}
                                  name="studentGroup"
                                  options={studentGroupOptions}
                                  value={values.studentGroup}
                                  invalid={errors.studentGroup ? true : false}
                                />
                                <span className="text-danger errormsg">
                                  {errors.studentGroup && errors.studentGroup}
                                </span>
                              </Form.Group>
                            </Col>
                          ) : (
                            ""
                          )}

                          <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Installment No.</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Installment No."
                                name="noOfInstallment"
                                id="noOfInstallment"
                                onChange={handleChange}
                                value={values.noOfInstallment}
                                isValid={
                                  touched.noOfInstallment &&
                                  !errors.noOfInstallment
                                }
                                isInvalid={!!errors.noOfInstallment}
                                className="formbg"
                              />
                              <span className="text-danger errormsg">
                                {errors.noOfInstallment}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>

              <div
                id="example-collapse-text"
                className="common-form-style mt-2 p-2"
              >
                <div className="main-div mb-2 m-0">
                  <h4 className="form-header" style={{ background: "#e8ecef" }}>
                    {" "}
                    Payment Heads
                  </h4>

                  {/* {JSON.stringify(values)} */}
                  <div className="common-form-style m-0">
                    <Row className="">
                      <Col
                        md="6"
                        className="mb-2"
                        style={{ borderRight: "1px solid #cacaca" }}
                      >
                        <Row className="row-inside">
                          <Col md="4">
                            <Form.Group className="createnew">
                              <Form.Label>Master Fee Head</Form.Label>
                              <Select
                                isClearable={true}
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  setFieldValue("feesheadId", "");
                                  setFieldValue("feessubheadId", "");
                                  if (v != null) {
                                    setFieldValue("feesheadId", v);
                                    this.getSubFeeHeadsByFeeHeadlst(v.value);
                                  }
                                }}
                                name="feesheadId"
                                options={opFeesHeadList}
                                value={values.feesheadId}
                                invalid={errors.feesheadId ? true : false}
                              />
                              <span className="text-danger errormsg">
                                {errors.branchId}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col lg="2" md="2">
                            <Form.Group>
                              <Form.Label>Priority</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Priority"
                                name="priority"
                                id="priority"
                                onChange={handleChange}
                                value={values.priority}
                                isValid={touched.priority && !errors.priority}
                                isInvalid={!!errors.priority}
                                className="formbg"
                                maxLength={2}
                              />
                              <span className="text-danger errormsg">
                                {errors.priority}
                              </span>
                            </Form.Group>
                          </Col>

                          {values.standardId &&
                          parseInt(values.standardId.label) >= 11 &&
                          values.studentType &&
                          parseInt(values.studentType.value) == 2 ? (
                            <>
                              <Col lg="2" md="2">
                                <Form.Group>
                                  <Form.Label> Boys</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="boys"
                                    name="boys"
                                    id="boys"
                                    onChange={handleChange}
                                    value={values.boys}
                                    isValid={touched.boys && !errors.boys}
                                    isInvalid={!!errors.boys}
                                    className="formbg"
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.boys}
                                  </span>
                                </Form.Group>
                              </Col>
                              <Col lg="2" md="2">
                                <Form.Group className="createnew">
                                  <Form.Label> Girls</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="girls"
                                    name="girls"
                                    id="girls"
                                    onChange={handleChange}
                                    value={values.girls}
                                    isValid={touched.girls && !errors.girls}
                                    isInvalid={!!errors.girls}
                                    className="formbg"
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.girls}
                                  </span>
                                </Form.Group>
                              </Col>
                            </>
                          ) : (
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label> Amount</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="amount"
                                  name="amount"
                                  id="amount"
                                  onChange={handleChange}
                                  value={values.amount}
                                  isValid={touched.amount && !errors.amount}
                                  isInvalid={!!errors.amount}
                                  className="formbg"
                                />
                                <span className="text-danger errormsg">
                                  {errors.amount}
                                </span>
                              </Form.Group>
                            </Col>
                          )}

                          <Col md="2">
                            <Button
                              style={{
                                backgroundColor: "transparent",
                                border: "transparent",
                                boxShadow: "none",
                              }}
                            >
                              <img
                                src={Vector1}
                                className="ms-1 mt-3"
                                style={{ height: "40px" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (
                                    values.feesheadId.value != "" &&
                                    values.priority != ""
                                  ) {
                                    this.addParticularList(
                                      {
                                        feesheadId: values.feesheadId,
                                        priority: values.priority,
                                        boy: values.boys,
                                        girl: values.girls,
                                        amount: values.amount,
                                        isSubHead: 0,
                                      },
                                      setFieldValue
                                    );
                                  } else {
                                    ShowNotification(
                                      "Error",
                                      "Please Fill Particular Details"
                                    );
                                  }
                                }}
                              ></img>
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                      <Col md="6" className="mb-2">
                        <Row className="row-inside">
                          <Col md="4">
                            <Form.Group className="createnew">
                              <Form.Label>Sub Fee Head</Form.Label>
                              <Select
                                isClearable={true}
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  if (v != null) {
                                    setFieldValue("feessubheadId", v);
                                  } else {
                                    setFieldValue("feessubheadId", "");
                                  }
                                }}
                                name="feesheadId"
                                options={opFeeSubHeadIdList}
                                value={values.feessubheadId}
                                invalid={errors.feessubheadId ? true : false}
                              />
                              <span className="text-danger errormsg">
                                {errors.feessubheadId && errors.feessubheadId}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col lg="2" md="2">
                            <Form.Group>
                              <Form.Label>Priority</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Priority"
                                name="subpriority"
                                id="subpriority"
                                onChange={handleChange}
                                value={values.subpriority}
                                isValid={
                                  touched.subpriority && !errors.subpriority
                                }
                                isInvalid={!!errors.subpriority}
                                className="formbg"
                                maxLength={3}
                              />
                              <span className="text-danger errormsg">
                                {errors.subpriority}
                              </span>
                            </Form.Group>
                          </Col>

                          {values.standardId &&
                          parseInt(values.standardId.label) >= 11 &&
                          values.studentType &&
                          parseInt(values.studentType.value) == 2 ? (
                            <>
                              <Col lg="2" md="2">
                                <Form.Group>
                                  <Form.Label> Boys</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="boys"
                                    name="subboys"
                                    id="subboys"
                                    onChange={handleChange}
                                    value={values.subboys}
                                    isValid={touched.subboys && !errors.subboys}
                                    isInvalid={!!errors.subboys}
                                    className="formbg"
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.subboys}
                                  </span>
                                </Form.Group>
                              </Col>
                              <Col lg="2" md="2">
                                <Form.Group className="createnew">
                                  <Form.Label> Girls</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="subgirls"
                                    name="subgirls"
                                    id="subgirls"
                                    onChange={handleChange}
                                    value={values.subgirls}
                                    isValid={
                                      touched.subgirls && !errors.subgirls
                                    }
                                    isInvalid={!!errors.subgirls}
                                    className="formbg"
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.subgirls}
                                  </span>
                                </Form.Group>
                              </Col>
                            </>
                          ) : (
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label> Amount</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="amount"
                                  name="subamount"
                                  id="subamount"
                                  onChange={handleChange}
                                  value={values.subamount}
                                  isValid={
                                    touched.subamount && !errors.subamount
                                  }
                                  isInvalid={!!errors.subamount}
                                  className="formbg"
                                />
                                <span className="text-danger errormsg">
                                  {errors.subamount}
                                </span>
                              </Form.Group>
                            </Col>
                          )}
                          <Col md="2" className="text-end">
                            <Button
                              style={{
                                backgroundColor: "transparent",
                                border: "transparent",
                                boxShadow: "none",
                              }}
                            >
                              <img
                                src={Vector1}
                                className="ms-1 mt-3"
                                style={{
                                  height: "40px",
                                  marginLeft: "-12px",
                                  marginTop: "-6px",
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (
                                    values.feessubheadId.value != "" &&
                                    values.subpriority != ""
                                  ) {
                                    this.addParticularList(
                                      {
                                        feesheadId: values.feessubheadId,
                                        priority: values.subpriority,
                                        boy: values.subboys,
                                        girl: values.subgirls,
                                        amount: values.subamount,
                                        isSubHead: 1,
                                      },
                                      setFieldValue
                                    );
                                  } else {
                                    ShowNotification(
                                      "Error",
                                      "Please Fill Particular Details"
                                    );
                                  }
                                }}
                              ></img>
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>

              <div className="wrapper_div" style={{ height: "62vh" }}>
                {/* <h6>Group</h6> */}

                <div className="cust_table">
                  {/* {data.length > 0 && ( */}
                  <div
                    className="table_wrapper denomination-style"
                    style={{
                      height: "48vh",
                      overflow: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {/* {JSON.stringify(particularlist)} */}

                    <Table
                      size="sm"
                      hover
                      // responsive
                      className="tbl-font"
                      style={{ marginBottom: "0px" }}
                    >
                      <thead>
                        <tr>
                          <th>#.</th>
                          <th>Particular</th>
                          <th>Priority</th>
                          {values.standardId &&
                          parseInt(values.standardId.label) >= 11 &&
                          values.studentType &&
                          parseInt(values.studentType.value) == 2 ? (
                            <>
                              <th>Boys</th>
                              <th>Girls</th>
                            </>
                          ) : (
                            <th>Amount</th>
                          )}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tfoot style={{ bottom: "-3px" }}>
                        <tr className="fontbold">
                          <th colSpan={3}>Total</th>
                          {values.standardId &&
                          parseInt(values.standardId.label) >= 11 &&
                          values.studentType &&
                          parseInt(values.studentType.value) == 2 ? (
                            <>
                              <th>{this.getboysTotalAmount()}</th>
                              <th>{this.getgirlsTotalAmount()}</th>
                            </>
                          ) : (
                            <th>{this.getTotalAmount()}</th>
                          )}
                          <th></th>
                        </tr>
                      </tfoot>
                      <tbody>
                        {particularlist &&
                          particularlist.map((v, key) => {
                            return (
                              <tr key={key}>
                                <td>{key + 1}</td>
                                <td>{v.feesheadId.label}</td>
                                <td>{v.priority}</td>

                                {values.standardId &&
                                parseInt(values.standardId.label) >= 11 &&
                                values.studentType &&
                                parseInt(values.studentType.value) == 2 ? (
                                  <>
                                    <td>
                                      {numberWithCommasIN(v.boy, true, 2)}
                                    </td>
                                    <td>
                                      {numberWithCommasIN(v.girl, true, 2)}
                                    </td>
                                  </>
                                ) : (
                                  <td>
                                    {numberWithCommasIN(v.amount, true, 2)}
                                  </td>
                                )}
                                <td>
                                  <a
                                    href=""
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.removeParticularList(key);
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
                          })}
                      </tbody>
                    </Table>
                  </div>
                  <hr></hr>
                  <div className="p-2 text-center fourbtnfeestrans">
                    <Button type="submit" className="submitbtn affiliated">
                      Save
                      <img src={save} alt="" className="btsubmit "></img>
                    </Button>

                    <Button
                      type="submit"
                      className="submitbtn cancelbtn formbtn affiliated"
                      variant="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "feesmasterlist");
                      }}
                    >
                      Cancel
                      <img src={cancel} alt="" className="btsubmit "></img>
                    </Button>
                  </div>
                  {/* )} */}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
