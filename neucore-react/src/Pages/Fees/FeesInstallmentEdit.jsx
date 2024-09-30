import React from "react";
import { Button, Col, Row, Form, Table } from "react-bootstrap";
import {
  authenticationService,
  get_companies_super_admin,
  getBranchesByInstitute,
  createInstallmentMaster,
  updateInstallmentMaster,
  getStandardsByBranch,
  getAcademicYearByBranch,
  getDivisionsByStandard,
  getFeeHeadsByBranch,
  getSubFeeHeadsByFeeHead,
  getInstallmentsById,
  getFeesMasterDetailsForInstallment,
} from "@/services/api_functions";

import Select from "react-select";
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
import cancel from "@/assets/images/3x/cancel.png";
import save from "@/assets/images/3x/save.png";
import moment from "moment";

export default class FeesInstallment extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      data: [],
      isReqsent: false,
      isEditDataSet: false,
      installmentEditData: "",
      show: false,
      opbranchList: [],
      opFeesMasterDetailsList: [],
      opFeeSubHeadIdList: [],
      opstandList: [],
      opDivisionList: [],
      opAcademicYearList: [],
      particularlist: [],
      opFeesHeadList: [],
      feesMasterId: 0,

      studentTypeOptions: [
        { label: "Day School", value: 1 },
        { label: "Residential", value: 2 },
      ],

      concessionOptions: [
        { label: "No Concession", value: 1 },
        { label: "3000 Concession", value: 2 },
        { label: "1000 Concession", value: 3 },
        { label: "2000 Concession", value: 4 },
      ],
      studentGroupOptions: [
        { label: "PCM", value: 1 },
        { label: "PCB", value: 2 },
      ],
      isLoading: true,
      initVal: {
        id: "",
        branchId: "",
        academicId: "",
        studentType: "",
        studentGroup: "",
        standardId: "",
        divisionId: "",
        feesMasterId: "",
        minimumAmount: "",
        noOfInstallments: "",
        amount: "",
        boys: "",
        girls: "",
      },
    };
  }

  setInitValAndLoadData() {
    this.setState({
      initVal: {
        id: "",
        branchId: "",
        academicId: "",
        studentType: "",
        studentGroup: "",
        standardId: "",
        divisionId: "",
        feesheadId: "",
        minimumAmount: "",
        feesMasterId: "",
        noOfInstallments: "",
        amount: "",
        boys: "",
        girls: "",
      },

      opendiv: false,
    });
  }

  setInstallmentEditData = () => {
    const { id, feesMasterId, concType } = this.state.installmentEditData;
    console.log(
      "this.state.installmentEditData",
      this.state.installmentEditData
    );
    console.log("id", id);
    this.setState({ isReqsent: true }, () => {
      let formData = new FormData();
      formData.append("id", id);
      formData.append("feesMasterId", feesMasterId);
      formData.append("concessionType", concType);
      getInstallmentsById(formData)
        .then((response) => {
          let res = response.data;
          let row = response.data.row;
          if (res.responseStatus == 200) {
            let data = res.responseObject;
            console.log("res", res);
            const {
              installmentEditData,
              opAcademicYearList,
              opbranchList,
              opstandList,
              studentTypeOptions,
              studentGroupOptions,
              concessionOptions,
            } = this.state;
            console.log({
              opAcademicYearList,
              installmentEditData,
              opbranchList,
            });

            let initData = {
              // id: data.id,
              branchId:
                data.branchId != null
                  ? getSelectValue(opbranchList, data.branchId)
                  : "",
              noOfInstallments: data.installmentNo,
              academicId:
                data.academicYearId != null ? data.academicYearId : "",
              standardId: data.standardId != null ? data.standardId : "",
              feesMasterId: data.feesMasterId != null ? data.feesMasterId : "",
              studentGroup: getSelectValue(
                studentGroupOptions,
                data.studentGroup
              ),
              studentType: getSelectValue(studentTypeOptions, data.studentType),
              concessionType: getSelectValue(
                concessionOptions,
                data.concessionType
              ),

              amount: data.feesAmount != null ? data.feesAmount : "",
              boys: data.amountForBoy != null ? data.amountForBoy : "",
              girls: data.amountForBoy != null ? data.amountForGirl : "",
            };
            console.log("initData", initData);

            for (let i = 0; i < data.installmentNo; i++) {
              console.log("e_d", data["expiryDate_" + i]);
              initData["expiryDate_" + (i + 1)] =
                data["expiryDate_" + i] != "" &&
                data["expiryDate_" + i] != undefined
                  ? new Date(data["expiryDate_" + i])
                  : "";

              initData["instId_" + (i + 1)] =
                data["instId_" + (i + 1)] != ""
                  ? data["instId_" + (i + 1)]
                  : "";
            }

            this.setState(
              {
                initVal: initData,
                isEditDataSet: true,
                opFeesMasterDetailsList: data.data,
                isReqsent: false,
              },
              () => {
                this.getAcademicYearData(
                  initData.branchId.value,
                  data.academicYearId
                );

                this.getStandardByBranchData(
                  initData.branchId.value,
                  data.standardId
                );
              }
            );
          }
        })
        .catch((error) => {
          console.log("error", error);
          this.setState({ isReqsent: false });
        });
    });
  };

  componentDidMount() {
    let companyId = authenticationService.currentUserValue.companyId;
    this.getBranchData(companyId);
    console.log("this.props", this.props);
    const { prop_data } = this.props.block;
    console.log("prop_Data ===--------->>>>>>>>", prop_data);
    this.setState({ installmentEditData: prop_data });
  }

  componentDidUpdate() {
    let {
      installmentEditData,
      isEditDataSet,
      opbranchList,
      opAcademicYearList,
      opstandList,
      isReqsent,
    } = this.state;
    console.log(" in componentDidUpdate =>>>>>>>>>>>>>>>>", opbranchList);

    if (
      isEditDataSet == false &&
      installmentEditData != "" &&
      isReqsent == false &&
      opbranchList.length > 0
    ) {
      this.setInstallmentEditData();
    }
  }

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

  getStandardByBranchData = (branchId, standardId = null) => {
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
              let { initVal } = this.state;
              if (standardId != null && standardId != "") {
                initVal["standardId"] = getSelectValue(
                  Opt,
                  parseInt(standardId)
                );

                this.setState({ initVal: initVal });
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

  getAcademicYearData = (branchId, academicYearId = null) => {
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
            this.setState({ opAcademicYearList: Opt }, () => {
              let { initVal } = this.state;
              if (academicYearId != null && academicYearId != "") {
                initVal["academicId"] = getSelectValue(
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
  getSubFeeHeadsByFeeHeadlst = (feeHeadId) => {
    let reqData = new FormData();
    reqData.append("feeHeadId", feeHeadId);
    getSubFeeHeadsByFeeHead(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          if (d.length > 0) {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.subFeeHeadName };
            });
            this.setState({ opFeeSubHeadIdList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opFeeSubHeadIdList: [] });
        console.log("error", error);
      });
  };

  getFeeHeadsByBranchlst = (branchId, studentType, studentGroup) => {
    let reqData = new FormData();
    console.log("in fess");
    reqData.append("branchId", branchId);
    reqData.append("studentType", studentType);
    reqData.append("studentGroup", studentGroup);
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
  getFeesMasterDetailsForInstallmentlst = (
    branchId,
    academicId,
    standardId,
    studentType,
    studentGroup
  ) => {
    let reqData = new FormData();
    console.log("in fess");

    reqData.append("branchId", branchId);
    reqData.append("academicYearId", academicId);
    reqData.append("standardId", standardId);
    reqData.append("studentType", studentType);
    reqData.append("studentGroup", studentGroup);

    getFeesMasterDetailsForInstallment(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          this.setState({
            opFeesMasterDetailsList: d,
            feesMasterId: res.feesMasterId,
          });
          // this.ref.current.setFieldValue("feesMasterId", res.feesMasterId);
          this.ref.current.setFieldValue("boys", res.amountForBoy);
          this.ref.current.setFieldValue("girls", res.amountForGirl);
          this.ref.current.setFieldValue("amount", res.amount);
          this.ref.current.setFieldValue(
            "noOfInstallments",
            res.noOfInstallments
          );
        } else {
          this.setState({ opFeesMasterDetailsList: [], feesMasterId: 0 });
        }
      })
      .catch((error) => {
        this.setState({ opFeesMasterDetailsList: [], feesMasterId: 0 });
        console.log("error", error);
      });
  };

  updateAmount = (value, keyElement, object, index) => {
    console.log("value", value, " keyElement", keyElement, " index", index);
    const { opFeesMasterDetailsList } = this.state;

    if (value != "" && keyElement != "") {
      object[keyElement] = value;
      let old_lst = opFeesMasterDetailsList;

      let is_updated = false;
      let final_state = old_lst.map((item) => {
        if (item.payHeadName === object.payHeadName) {
          is_updated = true;
          const updatedItem = object;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...opFeesMasterDetailsList, object];
      }
      this.setState({ opFeesMasterDetailsList: final_state });
    }
  };

  getInstallmentTotalAmount = (gender, keyElement) => {
    let { opFeesMasterDetailsList } = this.state;
    let resAmt = 0;
    opFeesMasterDetailsList.map((v) => {
      if (gender + keyElement in v)
        resAmt = parseFloat(resAmt) + parseFloat(v[gender + keyElement]);
    });

    return isNaN(resAmt) ? 0 : numberWithCommasIN(resAmt, true, 2);
  };

  pageReload = () => {
    this.componentDidMount();
  };

  render() {
    const {
      initVal,
      opbranchList,

      opstandList,
      concessionOptions,
      studentGroupOptions,
      studentTypeOptions,
      opAcademicYearList,
      opFeesMasterDetailsList,
      feesMasterId,
    } = this.state;

    return (
      <div className="">
        <Formik
          validateOnChange={false}
          // validateOnBlur={false}
          innerRef={this.ref}
          enableReinitialize={true}
          initialValues={initVal}
          validationSchema={Yup.object().shape({})}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            let requestData = new FormData();
            console.log("opFeesMasterDetailsList", {
              values,
              opFeesMasterDetailsList,
            });
            let frow = opFeesMasterDetailsList.map((v, i) => {
              if (v.payHeadId != "") {
                let d = {
                  paymentHeadId: v.payHeadId,
                  feeHeadId: v.feeHeadId,
                  isSubHead: v.isSubHead,
                  priority: v.priority,
                };

                for (let i = 0; i < values.noOfInstallments; i++) {
                  if (
                    (values.standardId.label == 11 ||
                      values.standardId.label == 12) &&
                    values.studentType.value == 2
                  ) {
                    d["boys" + i] = v["boys" + i];
                    d["girls" + i] = v["girls" + i];
                  } else {
                    d["amt" + i] = v["amt" + i];
                  }
                }

                return d;
              }
            });
            console.log("frow", frow);

            for (let i = 0; i < values.noOfInstallments; i++) {
              if (
                values["expiryDate_" + parseInt(i + 1)] != null &&
                values["expiryDate_" + parseInt(i + 1)] != ""
              ) {
                requestData.append(
                  "expiryDate_" + i,
                  moment(values["expiryDate_" + parseInt(i + 1)]).format(
                    "yyyy-MM-DD"
                  )
                );
              }

              requestData.append(
                "instId_" + parseInt(i + 1),
                values["instId_" + parseInt(i + 1)]
              );
            }

            requestData.append("branchId", values.branchId.value);
            requestData.append("concessionType", values.concessionType.value);

            if (values.studentGroup != null && values.studentGroup != "") {
              requestData.append(
                "studentGroup",
                values.studentGroup != null && values.studentGroup != ""
                  ? values.studentGroup.value
                  : ""
              );
            }
            requestData.append("studentType", values.studentType.value);
            requestData.append("feesMasterId", values.feesMasterId);
            requestData.append("amount", values.amount);
            requestData.append("noOfInstallments", values.noOfInstallments);
            requestData.append("row", JSON.stringify(frow));

            updateInstallmentMaster(requestData)
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
                  this.pageReload();
                  eventBus.dispatch("page_change", "feesinstallmentList");
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
              {/* {JSON.stringify(values)} */}
              <div
                id="example-collapse-text"
                className="common-form-style mt-2 p-2"
              >
                <div className="main-divform mb-2 m-0">
                  <div className="common-form-style m-0 mb-2">
                    <Row className="">
                      <Col md="12" className="mb-2">
                        <Row className="row-inside">
                          <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Branch</Form.Label>
                              <Select
                                isDisabled={true}
                                isClearable={true}
                                className="selectTo"
                                styles={customStyles}
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
                          <Col lg="2" md="2">
                            <Form.Group>
                              <Form.Label>Year</Form.Label>
                              <Select
                                isClearable={true}
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  setFieldValue("academicId", "");
                                  if (v != null) {
                                    setFieldValue("academicId", v);
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
                                isClearable={true}
                                onChange={(v) => {
                                  setFieldValue("standardId", "");
                                  setFieldValue("studentType", "");
                                  setFieldValue("studentGroup", "");
                                  if (v != null) {
                                    setFieldValue("standardId", v);
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

                          <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Student Type</Form.Label>
                              <Select
                                className="selectTo"
                                styles={customStyles}
                                isClearable={true}
                                name="studentType"
                                options={studentTypeOptions}
                                value={values.studentType}
                                onChange={(v) => {
                                  setFieldValue("studentType", "");
                                  setFieldValue("studentGroup", "");
                                  if (v != null) {
                                    setFieldValue("studentType", v);

                                    if (
                                      values.standardId &&
                                      values.standardId.label != "11" &&
                                      values.standardId.label != "12"
                                    ) {
                                      this.getFeesMasterDetailsForInstallmentlst(
                                        values.branchId.value,
                                        values.academicId.value,
                                        values.standardId.value,
                                        v.value,
                                        values.studentGroup != null &&
                                          values.studentGroup != ""
                                          ? values.studentGroup.value
                                          : ""
                                      );
                                    }
                                  } else {
                                    this.setState({
                                      opFeesMasterDetailsList: [],
                                    });
                                  }
                                }}
                              />
                            </Form.Group>
                          </Col>

                          {values.standardId &&
                          parseInt(values.standardId.label) >= 11 ? (
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

                                      this.getFeesMasterDetailsForInstallmentlst(
                                        values.branchId.value,
                                        values.academicId.value,
                                        values.standardId.value,
                                        values.studentType.value,
                                        v.value
                                      );
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
                          <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Select Concession</Form.Label>
                              <Select
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  if (v != null) {
                                    setFieldValue("concessionType", v);
                                  } else {
                                    setFieldValue("concessionType", "");
                                  }
                                }}
                                name="concessionType"
                                options={concessionOptions}
                                value={values.concessionType}
                                invalid={errors.concessionType ? true : false}
                              />
                              <span className="text-danger errormsg">
                                {errors.concessionType && errors.concessionType}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="row-inside">
                          {values.standardId &&
                          parseInt(values.standardId.label) >= 11 &&
                          values.studentType &&
                          parseInt(values.studentType.value) == 2 ? (
                            <>
                              <Col lg="1" md="2">
                                <Form.Group className="createnew">
                                  <Form.Label>Boys Fees Amount</Form.Label>
                                  <Form.Control
                                    readOnly={true}
                                    type="text"
                                    placeholder="amount"
                                    name="boys"
                                    id="boys"
                                    // onChange={handleChange}
                                    onChange={(v) => {
                                      if (v != null) {
                                        setFieldValue("boys", v);
                                      } else {
                                        setFieldValue("boys", "");
                                      }
                                    }}
                                    value={values.boys}
                                    isValid={touched.boys && !errors.boys}
                                    isInvalid={!!errors.boys}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.boys}
                                  </span>
                                </Form.Group>
                              </Col>
                              <Col lg="1" md="2">
                                <Form.Group className="createnew">
                                  <Form.Label>Girls Fees Amount</Form.Label>
                                  <Form.Control
                                    readOnly={true}
                                    type="text"
                                    placeholder="amount"
                                    name="girls"
                                    id="girls"
                                    onChange={handleChange}
                                    value={values.girls}
                                    isValid={touched.girls && !errors.girls}
                                    isInvalid={!!errors.girls}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.girls}
                                  </span>
                                </Form.Group>
                              </Col>
                            </>
                          ) : (
                            <Col lg="1" md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Fees Amount</Form.Label>
                                <Form.Control
                                  readOnly={true}
                                  type="text"
                                  placeholder="amount"
                                  name="amount"
                                  id="amount"
                                  onChange={handleChange}
                                  value={values.amount}
                                  isValid={touched.amount && !errors.amount}
                                  isInvalid={!!errors.amount}
                                />
                                <span className="text-danger errormsg">
                                  {errors.amount}
                                </span>
                              </Form.Group>
                            </Col>
                          )}

                          <Col lg="1" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Installment No</Form.Label>
                              <Form.Control
                                readOnly={true}
                                type="text"
                                placeholder="installment no."
                                name="noOfInstallments"
                                id="noOfInstallments"
                                onChange={handleChange}
                                value={values.noOfInstallments}
                                isValid={
                                  touched.noOfInstallments &&
                                  !errors.noOfInstallments
                                }
                                isInvalid={!!errors.noOfInstallments}
                              />
                              <span className="text-danger errormsg">
                                {errors.noOfInstallments}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>

              <div className="wrapper_div" style={{ height: "58vh" }}>
                {/* <h6>Group</h6> */}

                <div className="cust_table">
                  <Row style={{ padding: "2px" }}></Row>
                  {/* {data.length > 0 && ( */}
                  <div
                    className="table_wrapper denomination-style"
                    style={{
                      height: "48vh",
                      overflow: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {/* {JSON.stringify(opFeesMasterDetailsList)} */}
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
                              <th>Boys Amount</th>
                              <th>Girls Amount</th>
                            </>
                          ) : (
                            <th>Amount</th>
                          )}
                          {Array.from(
                            Array(values.noOfInstallments),
                            (e, i) => {
                              return (
                                <th>
                                  Installment {i + 1}
                                  <Col lg={4} md={4} sm={2} className="mb-2">
                                    <Form.Label className="formlabelsize">
                                      Expiry Date{" "}
                                    </Form.Label>
                                    <MyDatePicker
                                      className="datepic form-control"
                                      styles={customStyles}
                                      name={"expiryDate" + i}
                                      id={"expiryDate" + i}
                                      placeholderText="dd/MM/yyyy"
                                      dateFormat="dd/MM/yyyy"
                                      value={
                                        values["expiryDate_" + parseInt(i + 1)]
                                          ? values[
                                              "expiryDate_" + parseInt(i + 1)
                                            ]
                                          : ""
                                      }
                                      onChange={(date) => {
                                        setFieldValue(
                                          "expiryDate_" + parseInt(i + 1),
                                          date
                                        );
                                      }}
                                      selected={
                                        values["expiryDate_" + parseInt(i + 1)]
                                          ? values[
                                              "expiryDate_" + parseInt(i + 1)
                                            ]
                                          : ""
                                      }
                                    />
                                  </Col>
                                </th>
                              );
                            }
                          )}
                        </tr>
                      </thead>
                      {/* {JSON.stringify(opFeesMasterDetailsList)} */}

                      <tfoot>
                        <tr className="fontbold">
                          {values.standardId &&
                          parseInt(values.standardId.label) >= 11 &&
                          values.studentType &&
                          parseInt(values.studentType.value) == 2 ? (
                            <>
                              <th colSpan={5}>Total</th>
                              {Array.from(
                                Array(values.noOfInstallments),
                                (e, i) => {
                                  return (
                                    <th>
                                      <td colSpan={2}>
                                        {this.getInstallmentTotalAmount(
                                          "boys",
                                          i
                                        )}
                                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                        &nbsp; &nbsp;
                                        {this.getInstallmentTotalAmount(
                                          "girls",
                                          i
                                        )}
                                      </td>
                                    </th>
                                  );
                                }
                              )}
                            </>
                          ) : (
                            <>
                              <th colSpan={4}>Total</th>
                              {Array.from(
                                Array(values.noOfInstallments),
                                (e, i) => {
                                  return (
                                    <th>
                                      {this.getInstallmentTotalAmount("amt", i)}
                                    </th>
                                  );
                                }
                              )}
                            </>
                          )}
                          <th></th>
                        </tr>
                      </tfoot>

                      <tbody>
                        {opFeesMasterDetailsList &&
                          opFeesMasterDetailsList.map((v, key) => {
                            return (
                              <tr key={key}>
                                <td>{key + 1}</td>
                                <td>{v.payHeadName}</td>
                                <td>{v.priority}</td>
                                {values.standardId &&
                                parseInt(values.standardId.label) >= 11 &&
                                values.studentType &&
                                parseInt(values.studentType.value) == 2 ? (
                                  <>
                                    <td>
                                      {v.boys &&
                                        numberWithCommasIN(v.boys, true, 2)}
                                    </td>
                                    <td>
                                      {v.girls &&
                                        numberWithCommasIN(v.girls, true, 2)}
                                    </td>
                                  </>
                                ) : (
                                  <td>
                                    {v.amount &&
                                      numberWithCommasIN(v.amount, true, 2)}
                                  </td>
                                )}

                                {Array.from(
                                  Array(values.noOfInstallments),
                                  (e, i) => {
                                    return (
                                      <td>
                                        {values.standardId &&
                                        parseInt(values.standardId.label) >=
                                          11 &&
                                        values.studentType &&
                                        parseInt(values.studentType.value) ==
                                          2 ? (
                                          <>
                                            <div
                                              style={{
                                                display: "flex",
                                                width: "100%",
                                              }}
                                            >
                                              <Form.Control
                                                type="text"
                                                placeholder=""
                                                name={v.res + key + i}
                                                onChange={(e) => {
                                                  if (
                                                    e.target.value != null &&
                                                    e.target.value != ""
                                                  ) {
                                                    this.updateAmount(
                                                      e.target.value,
                                                      "boys" + i,
                                                      v,
                                                      i
                                                    );
                                                  } else {
                                                    this.updateAmount(
                                                      "0",
                                                      "boys" + i,
                                                      v,
                                                      i
                                                    );
                                                  }
                                                }}
                                                value={v["boys" + i]}
                                                className="formbg"
                                                style={{
                                                  width: "50%",
                                                }}
                                              />
                                              <Form.Control
                                                type="text"
                                                placeholder=""
                                                name={v.res + key + i}
                                                onChange={(e) => {
                                                  if (
                                                    e.target.value != null &&
                                                    e.target.value != ""
                                                  ) {
                                                    this.updateAmount(
                                                      e.target.value,
                                                      "girls" + i,
                                                      v,
                                                      i
                                                    );
                                                  } else {
                                                    this.updateAmount(
                                                      "0",
                                                      "girls" + i,
                                                      v,
                                                      i
                                                    );
                                                  }
                                                }}
                                                value={v["girls" + i]}
                                                className="formbg"
                                                style={{
                                                  width: "50%",
                                                }}
                                              />
                                            </div>
                                          </>
                                        ) : (
                                          <Form.Control
                                            type="text"
                                            placeholder="0"
                                            name={v.res + key + i}
                                            onChange={(e) => {
                                              if (
                                                e.target.value != null &&
                                                e.target.value != ""
                                              ) {
                                                this.updateAmount(
                                                  e.target.value,
                                                  "amt" + i,
                                                  v,
                                                  i
                                                );
                                              } else {
                                                this.updateAmount(
                                                  "0",
                                                  "amt" + i,
                                                  v,
                                                  i
                                                );
                                              }
                                            }}
                                            value={v["amt" + i]}
                                            className="formbg"
                                          />
                                        )}
                                      </td>
                                    );
                                  }
                                )}
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
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
                        eventBus.dispatch("page_change", "feesinstallmentList");
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
