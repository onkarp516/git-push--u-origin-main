import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  ButtonGroup,
  FormControl,
  Table,
} from "react-bootstrap";
import { Formik } from "formik";

import Select from "react-select";
import * as Yup from "yup";
//import "./css/purchace.scss";

import {
  getUnderList,
  authenticationService,
  getBalancingMethods,
  getIndianState,
  getIndiaCountry,
  getLedgersById,
  editLedger,
  getGSTTypes,
  getBranchesByInstitute,
} from "@/services/api_functions";
import moment from "moment";
import {
  ShowNotification,
  getRandomIntInclusive,
  getSelectValue,
  AuthenticationCheck,
  customStyles,
  MyDatePicker,
  eventBus,
} from "@/helpers";

const taxOpt = [
  { value: "central_tax", label: "Central Tax" },
  { value: "state_tax", label: "State Tax" },
  { value: "integrated_tax", label: "Integrated Tax" },
];

export default class LedgerEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      principleList: [],
      undervalue: [],
      balancingOpt: [],
      stateOpt: [],
      countryOpt: [],
      edit_data: "",
      GSTTypeOpt: [],
      opbranchList: [],

      gstList: [],
      deptList: [],
      shippingList: [],
      billingList: [],

      removeGstList: [],
      removeDeptList: [],
      removeShippingList: [],
      removeBillingList: [],

      initVal: {
        id: "",
        ledger_name: "",
        underId: "",
        supplier_code: getRandomIntInclusive(1, 1000),
        opening_balance: 0,
        is_private: "false",
      },
      isEditDataSet: false,
    };
  }
  listGSTTypes = () => {
    getGSTTypes()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.map((v) => {
            return { label: v.gstType, value: v.id };
          });
          this.setState({ GSTTypeOpt: opt });
        }
      })
      .catch((error) => {});
  };

  lstUnders = () => {
    getUnderList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let Opt = res.responseObject.map((v, i) => {
            let innerOpt = {};
            if (v.associates_name != "") {
              innerOpt["value"] =
                v.principle_id +
                "_" +
                v.sub_principle_id +
                "_" +
                v.associates_id;
              innerOpt["label"] = v.associates_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            } else if (v.subprinciple_name != "") {
              innerOpt["value"] = v.principle_id + "_" + v.sub_principle_id;
              innerOpt["label"] = v.subprinciple_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            } else {
              innerOpt["value"] = v.principle_id;
              innerOpt["label"] = v.principle_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            }
            return innerOpt;
          });
          this.setState({ undervalue: Opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ undervalue: [] });
      });
  };
  lstBalancingMethods = () => {
    getBalancingMethods()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.response.map((v, i) => {
            return { value: v.balancing_id, label: v.balance_method };
          });
          this.setState({ balancingOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstState = () => {
    getIndianState()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.responseObject.map((v) => {
            return { label: v.stateName, value: v.id };
          });
          this.setState({ stateOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstCountry = () => {
    getIndiaCountry()
      .then((response) => {
        // console.log("country res", response);
        let opt = [];
        let res = { label: response.data.name, value: response.data.id };
        opt.push(res);
        this.setState({ countryOpt: opt });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  setInitVal = () => {
    let initVal = {
      id: "",
      ledger_name: "",
      underId: "",
      supplier_code: getRandomIntInclusive(1, 1000),
      opening_balance: 0,
      is_private: "false",
    };
    this.setState({ initVal: initVal });
  };
  getLedgerDetails = () => {
    let { edit_data, undervalue, GSTTypeOpt } = this.state;
    let formData = new FormData();
    formData.append("id", edit_data);
    console.log("Edit Id", edit_data);
    getLedgersById(formData)
      .then((response) => {
        console.log("response. data ", response.data);
        let data = response.data;

        let gstdetails = [];
        let deptList = [];
        let shippingDetails = [];
        let billingDetails = [];

        let initVal = {
          id: "",
          ledger_name: "",
          underId: "",
          supplier_code: getRandomIntInclusive(1, 1000),
          is_private: "false",
        };
        if (data.responseStatus == 200) {
          data = data.response;
          let underOptID;
          if (data.under_prefix_separator == "P") {
            underOptID = getSelectValue(undervalue, data.principle_id);
          } else if (data.under_prefix_separator == "PG") {
            underOptID = getSelectValue(
              undervalue,
              data.principle_id + "_" + data.sub_principle_id
            );
          } else if (data.under_prefix_separator == "AG") {
            underOptID = getSelectValue(
              undervalue,
              data.principle_id +
                "_" +
                data.sub_principle_id +
                "_" +
                data.under_id
            );
          }
          if (data.ledger_form_parameter_slug == "assets") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              branchId: getSelectValue(this.state.opbranchList, data.branchId),
            };
          } else if (data.ledger_form_parameter_slug == "sundry_creditors") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              address: data.address,
              opening_balancing_method: getSelectValue(
                this.state.balancingOpt,
                data.balancing_method
              ),
              mailing_name: data.mailing_name,
              supplier_code: data.supplier_code,
              pincode: data.pincode,
              email_id: data.email != "NA" ? data.email : "",
              phone_no: data.mobile_no,
              credit_days: data.credit_days,
              applicable_from: data.applicable_from,
              fssai: data.fssai != "NA" ? data.fssai : "",
              isTaxation: String(data.taxable),
              tds: String(data.tds),
              tcs: String(data.tcs),
              bank_name: data.bank_name,
              bank_account_no: data.account_no,
              bank_branch: data.bank_branch,
              bank_ifsc_code: data.ifsc_code,
              branchId: getSelectValue(this.state.opbranchList, data.branchId),
            };

            if (data.deptDetails.length > 0) {
              deptList = data.deptDetails.map((v, i) => {
                return {
                  id: v.id,
                  dept: v.dept,
                  contact_person: v.contact_person,
                  contact_no: v.contact_no,
                  email: v.email != "NA" ? v.email : "",
                };
              });
            }

            if (data.shippingDetails.length > 0) {
              shippingDetails = data.shippingDetails.map((v, i) => {
                return {
                  id: v.id,
                  district: v.district,
                  shipping_address: v.shipping_address,
                };
              });
            }

            if (data.billingDetails.length > 0) {
              billingDetails = data.billingDetails.map((v, i) => {
                return {
                  id: v.id,
                  b_district: v.district,
                  billing_address: v.billing_address,
                };
              });
            }

            if (data.taxable) {
              if (data.gstdetails.length > 0) {
                gstdetails = data.gstdetails.map((v, i) => {
                  return {
                    id: v.id,
                    gstin: v.gstin,
                    dateofregistartion:
                      v.dateofregistartion != "NA"
                        ? moment(v.dateofregistartion).format("YYYY-MM-DD")
                        : "",
                    pan_no: v.pancard != "NA" ? v.pancard : "",
                  };
                });
              }

              initVal["registraion_type"] = getSelectValue(
                GSTTypeOpt,
                data.registration_type
              );
            } else {
              initVal["pan_no"] = data.pancard_no;
            }

            initVal["tds_applicable_date"] =
              data.tds_applicable_date != "NA"
                ? new Date(data.tds_applicable_date)
                : "";

            initVal["tcs_applicable_date"] =
              data.tcs_applicable_date != "NA"
                ? new Date(data.tcs_applicable_date)
                : "";

            console.log({ initVal });
          } else if (data.ledger_form_parameter_slug == "sundry_debtors") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              address: data.address,
              opening_balancing_method: getSelectValue(
                this.state.balancingOpt,
                data.balancing_method
              ),

              mailing_name: data.mailing_name,
              supplier_code: data.supplier_code,
              pincode: data.pincode,

              email_id: data.email != "NA" ? data.email : "",
              phone_no: data.mobile_no,
              credit_days: data.credit_days,
              applicable_from: data.applicable_from,
              fssai: data.fssai != "NA" ? data.fssai : "",
              isTaxation: String(data.taxable),
              tds: String(data.tds),
              tcs: String(data.tcs),
              branchId: getSelectValue(this.state.opbranchList, data.branchId),
            };

            if (data.deptDetails.length > 0) {
              deptList = data.deptDetails.map((v, i) => {
                return {
                  id: v.id,
                  dept: v.dept,
                  contact_person: v.contact_person,
                  contact_no: v.contact_no,
                  email: v.email,
                };
              });
            }

            if (data.shippingDetails.length > 0) {
              shippingDetails = data.shippingDetails.map((v, i) => {
                return {
                  id: v.id,
                  district: v.district,
                  shipping_address: v.shipping_address,
                };
              });
            }

            if (data.billingDetails.length > 0) {
              billingDetails = data.billingDetails.map((v, i) => {
                return {
                  id: v.id,
                  b_district: v.district,
                  billing_address: v.billing_address,
                };
              });
            }

            if (data.taxable) {
              if (data.gstdetails.length > 0) {
                gstdetails = data.gstdetails.map((v, i) => {
                  return {
                    id: v.id,
                    gstin: v.gstin,
                    dateofregistartion: moment(v.dateofregistartion).format(
                      "YYYY-MM-DD"
                    ),
                    pan_no: v.pancard,
                  };
                });
              }

              initVal["registraion_type"] = getSelectValue(
                GSTTypeOpt,
                data.registration_type
              );
            } else {
              initVal["pan_no"] = data.pancard_no;
            }
          } else if (data.ledger_form_parameter_slug == "others") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              branchId: getSelectValue(this.state.opbranchList, data.branchId),

              underId: underOptID,
              address: data.address,
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              pincode: data.pincode,
              phone_no: data.mobile_no,
            };
          } else if (data.ledger_form_parameter_slug == "duties_taxes") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              tax_type: getSelectValue(taxOpt, data.tax_type),
              branchId: getSelectValue(this.state.opbranchList, data.branchId),
            };
          } else if (data.ledger_form_parameter_slug == "bank_account") {
            let underIdOp = data.principle_id + "_" + data.sub_principle_id;
            initVal = {
              id: data.id,
              branchId: getSelectValue(this.state.opbranchList, data.branchId),
              ledger_name: data.ledger_name,
              underId: underOptID,
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              address: data.address,
              opening_balancing_method: getSelectValue(
                this.state.balancingOpt,
                data.balancing_method
              ),
              mailing_name: data.mailing_name,
              pincode: data.pincode,
              email_id: data.email,
              phone_no: data.mobile_no,
              isTaxation: String(data.taxable),
              bank_name: data.bank_name,
              bank_account_no: data.account_no,
              bank_branch: data.bank_branch,
              bank_ifsc_code: data.ifsc_code,
            };
            if (data.taxable) {
              // dateofregistartion: data.dateofregistartion,
              initVal["gstin"] = data.gstin;
            }
          }

          initVal["is_private"] =
            data.is_private != null ? data.is_private : "false";

          console.log({
            initVal,
            gstdetails,
            deptList,
            shippingDetails,
            billingDetails,
          });
          this.setState({
            isEditDataSet: true,
            initVal: initVal,
            gstList: gstdetails,
            deptList: deptList,
            shippingList: shippingDetails,
            billingList: billingDetails,
          });
        } else {
          this.setState({ isEditDataSet: true });
          ShowNotification("Error", data.responseStatus);
        }
      })
      .catch((error) => {});
  };

  addGSTRow = (values, setFieldValue) => {
    let gstObj = {
      id: values.id != 0 ? values.id : 0,
      gstin: values.gstin,
      dateofregistartion: values.dateofregistartion,
      pan_no: values.pan_no,
    };

    const { gstList } = this.state;

    let old_lst = gstList;
    let is_updated = false;

    let final_state = old_lst.map((item) => {
      if (item.gstin === gstObj.gstin) {
        is_updated = true;
        const updatedItem = gstObj;
        return updatedItem;
      }
      return item;
    });
    if (is_updated == false) {
      final_state = [...gstList, gstObj];
    }
    this.setState({ gstList: final_state }, () => {
      setFieldValue("gstin", "");
      setFieldValue("dateofregistartion", "");
      setFieldValue("pan_no", "");
    });
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

                this.setState({ initVal: initObj });
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

  // // handle click event of the Remove button
  // removeGstRow = (index) => {
  //   const { gstList } = this.state;
  //   const list = [...gstList];
  //   list.splice(index, 1);
  //   this.setState({ gstList: list });
  // };

  // handle click event of the Remove button
  removeGstRow = (values, index) => {
    const { gstList, removeGstList } = this.state;
    const list = [...gstList];
    let splist = list.splice(index, 1);

    const list1 = [...removeGstList];
    if (values.id > 0) {
      list1.push(values.id);
    }

    this.setState({ gstList: list, removeGstList: list1 });
  };

  addShippingRow = (values, setFieldValue) => {
    let shipObj = {
      id: values.id != 0 ? values.id : 0,
      district: values.district,
      shipping_address: values.shipping_address,
    };

    const { shippingList } = this.state;

    let old_lst = shippingList;
    let is_updated = false;

    let final_state = old_lst.map((item) => {
      if (item.district === shipObj.district) {
        is_updated = true;
        const updatedItem = shipObj;
        return updatedItem;
      }
      return item;
    });
    if (is_updated == false) {
      final_state = [...shippingList, shipObj];
    }
    this.setState({ shippingList: final_state }, () => {
      setFieldValue("district", "");
      setFieldValue("shipping_address", "");
    });
  };

  // handle click event of the Remove button
  removeShippingRow = (values, index) => {
    const { shippingList, removeShippingList } = this.state;
    const list = [...shippingList];
    list.splice(index, 1);

    const list1 = [...removeShippingList];
    if (values.id > 0) {
      list1.push(values.id);
    }
    this.setState({ shippingList: list, removeShippingList: list1 });
  };

  addBillingRow = (values, setFieldValue) => {
    let billAddObj = {
      id: values.id != 0 ? values.id : 0,
      b_district: values.b_district,
      billing_address: values.billing_address,
    };

    const { billingList } = this.state;

    let old_lst = billingList;
    let is_updated = false;

    let final_state = old_lst.map((item) => {
      if (item.b_district === billAddObj.b_district) {
        is_updated = true;
        const updatedItem = billAddObj;
        return updatedItem;
      }
      return item;
    });
    if (is_updated == false) {
      final_state = [...billingList, billAddObj];
    }
    this.setState({ billingList: final_state }, () => {
      setFieldValue("b_district", "");
      setFieldValue("billing_address", "");
    });
  };

  // handle click event of the Remove button
  removeBillingRow = (values, index) => {
    const { billingList, removeBillingList } = this.state;
    const list = [...billingList];
    list.splice(index, 1);

    const list1 = [...removeBillingList];
    if (values.id > 0) {
      list1.push(values.id);
    }

    this.setState({ billingList: list, removeBillingList: list1 });
  };

  addDeptRow = (values, setFieldValue) => {
    let deptObj = {
      id: values.id != 0 ? values.id : 0,
      dept: values.dept,
      contact_person: values.contact_person,
      contact_no: values.contact_no,
      email: values.email,
    };

    console.log({ deptObj });
    const { deptList } = this.state;

    let old_lst = deptList;
    let is_updated = false;

    let final_state = old_lst.map((item) => {
      if (item.contact_no === deptObj.contact_no) {
        is_updated = true;
        const updatedItem = deptObj;
        return updatedItem;
      }
      return item;
    });
    if (is_updated == false) {
      final_state = [...deptList, deptObj];
    }
    console.log({ final_state });
    this.setState({ deptList: final_state }, () => {
      setFieldValue("dept", "");
      setFieldValue("contact_person", "");
      setFieldValue("contact_no", "");
      setFieldValue("email", "");
    });
  };

  // handle click event of the Remove button
  removeDeptRow = (values, index) => {
    const { deptList, removeDeptList } = this.state;
    const list = [...deptList];
    list.splice(index, 1);

    const list1 = [...removeDeptList];
    if (values.id > 0) {
      list1.push(values.id);
    }
    this.setState({ deptList: list, removeDeptList: list1 });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstUnders();
      this.lstBalancingMethods();
      this.getBranchData();
      this.lstState();
      this.lstCountry();
      this.listGSTTypes();
      const { prop_data } = this.props.block;
      console.log({ prop_data });
      this.setState({ edit_data: prop_data });
    }
  }

  componentDidUpdate() {
    const {
      undervalue,
      balancingOpt,
      stateOpt,
      countryOpt,
      GSTTypeOpt,
      edit_data,
      isEditDataSet,
    } = this.state;

    if (
      undervalue.length > 0 &&
      balancingOpt.length > 0 &&
      stateOpt.length > 0 &&
      countryOpt.length > 0 &&
      GSTTypeOpt.length > 0 &&
      isEditDataSet == false &&
      edit_data != ""
    ) {
      console.log("componentDidUpdate call");
      this.getLedgerDetails();
    }
  }

  render() {
    const {
      undervalue,
      balancingOpt,
      stateOpt,
      countryOpt,
      initVal,
      GSTTypeOpt,
      opbranchList,

      gstList,
      deptList,
      shippingList,
      billingList,

      removeGstList,
      removeDeptList,
      removeShippingList,
      removeBillingList,
    } = this.state;
    const validate = (values) => {
      const errors = {};
      // console.log("errors");
      // console.log("values", values);
      if (!values.ledger_name) {
        errors.ledger_name = "Ledger name is required";
      }

      // if (!values.lastName) {
      //   errors.lastName = "Required";
      // } else if (values.lastName.length > 20) {
      //   errors.lastName = "Must be 20 characters or less";
      // }

      // if (!values.email) {
      //   errors.email = "Required";
      // } else if (
      //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      // ) {
      //   errors.email = "Invalid email address";
      // }

      return errors;
    };
    return (
      <div className="company-from">
        {/* <h6>Purchase Invoice</h6> */}

        <div className="d-bg i-bg">
          <div className="ledger-form ">
            <h4 className="form-header">Update Ledger</h4>
            <Formik
              validateOnBlur={false}
              validateOnChange={false}
              enableReinitialize={true}
              initialValues={initVal}
              validate={validate}
              onSubmit={(values, { resetForm }) => {
                console.log({ values, removeGstList });
                const formData = new FormData();
                formData.append("id", values.id);

                if (values.underId && values.underId.under_prefix != null) {
                  formData.append(
                    "under_prefix",
                    values.underId ? values.underId.under_prefix : ""
                  );
                }

                if (
                  values.underId &&
                  values.underId.associates_id != null &&
                  values.underId.associates_id != ""
                ) {
                  formData.append(
                    "associates_id",
                    values.underId ? values.underId.associates_id : ""
                  );
                }
                if (
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                  "sundry_debtors"
                ) {
                  if (values.ledger_name != null) {
                    formData.append(
                      "ledger_name",
                      values.ledger_name ? values.ledger_name : ""
                    );
                  }

                  if (
                    values.underId &&
                    values.underId.sub_principle_id != null
                  ) {
                    formData.append(
                      "principle_group_id",
                      values.underId.sub_principle_id
                        ? values.underId.sub_principle_id
                        : ""
                    );
                  }

                  if (values.underId && values.underId.principle_id != null) {
                    formData.append(
                      "principle_id",
                      values.underId.principle_id
                        ? values.underId.principle_id
                        : ""
                    );
                  }

                  if (
                    values.underId &&
                    values.underId.ledger_form_parameter_id != null
                  ) {
                    formData.append(
                      "underId",
                      values.underId.ledger_form_parameter_id
                        ? values.underId.ledger_form_parameter_id
                        : ""
                    );
                  }

                  if (values.mailing_name != null) {
                    formData.append("mailing_name", values.mailing_name);
                  }

                  formData.append(
                    "opening_bal_type",
                    values.opening_balance_type
                      ? values.opening_balance_type == "dr"
                        ? "Dr"
                        : "Cr"
                      : "Dr"
                  );
                  formData.append(
                    "opening_bal",
                    values.opening_balance ? values.opening_balance : 0
                  );
                  if (values.opening_balancing_method != null) {
                    formData.append(
                      "balancing_method",
                      values.opening_balancing_method.value
                    );
                  }
                  if (values.address != null) {
                    formData.append("address", values.address);
                  }

                  if (values.stateId != null) {
                    formData.append(
                      "state",
                      values.stateId
                        ? values.stateId != ""
                          ? values.stateId.value
                          : 0
                        : 0
                    );
                  }

                  if (values.countryId != "" && values.countryId != null) {
                    formData.append(
                      "country",
                      values.countryId
                        ? values.countryId != ""
                          ? values.countryId.value
                          : 0
                        : 0
                    );
                  }
                  if (values.pincode != null) {
                    formData.append("pincode", values.pincode);
                  }
                  if (values.email_id && values.email_id != null) {
                    formData.append("email", values.email_id);
                  }
                  if (values.phone_no != null) {
                    formData.append("mobile_no", values.phone_no);
                  }

                  if (values.tds != null) {
                    formData.append("tds", values.tds);
                  }
                  if (values.tds == "true") {
                    formData.append(
                      "tds_applicable_date",
                      moment(values.tds_applicable_date).format("YYYY-MM-DD")
                    );
                  }

                  if (values.tcs != null) {
                    formData.append("tcs", values.tcs);
                  }
                  if (values.tcs == "true") {
                    formData.append(
                      "tcs_applicable_date",
                      moment(values.tcs_applicable_date).format("YYYY-MM-DD")
                    );
                  }
                  if (values.credit_days != null) {
                    formData.append("credit_days", values.credit_days);
                  }
                  if (values.applicable_from != null) {
                    formData.append("applicable_from", values.applicable_from);
                  }

                  if (values.fssai != null) {
                    formData.append("fssai", values.fssai);
                  }

                  if (values.isTaxation != null) {
                    formData.append("taxable", values.isTaxation);
                  }
                  if (values.pan_no != null) {
                    formData.append("pan_no", values.pan_no);
                  }

                  let gstdetails = [];
                  if (values.isTaxation == "true") {
                    if (values.registraion_type != null) {
                      formData.append(
                        "registration_type",
                        values.registraion_type.value
                      );
                    }

                    gstdetails = gstList.map((v, i) => {
                      let obj = {};
                      obj["id"] = v.id;
                      obj["gstin"] = v.gstin;

                      if (v.dateofregistartion != "")
                        obj["dateofregistartion"] = moment(
                          v.dateofregistartion
                        ).format("YYYY-MM-DD");

                      if (v.pan_no != "") obj["pancard"] = v.pan_no;

                      return obj;
                    });
                  }
                  formData.append("gstdetails", JSON.stringify(gstdetails));
                  formData.append(
                    "removeGstList",
                    JSON.stringify(removeGstList)
                  );

                  let billingDetails = billingList.map((v, i) => {
                    return {
                      id: v.id != null ? v.id : 0,
                      district: v.b_district,
                      billing_address: v.billing_address,
                    };
                  });

                  formData.append(
                    "billingDetails",
                    JSON.stringify(billingDetails)
                  );

                  formData.append(
                    "removeBillingList",
                    JSON.stringify(removeBillingList)
                  );

                  formData.append(
                    "shippingDetails",
                    JSON.stringify(shippingList)
                  );

                  formData.append(
                    "removeShippingList",
                    JSON.stringify(removeShippingList)
                  );

                  let deptDetails = [];
                  deptDetails = deptList.map((v, i) => {
                    let obj = {
                      id: v.id,
                      dept: v.dept,
                      contact_person: v.contact_person,
                      contact_no: v.contact_no,
                    };

                    if (v.email != "") obj["email"] = v.email;

                    return obj;
                  });
                  formData.append("deptDetails", JSON.stringify(deptDetails));

                  formData.append(
                    "removeDeptList",
                    JSON.stringify(removeDeptList)
                  );
                }

                if (
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                  "sundry_creditors"
                ) {
                  if (values.ledger_name != null) {
                    formData.append(
                      "ledger_name",
                      values.ledger_name ? values.ledger_name : ""
                    );
                  }

                  if (
                    values.underId.sub_principle_id &&
                    values.underId.sub_principle_id != ""
                  ) {
                    formData.append(
                      "principle_group_id",
                      values.underId.sub_principle_id
                    );
                  }
                  if (
                    values.underId.principle_id &&
                    values.underId.principle_id != ""
                  ) {
                    formData.append(
                      "principle_id",
                      values.underId.principle_id
                    );
                  }
                  if (values.supplier_code != null) {
                    formData.append("supplier_code", values.supplier_code);
                  }
                  if (
                    values.underId.ledger_form_parameter_id &&
                    values.underId.ledger_form_parameter_id != ""
                  ) {
                    formData.append(
                      "underId",
                      values.underId.ledger_form_parameter_id
                    );
                  }
                  if (values.mailing_name != null) {
                    formData.append("mailing_name", values.mailing_name);
                  }

                  formData.append(
                    "opening_bal_type",
                    values.opening_balance_type
                      ? values.opening_balance_type == "dr"
                        ? "Dr"
                        : "Cr"
                      : "Dr"
                  );
                  formData.append(
                    "opening_bal",
                    values.opening_balance ? values.opening_balance : 0
                  );

                  if (values.opening_balancing_method != null) {
                    formData.append(
                      "balancing_method",
                      values.opening_balancing_method.value
                    );
                  }

                  if (values.address != null) {
                    formData.append("address", values.address);
                  }

                  if (values.stateId != "" && values.stateId != null) {
                    formData.append(
                      "state",
                      values.stateId
                        ? values.stateId != ""
                          ? values.stateId.value
                          : 0
                        : 0
                    );
                  }

                  if (values.countryId != "" && values.countryId != null) {
                    formData.append(
                      "country",
                      values.countryId
                        ? values.countryId != ""
                          ? values.countryId.value
                          : 0
                        : 0
                    );
                  }

                  if (values.pincode != null) {
                    formData.append("pincode", values.pincode);
                  }

                  if (values.email_id != "" && values.email_id != null) {
                    formData.append("email", values.email_id);
                  }

                  if (values.phone_no != null) {
                    formData.append(
                      "mobile_no",
                      values.phone_no ? values.phone_no : 0
                    );
                  }

                  if (values.tds != null) {
                    formData.append("tds", values.tds);
                  }
                  if (values.tds == "true") {
                    formData.append(
                      "tds_applicable_date",
                      moment(values.tds_applicable_date).format("YYYY-MM-DD")
                    );
                  }

                  if (values.tcs != null) {
                    formData.append("tcs", values.tcs);
                  }
                  if (values.tcs == "true") {
                    formData.append(
                      "tcs_applicable_date",
                      moment(values.tcs_applicable_date).format("YYYY-MM-DD")
                    );
                  }
                  if (values.credit_days != null) {
                    formData.append("credit_days", values.credit_days);
                  }
                  if (values.applicable_from != null) {
                    formData.append("applicable_from", values.applicable_from);
                  }

                  if (values.fssai != null) {
                    formData.append("fssai", values.fssai);
                  }

                  if (values.isTaxation != null) {
                    formData.append("taxable", values.isTaxation);
                  }
                  if (values.pan_no != null) {
                    formData.append("pan_no", values.pan_no);
                  }

                  let gstdetails = [];
                  if (values.isTaxation == "true") {
                    if (values.registraion_type != null) {
                      formData.append(
                        "registration_type",
                        values.registraion_type.value
                      );
                    }

                    gstdetails = gstList.map((v, i) => {
                      let obj = {};
                      obj["id"] = v.id != null ? v.id : 0;
                      obj["gstin"] = v.gstin;

                      if (v.dateofregistartion != "")
                        obj["dateofregistartion"] = moment(
                          v.dateofregistartion
                        ).format("YYYY-MM-DD");

                      if (v.pan_no != "") obj["pancard"] = v.pan_no;

                      return obj;
                    });
                  }
                  formData.append("gstdetails", JSON.stringify(gstdetails));

                  formData.append(
                    "removeGstList",
                    JSON.stringify(removeGstList)
                  );

                  let billingDetails = billingList.map((v, i) => {
                    return {
                      id: v.id != null ? v.id : 0,
                      district: v.b_district,
                      billing_address: v.billing_address,
                    };
                  });

                  formData.append(
                    "billingDetails",
                    JSON.stringify(billingDetails)
                  );

                  formData.append(
                    "removeBillingList",
                    JSON.stringify(removeBillingList)
                  );

                  formData.append(
                    "shippingDetails",
                    JSON.stringify(shippingList)
                  );

                  formData.append(
                    "removeShippingList",
                    JSON.stringify(removeShippingList)
                  );

                  let deptDetails = [];
                  deptDetails = deptList.map((v, i) => {
                    let obj = {
                      id: v.id != null ? v.id : 0,
                      dept: v.dept,
                      contact_person: v.contact_person,
                      contact_no: v.contact_no,
                    };

                    if (v.email != "") obj["email"] = v.email;

                    return obj;
                  });
                  formData.append("deptDetails", JSON.stringify(deptDetails));

                  formData.append(
                    "removeDeptList",
                    JSON.stringify(removeDeptList)
                  );

                  if (values.bank_name != null) {
                    formData.append("bank_name", values.bank_name);
                  }
                  if (values.bank_account_no != null) {
                    formData.append("account_no", values.bank_account_no);
                  }
                  if (values.bank_ifsc_code != null) {
                    formData.append("ifsc_code", values.bank_ifsc_code);
                  }
                  if (values.bank_branch != null) {
                    formData.append("bank_branch", values.bank_branch);
                  }
                }
                if (
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                  "bank_account"
                ) {
                  if (values.ledger_name != null) {
                    formData.append(
                      "ledger_name",
                      values.ledger_name ? values.ledger_name : ""
                    );
                  }
                  if (
                    values.underId.sub_principle_id &&
                    values.underId.sub_principle_id != ""
                  ) {
                    formData.append(
                      "principle_group_id",
                      values.underId.sub_principle_id
                    );
                  }
                  if (
                    values.underId.principle_id &&
                    values.underId.principle_id != ""
                  ) {
                    formData.append(
                      "principle_id",
                      values.underId.principle_id
                    );
                  }
                  if (
                    values.underId.ledger_form_parameter_id &&
                    values.underId.ledger_form_parameter_id != ""
                  ) {
                    formData.append(
                      "underId",
                      values.underId.ledger_form_parameter_id
                    );
                  }
                  // formData.append("mailing_name", values.mailing_name);

                  formData.append(
                    "opening_bal_type",
                    values.opening_balance_type
                      ? values.opening_balance_type == "dr"
                        ? "Dr"
                        : "Cr"
                      : "Dr"
                  );
                  formData.append(
                    "opening_bal",
                    values.opening_balance ? values.opening_balance : 0
                  );
                  // formData.append(
                  //   "balancing_method",
                  //   values.opening_balancing_method.value
                  // );
                  if (values.address != null) {
                    formData.append("address", values.address);
                  }

                  if (values.stateId != "" && values.stateId != null) {
                    formData.append(
                      "state",
                      values.stateId
                        ? values.stateId != ""
                          ? values.stateId.value
                          : 0
                        : 0
                    );
                  }

                  if (values.countryId != "" && values.countryId != null) {
                    formData.append(
                      "country",
                      values.countryId
                        ? values.countryId != ""
                          ? values.countryId.value
                          : 0
                        : 0
                    );
                  }
                  if (values.pincode != null) {
                    formData.append("pincode", values.pincode);
                  }

                  if (values.email_id != "" && values.email_id) {
                    formData.append("email", values.email_id);
                  }
                  if (values.phone_no != null)
                    formData.append("mobile_no", values.phone_no);

                  if (values.isTaxation != null) {
                    formData.append("taxable", values.isTaxation);
                  }
                  if (values.isTaxation == "true") {
                    formData.append("gstin", values.gstin);
                    // formData.append(
                    //   "registration_type",
                    //   values.registraion_type.value
                    // );
                    // formData.append("pancard_no", values.pan_no);
                    // formData.append(
                    //   "dateofregistartion",
                    //   moment(values.dateofregistartion).format("YYYY-MM-DD")
                    // );
                  }

                  if (values.bank_name != null) {
                    formData.append("bank_name", values.bank_name);
                  }
                  if (values.bank_account_no != null) {
                    formData.append("account_no", values.bank_account_no);
                  }
                  if (values.bank_ifsc_code != null) {
                    formData.append("ifsc_code", values.bank_ifsc_code);
                  }
                  if (values.bank_branch != null) {
                    formData.append("bank_branch", values.bank_branch);
                  }
                }

                if (
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                  "duties_taxes"
                ) {
                  if (values.ledger_name != null) {
                    formData.append("ledger_name", values.ledger_name);
                  }

                  if (
                    values.underId.sub_principle_id &&
                    values.underId.sub_principle_id != ""
                  ) {
                    formData.append(
                      "principle_group_id",
                      values.underId.sub_principle_id
                    );
                  }
                  if (
                    values.underId.principle_id &&
                    values.underId.principle_id != ""
                  ) {
                    formData.append(
                      "principle_id",
                      values.underId.principle_id
                    );
                  }
                  if (
                    values.underId.ledger_form_parameter_id &&
                    values.underId.ledger_form_parameter_id != ""
                  ) {
                    formData.append(
                      "underId",
                      values.underId.ledger_form_parameter_id
                    );
                  }
                  if (values.tax_type != null) {
                    formData.append("tax_type", values.tax_type.value);
                  }
                }
                if (
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                  "assets"
                ) {
                  if (values.ledger_name != null) {
                    formData.append("ledger_name", values.ledger_name);
                  }

                  if (
                    values.underId.sub_principle_id &&
                    values.underId.sub_principle_id != ""
                  ) {
                    formData.append(
                      "principle_group_id",
                      values.underId.sub_principle_id
                    );
                  }
                  if (
                    values.underId.principle_id &&
                    values.underId.principle_id != ""
                  ) {
                    formData.append(
                      "principle_id",
                      values.underId.principle_id
                    );
                  }
                  if (
                    values.underId.ledger_form_parameter_id &&
                    values.underId.ledger_form_parameter_id != ""
                  ) {
                    formData.append(
                      "underId",
                      values.underId.ledger_form_parameter_id
                    );
                  }
                  formData.append(
                    "opening_bal_type",
                    values.opening_balance_type
                      ? values.opening_balance_type == "dr"
                        ? "Dr"
                        : "Cr"
                      : "Dr"
                  );
                  formData.append(
                    "opening_bal",
                    values.opening_balance ? values.opening_balance : 0
                  );
                }

                if (
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                  "others"
                ) {
                  if (values.ledger_name != null) {
                    formData.append("ledger_name", values.ledger_name);
                  }
                  if (
                    values.underId.sub_principle_id &&
                    values.underId.sub_principle_id != ""
                  ) {
                    formData.append(
                      "principle_group_id",
                      values.underId.sub_principle_id
                    );
                  }
                  if (
                    values.underId.principle_id &&
                    values.underId.principle_id != ""
                  ) {
                    formData.append(
                      "principle_id",
                      values.underId.principle_id
                    );
                  }
                  if (
                    values.underId.ledger_form_parameter_id &&
                    values.underId.ledger_form_parameter_id != ""
                  ) {
                    formData.append(
                      "underId",
                      values.underId.ledger_form_parameter_id
                    );
                  }
                  if (values.address != null) {
                    formData.append("address", values.address);
                  }
                  if (values.stateId != "" && values.stateId != null) {
                    formData.append(
                      "state",
                      values.stateId
                        ? values.stateId != ""
                          ? values.stateId.value
                          : 0
                        : 0
                    );
                  }

                  if (values.countryId != "" && values.countryId != null) {
                    formData.append(
                      "country",
                      values.countryId
                        ? values.countryId != ""
                          ? values.countryId.value
                          : 0
                        : 0
                    );
                  }
                  if (values.pincode != null) {
                    formData.append("pincode", values.pincode);
                  }
                  if (values.phone_no != null) {
                    formData.append("mobile_no", values.phone_no);
                  }
                }
                formData.append(
                  "slug",
                  values.underId.ledger_form_parameter_slug.toLowerCase()
                );
                formData.append("is_private", values.is_private);

                for (let [name, value] of formData) {
                  console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                }

                editLedger(formData)
                  .then((response) => {
                    let res = response.data;
                    if (res.responseStatus == 200) {
                      ShowNotification("Success", res.message);
                      resetForm();
                      eventBus.dispatch("page_change", "ledgerlist");

                      // this.props.history.push('/SundryCreditors');
                    } else {
                      ShowNotification("Error", res.message);
                    }
                  })
                  .catch((error) => {
                    console.log("error", error);
                  });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                submitForm,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="ledger-header mb-0">
                    <Row className="ledgerrow">
                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>Select Branch</Form.Label>
                          <Select
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

                      <Col md="5" className="">
                        <Form.Group>
                          <Form.Label>
                            Ledger Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            autoFocus="true"
                            type="text"
                            placeholder="Ledger Name"
                            name="ledger_name"
                            onChange={handleChange}
                            value={values.ledger_name}
                            autofocus
                            isValid={touched.ledger_name && !errors.ledger_name}
                            isInvalid={!!errors.ledger_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.ledger_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="2" className="">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Under{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            onChange={(v) => {
                              setFieldValue("underId", v);
                              if (v.sub_principle_id) {
                                if (v.sub_principle_id == 5) {
                                  setFieldValue("opening_balance_type", "cr");
                                } else if (v.sub_principle_id == 1) {
                                  setFieldValue("opening_balance_type", "dr");
                                }
                              }
                            }}
                            name="underId"
                            styles={customStyles}
                            options={undervalue}
                            value={values.underId}
                            invalid={errors.underId ? true : false}
                            //styles={customStyles}
                          />
                          <span className="text-danger">{errors.underId}</span>
                        </Form.Group>
                      </Col>
                      {/* <Col md="2">
                          <Button
                            className="createbtn mt-4s"
                            variant="secondary"
                            type="submit"
                            onClick={() => {
                              this.handleModal(true);
                            }}
                          >
                            Associate Group
                          </Button>
                        </Col> */}
                      <Col md="2">
                        <Form.Group>
                          {/* <Form.Label style={{ color: '#fff' }}>
                                  Blank
                                </Form.Label> */}
                          <p className="displaygroup pl-4">
                            {values.underId
                              ? values.underId.sub_principle_id
                                ? values.underId.principle_name
                                : ""
                              : ""}
                          </p>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <div>
                          <Form.Group>
                            <Form.Label>
                              Ledger Type{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>{" "}
                            <Form.Control
                              as="select"
                              onChange={(e) => {
                                setFieldValue("is_private", e.target.value);
                              }}
                              name="is_private"
                              value={values.is_private}
                            >
                              <option value="true"> Yes</option>
                              <option value="false">No</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "sundry_creditors" && (
                      <>
                        <div className="bankaccount form-style">
                          <Row className="mt-4 row-border">
                            <h6
                              className="title-style"
                              style={{
                                marginLeft: "20px",
                              }}
                            >
                              SUNDRY CREDITORS
                            </h6>
                            <Row className="mb-4 row-inside">
                              <Col md="4" className="">
                                <Form.Group>
                                  <Form.Label>Mailing Name </Form.Label>
                                  <Form.Control
                                    autoFocus="true"
                                    type="text"
                                    placeholder="Mailing Name"
                                    name="mailing_name"
                                    onChange={handleChange}
                                    value={values.mailing_name}
                                    isValid={
                                      touched.mailing_name &&
                                      !errors.mailing_name
                                    }
                                    isInvalid={!!errors.mailing_name}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.mailing_name}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col
                                md="2"
                                //className="ml-2 pl-2 pr-3"
                                //style={{ width: "18%" }}
                              >
                                <Form.Group className="">
                                  <Form.Label>
                                    Opening Balance{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <InputGroup className="jointdropdown">
                                    <FormControl
                                      placeholder=""
                                      aria-label="Opening Balance"
                                      aria-describedby="basic-addon2"
                                      name="opening_balance"
                                      onChange={handleChange}
                                      value={values.opening_balance}
                                      isValid={
                                        touched.opening_balance &&
                                        !errors.opening_balance
                                      }
                                      isInvalid={!!errors.opening_balance}
                                    />

                                    {/* <DropdownButton
                                      as={InputGroup.Append}
                                      variant="outline-secondary"
                                      title="Dr"
                                      id="input-group-dropdown-2"
                                    >
                                      <Dropdown.Item href="#">Dr</Dropdown.Item>
                                      <Dropdown.Item href="#">Cr</Dropdown.Item>
                                    </DropdownButton> */}
                                    <div style={{ width: "25%" }}>
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          // console.log("e", e.target.value);
                                          setFieldValue(
                                            "opening_balance_type",
                                            e.target.value
                                          );
                                        }}
                                        name="opening_balance_type"
                                        value={values.opening_balance_type}
                                      >
                                        <option value="dr">Dr</option>
                                        <option value="cr">Cr</option>
                                      </Form.Control>
                                    </div>
                                    <Form.Control.Feedback type="invalid">
                                      {errors.opening_balance_type}
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                              <Col md="2">
                                <Form.Group className="createnew">
                                  <Form.Label>
                                    Balancing Method{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <Select
                                    className="selectTo"
                                    onChange={(v) => {
                                      setFieldValue(
                                        "opening_balancing_method",
                                        v
                                      );
                                    }}
                                    name="opening_balancing_method"
                                    styles={customStyles}
                                    options={balancingOpt}
                                    value={values.opening_balancing_method}
                                    invalid={
                                      errors.opening_balancing_method
                                        ? true
                                        : false
                                    }
                                  />
                                  <span className="text-danger">
                                    {errors.opening_balancing_method}
                                  </span>
                                </Form.Group>
                              </Col>
                              <Col md="4" className="">
                                <Form.Group>
                                  <Form.Label>
                                    Supplier Code{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Supplier Code"
                                    name="supplier_code"
                                    onChange={handleChange}
                                    value={values.supplier_code}
                                    isValid={
                                      touched.supplier_code &&
                                      !errors.supplier_code
                                    }
                                    isInvalid={!!errors.supplier_code}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.supplier_code}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Row>

                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-4">
                              {/* <div className="mt-2"> */}
                              <h6 className="title-style">Mailing Details</h6>
                              <Row className="row-inside">
                                <Col md="6">
                                  <Form.Group className="createnew">
                                    <Form.Label>Address </Form.Label>
                                    <Form.Control
                                      autoFoucs="true"
                                      type="text"
                                      placeholder="Address"
                                      name="address"
                                      onChange={handleChange}
                                      value={values.address}
                                      isValid={
                                        touched.address && !errors.address
                                      }
                                      isInvalid={!!errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.address}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>
                                      State{" "}
                                      <span className="pt-1 pl-1 req_validation">
                                        *
                                      </span>
                                    </Form.Label>
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("stateId", v);
                                      }}
                                      name="stateId"
                                      styles={customStyles}
                                      options={stateOpt}
                                      value={values.stateId}
                                      invalid={errors.stateId ? true : false}
                                    />
                                    <span className="text-danger">
                                      {errors.stateId}
                                    </span>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>
                                      Country{" "}
                                      <span className="pt-1 pl-1 req_validation">
                                        *
                                      </span>
                                    </Form.Label>
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      styles={customStyles}
                                      options={countryOpt}
                                      value={values.countryId}
                                      invalid={errors.countryId ? true : false}
                                    />
                                    <span className="text-danger">
                                      {errors.countryId}
                                    </span>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Pincode </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Pincode"
                                      name="pincode"
                                      onChange={handleChange}
                                      value={values.pincode}
                                      isValid={
                                        touched.pincode && !errors.pincode
                                      }
                                      isInvalid={!!errors.pincode}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.pincode}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row className="mt-3 row-inside">
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Email ID</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Email ID"
                                      name="email_id"
                                      onChange={handleChange}
                                      value={values.email_id}
                                      isValid={
                                        touched.email_id && !errors.email_id
                                      }
                                      isInvalid={!!errors.email_id}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.email_id}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Phone No. </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Phone No."
                                      name="phone_no"
                                      onChange={handleChange}
                                      value={values.phone_no}
                                      isValid={
                                        touched.phone_no && !errors.phone_no
                                      }
                                      isInvalid={!!errors.phone_no}
                                      maxLength={10}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.phone_no}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>

                                <Col md="2">
                                  <div>
                                    <Form.Group>
                                      <Form.Label>
                                        TDS Applicable{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>{" "}
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue("tds", e.target.value);
                                        }}
                                        name="tds"
                                        value={values.tds}
                                      >
                                        <option value="false">No</option>
                                        <option value="true"> Yes</option>
                                      </Form.Control>
                                    </Form.Group>
                                  </div>
                                </Col>
                                {values.tds == "true" && (
                                  <Col md="2">
                                    <Form.Group>
                                      <Form.Label>
                                        TDS Applicable Date
                                      </Form.Label>

                                      <MyDatePicker
                                        name="tds_applicable_date"
                                        placeholderText="DD/MM/YYYY"
                                        id="tds_applicable_date"
                                        dateFormat="dd/MM/yyyy"
                                        onChange={(date) => {
                                          setFieldValue(
                                            "tds_applicable_date",
                                            date
                                          );
                                        }}
                                        selected={values.tds_applicable_date}
                                        minDate={new Date()}
                                        className="date-style"
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.tds_applicable_date}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                )}
                                <Col md="2">
                                  <div>
                                    <Form.Group>
                                      <Form.Label>
                                        TCS Applicable{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>{" "}
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue("tcs", e.target.value);
                                        }}
                                        name="tcs"
                                        value={values.tcs}
                                      >
                                        <option value="false">No</option>
                                        <option value="true"> Yes</option>
                                      </Form.Control>
                                    </Form.Group>
                                  </div>
                                </Col>
                                {values.tcs == "true" && (
                                  <Col md="2">
                                    <Form.Group>
                                      <Form.Label>
                                        TCS Applicable Date
                                      </Form.Label>

                                      <MyDatePicker
                                        name="tcs_applicable_date"
                                        placeholderText="DD/MM/YYYY"
                                        id="tcs_applicable_date"
                                        dateFormat="dd/MM/yyyy"
                                        onChange={(date) => {
                                          setFieldValue(
                                            "tcs_applicable_date",
                                            date
                                          );
                                        }}
                                        selected={values.tcs_applicable_date}
                                        minDate={new Date()}
                                        className="date-style"
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.tcs_applicable_date}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                )}
                              </Row>

                              <Row className="mt-3 row-inside">
                                <Col md="1">
                                  <Form.Group className="createnew">
                                    <Form.Label>Credit Days </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Credit Days"
                                      name="credit_days"
                                      onChange={handleChange}
                                      value={values.credit_days}
                                      isValid={
                                        touched.credit_days &&
                                        !errors.credit_days
                                      }
                                      isInvalid={!!errors.credit_days}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.credit_days}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>

                                <Col md="2">
                                  <div>
                                    <Form.Group>
                                      <Form.Label>
                                        Applicable From
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>{" "}
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "applicable_from",
                                            e.target.value
                                          );
                                        }}
                                        name="applicable_from"
                                        value={values.applicable_from}
                                      >
                                        <option value="billDate">
                                          Bill Date
                                        </option>
                                        <option value="deliveryDate">
                                          Delivery Date
                                        </option>
                                      </Form.Control>
                                    </Form.Group>
                                  </div>
                                </Col>
                                <Col md="1">
                                  <Form.Group className="createnew">
                                    <Form.Label>FSSAI No. </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="FSSAI No."
                                      name="fssai"
                                      onChange={handleChange}
                                      value={values.fssai}
                                      isValid={touched.fssai && !errors.fssai}
                                      isInvalid={!!errors.fssai}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.fssai}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                          </Row>

                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-4">
                              {/* <div className="mt-2"> */}
                              <h6 className="title-style">Tax Details</h6>
                              <Row className="row-inside">
                                <Col md="1">
                                  <div>
                                    {/* <h6>Taxation Details</h6> */}
                                    <Form.Group>
                                      <Form.Label>
                                        Tax Available{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>{" "}
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "isTaxation",
                                            e.target.value
                                          );
                                        }}
                                        name="isTaxation"
                                        value={values.isTaxation}
                                      >
                                        <option value="false">No</option>
                                        <option value="true"> Yes</option>
                                      </Form.Control>
                                    </Form.Group>
                                  </div>
                                </Col>

                                {values.isTaxation == "true" ? (
                                  <Col md="2">
                                    <Form.Group className="createnew">
                                      <Form.Label>Registration Type</Form.Label>
                                      <Select
                                        className="selectTo"
                                        onChange={(v) => {
                                          setFieldValue("registraion_type", v);
                                        }}
                                        name="registraion_type"
                                        styles={customStyles}
                                        options={GSTTypeOpt}
                                        value={values.registraion_type}
                                        invalid={
                                          errors.registraion_type ? true : false
                                        }
                                      />
                                    </Form.Group>
                                  </Col>
                                ) : (
                                  <Col md="2">
                                    <Form.Group>
                                      <Form.Label>Pan Card No.</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Pan Card No."
                                        name="pan_no"
                                        onChange={handleChange}
                                        value={values.pan_no}
                                        isValid={
                                          touched.pan_no && !errors.pan_no
                                        }
                                        isInvalid={!!errors.pan_no}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.pan_no}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                )}
                              </Row>
                              {values.isTaxation == "true" && (
                                <>
                                  <Row className="mt-3 row-inside">
                                    <Col md="3">
                                      <Form.Group>
                                        <Form.Label>GSTIN</Form.Label>
                                        <Form.Control
                                          type="text"
                                          placeholder="GSTIN"
                                          name="gstin"
                                          onChange={handleChange}
                                          value={values.gstin}
                                          isValid={
                                            touched.gstin && !errors.gstin
                                          }
                                          isInvalid={!!errors.gstin}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.gstin}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                    <Col md="2">
                                      <Form.Group>
                                        <Form.Label>
                                          Registration Date
                                        </Form.Label>

                                        <MyDatePicker
                                          name="dateofregistartion"
                                          placeholderText="DD/MM/YYYY"
                                          id="dateofregistartion"
                                          dateFormat="dd/MM/yyyy"
                                          onChange={(date) => {
                                            setFieldValue(
                                              "dateofregistartion",
                                              date
                                            );
                                          }}
                                          selected={values.dateofregistartion}
                                          minDate={new Date()}
                                          className="date-style"
                                        />
                                        <span className="text-danger errormsg">
                                          {errors.dateofregistartion}
                                        </span>
                                      </Form.Group>
                                    </Col>
                                    <Col md="3">
                                      <Form.Group>
                                        <Form.Label>Pan Card No.</Form.Label>
                                        <Form.Control
                                          type="text"
                                          placeholder="Pan Card No."
                                          name="pan_no"
                                          onChange={handleChange}
                                          value={values.pan_no}
                                          isValid={
                                            touched.pan_no && !errors.pan_no
                                          }
                                          isInvalid={!!errors.pan_no}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.pan_no}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                    <Col md="4" className="mainbtn_create">
                                      {" "}
                                      <ButtonGroup
                                        className="pull-right pt-4"
                                        aria-label="Basic example"
                                      >
                                        <Button
                                          className="createbtn mr-2"
                                          onClick={(e) => {
                                            e.preventDefault();

                                            if (values.gstin != "") {
                                              let gstObj = {
                                                id: 0,
                                                gstin: values.gstin,
                                                dateofregistartion:
                                                  values.dateofregistartion,
                                                pan_no: values.pan_no,
                                              };
                                              this.addGSTRow(
                                                gstObj,
                                                setFieldValue
                                              );
                                            } else {
                                              ShowNotification(
                                                "Error",
                                                "Please submit all data"
                                              );
                                            }
                                          }}
                                        >
                                          ADD ROW
                                        </Button>
                                      </ButtonGroup>
                                    </Col>
                                  </Row>
                                  <Row className="mt-3 row-inside">
                                    <Col md="8">
                                      {gstList.length > 0 && (
                                        <div className="table_wrapper">
                                          <Table
                                            // bordered
                                            hover
                                            size="sm"
                                            style={{ fontSize: "13px" }}
                                            //responsive
                                          >
                                            <thead>
                                              <tr>
                                                <th> #.</th>
                                                <th>GST No.</th>
                                                <th>Registraton Date</th>
                                                <th>PAN No.</th>
                                                <th className="btn_align right_col">
                                                  -
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {gstList.map((v, i) => {
                                                return (
                                                  <tr>
                                                    <td>{i + 1}</td>
                                                    <td>{v.gstin}</td>
                                                    <td>
                                                      {moment(
                                                        v.dateofregistartion
                                                      ).format("DD-MM-YYYY")}
                                                    </td>
                                                    <td>{v.pan_no}</td>
                                                    <td>
                                                      <Button
                                                        className="mainbtnminus"
                                                        variant=""
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          this.removeGstRow(
                                                            v,
                                                            i
                                                          );
                                                        }}
                                                      >
                                                        <i class="fa fa-edit"></i>
                                                      </Button>
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </Table>
                                        </div>
                                      )}
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </Col>
                          </Row>

                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-4">
                              {/* <div className="mt-2"> */}
                              <h6 className="title-style">Shipping Details</h6>

                              <Row className="row-inside">
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>District</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="District"
                                      name="district"
                                      onChange={handleChange}
                                      value={values.district}
                                      isValid={
                                        touched.district && !errors.district
                                      }
                                      isInvalid={!!errors.district}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.district}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="6">
                                  <Form.Group>
                                    <Form.Label>Shipping Address</Form.Label>
                                    <Form.Control
                                      type="textarea"
                                      placeholder="Shipping Address"
                                      name="shipping_address"
                                      onChange={handleChange}
                                      value={values.shipping_address}
                                      isValid={
                                        touched.shipping_address &&
                                        !errors.shipping_address
                                      }
                                      isInvalid={!!errors.shipping_address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.shipping_address}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="4">
                                  <ButtonGroup
                                    className="pull-right pt-4"
                                    aria-label="Basic example"
                                  >
                                    <Button
                                      className="createbtn"
                                      variant="secondary"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.district != "" &&
                                          values.shipping_address != ""
                                        ) {
                                          let shipObj = {
                                            id: 0,
                                            district: values.district,
                                            shipping_address:
                                              values.shipping_address,
                                          };
                                          this.addShippingRow(
                                            shipObj,
                                            setFieldValue
                                          );
                                        } else {
                                          ShowNotification(
                                            "Error",
                                            "Please submit all data"
                                          );
                                        }
                                      }}
                                    >
                                      ADD ROW
                                    </Button>
                                  </ButtonGroup>
                                </Col>
                              </Row>

                              {shippingList.length > 0 && (
                                <Row className="mt-3 row-inside">
                                  <Col md="8">
                                    <div className="table_wrapper">
                                      <Table
                                        // bordered
                                        hover
                                        size="sm"
                                        style={{ fontSize: "13px" }}
                                        //responsive
                                      >
                                        <thead>
                                          <tr>
                                            <th>#.</th>
                                            <th>District</th>
                                            <th>Shipping Address</th>
                                            <th className="btn_align right_col">
                                              -
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {shippingList.map((v, i) => {
                                            return (
                                              <tr>
                                                <td>{i + 1}</td>
                                                <td>{v.district}</td>
                                                <td>{v.shipping_address}</td>
                                                <td>
                                                  <Button
                                                    className="mainbtnminus"
                                                    variant=""
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeShippingRow(
                                                        v,
                                                        i
                                                      );
                                                    }}
                                                  >
                                                    <i class="fa fa-edit"></i>
                                                  </Button>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  </Col>
                                </Row>
                              )}
                            </Col>
                          </Row>

                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-4">
                              {/* <div className="mt-2"> */}
                              <h6 className="title-style">Billing Details</h6>
                              <Row className="row-inside">
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>District</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="District"
                                      name="b_district"
                                      onChange={handleChange}
                                      value={values.b_district}
                                      isValid={
                                        touched.b_district && !errors.b_district
                                      }
                                      isInvalid={!!errors.b_district}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.b_district}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="6">
                                  <Form.Group>
                                    <Form.Label>Billing Address</Form.Label>
                                    <Form.Control
                                      type="textarea"
                                      placeholder="Billing Address"
                                      name="billing_address"
                                      onChange={handleChange}
                                      value={values.billing_address}
                                      isValid={
                                        touched.billing_address &&
                                        !errors.billing_address
                                      }
                                      isInvalid={!!errors.billing_address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.billing_address}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="4">
                                  <ButtonGroup
                                    className="pull-right pt-4"
                                    aria-label="Basic example"
                                  >
                                    <Button
                                      className="createbtn"
                                      variant="secondary"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.b_district != "" &&
                                          values.billing_address != ""
                                        ) {
                                          let billAddObj = {
                                            id: 0,
                                            b_district: values.b_district,
                                            billing_address:
                                              values.billing_address,
                                          };
                                          this.addBillingRow(
                                            billAddObj,
                                            setFieldValue
                                          );
                                        } else {
                                          ShowNotification(
                                            "Error",
                                            "Please submit all data"
                                          );
                                        }
                                      }}
                                    >
                                      ADD ROW
                                    </Button>
                                  </ButtonGroup>
                                </Col>
                              </Row>

                              {billingList.length > 0 && (
                                <Row className="mt-3 row-inside">
                                  <Col md="8">
                                    <div className="table_wrapper">
                                      <Table
                                        hover
                                        size="sm"
                                        style={{ fontSize: "13px" }}

                                        //responsive
                                      >
                                        <thead>
                                          <tr>
                                            <th>#.</th>
                                            <th>District</th>
                                            <th>Shipping Address</th>
                                            <th className="btn_align right_col">
                                              -
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {billingList.map((v, i) => {
                                            return (
                                              <tr>
                                                <td>{i + 1}</td>
                                                <td>{v.b_district}</td>
                                                <td>{v.billing_address}</td>
                                                <td>
                                                  <Button
                                                    className="mainbtnminus"
                                                    variant=""
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeBillingRow(
                                                        v,
                                                        i
                                                      );
                                                    }}
                                                  >
                                                    <i class="fa fa-edit"></i>
                                                  </Button>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  </Col>
                                </Row>
                              )}
                            </Col>
                          </Row>

                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-4">
                              {/* <div className="mt-2"> */}
                              <h6 className="title-style">
                                Department Details
                              </h6>
                              <Row className="row-inside">
                                <Col md="3">
                                  <Form.Group>
                                    <Form.Label>Department Name</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Department Name"
                                      name="dept"
                                      onChange={handleChange}
                                      value={values.dept}
                                      isValid={touched.dept && !errors.dept}
                                      isInvalid={!!errors.dept}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.dept}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="3">
                                  <Form.Group>
                                    <Form.Label>Contact Person</Form.Label>
                                    <Form.Control
                                      type="textarea"
                                      placeholder="Contact Person"
                                      name="contact_person"
                                      onChange={handleChange}
                                      value={values.contact_person}
                                      isValid={
                                        touched.contact_person &&
                                        !errors.contact_person
                                      }
                                      isInvalid={!!errors.contact_person}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.contact_person}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>Contact No.</Form.Label>
                                    <Form.Control
                                      type="textarea"
                                      placeholder="Contact No."
                                      name="contact_no"
                                      onChange={handleChange}
                                      value={values.contact_no}
                                      isValid={
                                        touched.contact_no && !errors.contact_no
                                      }
                                      isInvalid={!!errors.contact_no}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.contact_no}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                      type="textarea"
                                      placeholder="Email"
                                      name="email"
                                      onChange={handleChange}
                                      value={values.email}
                                      isValid={touched.email && !errors.email}
                                      isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.email}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <ButtonGroup
                                    className="pull-right pt-4"
                                    aria-label="Basic example"
                                  >
                                    <Button
                                      className="createbtn"
                                      variant="secondary"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.dept != "" &&
                                          values.contact_no != "" &&
                                          values.contact_person != ""
                                        ) {
                                          let deptObj = {
                                            id: 0,
                                            dept:
                                              values.dept != null
                                                ? values.dept
                                                : "",
                                            contact_no:
                                              values.contact_no != null
                                                ? values.contact_no
                                                : "",
                                            contact_person:
                                              values.contact_person != null
                                                ? values.contact_person
                                                : "",
                                            email:
                                              values.email != null
                                                ? values.email
                                                : "",
                                          };
                                          this.addDeptRow(
                                            deptObj,
                                            setFieldValue
                                          );
                                        } else {
                                          ShowNotification(
                                            "Error",
                                            "Please submit all data"
                                          );
                                        }
                                      }}
                                    >
                                      ADD ROW
                                    </Button>
                                  </ButtonGroup>
                                </Col>
                              </Row>

                              {deptList.length > 0 && (
                                <Row className="mt-3 row-inside">
                                  <Col md="8">
                                    <div className="table_wrapper">
                                      <Table
                                        hover
                                        size="sm"
                                        style={{ fontSize: "13px" }}
                                        //responsive
                                      >
                                        <thead>
                                          <tr>
                                            <th>#.</th>
                                            <th>Dept. Name</th>
                                            <th>Contact Person</th>
                                            <th>Contact No.</th>
                                            <th>Email</th>
                                            <th className="btn_align right_col">
                                              -
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {deptList.map((v, i) => {
                                            return (
                                              <tr>
                                                <td>{i + 1}</td>
                                                <td>{v.dept}</td>
                                                <td>{v.contact_person}</td>
                                                <td>{v.contact_no}</td>
                                                <td>{v.email}</td>
                                                <td>
                                                  <Button
                                                    className="mainbtnminus"
                                                    variant=""
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeDeptRow(v, i);
                                                    }}
                                                  >
                                                    <i class="fa fa-edit"></i>
                                                  </Button>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  </Col>
                                </Row>
                              )}
                            </Col>
                          </Row>
                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-4">
                              {/* <div className="mt-2"> */}
                              <h6 className="title-style">Bank Details</h6>
                              <Row className="row-inside">
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>Bank Name </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Bank Name"
                                      name="bank_name"
                                      onChange={handleChange}
                                      value={values.bank_name}
                                      isValid={
                                        touched.bank_name && !errors.bank_name
                                      }
                                      isInvalid={!!errors.bank_name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.bank_name}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>Account Number </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Account Number"
                                      name="bank_account_no"
                                      onChange={handleChange}
                                      value={values.bank_account_no}
                                      isValid={
                                        touched.bank_account_no &&
                                        !errors.bank_account_no
                                      }
                                      isInvalid={!!errors.bank_account_no}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.bank_account_no}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>IFSC Code </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="IFSC Code"
                                      name="bank_ifsc_code"
                                      onChange={handleChange}
                                      value={values.bank_ifsc_code}
                                      isValid={
                                        touched.bank_ifsc_code &&
                                        !errors.bank_ifsc_code
                                      }
                                      isInvalid={!!errors.bank_ifsc_code}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.bank_ifsc_code}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="4">
                                  <Form.Group>
                                    <Form.Label>Branch </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Branch"
                                      name="bank_branch"
                                      onChange={handleChange}
                                      value={values.bank_branch}
                                      isValid={
                                        touched.bank_branch &&
                                        !errors.bank_branch
                                      }
                                      isInvalid={!!errors.bank_branch}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.bank_branch}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="mt-2 mb-2">
                            <Col md="12">
                              <ButtonGroup
                                className="pull-right pt-4"
                                aria-label="Basic example"
                              >
                                <Button className="submit-btn" type="submit">
                                  Submit
                                </Button>
                                <Button
                                  variant="secondary"
                                  className="cancel-btn"
                                  onClick={(e) => {
                                    e.preventDefault();

                                    eventBus.dispatch("page_change", {
                                      from: "ledgeredit",
                                      to: "ledgerlist",
                                      isNewTab: false,
                                    });
                                  }}
                                >
                                  Cancel
                                </Button>
                              </ButtonGroup>
                            </Col>
                          </Row>
                        </div>
                      </>
                    )}
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "sundry_debtors" && (
                      <>
                        {/* sundry debetor form start  */}
                        <div className="bankaccount form-style">
                          {/* <div className="mt-2"> */}
                          <Row className="mt-4 row-border">
                            <h6
                              className="title-style"
                              style={{
                                marginLeft: "20px",
                              }}
                            >
                              SUNDRY DEBTORS
                            </h6>
                            <Row className="mb-4 row-inside">
                              <Col md="4" className="">
                                <Form.Group>
                                  <Form.Label>Mailing Name </Form.Label>
                                  <Form.Control
                                    autoFocus="true"
                                    type="text"
                                    placeholder="Mailing Name"
                                    name="mailing_name"
                                    onChange={handleChange}
                                    value={values.mailing_name}
                                    isValid={
                                      touched.mailing_name &&
                                      !errors.mailing_name
                                    }
                                    isInvalid={!!errors.mailing_name}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.mailing_name}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col
                                md="2"
                                //className="ml-2 pl-2 pr-3"
                                // style={{ width: "18%" }}
                              >
                                <Form.Group className="">
                                  <Form.Label>
                                    Opening Balance{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <InputGroup className="jointdropdown">
                                    <FormControl
                                      placeholder=""
                                      aria-label="Opening Balance"
                                      aria-describedby="basic-addon2"
                                      name="opening_balance"
                                      onChange={handleChange}
                                      value={values.opening_balance}
                                      isValid={
                                        touched.opening_balance &&
                                        !errors.opening_balance
                                      }
                                      isInvalid={!!errors.opening_balance}
                                    />
                                    <div style={{ width: "25%" }}>
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          // console.log("e", e.target.value);
                                          setFieldValue(
                                            "opening_balance_type",
                                            e.target.value
                                          );
                                        }}
                                        name="opening_balance_type"
                                        value={values.opening_balance_type}
                                      >
                                        <option value="dr">Dr</option>
                                        <option value="cr">Cr</option>
                                      </Form.Control>
                                    </div>
                                    <Form.Control.Feedback type="invalid">
                                      {errors.opening_balance_type}
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                              <Col md="2">
                                <Form.Group className="createnew">
                                  <Form.Label>
                                    Balancing Method{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <Select
                                    className="selectTo"
                                    onChange={(v) => {
                                      setFieldValue(
                                        "opening_balancing_method",
                                        v
                                      );
                                    }}
                                    name="opening_balancing_method"
                                    styles={customStyles}
                                    options={balancingOpt}
                                    value={values.opening_balancing_method}
                                    invalid={
                                      errors.opening_balancing_method
                                        ? true
                                        : false
                                    }
                                    //styles={customStyles}
                                  />
                                  <span className="text-danger">
                                    {errors.opening_balancing_method}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Row>

                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-4">
                              {/* <div className="mt-2"> */}
                              <h6 className="title-style">Mailing Details</h6>
                              <Row className="row-inside">
                                <Col md="4">
                                  <Form.Group className="createnew">
                                    <Form.Label>Address </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Address"
                                      name="address"
                                      onChange={handleChange}
                                      value={values.address}
                                      isValid={
                                        touched.address && !errors.address
                                      }
                                      isInvalid={!!errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.address}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="3">
                                  <Form.Group className="createnew">
                                    <Form.Label>
                                      State{" "}
                                      <span className="pt-1 pl-1 req_validation">
                                        *
                                      </span>
                                    </Form.Label>
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("stateId", v);
                                      }}
                                      name="stateId"
                                      styles={customStyles}
                                      options={stateOpt}
                                      value={values.stateId}
                                      invalid={errors.stateId ? true : false}
                                      //styles={customStyles}
                                    />
                                    <span className="text-danger">
                                      {errors.stateId}
                                    </span>
                                  </Form.Group>
                                </Col>
                                <Col md="3">
                                  <Form.Group className="createnew">
                                    <Form.Label>
                                      Country{" "}
                                      <span className="pt-1 pl-1 req_validation">
                                        *
                                      </span>
                                    </Form.Label>
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      styles={customStyles}
                                      options={countryOpt}
                                      value={values.countryId}
                                      invalid={errors.countryId ? true : false}
                                      //styles={customStyles}
                                    />
                                    <span className="text-danger">
                                      {errors.countryId}
                                    </span>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Pincode </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Pincode"
                                      name="pincode"
                                      onChange={handleChange}
                                      value={values.pincode}
                                      isValid={
                                        touched.pincode && !errors.pincode
                                      }
                                      isInvalid={!!errors.pincode}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.pincode}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row className="mt-4 row-inside">
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Email ID </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Email ID"
                                      name="email_id"
                                      onChange={handleChange}
                                      value={values.email_id}
                                      isValid={
                                        touched.email_id && !errors.email_id
                                      }
                                      isInvalid={!!errors.email_id}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.email_id}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Phone No. </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Phone No."
                                      name="phone_no"
                                      onChange={handleChange}
                                      value={values.phone_no}
                                      isValid={
                                        touched.phone_no && !errors.phone_no
                                      }
                                      isInvalid={!!errors.phone_no}
                                      maxLength={10}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.phone_no}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>

                                <Col md="2">
                                  <div>
                                    <Form.Group>
                                      <Form.Label>
                                        TDS Applicable{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>{" "}
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue("tds", e.target.value);
                                        }}
                                        name="tds"
                                        value={values.tds}
                                      >
                                        <option value="false">No</option>
                                        <option value="true"> Yes</option>
                                      </Form.Control>
                                    </Form.Group>
                                  </div>
                                </Col>
                                {values.tds == "true" && (
                                  <Col md="2">
                                    <Form.Group>
                                      <Form.Label>
                                        TDS Applicable Date
                                      </Form.Label>

                                      <MyDatePicker
                                        name="tds_applicable_date"
                                        placeholderText="DD/MM/YYYY"
                                        id="tds_applicable_date"
                                        dateFormat="dd/MM/yyyy"
                                        onChange={(date) => {
                                          setFieldValue(
                                            "tds_applicable_date",
                                            date
                                          );
                                        }}
                                        selected={values.tds_applicable_date}
                                        minDate={new Date()}
                                        className="date-style"
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.tds_applicable_date}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                )}
                                <Col md="2">
                                  <div>
                                    <Form.Group>
                                      <Form.Label>
                                        TCS Applicable{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>{" "}
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue("tcs", e.target.value);
                                        }}
                                        name="tcs"
                                        value={values.tcs}
                                      >
                                        <option value="false">No</option>
                                        <option value="true"> Yes</option>
                                      </Form.Control>
                                    </Form.Group>
                                  </div>
                                </Col>
                                {values.tcs == "true" && (
                                  <Col md="2">
                                    <Form.Group>
                                      <Form.Label>
                                        TCS Applicable Date
                                      </Form.Label>

                                      <MyDatePicker
                                        name="tcs_applicable_date"
                                        placeholderText="DD/MM/YYYY"
                                        id="tcs_applicable_date"
                                        dateFormat="dd/MM/yyyy"
                                        onChange={(date) => {
                                          setFieldValue(
                                            "tcs_applicable_date",
                                            date
                                          );
                                        }}
                                        selected={values.tcs_applicable_date}
                                        minDate={new Date()}
                                        className="date-style"
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.tcs_applicable_date}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                )}
                              </Row>

                              <Row className="mt-4 row-inside">
                                <Col md="1">
                                  <Form.Group className="createnew">
                                    <Form.Label>Credit Days </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Credit Days"
                                      name="credit_days"
                                      onChange={handleChange}
                                      value={values.credit_days}
                                      isValid={
                                        touched.credit_days &&
                                        !errors.credit_days
                                      }
                                      isInvalid={!!errors.credit_days}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.credit_days}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>

                                <Col md="2">
                                  <div>
                                    <Form.Group>
                                      <Form.Label>
                                        Applicable From
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>{" "}
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "applicable_from",
                                            e.target.value
                                          );
                                        }}
                                        name="applicable_from"
                                        value={values.applicable_from}
                                      >
                                        <option value="billDate">
                                          Bill Date
                                        </option>
                                        <option value="deliveryDate">
                                          Delivery Date
                                        </option>
                                      </Form.Control>
                                    </Form.Group>
                                  </div>
                                </Col>
                                <Col md="1">
                                  <Form.Group className="createnew">
                                    <Form.Label>FSSAI No. </Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="FSSAI No."
                                      name="fssai"
                                      onChange={handleChange}
                                      value={values.fssai}
                                      isValid={touched.fssai && !errors.fssai}
                                      isInvalid={!!errors.fssai}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.fssai}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                          </Row>

                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-5">
                              <h6 className="title-style">Tax Details</h6>
                              <Row className="row-inside">
                                <Col md="1">
                                  <div>
                                    {/* <h6>Taxation Details</h6> */}
                                    <Form.Group>
                                      <Form.Label>
                                        Tax Available{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>{" "}
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "isTaxation",
                                            e.target.value
                                          );
                                        }}
                                        name="isTaxation"
                                        value={values.isTaxation}
                                      >
                                        <option value="false">No</option>
                                        <option value="true"> Yes</option>
                                      </Form.Control>
                                    </Form.Group>
                                  </div>
                                </Col>

                                {values.isTaxation == "true" ? (
                                  <Col md="2">
                                    <Form.Group className="createnew">
                                      <Form.Label>Registration Type</Form.Label>
                                      <Select
                                        className="selectTo"
                                        onChange={(v) => {
                                          setFieldValue("registraion_type", v);
                                        }}
                                        name="registraion_type"
                                        styles={customStyles}
                                        options={GSTTypeOpt}
                                        value={values.registraion_type}
                                        invalid={
                                          errors.registraion_type ? true : false
                                        }
                                      />
                                    </Form.Group>
                                  </Col>
                                ) : (
                                  <Col md="2">
                                    <Form.Group>
                                      <Form.Label>Pan Card No.</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Pan Card No."
                                        name="pan_no"
                                        onChange={handleChange}
                                        value={values.pan_no}
                                        isValid={
                                          touched.pan_no && !errors.pan_no
                                        }
                                        isInvalid={!!errors.pan_no}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.pan_no}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                )}
                              </Row>
                              {values.isTaxation == "true" && (
                                <>
                                  <Row className="mt-4 row-inside">
                                    <Col md="3">
                                      <Form.Group>
                                        <Form.Label>GSTIN</Form.Label>
                                        <Form.Control
                                          type="text"
                                          placeholder="GSTIN"
                                          name="gstin"
                                          onChange={handleChange}
                                          value={values.gstin}
                                          isValid={
                                            touched.gstin && !errors.gstin
                                          }
                                          isInvalid={!!errors.gstin}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.gstin}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                    <Col md="2">
                                      <Form.Group>
                                        <Form.Label>
                                          Registration Date
                                        </Form.Label>

                                        <MyDatePicker
                                          name="dateofregistartion"
                                          placeholderText="DD/MM/YYYY"
                                          id="dateofregistartion"
                                          dateFormat="dd/MM/yyyy"
                                          onChange={(date) => {
                                            setFieldValue(
                                              "dateofregistartion",
                                              date
                                            );
                                          }}
                                          selected={values.dateofregistartion}
                                          minDate={new Date()}
                                          className="date-style"
                                        />
                                        <span className="text-danger errormsg">
                                          {errors.dateofregistartion}
                                        </span>
                                      </Form.Group>
                                    </Col>
                                    <Col md="2">
                                      <Form.Group>
                                        <Form.Label>Pan Card No.</Form.Label>
                                        <Form.Control
                                          type="text"
                                          placeholder="Pan Card No."
                                          name="pan_no"
                                          onChange={handleChange}
                                          value={values.pan_no}
                                          isValid={
                                            touched.pan_no && !errors.pan_no
                                          }
                                          isInvalid={!!errors.pan_no}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.pan_no}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                    <Col md="5">
                                      <ButtonGroup
                                        className="pull-right pt-4"
                                        aria-label="Basic example"
                                      >
                                        <Button
                                          className="createbtn mr-2"
                                          onClick={(e) => {
                                            e.preventDefault();

                                            if (values.gstin != "") {
                                              let gstObj = {
                                                id: 0,
                                                gstin: values.gstin,
                                                dateofregistartion:
                                                  values.dateofregistartion,
                                                pan_no: values.pan_no,
                                              };
                                              this.addGSTRow(
                                                gstObj,
                                                setFieldValue
                                              );
                                            } else {
                                              ShowNotification(
                                                "Error",
                                                "Please submit all data"
                                              );
                                            }
                                          }}
                                        >
                                          ADD ROW
                                        </Button>
                                      </ButtonGroup>
                                    </Col>
                                  </Row>
                                  <Row className="mt-4 row-inside">
                                    <Col md="8">
                                      {gstList.length > 0 && (
                                        <div className="table_wrapper">
                                          <Table
                                            // bordered
                                            hover
                                            size="sm"
                                            className=""
                                            //responsive
                                            style={{ fontSize: "13px" }}
                                          >
                                            <thead>
                                              <tr>
                                                <th>#.</th>
                                                <th>GST No.</th>
                                                <th>Registraton Date</th>
                                                <th>PAN No.</th>
                                                <th className="btn_align right_col">
                                                  -
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {gstList.map((v, i) => {
                                                return (
                                                  <tr>
                                                    <td>{i + 1}</td>
                                                    <td>{v.gstin}</td>
                                                    <td>
                                                      {moment(
                                                        v.dateofregistartion
                                                      ).format("DD-MM-YYYY")}
                                                    </td>
                                                    <td>{v.pan_no}</td>
                                                    <td>
                                                      <Button
                                                        className="mainbtnminus"
                                                        variant=""
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          this.removeGstRow(
                                                            v,
                                                            i
                                                          );
                                                        }}
                                                      >
                                                        {" "}
                                                        <i class="fa fa-edit"></i>
                                                      </Button>
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </Table>
                                        </div>
                                      )}
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </Col>
                          </Row>

                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-5">
                              <h6 className="title-style">Shipping Details</h6>
                              <Row className="row-inside">
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>District</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="District"
                                      name="district"
                                      onChange={handleChange}
                                      value={values.district}
                                      isValid={
                                        touched.district && !errors.district
                                      }
                                      isInvalid={!!errors.district}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.district}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="6">
                                  <Form.Group>
                                    <Form.Label>Shipping Address</Form.Label>
                                    <Form.Control
                                      type="textarea"
                                      placeholder="Shipping Address"
                                      name="shipping_address"
                                      onChange={handleChange}
                                      value={values.shipping_address}
                                      isValid={
                                        touched.shipping_address &&
                                        !errors.shipping_address
                                      }
                                      isInvalid={!!errors.shipping_address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.shipping_address}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="4">
                                  <ButtonGroup
                                    className="pull-right pt-4"
                                    aria-label="Basic example"
                                  >
                                    <Button
                                      className="createbtn"
                                      variant="secondary"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.district != "" &&
                                          values.shipping_address != ""
                                        ) {
                                          let shipObj = {
                                            id: 0,
                                            district: values.district,
                                            shipping_address:
                                              values.shipping_address,
                                          };
                                          this.addShippingRow(
                                            shipObj,
                                            setFieldValue
                                          );
                                        } else {
                                          ShowNotification(
                                            "Error",
                                            "Please submit all data"
                                          );
                                        }
                                      }}
                                    >
                                      ADD ROW
                                    </Button>
                                  </ButtonGroup>
                                </Col>
                              </Row>
                              <Row className="mt-4 row-inside">
                                <Col md="8">
                                  {shippingList.length > 0 && (
                                    <div className="table_wrapper">
                                      <Table
                                        // bordered
                                        hover
                                        size="sm"
                                        style={{ fontSize: "13px" }}
                                        //responsive
                                      >
                                        <thead>
                                          <tr>
                                            <th>#.</th>
                                            <th>District</th>
                                            <th>Shipping Address</th>
                                            <th className="btn_align right_col">
                                              -
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {shippingList.map((v, i) => {
                                            return (
                                              <tr>
                                                <td>{i + 1}</td>
                                                <td>{v.district}</td>
                                                <td>{v.shipping_address}</td>
                                                <td>
                                                  <Button
                                                    className="mainbtnminus"
                                                    variant=""
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeShippingRow(
                                                        v,
                                                        i
                                                      );
                                                    }}
                                                  >
                                                    {" "}
                                                    <i class="fa fa-edit"></i>
                                                  </Button>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          </Row>

                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-5">
                              <h6 className="title-style">Billing Details</h6>
                              <Row className="row-inside">
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>District</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="District"
                                      name="b_district"
                                      onChange={handleChange}
                                      value={values.b_district}
                                      isValid={
                                        touched.b_district && !errors.b_district
                                      }
                                      isInvalid={!!errors.b_district}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.b_district}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="6">
                                  <Form.Group>
                                    <Form.Label>Billing Address</Form.Label>
                                    <Form.Control
                                      type="textarea"
                                      placeholder="Billing Address"
                                      name="billing_address"
                                      onChange={handleChange}
                                      value={values.billing_address}
                                      isValid={
                                        touched.billing_address &&
                                        !errors.billing_address
                                      }
                                      isInvalid={!!errors.billing_address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.billing_address}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="4">
                                  <ButtonGroup
                                    className="pull-right pt-4"
                                    aria-label="Basic example"
                                  >
                                    <Button
                                      className="createbtn"
                                      variant="secondary"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.b_district != "" &&
                                          values.billing_address != ""
                                        ) {
                                          let billAddObj = {
                                            id: 0,
                                            b_district: values.b_district,
                                            billing_address:
                                              values.billing_address,
                                          };
                                          this.addBillingRow(
                                            billAddObj,
                                            setFieldValue
                                          );
                                        } else {
                                          ShowNotification(
                                            "Error",
                                            "Please submit all data"
                                          );
                                        }
                                      }}
                                    >
                                      ADD ROW
                                    </Button>
                                  </ButtonGroup>
                                </Col>
                              </Row>

                              <Row className="row-inside mt-4 ">
                                <Col md="8">
                                  {billingList.length > 0 && (
                                    <div className="table_wrapper">
                                      <Table
                                        // bordered
                                        hover
                                        size="sm"
                                        style={{ fontSize: "13px" }}
                                        //responsive
                                      >
                                        <thead>
                                          <tr>
                                            <th>#.</th>
                                            <th>District</th>
                                            <th>Billing Address</th>
                                            <th className="btn_align right_col">
                                              -
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {billingList.map((v, i) => {
                                            return (
                                              <tr>
                                                <td>{i + 1}</td>
                                                <td>{v.b_district}</td>
                                                <td>{v.billing_address}</td>
                                                <td>
                                                  <Button
                                                    className="mainbtnminus"
                                                    variant=""
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeBillingRow(
                                                        v,
                                                        i
                                                      );
                                                    }}
                                                  >
                                                    <i class="fa fa-edit"></i>
                                                  </Button>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          </Row>

                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-5">
                              <h6 className="title-style">
                                Department Details
                              </h6>
                              <Row className="row-inside">
                                <Col md="3">
                                  <Form.Group>
                                    <Form.Label>Department Name</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Department Name"
                                      name="dept"
                                      onChange={handleChange}
                                      value={values.dept}
                                      isValid={touched.dept && !errors.dept}
                                      isInvalid={!!errors.dept}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.dept}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="3">
                                  <Form.Group>
                                    <Form.Label>Contact Person</Form.Label>
                                    <Form.Control
                                      type="textarea"
                                      placeholder="Contact Person"
                                      name="contact_person"
                                      onChange={handleChange}
                                      value={values.contact_person}
                                      isValid={
                                        touched.contact_person &&
                                        !errors.contact_person
                                      }
                                      isInvalid={!!errors.contact_person}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.contact_person}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>Contact No.</Form.Label>
                                    <Form.Control
                                      type="textarea"
                                      placeholder="Contact No."
                                      name="contact_no"
                                      onChange={handleChange}
                                      value={values.contact_no}
                                      isValid={
                                        touched.contact_no && !errors.contact_no
                                      }
                                      isInvalid={!!errors.contact_no}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.contact_no}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                      type="textarea"
                                      placeholder="Email"
                                      name="email"
                                      onChange={handleChange}
                                      value={values.email}
                                      isValid={touched.email && !errors.email}
                                      isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.email}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <ButtonGroup
                                    className="pull-right pt-4"
                                    aria-label="Basic example"
                                  >
                                    <Button
                                      className="createbtn"
                                      variant="secondary"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.dept != "" &&
                                          values.contact_no != "" &&
                                          values.contact_person != ""
                                        ) {
                                          let deptObj = {
                                            id: 0,
                                            dept:
                                              values.dept != null
                                                ? values.dept
                                                : "",
                                            contact_no:
                                              values.contact_no != null
                                                ? values.contact_no
                                                : "",
                                            contact_person:
                                              values.contact_person != null
                                                ? values.contact_person
                                                : "",
                                            email:
                                              values.email != null
                                                ? values.email
                                                : "",
                                          };
                                          this.addDeptRow(
                                            deptObj,
                                            setFieldValue
                                          );
                                        } else {
                                          ShowNotification(
                                            "Error",
                                            "Please submit all data"
                                          );
                                        }
                                      }}
                                    >
                                      ADD ROW
                                    </Button>
                                  </ButtonGroup>
                                </Col>
                              </Row>

                              <Row className="mt-4 row-inside">
                                <Col md="8">
                                  {deptList.length > 0 && (
                                    <div className="table_wrapper">
                                      <Table
                                        // bordered
                                        hover
                                        size="sm"
                                        style={{ fontSize: "13px" }}
                                        //responsive
                                      >
                                        <thead>
                                          <tr>
                                            <th>#.</th>
                                            <th>Dept. Name</th>
                                            <th>Contact Person</th>
                                            <th>Contact No.</th>
                                            <th>Email</th>
                                            <th className="btn_align right_col">
                                              -
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {deptList.map((v, i) => {
                                            return (
                                              <tr>
                                                <td>{i + 1}</td>
                                                <td>{v.dept}</td>
                                                <td>{v.contact_person}</td>
                                                <td>{v.contact_no}</td>
                                                <td>{v.email}</td>
                                                <td>
                                                  <Button
                                                    className="mainbtnminus"
                                                    variant=""
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeDeptRow(v, i);
                                                    }}
                                                  >
                                                    {" "}
                                                    <i class="fa fa-edit"></i>
                                                  </Button>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          </Row>

                          <Row className="mt-4" style={{ float: "right" }}>
                            <Col md="12" className="mb-3">
                              <ButtonGroup
                                className="pull-right pt-4"
                                aria-label="Basic example"
                              >
                                <Button className="submit-btn" type="submit">
                                  Submit
                                </Button>
                                <Button
                                  variant="secondary"
                                  className="cancel-btn"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.electron.ipcRenderer.webPageChange({
                                      from: "ledgercreate",
                                      to: "ledgerlist",
                                      isNewTab: false,
                                    });
                                  }}
                                >
                                  Cancel
                                </Button>
                              </ButtonGroup>
                            </Col>
                          </Row>
                        </div>
                        {/* sundry debetor form end  */}
                      </>
                    )}

                  {/* Bank account start  **/}
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "bank_account" && (
                      <div className="bankaccount form-style">
                        <Row className="mt-5 row-border">
                          <Col md="12" className="mb-4">
                            <h6 className="title-style">BANK ACCOUNT</h6>

                            {/* A */}

                            <Row className="row-inside">
                              <Col
                                md="2"
                                // className="ml-2 pl-2 pr-3"
                                //style={{ width: "18%" }}
                              >
                                <Form.Group className="">
                                  <Form.Label>
                                    Opening Balance1{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <InputGroup className="jointdropdown">
                                    <FormControl
                                      autoFous="true"
                                      placeholder=""
                                      aria-label="Opening Balance"
                                      aria-describedby="basic-addon2"
                                      name="opening_balance"
                                      onChange={handleChange}
                                      value={values.opening_balance}
                                      isValid={
                                        touched.opening_balance &&
                                        !errors.opening_balance
                                      }
                                      isInvalid={!!errors.opening_balance}
                                    />

                                    {/* <DropdownButton
                                      as={InputGroup.Append}
                                      variant="outline-secondary"
                                      title="Dr"
                                      id="input-group-dropdown-2"
                                    >
                                      <Dropdown.Item href="#">Dr</Dropdown.Item>
                                      <Dropdown.Item href="#">Cr</Dropdown.Item>
                                    </DropdownButton> */}
                                    <div className="" style={{ width: "25%" }}>
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          // console.log("e", e.target.value);
                                          setFieldValue(
                                            "opening_balance_type",
                                            e.target.value
                                          );
                                        }}
                                        name="opening_balance_type"
                                        value={values.opening_balance_type}
                                      >
                                        <option value="dr">Dr</option>
                                        <option value="cr">Cr</option>
                                      </Form.Control>
                                    </div>
                                    <Form.Control.Feedback type="invalid">
                                      {errors.opening_balance_type}
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row className="mt-5 row-border">
                          <Col md="12" className="mb-4">
                            <h6 className="title-style">Mailing Details</h6>
                            <Row className="row-inside">
                              <Col md="6">
                                <Form.Group className="createnew">
                                  <Form.Label>Address </Form.Label>
                                  <Form.Control
                                    autoFocus="true"
                                    type="text"
                                    placeholder="Address"
                                    name="address"
                                    onChange={handleChange}
                                    value={values.address}
                                    isValid={touched.address && !errors.address}
                                    isInvalid={!!errors.address}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.address}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md="2">
                                <Form.Group className="createnew">
                                  <Form.Label>
                                    State{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <Select
                                    className="selectTo"
                                    onChange={(v) => {
                                      setFieldValue("stateId", v);
                                    }}
                                    name="stateId"
                                    styles={customStyles}
                                    options={stateOpt}
                                    value={values.stateId}
                                    invalid={errors.stateId ? true : false}
                                    //styles={customStyles}
                                  />
                                  <span className="text-danger">
                                    {errors.stateId}
                                  </span>
                                </Form.Group>
                              </Col>
                              <Col md="2">
                                <Form.Group className="createnew">
                                  <Form.Label>
                                    Country{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <Select
                                    className="selectTo"
                                    onChange={(v) => {
                                      setFieldValue("countryId", v);
                                    }}
                                    name="countryId"
                                    styles={customStyles}
                                    options={countryOpt}
                                    value={values.countryId}
                                    invalid={errors.countryId ? true : false}
                                    //styles={customStyles}
                                  />
                                  <span className="text-danger">
                                    {errors.countryId}
                                  </span>
                                </Form.Group>
                              </Col>
                              <Col md="2">
                                <Form.Group className="createnew">
                                  <Form.Label>Pincode </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Pincode"
                                    name="pincode"
                                    onChange={handleChange}
                                    value={values.pincode}
                                    isValid={touched.pincode && !errors.pincode}
                                    isInvalid={!!errors.pincode}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.pincode}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row className="mt-3 row-inside">
                              <Col md="3">
                                <Form.Group className="createnew">
                                  <Form.Label>Email ID</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Email ID"
                                    name="email_id"
                                    onChange={handleChange}
                                    value={values.email_id}
                                    isValid={
                                      touched.email_id && !errors.email_id
                                    }
                                    isInvalid={!!errors.email_id}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.email_id}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md="3">
                                <Form.Group className="createnew">
                                  <Form.Label>Phone No. </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Phone No."
                                    name="phone_no"
                                    onChange={handleChange}
                                    value={values.phone_no}
                                    isValid={
                                      touched.phone_no && !errors.phone_no
                                    }
                                    isInvalid={!!errors.phone_no}
                                    maxLength={10}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.phone_no}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-5 row-border">
                          <Col md="12" className="mb-4">
                            <h6 className="title-style">Taxation Details</h6>
                            <Row className="row-inside">
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label>
                                    Taxation Detail Available{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>{" "}
                                  <Form.Control
                                    autoFocus="true"
                                    as="select"
                                    onChange={(e) => {
                                      // console.log("e", e.target.value);
                                      setFieldValue(
                                        "isTaxation",
                                        e.target.value
                                      );
                                    }}
                                    name="isTaxation"
                                    value={values.isTaxation}
                                  >
                                    <option value="false">No</option>
                                    <option value="true"> Yes</option>
                                  </Form.Control>
                                </Form.Group>
                              </Col>

                              {values.isTaxation == "true" && (
                                <>
                                  <Col md="2">
                                    <Form.Group>
                                      <Form.Label>GSTIN</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="GSTIN"
                                        name="gstin"
                                        onChange={handleChange}
                                        value={values.gstin}
                                        isValid={touched.gstin && !errors.gstin}
                                        isInvalid={!!errors.gstin}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.gstin}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  {/* <Col md="6">
                                            <Form.Group >
                                              <Form.Label>
                                                Date of Registration
                                              </Form.Label>
                                              <Form.Control
                                                type="date"
                                                placeholder="Date of Registration"
                                                name="dateofregistartion"
                                                onChange={handleChange}
                                                value={values.dateofregistartion}
                                                isValid={
                                                  touched.dateofregistartion &&
                                                  !errors.dateofregistartion
                                                }
                                                isInvalid={
                                                  !!errors.dateofregistartion
                                                }
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.dateofregistartion}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col>
                                          <Col md="6">
                                            <Form.Group >
                                              <Form.Label>
                                                Registration Type
                                              </Form.Label>
                                              <Select
                                                className="selectTo"
                                                onChange={(v) => {
                                                  setFieldValue(
                                                    "registraion_type",
                                                    v
                                                  );
                                                }}
                                                name="registraion_type"
                                                styles={customStyles}
                                                options={GSTTypeOpt}
                                                value={values.registraion_type}
                                                invalid={
                                                  errors.registraion_type
                                                    ? true
                                                    : false
                                                }
                                                //styles={customStyles}
                                              />
                                            </Form.Group>
                                          </Col>
                                          <Col md="6">
                                            <Form.Group >
                                              <Form.Label>Pan Card No.</Form.Label>
                                              <Form.Control
                                                type="text"
                                                placeholder="Pan Card No."
                                                name="pan_no"
                                                onChange={handleChange}
                                                value={values.pan_no}
                                                isValid={
                                                  touched.pan_no && !errors.pan_no
                                                }
                                                isInvalid={!!errors.pan_no}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.pan_no}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col> */}

                                  {/* <hr style={{ margin: "0px", paddingBottom: "7px" }} /> */}
                                </>
                              )}
                            </Row>
                          </Col>
                        </Row>

                        <Row className="mt-5 row-border">
                          <Col md="12" className="mb-4">
                            <h6 className="title-style">Bank Details</h6>
                            <Row className="row-inside">
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label>Bank Name </Form.Label>
                                  <Form.Control
                                    // autoFocus="true"
                                    type="text"
                                    placeholder="Bank Name"
                                    name="bank_name"
                                    onChange={handleChange}
                                    value={values.bank_name}
                                    isValid={
                                      touched.bank_name && !errors.bank_name
                                    }
                                    isInvalid={!!errors.bank_name}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.bank_name}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label>Account Number </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Account Number"
                                    name="bank_account_no"
                                    onChange={handleChange}
                                    value={values.bank_account_no}
                                    isValid={
                                      touched.bank_account_no &&
                                      !errors.bank_account_no
                                    }
                                    isInvalid={!!errors.bank_account_no}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.bank_account_no}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label>IFSC Code </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="IFSC Code"
                                    name="bank_ifsc_code"
                                    onChange={handleChange}
                                    value={values.bank_ifsc_code}
                                    isValid={
                                      touched.bank_ifsc_code &&
                                      !errors.bank_ifsc_code
                                    }
                                    isInvalid={!!errors.bank_ifsc_code}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.bank_ifsc_code}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md="4">
                                <Form.Group>
                                  <Form.Label>Branch </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Branch"
                                    name="bank_branch"
                                    onChange={handleChange}
                                    value={values.bank_branch}
                                    isValid={
                                      touched.bank_branch && !errors.bank_branch
                                    }
                                    isInvalid={!!errors.bank_branch}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.bank_branch}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12">
                            <ButtonGroup
                              className="pull-right pt-4"
                              aria-label="Basic example"
                            >
                              <Button className="submit-btn" type="submit">
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.electron.ipcRenderer.webPageChange({
                                    from: "ledgercreate",
                                    to: "ledgerlist",
                                    isNewTab: false,
                                  });
                                }}
                              >
                                Cancel
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </div>
                    )}
                  {/* Bank account end */}

                  {/* duties and taxes start  **/}
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "duties_taxes" && (
                      <>
                        <Row
                          className="mt-5 row-border"
                          style={{ margin: "12px" }}
                        >
                          <Col md="12" className="mb-4">
                            <h6 className="title-style">DUTIES & TAXES</h6>
                            <Row className="row-inside">
                              <Col md="2">
                                <Form.Group className="createnew">
                                  <Form.Label>
                                    Tax Type{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  {/* <Form.Control
                                  as="select"
                                  onChange={(e) => {
                                    // console.log("e", e.target.value);
                                    setFieldValue("isTaxation", e.target.value);
                                  }}
                                  name="isTaxation"
                                >
                                  <option value>Central Tax</option>
                                  <option>State Tax</option>
                                  <option>Integrated Tax</option>
                                </Form.Control> */}
                                  <Select
                                    autoFocus="true"
                                    className="selectTo"
                                    onChange={(v) => {
                                      setFieldValue("tax_type", v);
                                    }}
                                    name="tax_type"
                                    styles={customStyles}
                                    options={taxOpt}
                                    value={values.tax_type}
                                    invalid={errors.tax_type ? true : false}
                                    //styles={customStyles}
                                  />
                                  <span className="text-danger">
                                    {errors.tax_type}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row style={{ margin: "8px" }}>
                          <Col md="12">
                            <ButtonGroup
                              className="pull-right pt-4"
                              aria-label="Basic example"
                            >
                              <Button className="submit-btn" type="submit">
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.electron.ipcRenderer.webPageChange({
                                    from: "ledgercreate",
                                    to: "ledgerlist",
                                    isNewTab: false,
                                  });
                                }}
                              >
                                Cancel
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </>
                    )}
                  {/* duties and taxes end  */}

                  {/* Other start ***/}
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "others" && (
                      <div className="duties">
                        {/* <hr
                            style={{ marginTop: '5px', marginBottom: '5px' }}
                          /> */}
                        {/* <h6>OTHER</h6> */}
                        {/* <h6>
                            {values.underId &&
                              values.underId.label.toUpperCase()}
                          </h6> */}

                        {/* <div className="mt-2">
                            <h6>Mailing Details</h6>
                          </div> */}
                        <Row style={{ margin: "4px" }}>
                          {/* <Col md="6">
                              <Form.Group className="createnew">
                                <Form.Label>Address </Form.Label>
                                <Form.Control
                                  autoFocus="true"
                                  type="text"
                                  placeholder="Address"
                                  name="address"
                                  onChange={handleChange}
                                  value={values.address}
                                  isValid={touched.address && !errors.address}
                                  isInvalid={!!errors.address}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.address}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col> */}
                          {/* <Col md="3">
                              <Form.Group className="createnew">
                                <Form.Label>State</Form.Label>
                                <Select
                                  className="selectTo"
                                  onChange={(v) => {
                                    setFieldValue('stateId', v);
                                  }}
                                  name="stateId"
                                  styles={customStyles}
                                  options={stateOpt}
                                  value={values.stateId}
                                  invalid={errors.stateId ? true : false}
                                  //styles={customStyles}
                                />
                                <span className="text-danger">
                                  {errors.stateId}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md="3">
                              <Form.Group className="createnew">
                                <Form.Label>Country</Form.Label>
                                <Select
                                  className="selectTo"
                                  onChange={(v) => {
                                    setFieldValue('countryId', v);
                                  }}
                                  name="countryId"
                                  styles={customStyles}
                                  options={countryOpt}
                                  value={values.countryId}
                                  invalid={errors.countryId ? true : false}
                                  //styles={customStyles}
                                />
                                <span className="text-danger">
                                  {errors.countryId}
                                </span>
                              </Form.Group>
                            </Col> */}
                          {/* <Col md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Pincode</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Pincode"
                                  name="pincode"
                                  onChange={handleChange}
                                  value={values.pincode}
                                  isValid={touched.pincode && !errors.pincode}
                                  isInvalid={!!errors.pincode}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.pincode}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col> */}
                          {/* <Col md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Email ID</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Email ID"
                                  name="email_id"
                                  onChange={handleChange}
                                  value={values.email_id}
                                  isValid={touched.email_id && !errors.email_id}
                                  isInvalid={!!errors.email_id}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.email_id}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col> */}
                          {/* <Col md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Phone No.</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Phone No."
                                  name="phone_no"
                                  onChange={handleChange}
                                  value={values.phone_no}
                                  isValid={touched.phone_no && !errors.phone_no}
                                  isInvalid={!!errors.phone_no}
                                  maxLength={10}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.phone_no}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col> */}
                          <Col md="12">
                            <ButtonGroup
                              className="pull-right pt-4"
                              aria-label="Basic example"
                            >
                              <Button className="submit-btn" type="submit">
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.electron.ipcRenderer.webPageChange({
                                    from: "ledgercreate",
                                    to: "ledgerlist",
                                    isNewTab: false,
                                  });
                                }}
                              >
                                Cancel
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </div>
                    )}
                  {/* Other end */}

                  {/* Assets start  **/}
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "assets" && (
                      <>
                        <Row
                          className="mt-5 row-border"
                          style={{ margin: "12px" }}
                        >
                          <Col md="12" className="mb-4">
                            {/* <h6
                            className="title-style"
                            style={{ marginTop: '5px', marginBottom: '5px' }}
                          /> */}
                            {/* <h6>Assets</h6> */}
                            <h6 className="title-style">
                              {values.underId &&
                                values.underId.label.toUpperCase()}
                            </h6>
                            <Row className="row-inside">
                              <Col
                                md="2"
                                // md="2"
                                //  className="ml-2 pl-2 pr-3"
                                //style={{ width: "18%" }}
                              >
                                <Form.Group className="">
                                  <Form.Label>Opening Balance</Form.Label>
                                  <InputGroup className="jointdropdown">
                                    <FormControl
                                      placeholder=""
                                      aria-label="Opening Balance"
                                      aria-describedby="basic-addon2"
                                      name="opening_balance"
                                      onChange={handleChange}
                                      value={values.opening_balance}
                                      isValid={
                                        touched.opening_balance &&
                                        !errors.opening_balance
                                      }
                                      isInvalid={!!errors.opening_balance}
                                    />

                                    {/* <DropdownButton
                                      as={InputGroup.Append}
                                      variant="outline-secondary"
                                      title="Dr"
                                      id="input-group-dropdown-2"
                                    >
                                      <Dropdown.Item href="#">Dr</Dropdown.Item>
                                      <Dropdown.Item href="#">Cr</Dropdown.Item>
                                    </DropdownButton> */}
                                    <div style={{ width: "25%" }}>
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          // console.log("e", e.target.value);
                                          setFieldValue(
                                            "opening_balance_type",
                                            e.target.value
                                          );
                                        }}
                                        name="opening_balance_type"
                                        value={values.opening_balance_type}
                                      >
                                        <option value="dr">Dr</option>
                                        <option value="cr">Cr</option>
                                      </Form.Control>
                                    </div>
                                    <Form.Control.Feedback type="invalid">
                                      {errors.opening_balance_type}
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row style={{ margin: "10px" }}>
                          <Col md="12">
                            <ButtonGroup
                              className="pull-right pt-4"
                              aria-label="Basic example"
                            >
                              <Button className="submit-btn" type="submit">
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn"
                                onClick={(e) => {
                                  e.preventDefault();

                                  eventBus.dispatch("page_change", {
                                    from: "ledgeredit",
                                    to: "ledgerlist",
                                    isNewTab: false,
                                  });
                                }}
                              >
                                Cancel
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </>
                    )}
                  {/* Assets end  */}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}
