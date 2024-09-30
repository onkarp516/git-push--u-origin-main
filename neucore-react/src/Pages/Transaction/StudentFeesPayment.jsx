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
  getStudentOutstanding,
  createTransaction,
  getConcessionsByInstallment,
  getDetailsByInstallment,
  getInstallments,
  getBankDetails,
  getDetailsByInstallmentForManual,
} from "@/services/api_functions";

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
  ordinal_suffix_of,
  MyDatePicker,
  isActionExist,
  ReceiptNoRegx,
} from "@/helpers";

import "mousetrap-global-bind";
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

export default class StudentFeesPayment extends React.Component {
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
      opBankList: [],
      initVal: {
        id: "",
        instituteId: "",
        transactionDate: "",
        branchId: "",
        academicYearId: "",
        standardId: "",
        divisionId: "",
        studentId: "",
        feesMasterId: "",
        transactionId: "",
        outstanding: "",
        receiptNo: "",
        totalFees: "",
        payable: "",
        studentType: "",
        installmentNo: "",
        IsInstallment: "no",
        concessionNo: "",
        isManual: "",
        paymentMode: "0",
        bankId: "",
        paymentNo: "",
        applyConcession: false,
        specialConcessionAmt: "",
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

  getAllBankDetail = () => {
    getBankDetails()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let Opt = d.map(function (values) {
            return { value: values.ledgerId, label: values.bankName };
          });
          this.setState({ opBankList: Opt }, () => {
            this.transFormRef.current.setFieldValue("bankId", Opt[0]);
          });
        }
      })
      .catch((error) => {
        this.setState({ opBankList: [] });
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
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<< res >>>>>>>>>>>>>>>>>>", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let { IsInstallment } = this.transFormRef.current.values;

          let installmentArray = res.installArray;

          let Opt = d.map(function (values) {
            return {
              value: values.concessionTypeValue,
              label: values.concessionType,
            };
          });
          Opt = Opt.filter((v) => v != undefined);

          this.setState(
            {
              installArray: installmentArray,
              concessions: Opt,
              isFirstTime: res.isManual == null ? true : false,
              installmentNo: res.installmentNo,
            },
            () => {
              // this.transFormRef.current.setFieldValue(
              //   "installmentNo",
              //   res.installmentNo
              // );
              // debugger;
              if (res.isManual == true) {
                this.transFormRef.current.setFieldValue("installment_no", 0);
              } else {
                this.transFormRef.current.setFieldValue(
                  "installment_no",
                  res.installmentNo
                );
              }
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
            }
          );
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
      installment_no,
      concessionNo,
      payable,
      transactionId,
      applyConcession,
    } = this.state.initVal;

    let reqData = new FormData();
    reqData.append("feesMasterId", feesMasterId);
    reqData.append("studentId", studentId.value);
    reqData.append(
      "installmentNo",
      installment_no == 0 ? this.state.installmentNo : installment_no
    );
    reqData.append("concessionNo", concessionNo);
    reqData.append("transactionId", transactionId);
    if (payable != "") {
      reqData.append("payable", payable.toString().trim());

      if (concessionNo != 0) {
        reqData.append("applyConcession", true);
      } else {
        reqData.append("applyConcession", applyConcession);
      }

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

            this.transFormRef.current.setFieldValue(
              "applyConcession",
              res.applyConcession
            );

            // console.log("Manual PayheadList===---->>>>", res.responseObject);
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
            // console.log("With Installment ==>", res.responseObject);
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

  setInitValue() {
    let { opBranchList, opBankList } = this.state;
    this.setState({
      payheadList: [],
      opBankList: [],
      initVal: {
        id: "",
        branchId: getSelectValue(
          opBranchList,
          authenticationService.currentUserValue.branchId
        ),
        transactionDate: "",
        academicYearId: "",
        standardId: "",
        studentType: "",
        bankId: opBankList[0],
        studentId: "",
        divName: "",
        studentName: "",
        outstanding: "",
        receiptNo: "",
        totalFees: "",
        payment: "",
        installmentNo: "",
        paymentMode: "0",
        paymentNo: "",
        applyConcession: false,
        specialConcessionAmt: "",
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
            // console.log("PList", pList);
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

  getInstallmentList = (
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

      getInstallments(requestData)
        .then((response) => {
          this.setState({ isLoading: false });
          if (response.data.responseStatus === 200) {
            let res = response.data.responseObject;

            this.transFormRef.current.setFieldValue(
              "feesMasterId",
              response.data.feesMasterId
            );
            this.transFormRef.current.setFieldValue(
              "transactionId",
              response.data.transactionId
            );
            this.transFormRef.current.setFieldValue(
              "outstanding",
              response.data.outstanding
            );
            this.transFormRef.current.setFieldValue(
              "totalFees",
              response.data.totalFees
            );
            this.setState({ installments: res }, () => {
              if (this.transFormRef.current) {
                let { values } = this.transFormRef.current;
                this.getConcessionFromInstallmentData(
                  values.studentId.value,
                  values.feesMasterId
                );
              }
            });
          } else {
            this.setState({ installments: [] });
          }
        })
        .catch((error) => {
          console.log("errors", error);
        });
    }
  };

  checkForFirstCondition = (payable) => {
    let { payheadList } = this.state;

    let totalAmount = 0;
    let priorityOneData = payheadList.find((v) => {
      return v["priority"] == 1;
    });

    let prioritySecondData = payheadList.find((v) => {
      return v["priority"] == 2;
    });

    if (priorityOneData != null && prioritySecondData != null) {
      totalAmount = totalAmount + parseFloat(priorityOneData["org_balance"]);
      totalAmount =
        totalAmount + parseFloat(prioritySecondData["org_balance"]) / 2;
    }

    payheadList.map((value, index) => {
      if (
        parseFloat(value.org_balance) > 0 &&
        parseInt(value.priority) > 1 &&
        parseInt(value.priority) > 2
      ) {
        totalAmount = totalAmount + parseFloat(value.org_balance);
      }
    });

    if (parseFloat(payable) > parseFloat(totalAmount)) {
      // console.log("true");
      return true;
    } else {
      // console.log("false");
      return false;
    }
  };

  checkForSecondCondition = (payable) => {
    let { payheadList } = this.state;

    let totalAmount = 0;
    let priorityOneData = payheadList.find((v) => {
      return v["priority"] == 1;
    });

    let prioritySecondData = payheadList.find((v) => {
      return v["priority"] == 2;
    });

    if (priorityOneData != null && prioritySecondData != null) {
      totalAmount =
        totalAmount + parseFloat(priorityOneData["org_balance"]) / 2;
      totalAmount =
        totalAmount + parseFloat(prioritySecondData["org_balance"]) / 2;
    }

    payheadList.map((value, index) => {
      if (
        parseFloat(value.org_balance) > 0 &&
        parseInt(value.priority) > 1 &&
        parseInt(value.priority) > 2
      ) {
        totalAmount = totalAmount + parseFloat(value.org_balance);
      }
    });

    if (parseFloat(payable) > parseFloat(totalAmount)) {
      // console.log("true");
      return true;
    } else {
      // console.log("false");
      return false;
    }
  };

  calculatePayheads = () => {
    let payable = parseFloat(this.transFormRef.current.values.payable);
    // console.log({ payable });
    let transactionId = this.transFormRef.current.values.transactionId;
    let { payheadList } = this.state;

    // console.log({ firstCondition, secondCondition });

    if (transactionId == 0) {
      if (this.checkForFirstCondition(payable)) {
        // console.log("checkForFirstCondition ");
        payheadList.find((v) => {
          if (v["priority"] == 1) {
            v["concession"] = 3000;
            v["installmentPer"] = 100;

            return v;
          }
        });
      } else if (this.checkForSecondCondition(payable)) {
        // console.log("checkForSecondCondition ");
        payheadList.find((v) => {
          if (v["priority"] == 1) {
            v["concession"] = 1000;
            v["installmentPer"] = 50;

            return v;
          }
        });
      } else if (this.checkForSecondCondition(payable)) {
        // console.log("checkForSecondCondition ");
        payheadList.find((v) => {
          if (v["priority"] == 1) {
            v["concession"] = 2000;
            v["installmentPer"] = 50;

            return v;
          }
        });
      } else {
        // console.log("no concession ");
        payheadList.map((v) => {
          v["concession"] = v["org_concession"];
          v["installmentPer"] = v["org_installmentPer"];
          return v;
        });
      }
    }

    // console.log({ payheadList });

    payheadList.map((value, index) => {
      if (parseFloat(value.org_balance) > 0) {
        let totalFees =
          parseFloat(value.org_balance) - parseFloat(value.concession);
        if (payable > 0) {
          let inst_value = 0;
          if (value.installmentPer > 0 && transactionId == 0) {
            inst_value = totalFees * (value.installmentPer / 100);
          } else {
            inst_value = totalFees;
          }
          // console.log("inst_value", inst_value, value.org_balance);
          // let rem_amt = parseFloat(payable) - parseFloat(value.org_balance);
          let rem_amt = 0;
          let paid_amt = 0;
          // console.log({ inst_value, payable });
          if (payable > inst_value) {
            // console.log("if");
            rem_amt = parseFloat(payable) - parseFloat(inst_value);
            paid_amt = parseFloat(inst_value);
          } else {
            // console.log("inst value else");
            rem_amt = 0;
            paid_amt = parseFloat(payable);
          }
          if (rem_amt <= 0) {
            value["paid"] = parseFloat(paid_amt) + parseFloat(value.org_paid);

            // value["balance"] = Math.abs(rem_amt);
            value["balance"] = totalFees - parseFloat(paid_amt);

            payable = 0;
          } else {
            value["paid"] = paid_amt + parseFloat(value.org_paid);
            value["balance"] = totalFees - parseFloat(paid_amt);
            payable = rem_amt;
          }
        } else {
          value["paid"] = parseFloat(value.org_paid);
          value["balance"] = value.org_balance;
        }
      }
      return value;
    });

    this.setState({ payheadList: payheadList });
  };

  getTotalFeesAmt = () => {
    let { payheadList } = this.state;
    let totalFees = 0;
    payheadList.map((v) => {
      totalFees = parseFloat(totalFees) + parseFloat(v["totalFees"]);
    });
    return isNaN(totalFees) ? 0 : totalFees;
  };

  getTotalPaidAmt = () => {
    let { payheadList } = this.state;
    let total = 0;
    payheadList.map((v) => {
      total = parseFloat(total) + parseFloat(v["paid"]);
    });
    return isNaN(total) ? 0 : total;
  };

  getTotalBalanceAmt = () => {
    let { payheadList } = this.state;
    let total = 0;
    payheadList.map((v) => {
      total = parseFloat(total) + parseFloat(v["balance"]);
    });
    return isNaN(total) ? 0 : total;
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getBranchData();
      this.getAllBankDetail();
    }
  }

  pageReload = () => {
    this.componentDidMount();
  };

  checkIsExistCBalance = (payheadId, isSubHead) => {
    let { payheadList } = this.state;
    let lst = [];
    payheadList.map((v, i) => {
      let f = v.installmentData.filter(
        (vi) =>
          parseInt(vi.payHeadId) == parseInt(payheadId) &&
          parseInt(vi.isSubHead) == parseInt(isSubHead)
      );
      lst = [...lst, ...f];
    });
    lst = lst.filter((v) => v != undefined);

    // console.log("lst", lst);
    let ret_val = false;
    lst.map((v) => {
      // console.log("CPaid", v.cPaid);
      if (v.cPaid > 0) {
        ret_val = true;
      }
    });
    return ret_val;
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
                  {this.checkIsExistCBalance(vi.payHeadId, vi.isSubHead) && (
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
                                {/* <pre>
                                {JSON.stringify(
                                  payheadList[i]["installmentData"][ii],
                                  undefined,
                                  2
                                )}
                              </pre> */}

                                {payheadList[i]["installmentData"][ii]
                                  ? payheadList[i]["installmentData"][ii][
                                      "totalFees"
                                    ]
                                    ? payheadList[i]["installmentData"][ii][
                                        "totalFees"
                                      ]
                                    : ""
                                  : ""}
                              </td>
                              <td>
                                {payheadList[i]["installmentData"][ii]
                                  ? payheadList[i]["installmentData"][ii][
                                      "prevPaid"
                                    ]
                                    ? payheadList[i]["installmentData"][ii][
                                        "prevPaid"
                                      ]
                                    : ""
                                  : ""}
                                {/* {
                                payheadList[i]["installmentData"][ii][
                                  "prevPaid"
                                ]
                              } */}
                              </td>{" "}
                              <td>
                                {payheadList[i]["installmentData"][ii]
                                  ? payheadList[i]["installmentData"][ii][
                                      "balance"
                                    ]
                                    ? payheadList[i]["installmentData"][ii][
                                        "balance"
                                      ]
                                    : "0"
                                  : "0"}
                              </td>{" "}
                            </>
                          );
                        })}
                    </tr>
                  )}
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

  submitCalculations = () => {
    let requestData = new FormData();
    let { initVal: values, payheadList } = this.state;
    requestData.append(
      "instituteId",
      authenticationService.currentUserValue.companyId
    );
    requestData.append(
      "transactionDate",
      moment(values.transactionDate).format("yyyy-MM-DD")
    );
    requestData.append(
      "paymentMode",
      values.paymentMode == "" ? 0 : values.paymentMode
    );
    console.log("paymentMod:", values.paymentMode);
    if (values.paymentMode != null) {
      requestData.append("ledgerId", values.bankId.value);
    }
    requestData.append("paymentNo", values.paymentNo);

    requestData.append("branchId", values.branchId.value);
    requestData.append("academicYearId", values.academicYearId.value);
    requestData.append("standardId", values.standardId.value);
    requestData.append("divisionId", values.divisionId.value);
    requestData.append("studentId", values.studentId.value);
    requestData.append("feesMasterId", values.feesMasterId);
    requestData.append("transactionId", values.transactionId);
    requestData.append("applyConcession", values.applyConcession);
    requestData.append("specialConcessionAmt", values.specialConcessionAmt);

    requestData.append("installmentNo", values.installmentNo);
    // requestData.append("receiptNo", values.receiptNo);

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
          // console.log("transactionId-->", values.transactionId);

          let propData = {
            transactionId: values.transactionId,
            lastReceiptNo: "",
          };
          if (this.transFormRef.current) {
            this.transFormRef.current.resetForm();
          }
          // this.resetForm();
          // this.setInitValue();
          eventBus.dispatch("page_change", {
            from: "studentfeespayment",
            to: "studentcopywithstructure",
            prop_data: propData,
            isNewTab: false,
          });

          // eventBus.dispatch("page_change", "student-copy");
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

  getConsessionDisabled = (concessionNo_1) => {
    // console.log({ concessionNo_1 });
    // let { concessions } = this.state;
    // if (this.transFormRef.current) {
    //   // if (this.transFormRef.current.values.concessionType != null) {
    //   if (this.transFormRef.current.values.IsInstallment == "yes") {
    //     // let f = concessions.find((v) => {
    //     //   if (parseInt(v.concessionTypeValue) == parseInt(concessionNo)) {
    //     //     return parseInt(v.value) == parseInt(concessionNo);
    //     //   }
    //     // });

    //     // let f = concessions.find(
    //     //   (v) => parseInt(v.concessionTypeValue) == parseInt(concessionNo)
    //     // );
    //     // console.log("f", f);
    //     let { concessionNo } = this.transFormRef.current.values;
    //     if (concessionNo != "" && concessionNo != null) {
    //       // if (parseInt(concessionNo) == parseInt(concessionNo_1)) {
    //       //   return false;
    //       // } else {
    //       //   return true;
    //       // }
    //       return true;
    //     } else {
    //       return false;
    //     }
    //     // return f ? true : false;
    //     // }
    //   }
    // }
    let { isFirstTime } = this.state;
    let { applyConcession } = this.transFormRef.current.values;
    if (isFirstTime == true) {
      return false;
    } else {
      if (applyConcession == true) {
        return false;
      } else {
        return true;
      }
    }
  };

  getInstallmentDisabled = (currentInstallmentNo) => {
    let { installmentNo } = this.state;
    let { isManual } = this.transFormRef.current.values;

    if (parseInt(installmentNo) != parseInt(currentInstallmentNo)) {
      if (parseInt(installmentNo) == 1) {
        if (parseInt(currentInstallmentNo) == 0) {
          return false;
        } else {
          if (isManual != true) {
            return true;
          }
        }
      } else {
        if (isManual == true && parseInt(currentInstallmentNo) == 0) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      if (isManual == true && parseInt(currentInstallmentNo) == 0) {
        return false;
      } else if (isManual != null) {
        return true;
      } else {
        return false;
      }
    }
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
      opBankList,
      installArray,
      installmentNo,
    } = this.state;

    return (
      <div className="">
        {/* {JSON.stringify(installments)}
        <hr />
        {JSON.stringify(concessions)}
        <hr />
        {JSON.stringify(installmentNo)}
        <hr /> */}
        <Formik
          innerRef={this.transFormRef}
          initialValues={initVal}
          validateOnChange={false}
          validateOnBlur={false}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            transactionDate: Yup.string()
              .trim()
              .required("Transaction Date is Required !"),
            // receiptNo: Yup.string().required("Receipt No is Required"),

            bankId: Yup.object().required("Bank No is Required"),
            paymentNo: Yup.mixed().when("paymentMode", {
              is: (value) => value && value == 1 && value && value == 2,

              then: Yup.string().required("Payment No is Required"),
              otherwise: Yup.string().notRequired(),
            }),

            // paymentNo: Yup.string().trim().required("Payment No is Required"),

            academicYearId: Yup.object().required("Select academic year"),
          })}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            // this.setState({ isLoading: true });
            setSubmitting(false);
            this.setState({ initVal: values }, () => {
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
              {JSON.stringify(errors)}
              {/* {JSON.stringify(installArray)} */}
              <div
                id="example-collapse-text"
                className="common-form-style mt-2 p-2"
              >
                <div className="main-divform mb-2 m-0">
                  <div className="common-form-style m-0 mb-2">
                    {/* {JSON.stringify(this.state.isFirstTime)} */}
                    <Row className="">
                      <Col md="12" className="mb-2">
                        <Row className="row-inside">
                          <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Transaction Date</Form.Label>
                              <MyDatePicker
                                className="formbg datepic form-control"
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
                              <span className="text-danger">
                                {errors.transactionDate &&
                                  errors.transactionDate}
                              </span>
                            </Form.Group>
                          </Col>
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

                          <Col md="2">
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
                                  setFieldValue("studentRollNo", "");
                                  setFieldValue("studentId", "");
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

                        {/* {JSON.stringify(values)} */}
                        <Row className="row-inside">
                          <Col lg="2" md="2">
                            <Form.Group className="createnew">
                              <Form.Label>Std Roll No.</Form.Label>
                              <Select
                                className="selectTo"
                                styles={customStyles}
                                isClearable={true}
                                onChange={(v) => {
                                  setFieldValue("studentRollNo", "");
                                  setFieldValue("studentId", "");
                                  setFieldValue("outstanding", "");
                                  this.setState({ payheadList: [] });

                                  if (v != null) {
                                    setFieldValue("studentRollNo", v);
                                    setFieldValue(
                                      "studentId",
                                      getSelectValue(opStudentList, v.value)
                                    );
                                    this.getInstallmentList(
                                      values.branchId,
                                      values.academicYearId,
                                      values.standardId,
                                      values.divisionId,
                                      values.studentType,
                                      v.value
                                    );
                                  }
                                  //  else {
                                  //   setFieldValue("studentRollNo", "");
                                  //   setFieldValue("studentId", "");
                                  //   setFieldValue("outstanding", "");
                                  //   this.setState({ payheadList: [] });
                                  // }
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
                                  setFieldValue("studentRollNo", "");
                                  setFieldValue("studentId", "");
                                  setFieldValue("outstanding", "");
                                  setFieldValue("payable", "");
                                  this.setState({ payheadList: [] });

                                  if (v != null) {
                                    setFieldValue(
                                      "studentRollNo",
                                      getSelectValue(optRollno, v.value)
                                    );
                                    setFieldValue("studentId", v);
                                    // setFieldValue("payable", "");
                                    // this.getStudentOutstandingAmount(
                                    this.getInstallmentList(
                                      values.branchId,
                                      values.academicYearId,
                                      values.standardId,
                                      values.divisionId,
                                      values.studentType,
                                      v.value
                                    );
                                  }
                                  //  else {
                                  //   setFieldValue("studentRollNo", "");
                                  //   setFieldValue("studentId", "");
                                  //   setFieldValue("outstanding", "");
                                  //   setFieldValue("payable", "");
                                  //   this.setState({ payheadList: [] });
                                  // }
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

                          <Col lg="1" md="2">
                            <Form.Group>
                              <Form.Label>Outstanding</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                name="outstanding"
                                id="outstanding"
                                onChange={handleChange}
                                value={values.outstanding}
                                isValid={
                                  touched.outstanding && !errors.outstanding
                                }
                                isInvalid={!!errors.outstanding}
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                          {/* <Col lg="2" md="2">
                            <Form.Group>
                              <Form.Label>Receipt No</Form.Label>
                              <Form.Control
                                className="formbg"
                                type="text"
                                placeholder=""
                                name="receiptNo"
                                id="receiptNo"
                                onChange={handleChange}
                                value={values.receiptNo.toUpperCase()}
                                isValid={touched.receiptNo && !errors.receiptNo}
                                isInvalid={!!errors.receiptNo}
                              />
                              <span className="text-danger">
                                {errors.receiptNo && errors.receiptNo}
                              </span>
                            </Form.Group>
                          </Col> */}

                          {installArray.length > 0 && (
                            <Col lg="2" md="2">
                              <Form.Group>
                                <Form.Label>Installments</Form.Label>
                                <br />
                                {installArray.map((v, i) => {
                                  return (
                                    <Form.Check
                                      inline
                                      label={v.label}
                                      value={v.value}
                                      name="installment_no"
                                      type="radio"
                                      id={`installment_no` + i}
                                      checked={
                                        parseInt(values.installment_no) ===
                                        parseInt(v.value)
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          "installment_no",
                                          e.target.value
                                        );

                                        if (parseInt(e.target.value) == 0) {
                                          // setFieldValue("concessionNo", 0);
                                          setFieldValue(
                                            "concessionNo",
                                            values.concessionNo != 0 &&
                                              values.concessionNo != null
                                              ? values.concessionNo
                                              : 0
                                          );
                                          setFieldValue("isManual", true);
                                        } else {
                                          // setFieldValue("concessionNo", null);
                                          setFieldValue(
                                            "concessionNo",
                                            values.concessionNo != 0
                                              ? values.concessionNo
                                              : null
                                          );
                                          // this.getConcessionFromInstallmentData(
                                          //   values.studentId.value,
                                          //   values.feesMasterId
                                          // );
                                        }
                                        setFieldValue("payable", "");
                                      }}
                                      disabled={
                                        v.value != 0 &&
                                        this.getInstallmentDisabled(v.value)
                                      }
                                    />
                                  );
                                })}
                              </Form.Group>
                            </Col>
                          )}

                          <Col lg="2" md="2" className="p-0 ">
                            <Form.Group>
                              <Form.Label>Payment Mode</Form.Label>
                              <br />
                              <div className="genderhorizotal">
                                <Form.Check
                                  inline
                                  label="Cash"
                                  name="paymentMode"
                                  value="0"
                                  type="radio"
                                  id="cash"
                                  checked={
                                    values.paymentMode === "0" ? true : false
                                  }
                                  onChange={(v) => {
                                    setFieldValue("paymentMode", "0");
                                  }}
                                />
                                <Form.Check
                                  inline
                                  label="Cheque"
                                  name="paymentMode"
                                  value="1"
                                  id="cheque"
                                  type="radio"
                                  checked={
                                    values.paymentMode === "1" ? true : false
                                  }
                                  onChange={(v) => {
                                    setFieldValue("paymentMode", "1");
                                  }}
                                />

                                <Form.Check
                                  inline
                                  label="Online"
                                  name="paymentMode"
                                  value="2"
                                  id="online"
                                  type="radio"
                                  checked={
                                    values.paymentMode === "2" ? true : false
                                  }
                                  onChange={(v) => {
                                    setFieldValue("paymentMode", "2");
                                  }}
                                />
                              </div>

                              <span className="text-danger errormsg">
                                {errors.paymentMode}
                              </span>
                            </Form.Group>
                          </Col>

                          {/* {concessions.length > 0 &&
                            values.installment_no != null &&
                            parseInt(values.installment_no) > 0 &&  */}

                          {parseInt(values.outstanding) > 0 &&
                            concessions.length > 0 &&
                            ((values.installment_no != null &&
                              parseInt(values.installment_no) > 0) ||
                              values.applyConcession == true) && (
                              <Col lg="3" md="2">
                                <Form.Group className="space">
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
                          {/* </Row>
                        <Row className="row-inside"> */}
                          {values &&
                          parseInt(values.outstanding) > 0 &&
                          (parseInt(values.concessionNo) == 0 ||
                            values.isManual == true) ? (
                            <>
                              <Col lg="1" md="2">
                                <Form.Group className="space">
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

                          {values.paymentMode != "" &&
                          values.paymentMode != "0" ? (
                            <>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label>
                                    Select Bank{" "}
                                    <span className="pt-1 pl-1 text-danger">
                                      *
                                    </span>
                                  </Form.Label>
                                  <Select
                                    // isClearable={true}
                                    isDisabled={true}
                                    className="selectTocaptain"
                                    placeholder="Select"
                                    name="bankId"
                                    id="bankId"
                                    styles={customStyles}
                                    options={opBankList}
                                    onChange={(v) => {
                                      setFieldValue("bankId", v);
                                      if (v != null) {
                                        setFieldValue("bankId", v);
                                      } else {
                                        setFieldValue("bankId", "");
                                      }
                                    }}
                                    value={values.bankId}
                                  />
                                  <span className="text-danger">
                                    {errors.bankId && errors.bankId}
                                  </span>
                                </Form.Group>
                              </Col>

                              <Col md="2">
                                <Form.Group>
                                  <Form.Label>Payment No</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Payment No"
                                    name="paymentNo"
                                    id="paymentNo"
                                    className="formbg"
                                    value={values.paymentNo}
                                    isValid={
                                      touched.paymentNo && !errors.paymentNo
                                    }
                                    isInvalid={!!errors.paymentNo}
                                    onChange={handleChange}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.paymentNo}
                                  </span>
                                </Form.Group>
                              </Col>
                            </>
                          ) : (
                            ""
                          )}

                          {values.outstanding > 0 && (
                            <Col lg="2" md="2">
                              <Form.Group>
                                <Form.Label>Special Concession</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Special Concession"
                                  name="specialConcessionAmt"
                                  id="specialConcessionAmt"
                                  className="formbg"
                                  onChange={handleChange}
                                  value={values.specialConcessionAmt}
                                  isValid={
                                    touched.specialConcessionAmt &&
                                    !errors.specialConcessionAmt
                                  }
                                  isInvalid={!!errors.specialConcessionAmt}
                                />
                                <span className="text-danger errormsg">
                                  {errors.specialConcessionAmt}
                                </span>
                              </Form.Group>
                            </Col>
                          )}
                          <Col
                            md="3"
                            xs={12}
                            className="add-btn-style mt-4 text-center"
                          >
                            {values.outstanding > 0 && (
                              <Button type="submit" className="submitbtn me-2">
                                Submit
                                <img
                                  src={arrowicon}
                                  className="btnico ms-1"
                                ></img>
                              </Button>
                            )}
                            <Button
                              type="button"
                              className="cancelbtn submitbtn ms-2 "
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
                        </Row>
                        {/* <Row className="row-inside"></Row> */}
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
              {payheadList && payheadList.length > 0 && (
                <div className="wrapper_div" style={{ height: "58vh" }}>
                  <div className="cust_table">
                    <Row style={{ padding: "2px" }}></Row>
                    <div
                      className="table_wrapper denomination-style"
                      style={{
                        // height: "48vh",
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
                            <th>
                              Total Fees
                              {/* {v.installmentNo} */}
                            </th>
                            <th>Payable</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        {/* {JSON.stringify(payheadList)} */}
                        {/* {this.getTbody()}
                        {this.getFooter()} */}
                        <tbody>
                          {payheadList.map((v, i) => {
                            return (
                              <>
                                {v && parseInt(v.totalCPaid) > 0 ? (
                                  <>
                                    <tr>
                                      <td colSpan={6}>
                                        {ordinal_suffix_of(v.installmentNo)}{" "}
                                        Installment
                                      </td>
                                    </tr>
                                    {v.installmentData.map((vi, ii) => {
                                      return (
                                        vi.cPaid > 0 && (
                                          <tr>
                                            <td>{ii + 1}</td>
                                            <td>{vi.payHeadName}</td>
                                            <td>{vi.priority}</td>
                                            <td>
                                              {vi.totalFees ? vi.totalFees : 0}
                                            </td>

                                            <td>
                                              {vi.prevPaid ? vi.prevPaid : 0}
                                            </td>
                                            <td>
                                              {vi.balance ? vi.balance : 0}
                                            </td>
                                          </tr>
                                        )
                                      );
                                    })}
                                  </>
                                ) : (
                                  ""
                                )}
                              </>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-2 text-center fourbtnfeestrans">
                {payheadList && payheadList.length > 0 && (
                  <Button
                    type="submit"
                    className="submitbtn formbtn affiliated"
                    onClick={(e) => {
                      e.preventDefault();
                      // this.submitCalculations();
                      this.setState({ initVal: values }, () => {
                        this.submitCalculations();
                      });
                    }}
                  >
                    Save
                    <img src={save} alt="" className="btsubmit "></img>
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    eventBus.dispatch("page_change", "studentPaymentList");
                  }}
                  className="submitbtn cancelbtn formbtn affiliated"
                  variant="secondary"
                >
                  Cancel
                  <img src={cancel} alt="" className="btsubmit "></img>
                </Button>
              </div>
            </Form>
          )}
        />
      </div>
    );
  }
}
