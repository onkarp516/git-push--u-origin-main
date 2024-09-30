import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  ButtonGroup,
  FormControl,
  CloseButton,
  Modal,
  Table,
} from "react-bootstrap";
import { Formik } from "formik";
import Select from "react-select";
import cancel from "@/assets/images/3x/cancel.png";
import * as Yup from "yup";

import {
  authenticationService,
  getUnderList,
  getBalancingMethods,
  createSundryCreditors,
  createSundryDebtors,
  create,
  createDutiesTaxes,
  createAssets,
  createOthers,
  getIndianState,
  getIndiaCountry,
  createLedger,
  getGSTTypes,
  createAssociateGroup,
  updateAssociateGroup,
  getBranchesByInstitute,
} from "@/services/api_functions";
import moment from "moment";
import {
  ShowNotification,
  getRandomIntInclusive,
  AuthenticationCheck,
  customStyles,
  MyDatePicker,
  eventBus,
  customStylesForJoin,
  getSelectValue,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser as faSolidUser,
  faPlusSquare,
  faShoppingCart,
  faTrash,
  faCamera,
  faAngleDown,
  faSearch,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";

const taxOpt = [
  { value: "central_tax", label: "Central Tax" },
  { value: "state_tax", label: "State Tax" },
  { value: "integrated_tax", label: "Integrated Tax" },
];

const ledger_type_options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
  // more options...
];
const dr_options = [
  { label: "Dr", value: "dr" },
  { label: "Cr", value: "cr" },
  // more options...
];
const applicable_from_options = [
  { label: " Bill Date", value: "billDate" },
  { label: "Delivery Date", value: "deliveryDate" },
];
export default class LedgerCreate extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      principleList: [],
      opbranchList: [],
      undervalue: [],
      balancingOpt: [],
      stateOpt: [],
      countryOpt: [],
      GSTTypeOpt: [],
      gstList: [],
      deptList: [],
      shippingList: [],
      billingList: [],
      initValue: {
        associates_id: "",
        branchId: "",
        associates_group_name: "",
        underId: "",
        opening_balance: 0,
        is_private: "false",
      },
    };
  }
  handleClose = () => {
    this.setState({ show: false });
  };
  handleModal = (status) => {
    if (status == true) {
      let initValue = {
        associates_id: "",
        associates_group_name: "",
        underId: "",
        opening_balance: 0,
        is_private: "false",
      };
      this.setState({ initValue: initValue }, () => {
        this.setState({ show: status });
      });
    } else {
      this.setState({ show: status });
    }
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
              } else {
                let branchId = getSelectValue(
                  Opt,
                  authenticationService.currentUserValue.branchId
                );
                this.myRef.current.setFieldValue("branchId", branchId);
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
  lstUnders = () => {
    getUnderList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let Opt = d.map((v, i) => {
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
        this.setState({ undervalue: [] });
      });
  };
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
  lstBalancingMethods = () => {
    getBalancingMethods()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.response.map((v, i) => {
            return { value: v.balancing_id, label: v.balance_method };
          });

          const { initValue } = this.state;
          console.log({ initValue });
          let initObj = initValue;
          initObj["opening_balancing_method"] = opt[0];
          console.log({ initObj });
          this.setState({ initValue: initObj, balancingOpt: opt });
        }
      })
      .catch((error) => {});
  };
  lstState = () => {
    getIndianState()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.map((v) => {
            return { label: v.stateName, value: v.id };
          });
          this.setState({ stateOpt: opt });
        }
      })
      .catch((error) => {});
  };
  lstCountry = () => {
    getIndiaCountry()
      .then((response) => {
        let opt = [];
        let res = { label: response.data.name, value: response.data.id };
        opt.push(res);
        this.setState({ countryOpt: opt });
      })
      .catch((error) => {});
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      let companyId = authenticationService.currentUserValue.companyId;
      this.getBranchData(companyId);

      this.lstUnders();
      this.lstBalancingMethods();
      this.lstState();
      this.lstCountry();
      this.listGSTTypes();
    }
  }
  setLedgerCode = () => {
    let supplier_code = getRandomIntInclusive(1, 1000);
    this.myRef.current.setFieldValue("supplier_code", supplier_code);
  };

  addGSTRow = (values, setFieldValue) => {
    let gstObj = {
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

  // handle click event of the Remove button
  removeGstRow = (index) => {
    const { gstList } = this.state;
    const list = [...gstList];
    list.splice(index, 1);
    this.setState({ gstList: list });
  };

  addShippingRow = (values, setFieldValue) => {
    let shipObj = {
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
  removeShippingRow = (index) => {
    const { shippingList } = this.state;
    const list = [...shippingList];
    list.splice(index, 1);
    this.setState({ shippingList: list });
  };

  addBillingRow = (values, setFieldValue) => {
    let billAddObj = {
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
  removeBillingRow = (index) => {
    const { billingList } = this.state;
    const list = [...billingList];
    list.splice(index, 1);
    this.setState({ billingList: list });
  };

  addDeptRow = (values, setFieldValue) => {
    let deptObj = {
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
  removeDeptRow = (index) => {
    const { deptList } = this.state;
    const list = [...deptList];
    list.splice(index, 1);
    this.setState({ deptList: list });
  };

  render() {
    const {
      show,
      opbranchList,
      undervalue,
      balancingOpt,
      stateOpt,
      countryOpt,
      GSTTypeOpt,
      initValue,
      gstList,
      deptList,
      shippingList,
      billingList,
    } = this.state;
    const validate = (values) => {
      const errors = {};

      if (!values.ledger_name) {
        errors.ledger_name = "Ledger name is required";
      }
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
      <div>
        {/* <h6>Purchase Invoice</h6> */}

        <div id="example-collapse-text" className="common-form-style m-2">
          <div className="main-div mb-2 m-0">
            <h4 className="form-header"> Ledger</h4>
            <Formik
              validateOnBlur={false}
              validateOnChange={false}
              innerRef={this.myRef}
              enableReinitialize={true}
              initialValues={initValue}
              validate={validate}
              onSubmit={(values, { resetForm }) => {
                const formData = new FormData();

                // if (values.branchId.value != null) {
                if ("branchId" in authenticationService.currentUserValue) {
                  formData.append(
                    "branchId",
                    authenticationService.currentUserValue.branchId
                  );
                }
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

                  let billingDetails = billingList.map((v, i) => {
                    return {
                      district: v.b_district,
                      billing_address: v.billing_address,
                    };
                  });

                  formData.append(
                    "billingDetails",
                    JSON.stringify(billingDetails)
                  );

                  formData.append(
                    "shippingDetails",
                    JSON.stringify(shippingList)
                  );

                  let deptDetails = [];
                  deptDetails = deptList.map((v, i) => {
                    let obj = {
                      dept: v.dept,
                      contact_person: v.contact_person,
                      contact_no: v.contact_no,
                    };

                    if (v.email != "") obj["email"] = v.email;

                    return obj;
                  });
                  formData.append("deptDetails", JSON.stringify(deptDetails));
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

                  let billingDetails = billingList.map((v, i) => {
                    return {
                      district: v.b_district,
                      billing_address: v.billing_address,
                    };
                  });

                  formData.append(
                    "billingDetails",
                    JSON.stringify(billingDetails)
                  );

                  formData.append(
                    "shippingDetails",
                    JSON.stringify(shippingList)
                  );

                  let deptDetails = [];
                  deptDetails = deptList.map((v, i) => {
                    let obj = {
                      dept: v.dept,
                      contact_person: v.contact_person,
                      contact_no: v.contact_no,
                    };

                    if (v.email != "") obj["email"] = v.email;

                    return obj;
                  });
                  formData.append("deptDetails", JSON.stringify(deptDetails));

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
                formData.append(
                  "is_private",
                  values.is_private ? values.is_private.value : false
                );

                for (let [name, value] of formData) {
                  console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                }
                createLedger(formData)
                  .then((response) => {
                    let res = response.data;
                    if (res.responseStatus == 200) {
                      ShowNotification("Success", res.message);
                      resetForm();
                      this.setLedgerCode();
                      eventBus.dispatch("page_change", "ledgerlist");
                    } else {
                      ShowNotification("Error", res.message);
                    }
                  })
                  .catch((error) => {});
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
                <Form onSubmit={handleSubmit} className="form-style">
                  {/* {JSON.stringify(values)} */}
                  <Row className="p-3">
                    <Col md="3">
                      <Form.Group className="createnew">
                        <Form.Label>Select Branch</Form.Label>
                        <Select
                          isClearable={true}
                          isDisabled={true}
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

                    <Col md="3" className="">
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
                        {/* <Form.Control.Feedback type="invalid"> */}
                        <span className="text-danger errormsg">
                          {errors.ledger_name}
                        </span>
                        {/* </Form.Control.Feedback> */}
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
                                setFieldValue("tds", "false");
                                setFieldValue("tcs", "false");
                                setFieldValue("applicable_from", "billDate");
                                setFieldValue("isTaxation", "false");
                              } else if (v.sub_principle_id == 1) {
                                setFieldValue("opening_balance_type", "dr");
                                setFieldValue("tds", "false");
                                setFieldValue("tcs", "false");
                                setFieldValue("applicable_from", "billDate");
                                setFieldValue("isTaxation", "false");
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
                        <p className="displaygroup p-0">
                          {values.underId
                            ? values.underId.sub_principle_id
                              ? values.underId.principle_name
                              : ""
                            : ""}
                        </p>
                        <span className="text-danger errormsg">
                          {errors.underId}
                        </span>
                      </Form.Group>
                    </Col>

                    <Col md="2">
                      <div>
                        <Form.Group>
                          <Form.Label>
                            Ledger Type{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>{" "}
                          <Select
                            isClearable={true}
                            styles={customStyles}
                            className="selectTo"
                            onChange={(v) => {
                              setFieldValue("is_private", v);
                            }}
                            options={ledger_type_options}
                            name="is_private"
                            value={values.is_private}
                          />
                          {/* <Form.Control
                            as="select"
                            onChange={(e) => {
                              setFieldValue("is_private", e.target.value);
                            }}
                            name="is_private"
                            value={values.is_private}
                            styles={customStyles}
                          >
                            <option value="true"> Yes</option>
                            <option value="false">No</option>
                          </Form.Control> */}
                        </Form.Group>
                      </div>
                    </Col>

                    {values.underId == "" ? (
                      <Col md="2" className="pt-4 mt-1">
                        <Button
                          variant="secondary"
                          className="submitbtn cancelbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "ledgerlist");
                          }}
                        >
                          Cancel
                          <img src={cancel} alt="" className="btsubmit "></img>
                        </Button>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                      "sundry_creditors" && (
                      <>
                        <div className=" form-style">
                          <Row className="mt-4 row-border">
                            <h6
                              className="title-style"
                              style={{
                                marginLeft: "20px",
                              }}
                            >
                              SUNDRY CREDITORS
                            </h6>
                            <Row className="mb-4 m-0">
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
                                  {/* <Form.Control.Feedback type="invalid"> */}
                                  <span className="text-danger errormsg">
                                    {errors.mailing_name}
                                  </span>
                                  {/* </Form.Control.Feedback> */}
                                </Form.Group>
                              </Col>
                              <Col
                                md="3"
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
                                    <Select
                                      isClearable={true}
                                      styles={customStylesForJoin}
                                      className="selectTo"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "opening_balance_type",
                                          e
                                        );
                                      }}
                                      options={dr_options}
                                      name="opening_balance_type"
                                      value={values.opening_balance_type}
                                    />
                                    {/* <div style={{ width: "25%" }}> */}
                                    {/* <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "opening_balance_type",
                                            e.target.value
                                          );
                                        }}
                                        name="opening_balance_type"
                                        id="opening_balance_type"
                                        value={values.opening_balance_type}
                                      >
                                        <option value="cr">Cr</option>
                                        <option value="dr">Dr</option>
                                      </Form.Control> */}
                                    {/* </div> */}
                                    {/* <Form.Control.Feedback type="invalid"> */}
                                    <span className="text-danger errormsg">
                                      {errors.opening_balance_type}
                                    </span>
                                    {/* </Form.Control.Feedback> */}
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
                              <Col md="3" className="">
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
                              <Row className=" m-0">
                                <Col lg="6" md="6">
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
                              <Row className="mt-3  m-0">
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
                                      <Select
                                        styles={customStyles}
                                        className="selectTo"
                                        onChange={(e) => {
                                          setFieldValue("tds", e);
                                        }}
                                        options={ledger_type_options}
                                        name="tds"
                                        value={values.tds}
                                      />
                                      {/* <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue("tds", e.target.value);
                                        }}
                                        name="tds"
                                        value={values.tds}
                                      >
                                        <option value="false">No</option>
                                        <option value="true"> Yes</option>
                                      </Form.Control> */}
                                    </Form.Group>
                                  </div>
                                </Col>
                                {values.tds.value == true && (
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
                                      <Select
                                        styles={customStyles}
                                        className="selectTo"
                                        onChange={(e) => {
                                          setFieldValue("tcs", e);
                                        }}
                                        options={ledger_type_options}
                                        name="tcs"
                                        value={values.tcs}
                                      />
                                      {/* <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue("tcs", e.target.value);
                                        }}
                                        name="tcs"
                                        value={values.tcs}
                                      >
                                        <option value="false">No</option>
                                        <option value="true"> Yes</option>
                                      </Form.Control> */}
                                    </Form.Group>
                                  </div>
                                </Col>
                                {values.tcs.value == true && (
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
                                <Col md="2">
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
                                      <Select
                                        isClearable={true}
                                        styles={customStyles}
                                        className="selectTo"
                                        onChange={(e) => {
                                          setFieldValue("applicable_from", e);
                                        }}
                                        options={applicable_from_options}
                                        name="applicable_from"
                                        value={values.applicable_from}
                                      />
                                      {/* <Form.Control
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
                                      </Form.Control> */}
                                    </Form.Group>
                                  </div>
                                </Col>
                                <Col md="2" className="mt-3">
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
                              <Row className=" m-0">
                                <Col md="2">
                                  <div>
                                    {/* <h6>Taxation Details</h6> */}
                                    <Form.Group>
                                      <Form.Label>
                                        Tax Available{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>{" "}
                                      <Select
                                        // isClearable={true}
                                        styles={customStyles}
                                        className="selectTo"
                                        onChange={(e) => {
                                          setFieldValue("isTaxation", e);
                                        }}
                                        options={ledger_type_options}
                                        name="isTaxation"
                                        value={values.isTaxation}
                                      />
                                      {/* <Form.Control
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
                                      </Form.Control> */}
                                    </Form.Group>
                                  </div>
                                </Col>

                                {values.isTaxation.value == true ? (
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
                              {values.isTaxation.value == true && (
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
                                      <ButtonGroup
                                        className="float-end pt-4"
                                        aria-label="Basic example"
                                      >
                                        {/* <Button
                                          className="create-btn"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            if (values.gstin != "") {
                                              let gstObj = {
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
                                        </Button> */}
                                        <FontAwesomeIcon
                                          icon={faPlusSquare}
                                          size={"2x"}
                                          title="Add Row"
                                          className="faIcon-style"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            if (values.gstin != "") {
                                              let gstObj = {
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
                                        />
                                      </ButtonGroup>
                                    </Col>
                                  </Row>
                                  <Row className="mt-3  m-0">
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
                                                <th>#.</th>
                                                <th>GST No.</th>
                                                <th>Registraton Date</th>
                                                <th>PAN No.</th>
                                                <th className="text-center">
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
                                                      {v.dateofregistartion !=
                                                      ""
                                                        ? moment(
                                                            v.dateofregistartion
                                                          ).format("DD-MM-YYYY")
                                                        : "NA"}
                                                    </td>
                                                    <td>{v.pan_no}</td>
                                                    <td>
                                                      <Button
                                                        className="mainbtnminus"
                                                        variant=""
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          this.removeGstRow(i);
                                                        }}
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={faPencil}
                                                        />
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

                              <Row className=" m-0">
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
                                    className="float-end pt-4"
                                    aria-label="Basic example"
                                  >
                                    {/* <Button
                                      className="create-btn"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.district != "" &&
                                          values.shipping_address != ""
                                        ) {
                                          let shipObj = {
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
                                    </Button> */}
                                    <FontAwesomeIcon
                                      icon={faPlusSquare}
                                      size={"2x"}
                                      title="Add Row"
                                      className="faIcon-style"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.district != "" &&
                                          values.shipping_address != ""
                                        ) {
                                          let shipObj = {
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
                                    />
                                  </ButtonGroup>
                                </Col>
                              </Row>

                              {shippingList.length > 0 && (
                                <Row className="mt-3  m-0">
                                  <Col md="8">
                                    <div className="table_wrapper">
                                      <Table
                                        // bordered
                                        hover
                                        size="sm"
                                        //responsive
                                        style={{ fontSize: "13px" }}
                                      >
                                        <thead>
                                          <tr>
                                            <th>#.</th>
                                            <th>District</th>
                                            <th>Shipping Address</th>
                                            <th className="text-center">-</th>
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
                                                      this.removeShippingRow(i);
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faTrash}
                                                    />
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
                              <Row className=" m-0">
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
                                    className="float-end pt-4"
                                    aria-label="Basic example"
                                  >
                                    {/* <Button
                                      className="create-btn"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.b_district != "" &&
                                          values.billing_address != ""
                                        ) {
                                          let billAddObj = {
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
                                    </Button> */}
                                    <FontAwesomeIcon
                                      icon={faPlusSquare}
                                      size={"2x"}
                                      title="Add Row"
                                      className="faIcon-style"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.b_district != "" &&
                                          values.billing_address != ""
                                        ) {
                                          let billAddObj = {
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
                                    />
                                  </ButtonGroup>
                                </Col>
                              </Row>

                              {billingList.length > 0 && (
                                <Row className="mt-3 m-0">
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
                                            <th>Billing Address</th>
                                            <th className="text-center">-</th>
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
                                                      this.removeBillingRow(i);
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faTrash}
                                                    />
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
                              <Row className=" m-0">
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
                                    className="float-end pt-4"
                                    aria-label="Basic example"
                                  >
                                    {/* <Button
                                      className="create-btn"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.dept != "" &&
                                          values.contact_no != "" &&
                                          values.contact_person != ""
                                        ) {
                                          let deptObj = {
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
                                    </Button> */}
                                    <FontAwesomeIcon
                                      icon={faPlusSquare}
                                      size={"2x"}
                                      title="Add Row"
                                      className="faIcon-style"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.dept != "" &&
                                          values.contact_no != "" &&
                                          values.contact_person != ""
                                        ) {
                                          let deptObj = {
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
                                    />
                                  </ButtonGroup>
                                </Col>
                              </Row>

                              {deptList.length > 0 && (
                                <Row className="mt-3 m-0">
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
                                            <th>Dept. Name</th>
                                            <th>Contact Person</th>
                                            <th>Contact No.</th>
                                            <th>Email</th>
                                            <th className="text-center">-</th>
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
                                                      this.removeDeptRow(i);
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faTrash}
                                                    />
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
                              <Row className=" m-0">
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
                                className="float-end pt-4"
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
                                    eventBus.dispatch(
                                      "page_change",
                                      "ledgerlist"
                                    );
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
                        <div className=" form-style">
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
                            <Row className="mb-4 m-0">
                              <Col lg="3" md="4">
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
                                lg={3}
                                md="3"
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

                                    <Select
                                      // isClearable={true}
                                      styles={customStylesForJoin}
                                      className="selectTo"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "opening_balance_type",
                                          e
                                        );
                                      }}
                                      options={dr_options}
                                      name="opening_balance_type"
                                      value={values.opening_balance_type}
                                    />
                                    {/* <div style={{ width: "25%" }}>
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
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
                                    </div> */}
                                    <Form.Control.Feedback type="invalid">
                                      {errors.opening_balance_type}
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                              {/* <div
                              style={{ width: '12%' }}
                              className="pl-3 ledgercol"
                            > */}
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
                              {/* </div> */}
                            </Row>
                          </Row>
                          <Row className="mt-5 row-border">
                            <Col md="12" className="mb-4">
                              {/* <div className="mt-2"> */}
                              <h6 className="title-style">Mailing Details</h6>
                              <Row className=" m-0">
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
                              <Row className="mt-4 m-0">
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
                                      <Select
                                        styles={customStyles}
                                        className="selectTo"
                                        onChange={(e) => {
                                          setFieldValue("tds", e);
                                        }}
                                        options={ledger_type_options}
                                        name="tds"
                                        value={values.tds}
                                      />
                                      {/* <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue("tds", e.target.value);
                                        }}
                                        name="tds"
                                        value={values.tds}
                                      >
                                        <option value="false">No</option>
                                        <option value="true"> Yes</option>
                                      </Form.Control> */}
                                    </Form.Group>
                                  </div>
                                </Col>
                                {values.tds.value == true && (
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
                                      <Select
                                        className="selectTo"
                                        onChange={(e) => {
                                          setFieldValue("tcs", e);
                                        }}
                                        options={ledger_type_options}
                                        name="countryId"
                                        styles={customStyles}
                                        value={values.tcs}
                                      />
                                      {/* <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                          setFieldValue("tcs", e.target.value);
                                        }}
                                        name="tcs"
                                        value={values.tcs}
                                      >
                                        <option value="false">No</option>
                                        <option value="true"> Yes</option>
                                      </Form.Control> */}
                                    </Form.Group>
                                  </div>
                                </Col>
                                {values.tcs.value == true && (
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
                                {/* </Row>

                              <Row className="mt-4 row-inside"> */}
                                <Col md="2">
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
                                      <Select
                                        className="selectTo"
                                        onChange={(e) => {
                                          setFieldValue("applicable_from", e);
                                        }}
                                        options={applicable_from_options}
                                        name="countryId"
                                        styles={customStyles}
                                        value={values.applicable_from}
                                      />
                                      {/* <Form.Control
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
                                      </Form.Control> */}
                                    </Form.Group>
                                  </div>
                                </Col>
                                <Col md="2" className="mt-3">
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
                              <h6 className="title-style">Tax Details</h6>
                              <Row className="m-0">
                                <Col md="2">
                                  <div>
                                    {/* <h6>Taxation Details</h6> */}
                                    <Form.Group>
                                      <Form.Label>
                                        Tax Available{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>{" "}
                                      <Select
                                        className="selectTo"
                                        onChange={(e) => {
                                          setFieldValue("isTaxation", e);
                                        }}
                                        options={ledger_type_options}
                                        name="countryId"
                                        styles={customStyles}
                                        value={values.isTaxation}
                                      />
                                      {/* <Form.Control
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
                                      </Form.Control> */}
                                    </Form.Group>
                                  </div>
                                </Col>

                                {values.isTaxation.value == true ? (
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
                              {values.isTaxation.value == true && (
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
                                          // minDate={new Date()}
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
                                        className="float-end pt-4"
                                        aria-label="Basic example"
                                      >
                                        {/* <Button
                                          className="create-btn mr-2"
                                          onClick={(e) => {
                                            e.preventDefault();

                                            if (values.gstin != "") {
                                              let gstObj = {
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
                                        </Button> */}
                                        <FontAwesomeIcon
                                          icon={faPlusSquare}
                                          size={"2x"}
                                          title="Add Row"
                                          className="faIcon-style"
                                          onClick={(e) => {
                                            e.preventDefault();

                                            if (values.gstin != "") {
                                              let gstObj = {
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
                                        />
                                      </ButtonGroup>
                                    </Col>
                                  </Row>
                                  <Row className="mt-4 m-0">
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
                                                <th className="text-center">
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
                                                      {v.dateofregistartion !=
                                                      ""
                                                        ? moment(
                                                            v.dateofregistartion
                                                          ).format("DD-MM-YYYY")
                                                        : "NA"}
                                                    </td>
                                                    <td>{v.pan_no}</td>
                                                    <td>
                                                      <Button
                                                        className="mainbtnminus"
                                                        variant=""
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          this.removeGstRow(i);
                                                        }}
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={faTrash}
                                                        />
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
                              <h6 className="title-style">Shipping Details</h6>
                              <Row className="m-0">
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
                                    className="float-end pt-4"
                                    aria-label="Basic example"
                                  >
                                    {/* <Button
                                      className="create-btn mr-2"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.district != "" &&
                                          values.shipping_address != ""
                                        ) {
                                          let shipObj = {
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
                                    </Button> */}
                                    <FontAwesomeIcon
                                      icon={faPlusSquare}
                                      size={"2x"}
                                      title="Add Row"
                                      className="faIcon-style"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.district != "" &&
                                          values.shipping_address != ""
                                        ) {
                                          let shipObj = {
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
                                    />
                                  </ButtonGroup>
                                </Col>
                              </Row>
                              <Row className="mt-4 m-0">
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
                                            <th className="text-center">-</th>
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
                                                      this.removeShippingRow(i);
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faTrash}
                                                    />
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
                            <Col md="12" className="mb-4">
                              <h6 className="title-style">Billing Details</h6>
                              <Row className="m-0">
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
                                    className="float-end pt-4"
                                    aria-label="Basic example"
                                  >
                                    {/* <Button
                                      className="create-btn mr-2"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.b_district != "" &&
                                          values.billing_address != ""
                                        ) {
                                          let billAddObj = {
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
                                    </Button> */}
                                    <FontAwesomeIcon
                                      icon={faPlusSquare}
                                      size={"2x"}
                                      title="Add Row"
                                      className="faIcon-style"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.b_district != "" &&
                                          values.billing_address != ""
                                        ) {
                                          let billAddObj = {
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
                                    />
                                  </ButtonGroup>
                                </Col>
                              </Row>

                              <Row className="mt-4 m-0">
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
                                            <th className="text-center">-</th>
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
                                                      this.removeBillingRow(i);
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faTrash}
                                                    />
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
                            <Col md="12" className="mb-4">
                              <h6 className="title-style">
                                Department Details
                              </h6>
                              <Row className="m-0">
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
                                    className="float-end pt-4"
                                    aria-label="Basic example"
                                  >
                                    {/* <Button
                                      className="create-btn mr-2"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.dept != "" &&
                                          values.contact_no != "" &&
                                          values.contact_person != ""
                                        ) {
                                          let deptObj = {
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
                                    </Button> */}
                                    <FontAwesomeIcon
                                      icon={faPlusSquare}
                                      size={"2x"}
                                      title="Add Row"
                                      className="faIcon-style"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          values.dept != "" &&
                                          values.contact_no != "" &&
                                          values.contact_person != ""
                                        ) {
                                          let deptObj = {
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
                                    />
                                  </ButtonGroup>
                                </Col>
                              </Row>

                              <Row className="mt-4 m-0">
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
                                            <th className="text-center">-</th>
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
                                                      this.removeDeptRow(i);
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faTrash}
                                                    />
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
                          <Row className="mt-2 mb-2">
                            <Col md="12">
                              <ButtonGroup
                                className="float-end pt-4"
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
                                    eventBus.dispatch(
                                      "page_change",
                                      "ledgerlist"
                                    );
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
                      <div className=" form-style">
                        <Row className="mt-4 row-border">
                          <Col md="12" className="mb-4">
                            <h6 className="title-style">BANK ACCOUNT</h6>

                            {/* A */}

                            <Row className="m-0">
                              <Col md="3">
                                <Form.Group className="">
                                  <Form.Label>
                                    Opening Balance{" "}
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
                                      style={{ zIndex: 0 }}
                                    />

                                    <Select
                                      // isClearable={true}
                                      styles={customStylesForJoin}
                                      className="selectTo"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "opening_balance_type",
                                          e
                                        );
                                      }}
                                      options={dr_options}
                                      name="opening_balance_type"
                                      value={values.opening_balance_type}
                                    />

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
                            <Row className="m-0">
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
                            <Row className="mt-3 m-0">
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
                            <Row className="m-0">
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label
                                    style={{
                                      paddingBottom: "2px",
                                      paddingTop: "11px",
                                    }}
                                  >
                                    Taxation Available{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>{" "}
                                  <Select
                                    styles={customStyles}
                                    className="selectTo"
                                    onChange={(e) => {
                                      setFieldValue("isTaxation", e);
                                    }}
                                    options={ledger_type_options}
                                    name="isTaxation"
                                    value={values.isTaxation}
                                  />
                                </Form.Group>
                              </Col>

                              {values.isTaxation &&
                                values.isTaxation.value == true && (
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
                                  </>
                                )}
                            </Row>
                          </Col>
                        </Row>

                        <Row className="mt-5 row-border">
                          <Col md="12" className="mb-4">
                            <h6 className="title-style">Bank Details</h6>
                            <Row className="m-0">
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
                            </Row>{" "}
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12">
                            <ButtonGroup
                              className="float-end pt-4"
                              aria-label="Basic example"
                            >
                              <Button className="submit-btn" type="submit">
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "ledgerlist"
                                  );
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
                            <Row className="m-0">
                              <Col md="2">
                                <Form.Group className="createnew">
                                  <Form.Label>
                                    Tax Type{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
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

                        <Row style={{ margin: "4px" }}>
                          <Col md="12">
                            <ButtonGroup
                              className="float-end pt-4"
                              aria-label="Basic example"
                            >
                              <Button className="submit-btn" type="submit">
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "ledgerlist"
                                  );
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
                        <Row style={{ margin: "4px" }}>
                          <Col md="12">
                            <ButtonGroup
                              className="float-end pt-4"
                              aria-label="Basic example"
                            >
                              <Button className="submit-btn" type="submit">
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "ledgerlist"
                                  );
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
                            <Row className="m-0">
                              <Col
                                md="3"
                                lg={3}
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

                                    <Select
                                      // isClearable={true}
                                      styles={customStylesForJoin}
                                      className="selectTo"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "opening_balance_type",
                                          e
                                        );
                                      }}
                                      options={dr_options}
                                      name="opening_balance_type"
                                      value={values.opening_balance_type}
                                    />
                                    {/* <div style={{ width: "25%" }}>
                                      <Form.Control
                                        as="select"
                                        onChange={(e) => {
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
                                    </div> */}
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
                              className="float-end pt-4"
                              aria-label="Basic example"
                            >
                              <Button className="submit-btn" type="submit">
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // window.electron.ipcRenderer.webPageChange({
                                  //   from: "ledgercreate",
                                  //   to: "ledgerlist",
                                  //   isNewTab: false,
                                  // });
                                  eventBus.dispatch(
                                    "page_change",
                                    "ledgerlist"
                                  );
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
          <Modal
            show={show}
            size="lg"
            className="groupnewmodal mt-5 mainmodal"
            onHide={() => this.handleModal(false)}
            dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header
              // closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Associate Group
              </Modal.Title>
              <CloseButton
                variant="white"
                className="float-end"
                onClick={this.handleClose}
                //  onClick={() => this.handelPurchaseacModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className=" p-2 p-invoice-modal">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={initValue}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                  associates_group_name: Yup.string()
                    .trim()
                    .required("Account group name is required"),
                  underId: Yup.object().required("select Under"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let requestData = new FormData();
                  //                     principle_id
                  // sub_principle_id
                  // associates_group_name
                  // under_prefix
                  requestData.append(
                    "associates_group_name",
                    values.associates_group_name
                  );
                  requestData.append(
                    "principle_id",
                    values.underId ? values.underId.principle_id : ""
                  );
                  requestData.append(
                    "sub_principle_id",
                    values.underId
                      ? values.underId.sub_principle_id
                        ? values.underId.sub_principle_id
                        : ""
                      : ""
                  );
                  requestData.append(
                    "under_prefix",
                    values.underId ? values.underId.under_prefix : ""
                  );
                  // requestData.append("underId");
                  if (values.associates_id == "") {
                    createAssociateGroup(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          this.lstUnders();
                          this.handleModal(false);
                          resetForm();
                          this.setInitValue();
                          this.lstAssociateGroups();
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {});
                  } else {
                    requestData.append("associates_id", values.associates_id);
                    updateAssociateGroup(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          this.lstUnders();
                          this.handleModal(false);
                          resetForm();
                          this.setInitValue();
                          this.lstAssociateGroups();
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {});
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
                  <Form onSubmit={handleSubmit}>
                    <div className="institute-head company-from">
                      <Row>
                        <Col md="4">
                          <Form.Group className="createnew">
                            <Form.Label>
                              Under Id{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>{" "}
                            </Form.Label>
                            <Select
                              isClearable={true}
                              styles={customStyles}
                              className="selectTo"
                              onChange={(v) => {
                                setFieldValue("underId", v);
                              }}
                              name="underId"
                              options={undervalue}
                              value={values.underId}
                              invalid={errors.underId ? true : false}
                            />
                            <span className="text-danger">
                              {errors.underId}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="5">
                          <Form.Group>
                            <Form.Label>
                              Associate Group Name{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Associate Group Name"
                              name="associates_group_name"
                              id="associates_group_name"
                              onChange={handleChange}
                              value={values.associates_group_name}
                              isValid={
                                touched.associates_group_name &&
                                !errors.associates_group_name
                              }
                              isInvalid={!!errors.associates_group_name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.associates_group_name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md="1">
                          <div>
                            <Form.Label style={{ color: "#fff" }}>
                              Blank
                              <br />
                            </Form.Label>
                          </div>
                          <Button className="submit-btn" type="submit">
                            {values.associates_id == "" ? "Submit" : "Update"}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}
