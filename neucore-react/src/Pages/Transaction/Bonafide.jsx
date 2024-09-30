import React, { Component } from "react";
import { Button, Col, Row, Form, Table, Figure } from "react-bootstrap";

import moment from "moment";
import {
  listOfCompanies,
  authenticationService,
  getAcademicYearByBranch,
  getBranchesByInstitute,
  getStandardsByBranch,
  getDivisionsByStandard,
  getStudentListForTransaction,
  getStudentOutstanding,
  createTransaction,
  getConcessionsByInstallment,
  getDetailsByInstallment,
  getInstallments,
  getStudentDetailsforBonafide,
  getDetailsByInstallmentForManual,
} from "@/services/api_functions";

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
} from "@/helpers";

import arrowicon from "@/assets/images/3x/arrowicon.png";
import edit from "@/assets/images/3x/edit.png";
import cancel from "@/assets/images/3x/cancel.png";
import exit from "@/assets/images/3x/exit.png";
import save from "@/assets/images/3x/save.png";
import reset from "@/assets/images/reset.png";
const CustomClearText = () => "clear all";
const ClearIndicator = (props) => {
  const {
    children = <CustomClearText />,
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;
  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles("clearIndicator", props)}
    >
      <div style={{ padding: "0px 5px" }}>{children}</div>
    </div>
  );
};

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});
const current = new Date();
const dates = `${current.getDate()}/${
  current.getMonth() + 1
}/${current.getFullYear()}`;
export default class Bonafide extends React.Component {
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
      studentInfo: [],
      initVal: {
        id: "",
        instituteId: "",
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
      outstandingAmount: 0,
    };
    this.ref = React.createRef();
  }

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  pageReload = () => {
    this.componentDidMount();
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

  getConcessionFromInstallmentData = (studentId, feesMasterId) => {
    let reqData = new FormData();
    reqData.append("studentId", studentId);
    reqData.append("feesMasterId", feesMasterId);
    getConcessionsByInstallment(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let { IsInstallment } = this.transFormRef.current.values;
          let Opt = d.map(function (values) {
            if (res.concessionType == null && res.isManual == null) {
              if (
                IsInstallment == "no" &&
                parseInt(values.concessionTypeValue) === 0
              ) {
                return {
                  value: values.concessionTypeValue,
                  label: values.concessionType,
                };
              } else if (
                IsInstallment == "yes" &&
                parseInt(values.concessionTypeValue) !== 0
              ) {
                return {
                  value: values.concessionTypeValue,
                  label: values.concessionType,
                };
              }
            } else if (
              res.isManual == true &&
              parseInt(res.concessionType) == 0
            ) {
              if (parseInt(values.concessionTypeValue) === 0) {
                return {
                  value: values.concessionTypeValue,
                  label: values.concessionType,
                };
              }
            } else {
              if (parseInt(res.concessionType) === 0) {
                return {
                  value: values.concessionTypeValue,
                  label: values.concessionType,
                };
              } else if (
                parseInt(values.concessionTypeValue) !== 0 &&
                parseInt(res.concessionType) !== 0
              ) {
                return {
                  value: values.concessionTypeValue,
                  label: values.concessionType,
                };
              }
            }
          });
          Opt = Opt.filter((v) => v != undefined);
          this.setState({ concessions: Opt }, () => {
            this.transFormRef.current.setFieldValue(
              "installmentNo",
              res.installmentNo
            );
            this.transFormRef.current.setFieldValue(
              "transactionId",
              res.transactionId
            );
            this.transFormRef.current.setFieldValue("isManual", res.isManual);
            // concessionType
            if (res.concessionType && res.concessionType != "")
              if (this.transFormRef.current) {
                if (parseInt(res.concessionType) != 0) {
                  this.transFormRef.current.setFieldValue(
                    "IsInstallment",
                    "yes"
                  );
                } else {
                  this.transFormRef.current.setFieldValue(
                    "IsInstallment",
                    "no"
                  );
                }
              }
            this.transFormRef.current.setFieldValue(
              "concessionNo",
              res.concessionType
            );
          });
        } else {
          this.setState({ concessions: [] });
        }
      })
      .catch((error) => {
        this.setState({ opAcademicYearList: [] });
        console.log("error", error);
      });
  };

  getInstallmentStructure = () => {
    let {
      feesMasterId,
      studentId,
      installmentNo,
      concessionNo,
      payable,
      transactionId,
    } = this.state.initVal;
    let reqData = new FormData();
    reqData.append("feesMasterId", feesMasterId);
    reqData.append("studentId", studentId.value);
    reqData.append("installmentNo", installmentNo);
    reqData.append("concessionNo", concessionNo);
    reqData.append("transactionId", transactionId);
    if (payable != "") {
      reqData.append("payable", payable.toString().trim());
      getDetailsByInstallmentForManual(reqData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            // // this.transFormRef.current.setFieldValue(
            // //   "outstanding",
            // //   res.outstanding
            // // );
            // this.transFormRef.current.setFieldValue("payable", res.payable);
            // // this.transFormRef.current.setFieldValue("totalFees", res.totalFees);
            // let pList = res.responseObject;
            // pList.sort((a, b) => {
            //   return parseInt(a.priority) - parseInt(b.priority);
            // });
            // pList = pList.map((v) => {
            //   v["org_concession"] = v.concession;
            //   v["org_installmentPer"] = v.installmentPer;
            //   v["org_paid"] = v.paid;
            //   v["org_balance"] = v.balance;
            //   v["org_totalFees"] = v.totalFees;
            //   return v;
            // });
            // this.setState({ payheadList: pList }, () => {
            //   this.calculatePayheads();
            // });

            this.setState(
              {
                outstandingAmount: res.outstanding,
                payheadList: res.responseObject,
              },
              () => {
                if (res.outstanding == 0) {
                  console.log("fees paid successfully");
                }
              }
            );
          } else {
            this.setState({ outstandingAmount: 0, payheadList: [] });
          }
        })
        .catch((error) => {
          this.setState({ opAcademicYearList: [] });
          console.log("error", error);
        });
    } else {
      // reqData.append("payable", 0);
      getDetailsByInstallment(reqData)
        .then((response) => {
          let res = response.data;

          if (res.responseStatus == 200) {
            // // this.transFormRef.current.setFieldValue(
            // //   "outstanding",
            // //   res.outstanding
            // // );
            // this.transFormRef.current.setFieldValue("payable", res.payable);
            // // this.transFormRef.current.setFieldValue("totalFees", res.totalFees);
            // let pList = res.responseObject;
            // pList.sort((a, b) => {
            //   return parseInt(a.priority) - parseInt(b.priority);
            // });
            // pList = pList.map((v) => {
            //   v["org_concession"] = v.concession;
            //   v["org_installmentPer"] = v.installmentPer;
            //   v["org_paid"] = v.paid;
            //   v["org_balance"] = v.balance;
            //   v["org_totalFees"] = v.totalFees;
            //   return v;
            // });
            // this.setState({ payheadList: pList }, () => {
            //   this.calculatePayheads();
            // });

            this.setState(
              {
                outstandingAmount: res.outstanding,
                payheadList: res.responseObject,
              },
              () => {
                if (res.outstanding == 0) {
                  console.log("fees paid successfully");
                }
              }
            );
          } else {
            this.setState({ outstandingAmount: 0, payheadList: [] });
          }
        })
        .catch((error) => {
          this.setState({ opAcademicYearList: [] });
          console.log("error", error);
        });
    }
  };

  getInstituteData = () => {
    listOfCompanies()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.companyName };
            });

            this.setState({ opInstituteList: Opt }, () => {
              let instituteId = getSelectValue(
                Opt,
                authenticationService.currentUserValue.companyId
              );
              this.transFormRef.current.setFieldValue(
                "instituteId",
                instituteId
              );

              let { initVal } = this.state;

              initVal["instituteId"] = instituteId;
              this.setState({ initVal: initVal });
            });
          }
        }
      })
      .catch((error) => {
        this.setState({ opInstituteList: [] });
        console.log("error", error);
      });
  };
  handleFetchData = (id) => {
    eventBus.dispatch("page_change", {
      from: "voucher_paymentlist",
      to: "voucher_payment",
      isNewTab: false,
      prop_data: id,
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
        divName: "",
        divisionId: "",
        studentType: "",
        studentRollNo: "",
        studentName: "",
        outstanding: "",
        totalFees: "",
        payment: "",
        installmentNo: "",
      },
    });
  }
  getStudentData = (
    branchId,
    academicYearId,
    standardId,
    divisionId,
    studentType
  ) => {
    // console.log({
    //   branchId,
    //   academicYearId,
    //   standardId,
    //   divisionId,
    //   studentType,
    // });
    if (
      branchId != null &&
      academicYearId != null &&
      standardId != null &&
      divisionId != null &&
      studentType != null
    ) {
      let requestData = new FormData();
      requestData.append("branchId", branchId.value);
      requestData.append("academicYearId", academicYearId.value);
      requestData.append("standardId", standardId.value);
      requestData.append("divisionId", divisionId.value);
      requestData.append("studentType", studentType.value);
      getStudentListForTransaction(requestData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            let d = res.responseObject;
            // if (d.length > 0)
            {
              let Opt = d.map(function (values) {
                return {
                  value: values.id,
                  label: values.firstName + " " + values.lastName,
                };
              });
              let opt1 = d.map(function (values) {
                return {
                  value: values.id,
                  label: values.id,
                };
              });
              this.setState({ opStudentList: Opt, optRollno: opt1 });
            }
          } else {
            this.setState({ opStudentList: [], optRollno: [] });
          }
        })
        .catch((error) => {
          this.setState({ opDivisionList: [] });
          console.log("error", error);
        });
    } else {
      console.log("wrong data");
    }
  };

  getStudentOutstandingAmount = (
    branchId,
    academicYearId,
    standardId,
    divisionId,
    studentType,
    studentId
  ) => {
    // console.log({
    //   branchId,
    //   academicYearId,
    //   standardId,
    //   divisionId,
    //   studentType,
    //   studentId,
    // });
    if (
      branchId != null &&
      academicYearId != null &&
      standardId != null &&
      divisionId != null &&
      studentType != null &&
      studentId != null
    ) {
      let requestData = new FormData();
      requestData.append("branchId", branchId.value);
      requestData.append("academicYearId", academicYearId.value);
      requestData.append("standardId", standardId.value);
      requestData.append("divisionId", divisionId.value);
      requestData.append("studentId", studentId);
      requestData.append("studentType", studentType.value);

      getStudentOutstanding(requestData)
        .then((response) => {
          this.setState({ isLoading: false });
          if (response.data.responseStatus === 200) {
            let res = response.data.responseObject;

            this.transFormRef.current.setFieldValue(
              "outstanding",
              res.outstandingAmount
            );

            this.transFormRef.current.setFieldValue(
              "feesMasterId",
              res.feesMasterId
            );

            this.transFormRef.current.setFieldValue(
              "transactionId",
              res.transactionId
            );

            let pList = res.list;

            pList.sort((a, b) => {
              return parseInt(a.priority) - parseInt(b.priority);
            });

            pList = pList.map((v) => {
              v["org_concession"] = v.concession;
              v["org_installmentPer"] = v.installmentPer;
              v["org_paid"] = v.paid;
              v["org_balance"] = v.balance;
              v["org_totalFees"] = v.totalFees;

              return v;
            });

            let iOpts = res.installments.map(function (values) {
              return { value: values, label: values };
            });

            let cOpts = res.concessions.map(function (values) {
              return { value: values, label: values };
            });
            this.setState({
              installments: iOpts,
              concessions: cOpts,
              payheadList: pList,
            });
          } else {
            // setSubmitting(false);
            // toast.error("✘ " + response.data.message);
          }
        })
        .catch((error) => {
          console.log("errors", error);
        });
    }
  };

  getStudentDataforBonafide = (
    branchId,
    academicYearId,
    standardId,
    divisionId,
    studentType,
    studentId
  ) => {
    console.log({
      branchId,
      academicYearId,
      standardId,
      divisionId,
      studentType,
      studentId,
    });
    if (
      branchId != null &&
      academicYearId != null &&
      standardId != null &&
      divisionId != null &&
      studentType != null &&
      studentId != null
    ) {
      let requestData = new FormData();
      requestData.append("branchId", branchId.value);
      requestData.append("academicYearId", academicYearId.value);
      requestData.append("standardId", standardId.value);
      requestData.append("divisionId", divisionId.value);
      requestData.append("studentId", studentId);
      requestData.append("studentType", studentType.value);

      getStudentDetailsforBonafide(requestData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            let data = res.responseObject;
            let sdata = data;

            console.log("sdata", sdata);
            this.setState({ studentInfo: sdata });
          }
        })
        .catch((error) => {
          console.log("errors", error);
        });
    }
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      // this.getInstituteData();
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
        {" "}
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

  submitCalculations = () => {
    let requestData = new FormData();
    let { initVal: values, payheadList } = this.state;
    requestData.append(
      "instituteId",
      authenticationService.currentUserValue.companyId
    );
    requestData.append("branchId", values.branchId.value);
    requestData.append("academicYearId", values.academicYearId.value);
    requestData.append("standardId", values.standardId.value);
    requestData.append("divisionId", values.divisionId.value);
    requestData.append("studentId", values.studentId.value);
    requestData.append("feesMasterId", values.feesMasterId);
    requestData.append("transactionId", values.transactionId);

    requestData.append("installmentNo", values.installmentNo);
    requestData.append("concessionNo", values.concessionNo);
    if (values.transactionId == 0) {
      requestData.append("balance", values.totalFees - values.payable);
    } else {
      requestData.append("balance", values.outstanding - values.payable);
    }
    requestData.append("totalFees", values.totalFees);
    requestData.append("row", JSON.stringify(payheadList));
    // for (var pair of requestData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    createTransaction(requestData)
      .then((response) => {
        if (response.data.responseStatus === 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: response.data.message,
            is_timeout: true,
            delay: 1000,
          });
          if (this.transFormRef.current) {
            this.transFormRef.current.resetForm();
            this.setInitValue();
          }
          eventBus.dispatch("page_change", "studentPaymentList");
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: response.data.message,
            is_button_show: true,
            response,
          });
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        // toast.error("✘ " + error);
        console.log("errors", error);
      });
  };

  getConsessionDisabled = (concessionNo) => {
    let { concessions } = this.state;
    if (this.transFormRef.current) {
      if (this.transFormRef.current.values.IsInstallment == "yes") {
        let f = concessions.find((v) => {
          return parseInt(v.value) == parseInt(concessionNo);
        });

        return f ? true : false;
      }
    }
    return false;
  };

  callPrint = () => {
    var newWin = window.frames["printf"];
    var divToPrint = document.getElementById("printDiv");
    let data = divToPrint.outerHTML;
    let htmlToPrint = '<body onload="window.print()">';
    htmlToPrint +=
      "<style>@media print {" +
      "body {" +
      "width: 100%;" +
      // "margin: 0;" +
      // "color: #ffffff;" +
      // "background-color: #000000;" +
      "font-size: 18px;" +
      "margin-top: 0px;" +
      "page-break-after: auto;" +
      "font-family: Calibri;" +
      "}" +
      "@page {" +
      "margin-left: 0cm;" +
      "margin-right: 0cm;" +
      "margin-top:0cm;" +
      "}" +
      ".data_body {" +
      "width: 98%;" +
      "display: inline-block;" +
      "font-size: 18px;" +
      "font-family: Calibri;" +
      "border: 1px solid;" +
      "}" +
      ".border-style{" +
      "border-right: 1px dashed black;" +
      "margin-right: 10px" +
      "}" +
      ".p-style{" +
      "font-size: 10px;" +
      "margin: 0px;" +
      "}" +
      ".rec-style{" +
      "font-size: 13px;" +
      "text-align: start;" +
      "margin-left:2px;" +
      "margin:5px;" +
      "margin-bottom:11px;" +
      "line-height:5px;" +
      "}" +
      ".sign-style{" +
      "margin-left:5px;" +
      "font-size: 13px;" +
      "margin-top: 30px;" +
      "text-align: start;" +
      "}" +
      ".h3-style{" +
      "font-size: 16px;" +
      "margin: 0px;" +
      "}" +
      ".outlet-header {" +
      "margin-top: 0px;" +
      "text-transform: uppercase;" +
      "font-weight: bold;" +
      "margin-bottom: 0px;" +
      "font-size: 18px;" +
      "text-align: center;" +
      "font-family: Calibri;" +
      "}" +
      ".text-center {" +
      "text-align: center;" +
      "}" +
      ".text-end {" +
      "text-align: end;" +
      "}" +
      ".outlet-address {" +
      "word-wrap: break-word;" +
      "text-align: center;" +
      "font-style: italic;" +
      "font-weight: 500;" +
      "margin-bottom: 0;" +
      "font-size: 12px;" +
      "margin-top: 0px;" +
      "font-family: Calibri;" +
      "}" +
      ".printtop {" +
      "border-bottom: 1px solid #333;" +
      "}" +
      ".support {" +
      "text-align: center;" +
      "word-wrap: break-word;" +
      "font-weight: 500;" +
      "font-size: 12px;" +
      "margin-top: 0px;" +
      "margin-bottom: 0 !important;" +
      "font-family: Calibri;" +
      "}" +
      ".support1 {" +
      "font-size: 12px;" +
      // "text-align: center;" +
      "word-wrap: break-word;" +
      "margin-top: 2px;" +
      "margin-bottom: 0 !important;" +
      "font-family: Calibri;" +
      // font-family: Calibri;
      "}" +
      ".receipt-tbl {" +
      "width: 92.5%;" +
      "border-collapse: collapse;" +
      "font-size: 8px;" +
      ".tbody-style {" +
      "font-family: Calibri;" +
      "}" +
      "}" +
      ".th-style {" +
      // "font-weight: 500;" +
      "border-bottom: 1px solid #333;" +
      "border-top: 1px solid #333;" +
      "text-align:start;" +
      "width:70%;" +
      // "font-family: Calibri;" +
      "}" +
      ".td-style {" +
      "text-align:start;" +
      "border-right:1px solid #000;" +
      "border-left:1px solid #000;" +
      "border-bottom:1px solid #000;" +
      "font-size: 13px;" +
      "}" +
      ".amt-th-style {" +
      "text-align:center !important;" +
      "}" +
      ".amt-style {" +
      // "text-align:end !important;" +
      "width:50px;" +
      "}" +
      "}</style>";
    htmlToPrint += data;
    htmlToPrint += "</body>";
    newWin.document.write(htmlToPrint);
    newWin.document.close();
  };

  render() {
    const {
      initVal,
      opBranchList,
      opDivisionList,
      opInstituteList,
      opStandardList,
      opAcademicYearList,
      opStudentList,
      payheadList,
      optRollno,
      studentTypeOptions,
      installments,
      concessions,
      studentInfo,
    } = this.state;
    return (
      <>
        <Formik
          innerRef={this.transFormRef}
          initialValues={initVal}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({})}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            // this.setState({ isLoading: true });
            setSubmitting(false);
            this.setState({ initVal: values }, () => {
              this.setInitValue();
              this.getInstallmentStructure();
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
                {/* {JSON.stringify(initVal)}
                 */}
                <div className="main-divform mb-2 m-0">
                  <div className="common-form-style m-0 mb-2">
                    <Row className="">
                      <Col md="12" className="mb-2">
                        <Row className="row-inside">
                          {/* <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Institute</Form.Label>
                              <Select
                                className="selectTo formbg"
                                styles={customStyles}
                                isDisabled={true}
                                onChange={(v) => {
                                  setFieldValue("instituteId", v);
                                }}
                                name="instituteId"
                                options={opInstituteList}
                                value={values.instituteId}
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
                                    console.log("v ===>>>>> ", v);
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
                                  //   this.getStudentData(
                                  //     values.branchId,
                                  //     values.academicYearId,
                                  //     values.standardId,
                                  //     v
                                  //   );
                                  // } else {
                                  //   this.setState({
                                  //     opStudentList: [],
                                  //   });
                                  // }
                                }}
                              />
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
                                  if (v != null) {
                                    setFieldValue("studentType", v);

                                    this.getStudentData(
                                      values.branchId,
                                      values.academicYearId,
                                      values.standardId,
                                      values.divisionId,
                                      v
                                    );
                                  } else {
                                    this.setState({
                                      opStudentList: [],
                                    });
                                  }
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="row-inside">
                          <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Student Roll No.</Form.Label>
                              <Select
                                className="selectTo"
                                styles={customStyles}
                                isClearable={true}
                                onChange={(v) => {
                                  if (v != null) {
                                    setFieldValue("studentRollNo", v);
                                    setFieldValue(
                                      "studentId",
                                      getSelectValue(opStudentList, v.value)
                                    );
                                    this.getStudentDataforBonafide(
                                      values.branchId,
                                      values.academicYearId,
                                      values.standardId,
                                      values.divisionId,
                                      values.studentType,
                                      v.value
                                    );
                                  } else {
                                    setFieldValue("studentRollNo", "");
                                    setFieldValue("studentId", "");
                                  }
                                }}
                                name="studentRollNo"
                                options={optRollno}
                                value={values.studentRollNo}
                              />
                            </Form.Group>
                          </Col>

                          <Col lg="2" md="2">
                            <Form.Group>
                              <Form.Label>Student Name</Form.Label>
                              <Select
                                className="selectTo"
                                styles={customStyles}
                                isClearable={true}
                                onChange={(v) => {
                                  if (v != null) {
                                    setFieldValue("studentRollNo", v);
                                    setFieldValue(
                                      "studentId",
                                      getSelectValue(opStudentList, v.value)
                                    );
                                    this.getStudentDataforBonafide(
                                      values.branchId,
                                      values.academicYearId,
                                      values.standardId,
                                      values.divisionId,
                                      values.studentType,
                                      v.value
                                    );
                                  } else {
                                    setFieldValue("studentRollNo", "");
                                    setFieldValue("studentId", "");
                                  }
                                }}
                                name="studentId"
                                options={opStudentList}
                                value={values.studentId}
                              />
                              <span className="text-danger errormsg">
                                {errors.studentId}
                              </span>
                            </Form.Group>
                          </Col>

                          {values.outstanding > 0 && installments.length > 0 && (
                            <Col lg="1" md="2">
                              <Form.Group>
                                <Form.Label>Installment</Form.Label>
                                <Row>
                                  <Col>
                                    <Form.Check
                                      type="radio"
                                      label="Yes"
                                      className="pr-3"
                                      name="IsInstallment"
                                      id="IsInstallmentYes"
                                      onClick={() => {
                                        setFieldValue("IsInstallment", "yes");
                                        this.getConcessionFromInstallmentData(
                                          values.studentId.value,
                                          values.feesMasterId
                                        );
                                      }}
                                      value="yes"
                                      checked={
                                        values.IsInstallment == "yes"
                                          ? true
                                          : false
                                      }
                                      disabled={
                                        values.isManual == true ? true : false
                                      }
                                    />{" "}
                                  </Col>
                                  <Col className="me-4">
                                    {" "}
                                    <Form.Check
                                      type="radio"
                                      label="No"
                                      name="IsInstallment"
                                      id="IsInstallmentNo"
                                      onClick={() => {
                                        setFieldValue("IsInstallment", "no");
                                        this.getConcessionFromInstallmentData(
                                          values.studentId.value,
                                          values.feesMasterId
                                        );
                                      }}
                                      value="no"
                                      checked={
                                        values.IsInstallment == "no"
                                          ? true
                                          : false
                                      }
                                      disabled={
                                        values.isManual == false ? true : false
                                      }
                                    />
                                  </Col>{" "}
                                </Row>
                                {/* {installments.map((v, i) => {
                                  return (
                                    <Form.Check
                                      inline
                                      label={v}
                                      value={v}
                                      name="installmentNo"
                                      type="radio"
                                      id={`installment` + i}
                                      checked={
                                        values.installmentNo === v
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        // console.log("e ", e.target.value);
                                        setFieldValue(
                                          "installmentNo",
                                          e.target.value
                                        );
                                        setFieldValue("concessionNo", "");
                                        this.getConcessionFromInstallmentData(
                                          e.target.value,
                                          values.feesMasterId
                                        );
                                      }}
                                    />
                                  );
                                })} */}
                              </Form.Group>
                            </Col>
                          )}
                          {concessions.length > 0 && (
                            <Col lg="2" md="2">
                              <Form.Group>
                                <Form.Label>Concessions</Form.Label>
                                <br />
                                {concessions.map((v, i) => {
                                  return (
                                    <Form.Check
                                      inline
                                      label={v.label}
                                      value={v.value}
                                      name="concessionNo"
                                      type="radio"
                                      id={`concession` + i}
                                      checked={
                                        parseInt(values.concessionNo) ===
                                        parseInt(v.value)
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          "concessionNo",
                                          e.target.value
                                        );
                                      }}
                                      disabled={this.getConsessionDisabled(
                                        values.concessionNo
                                      )}
                                    />
                                  );
                                })}
                              </Form.Group>
                            </Col>
                          )}

                          {values && parseInt(values.concessionNo) == 0 ? (
                            <>
                              <Col lg="1" md="2">
                                <Form.Group>
                                  <Form.Label>Payable</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="payable"
                                    name="payable"
                                    id="payable"
                                    className="formbg"
                                    // readOnly={
                                    //   values.concessionNo &&
                                    //   parseInt(values.concessionNo) === 0
                                    //     ? false
                                    //     : true
                                    // }
                                    onChange={(e) => {
                                      if (e.target.value != undefined) {
                                        if (
                                          parseFloat(e.target.value) >
                                          parseFloat(values.outstanding)
                                        ) {
                                          setFieldValue(
                                            "payable",
                                            values.outstanding
                                          );
                                        } else {
                                          setFieldValue(
                                            "payable",
                                            e.target.value
                                          );
                                        }
                                      } else if (e.target.value == "") {
                                        setFieldValue("payable", "");
                                      }
                                    }}
                                    value={values.payable}
                                    isValid={touched.payable && !errors.payable}
                                    isInvalid={!!errors.payable}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.payable}
                                  </span>
                                </Form.Group>
                              </Col>
                            </>
                          ) : (
                            ""
                          )}
                          <Col lg="2" md="2" xs={12} className="add-btn-style">
                            <Col className="mt-4 text-center">
                              {/* <Button type="submit" className="submitbtn me-2">
                                Submit
                                <img
                                  src={arrowicon}
                                  className="btnico ms-1"
                                ></img>
                              </Button> */}

                              {/* <Button
                                type="button"
                                className="submitbtn me-2"
                                onClick={() => {
                                  this.calculatePayheads();
                                }}
                              >
                                Calculate
                                <img
                                  src={arrowicon}
                                  className="btnico ms-1"
                                ></img>
                              </Button> */}
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
                            </Col>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
              {/* <pre>{JSON.stringify(values, undefined, 2)}</pre> */}
              {/* <pre>{JSON.stringify(payheadList, undefined, 2)}</pre> */}
              {payheadList && payheadList.length > 0 && (
                <div className="wrapper_div" style={{ height: "58vh" }}>
                  <div className="cust_table">
                    <Row style={{ padding: "2px" }}></Row>
                    <div
                      className="table_wrapper denomination-style"
                      style={{
                        height: "48vh",
                        overflow: "auto",
                        overflowX: "hidden",
                      }}
                    >
                      <Table
                        size="sm"
                        hover
                        className="tbl-font"
                        style={{ marginBottom: "0px" }}
                      >
                        <thead>
                          <tr>
                            <th>#.</th>
                            <th>Particular</th>
                            <th>Priority</th>

                            {payheadList.map((v, i) => {
                              return (
                                <>
                                  <th>
                                    {ordinal_suffix_of(v.installmentNo)} inst
                                    Total Fees
                                    {/* {v.installmentNo} */}
                                  </th>
                                  <th>
                                    {ordinal_suffix_of(v.installmentNo)} inst
                                    Paid
                                  </th>
                                  <th>
                                    {ordinal_suffix_of(v.installmentNo)} inst
                                    Balance
                                  </th>
                                </>
                              );
                            })}
                          </tr>
                        </thead>
                        {this.getTbody()}
                        {this.getFooter()}
                      </Table>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-2 text-center fourbtnfeestrans">
                {values.outstanding > 0 && (
                  <Button
                    type="submit"
                    className="submitbtn formbtn affiliated"
                    onClick={(e) => {
                      e.preventDefault();
                      this.submitCalculations();
                    }}
                  >
                    Save
                    <img src={save} alt="" className="btsubmit "></img>
                  </Button>
                )}
              </div>
            </Form>
          )}
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            this.callPrint();
          }}
        >
          Print
        </Button>
        <iframe id="printf" name="printf" className="d-none"></iframe>
        <div id="printDiv">
          <Row>
            <Col
              className="data_body"
              style={{
                // paddingLeft: "5px",
                paddingTop: "5px",
              }}
            >
              <Row style={{ display: "flex" }}>
                <Col md={3}>
                  <div
                    style={{
                      border: "1px solid black",
                      width: "100px",
                      height: "100px",
                      marginLeft: "5px",
                    }}
                  >
                    <p style={{ marginTop: "40px", marginLeft: "20px" }}>
                      {" "}
                      Photo
                    </p>
                  </div>
                </Col>
                <Col md={9}>
                  <h2
                    style={{
                      fontWeight: "600",
                      fontSize: "32px",
                      marginTop: "0px",
                      marginBottom: "0px",
                      marginLeft: "10px",
                    }}
                  >
                    SUYASH GURUKUL /JR COLLEGE
                  </h2>
                  <h2
                    style={{
                      fontWeight: "600",
                      fontSize: "15px",
                      marginTop: "0px",
                      marginBottom: "0px",
                      textAlign: "center",
                    }}
                  >
                    Opp. SRP Camp,Vijapur Road,Solapur,Ph-0217/2744921
                  </h2>
                  <div
                    style={{
                      border: "3px solid black",
                      borderRadius: "10px",
                      width: "370px",
                      marginTop: "20px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: "600",
                        fontSize: "15px",
                        marginTop: "0px",
                        marginBottom: "0px",
                        textAlign: "center",
                      }}
                    >
                      BONAFIDE & CHARACTER CERTIFICATE
                    </h3>
                  </div>
                  <h5
                    style={{
                      fontWeight: "600",
                      fontSize: "15px",
                      marginTop: "0px",
                      marginBottom: "0px",
                      textAlign: "center",
                      padding: "0px 100px",
                    }}
                  >
                    <span style={{ float: "left" }}>
                      G.R.No.:
                      <span style={{ textDecoration: "underline" }}>
                        {studentInfo && studentInfo.grNo}
                      </span>
                    </span>
                    <span style={{ float: "right", marginLeft: "20px" }}>
                      Date:
                      <span style={{ textDecoration: "underline" }}>
                        {dates}
                      </span>
                    </span>
                  </h5>
                  <br />
                </Col>
              </Row>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                This is to certify that
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                Kumar / Kumari{" "}
                <span style={{ textDecoration: "underline" }}>
                  {studentInfo && studentInfo.studentName}
                </span>{" "}
                <span style={{ float: "right", marginRight: "10px" }}>
                  is / was a
                </span>
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                bonafide Student of this School Studying in Std.
                <span
                  style={{ textDecoration: "underline", marginRight: "100px" }}
                >
                  {studentInfo && studentInfo.standardName}
                </span>{" "}
                Div.
                <span style={{ textDecoration: "underline" }}>
                  {studentInfo && studentInfo.divisionName}
                </span>{" "}
                <span style={{ float: "right", marginRight: "10px" }}>
                  in the
                </span>
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                Year
                <span
                  style={{
                    textDecoration: "underline",
                    marginLeft: "10px",
                    marginRight: "100px",
                  }}
                >
                  {studentInfo && studentInfo.academicYear}
                </span>{" "}
                His/ Her/ Birth Date on the General Register is{" "}
                <span style={{ marginRight: "10px", marginLeft: "10px" }}>
                  {studentInfo && moment(studentInfo.dob).format("DD-MMM-YYYY")}
                </span>
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                in words
                <span
                  style={{
                    textDecoration: "underline",
                    marginLeft: "10px",
                    marginRight: "100px",
                  }}
                >
                  {studentInfo && studentInfo.dob1}
                </span>
                <span style={{ float: "right", marginRight: "10px" }}>
                  and He/ She blongs
                </span>
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                to the caste
                <span
                  style={{
                    textDecoration: "underline",
                    marginLeft: "10px",
                    marginRight: "100px",
                  }}
                >
                  {studentInfo && studentInfo.caste}
                </span>
                and His/Her place of birth
                <span
                  style={{
                    textDecoration: "underline",
                    marginLeft: "10px",
                    // marginRight: "100px",
                  }}
                >
                  {studentInfo && studentInfo.placeofbirth}
                </span>
                <span style={{ float: "right", marginRight: "10px" }}>
                  He/ She/
                </span>
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                is/ was regular in attendance.To the best of my knowledge He/She
                bears a good moral character.
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "50px",
                  marginBottom: "0px",
                }}
              >
                <span
                  style={{
                    float: "right",
                    marginRight: "80px",
                    marginBottom: "20px",
                  }}
                >
                  {" "}
                  Head Master/Principal
                </span>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col
              className="data_body"
              style={{
                // paddingLeft: "5px",
                paddingTop: "5px",
                marginTop: "50px",
              }}
            >
              <Row style={{ display: "flex" }}>
                <Col md={3}>
                  <div
                    style={{
                      border: "1px solid black",
                      width: "100px",
                      height: "100px",
                      marginLeft: "5px",
                    }}
                  >
                    <p style={{ marginTop: "40px", marginLeft: "20px" }}>
                      {" "}
                      Photo
                    </p>
                  </div>
                </Col>
                <Col md={9}>
                  <h2
                    style={{
                      fontWeight: "600",
                      fontSize: "32px",
                      marginTop: "0px",
                      marginBottom: "0px",
                      marginLeft: "10px",
                    }}
                  >
                    SUYASH GURUKUL /JR COLLEGE
                  </h2>
                  <h2
                    style={{
                      fontWeight: "600",
                      fontSize: "15px",
                      marginTop: "0px",
                      marginBottom: "0px",
                      textAlign: "center",
                    }}
                  >
                    Opp. SRP Camp,Vijapur Road,Solapur,Ph-0217/2744921
                  </h2>
                  <div
                    style={{
                      border: "3px solid black",
                      borderRadius: "10px",
                      width: "370px",
                      marginTop: "20px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: "600",
                        fontSize: "15px",
                        marginTop: "0px",
                        marginBottom: "0px",
                        textAlign: "center",
                      }}
                    >
                      BONAFIDE & CHARACTER CERTIFICATE
                    </h3>
                  </div>
                  <h5
                    style={{
                      fontWeight: "600",
                      fontSize: "15px",
                      marginTop: "0px",
                      marginBottom: "0px",
                      textAlign: "center",
                      padding: "0px 100px",
                    }}
                  >
                    <span style={{ float: "left" }}>
                      G.R.No.:
                      <span style={{ textDecoration: "underline" }}>
                        {studentInfo && studentInfo.grNo}
                      </span>
                    </span>
                    <span style={{ float: "right", marginLeft: "20px" }}>
                      Date:
                      <span style={{ textDecoration: "underline" }}>
                        {dates}
                      </span>
                    </span>
                  </h5>
                  <br />
                </Col>
              </Row>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                This is to certify that
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                Kumar / Kumari{" "}
                <span style={{ textDecoration: "underline" }}>
                  {studentInfo && studentInfo.studentName}
                </span>{" "}
                <span style={{ float: "right", marginRight: "10px" }}>
                  is / was a
                </span>
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                bonafide Student of this School Studying in Std.
                <span
                  style={{ textDecoration: "underline", marginRight: "100px" }}
                >
                  {studentInfo && studentInfo.standardName}
                </span>{" "}
                Div.
                <span style={{ textDecoration: "underline" }}>
                  {studentInfo && studentInfo.divisionName}
                </span>{" "}
                <span style={{ float: "right", marginRight: "10px" }}>
                  in the
                </span>
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                Year
                <span
                  style={{
                    textDecoration: "underline",
                    marginLeft: "10px",
                    marginRight: "100px",
                  }}
                >
                  {studentInfo && studentInfo.academicYear}
                </span>{" "}
                His/ Her/ Birth Date on the General Register is{" "}
                <span style={{ marginRight: "10px", marginLeft: "10px" }}>
                  {studentInfo && moment(studentInfo.dob).format("DD-MMM-YYYY")}{" "}
                </span>
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                in words
                <span
                  style={{
                    textDecoration: "underline",
                    marginLeft: "10px",
                    marginRight: "100px",
                  }}
                >
                  {studentInfo && studentInfo.dob1}
                </span>
                <span style={{ float: "right", marginRight: "10px" }}>
                  and He/ She blongs
                </span>
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                to the caste
                <span
                  style={{
                    textDecoration: "underline",
                    marginLeft: "10px",
                    marginRight: "100px",
                  }}
                >
                  {studentInfo && studentInfo.caste}
                </span>
                and His/Her place of birth
                <span
                  style={{
                    textDecoration: "underline",
                    marginLeft: "10px",
                    // marginRight: "100px",
                  }}
                >
                  {studentInfo && studentInfo.placeofbirth}
                </span>
                <span style={{ float: "right", marginRight: "10px" }}>
                  He/ She/
                </span>
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "0px",
                  marginBottom: "0px",
                  paddingLeft: "5px",
                }}
              >
                is/ was regular in attendance.To the best of my knowledge He/She
                bears a good moral character.
              </h5>
              <h5
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  marginTop: "50px",
                  marginBottom: "0px",
                }}
              >
                <span
                  style={{
                    float: "right",
                    marginRight: "80px",
                    marginBottom: "20px",
                  }}
                >
                  {" "}
                  Head Master/Principal
                </span>
              </h5>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
