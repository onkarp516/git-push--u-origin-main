import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  ButtonGroup,
  Modal,
  Collapse,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import moment from "moment";
import Select from "react-select";
import {
  getSundryDebtors,
  getSalesAccounts,
  getProduct,
  createSalesOrder,
  getDiscountLedgers,
  getAdditionalLedgers,
  authenticationService,
  getSundryDebtorsIdClient,
  getProductPackageList,
} from "@/services/api_functions";
import TransactionModal from "../../Components/TransactionModal";
import TRowComponent from "../../Components/TRowComponent";

import {
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
} from "@/helpers";

import mousetrap from "mousetrap";
import "mousetrap-global-bind";

// const customStyles = {
//   control: (base) => ({
//     ...base,
//     height: 30,
//     minHeight: 30,
//     border: 'none',
//     padding: '0 6px',
//     boxShadow: 'none',
//     //lineHeight: "10",
//     background: 'transparent',
//     //borderBottom: "1px solid #ccc",
//     '&:focus': {
//       borderBottom: '1px solid black',
//     },
//   }),
// };
const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    border: "none",
    padding: "0 6px",
    boxShadow: "none",
    //lineHeight: "10",
    background: "transparent",
    // borderBottom: '1px solid #ccc',
    // '&:focus': {
    //   borderBottom: '1px solid #1e3989',
    // },
  }),
};

export default class TranxSalesOrderCreate extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      opendiv: false,
      hidediv: true,
      invoice_data: "",
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      Clietdetailmodal: false,
      clientinfo: [],
      invoiceedit: false,
      productLst: [],
      unitLst: [],
      rows: [],
      serialnopopupwindow: false,
      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      lstPackages: [],
      transaction_mdl_show: false,
      transaction_detail_index: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
    };
  }
  getProductPackageLst = (product_id) => {
    let reqData = new FormData();
    reqData.append("product_id", product_id);
    getProductPackageList(reqData)
      .then((response) => {
        let responseData = response.data;
        if (responseData.responseStatus == 200) {
          let data = responseData.responseObject.lst_packages;
          let opt = data.map((v) => {
            let unitOpt = v.units.map((vi) => {
              return { label: vi.unit_name, value: vi.units_id, ...vi };
            });
            return { label: v.pack_name, value: v.id, ...v, unitOpt: unitOpt };
          });
          this.setState({ lstPackages: opt }, () => {
            if (opt.length > 0) {
              this.setState({ transaction_mdl_show: true });
            }
          });
        } else {
          this.setState({ lstPackages: [], transaction_mdl_show: false });
        }
      })
      .catch((error) => {
        this.setState({ lstPackages: [], transaction_mdl_show: false });
        console.log("error", error);
      });
  };

  lstAdditionalLedgers = () => {
    getAdditionalLedgers()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.name };
            });
            let fOpt = Opt.filter(
              (v) => v.label.trim().toLowerCase() != "round off"
            );
            // console.log({ fOpt });
            this.setState({ lstAdditionalLedger: fOpt });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstDiscountLedgers = () => {
    getAdditionalLedgers()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.name };
            });
            let fOpt = Opt.filter(
              (v) => v.label.trim().toLowerCase() != "round off"
            );
            this.setState({ lstDisLedger: fOpt });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleClientDetails = (status) => {
    let { invoice_data } = this.state;
    console.log({ invoice_data });
    if (status == true) {
      let reqData = new FormData();
      let sun_id = invoice_data.clientNameId && invoice_data.clientNameId.value;
      reqData.append("sundry_debtors_id", sun_id);
      getSundryDebtorsIdClient(reqData)
        .then((response) => {
          console.log("res", response);
          let res = response.data;
          if (res.responseStatus == 200) {
            this.setState({ clientinfo: res });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }

    this.setState({ Clietdetailmodal: status });
  };

  handleClientForm = () => {
    this.handleClientDetails(true);
  };

  lstSalesAccounts = () => {
    getSalesAccounts()
      .then((response) => {
        // console.log("res", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ salesAccLst: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstSundrydebtors = () => {
    getSundryDebtors()
      .then((response) => {
        // console.log("res", response);

        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.name,
              value: v.id,
              code: v.ledger_code,
              state: stateCode,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.ledger_code,
              value: v.id,
              name: v.name,
              state: stateCode,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstProduct = () => {
    getProduct()
      .then((response) => {
        // console.log('res', response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          let opt = data.map((v) => {
            let unitOpt = v.units.map((vi) => {
              return { label: vi.unitCode, value: vi.id };
            });
            return {
              label: v.productName,
              value: v.id,
              igst: v.igst,
              hsnId: v.hsnId,
              taxMasterId: v.taxMasterId,
              sgst: v.sgst,
              cgst: v.cgst,
              productCode: v.productCode,
              productName: v.productName,
              isNegativeStocks: v.isNegativeStocks,
              isSerialNumber: v.isSerialNumber,
              unitOpt: unitOpt,
            };
          });
          this.setState({ productLst: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  /**
   * @description Initialize Product Row
   */
  initRow = () => {
    let lst = [];
    for (let index = 0; index < 10; index++) {
      let data = {
        productId: "",
        packageId: "",
        units: [
          {
            unitId: "",
            qty: "",
            rate: "",
            base_amt: "",
            unit_conv: "",
          },
        ],
        unitId: "",
        qtyH: "",
        qtyM: "",
        qtyL: "",
        rateH: "",
        rateM: "",
        rateL: "",
        base_amt_H: 0,
        base_amt_M: 0,
        base_amt_L: 0,
        base_amt: "",
        dis_amt: "",
        dis_per: "",
        dis_per_cal: "",
        dis_amt_cal: "",
        total_amt: "",
        gst: "",
        igst: "",
        cgst: "",
        sgst: "",
        total_igst: "",
        total_cgst: "",
        total_sgst: "",
        final_amt: "",
        serialNo: [],
        discount_proportional_cal: 0,
        additional_charges_proportional_cal: 0,
        reference_id: "",
        reference_type: "",
      };
      lst.push(data);
    }
    this.setState({ rows: lst });
  };
  /**
   * @description Initialize Additional Charges
   */
  initAdditionalCharges = () => {
    // additionalCharges
    let lst = [];
    for (let index = 0; index < 5; index++) {
      let data = {
        ledgerId: "",
        amt: "",
      };
      lst.push(data);
    }
    this.setState({ additionalCharges: lst });
  };

  componentDidMount() {
    // console.log("props", this.props);
    if (AuthenticationCheck()) {
      this.lstSalesAccounts();
      this.lstSundrydebtors();
      this.lstProduct();
      // this.lstUnit();
      this.initRow();
      this.initAdditionalCharges();
      this.lstDiscountLedgers();
      this.lstAdditionalLedgers();
      const { prop_data } = this.props.block;
      this.setState({ invoice_data: prop_data });
      // let invoice_data = this.props.location.state;
      // this.setState({ invoice_data: invoice_data } );
      mousetrap.bindGlobal("ctrl+h", this.handleClientForm);
    }
  }
  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+h", this.handleClientForm);
  }
  /**
   *
   * @param {*} product
   * @param {*} element
   * @description to return place holder according to product unit
   * @returns
   */
  handlePlaceHolder = (product, element) => {
    // console.log({ product, element });
    if (product != "") {
      if (element == "qtyH") {
        if (product.unitOpt.length > 0) {
          return product.unitOpt[0].label;
        }
      }
      if (element == "rateH") {
        if (product.unitOpt.length > 0) {
          return product.unitOpt[0].label;
        }
      }
      if (element == "qtyM") {
        if (product.unitOpt.length > 1) {
          return product.unitOpt[1].label;
        }
      }
      if (element == "rateM") {
        if (product.unitOpt.length > 1) {
          return product.unitOpt[1].label;
        }
      }
      if (element == "qtyL") {
        if (product.unitOpt.length > 2) {
          return product.unitOpt[2].label;
        }
      }
      if (element == "rateL") {
        if (product.unitOpt.length > 2) {
          return product.unitOpt[2].label;
        }
      }
    }
    return "";
  };

  /**
   *
   * @param {*} element
   * @param {*} value
   * @param {*} index
   * @param {*} setFieldValue
   * @description on change of each element in row function will recalculate amt
   */

  handleChangeArrayElement = (element, value, index, setFieldValue) => {
    // console.log({ element, value, unittype });
    let { rows } = this.state;

    // checkelement[element] = value;
    /**
     * @description Calculate product level calculation
     */
    let frows = rows.map((v, i) => {
      if (i == index) {
        v[element] = value;
        index = i;
        if (element == "productId" && value != null && value != undefined) {
          v["igst"] = value.igst;
          v["gst"] = value.igst;
          v["cgst"] = value.cgst;
          v["sgst"] = value.sgst;
          if (value.isSerialNumber == true) {
            let serialnoarray = [];
            for (let index = 0; index < 100; index++) {
              serialnoarray.push({ no: "" });
            }
            v["serialNo"] = serialnoarray;
            this.setState({
              serialnopopupwindow: true,
              serialnoshowindex: i,
              serialnoarray: serialnoarray,
            });
          }
        }

        return v;
      } else {
        return v;
      }
    });
    this.setState({ rows: frows }, () => {
      if (
        element == "productId" &&
        value != "" &&
        value != undefined &&
        value != null
      ) {
        this.setState({ transaction_detail_index: index }, () => {
          this.getProductPackageLst(value.value);
        });
      }
      this.handleAdditionalChargesSubmit();
    });
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    // console.log("elementCheck", elementCheck);
    // console.log("element", element);
    return elementCheck ? elementCheck[element] : "";
  };

  handleUnitLstOpt = (productId) => {
    // console.log("productId", productId);
    if (productId != undefined && productId) {
      return productId.unitOpt;
    }
  };
  handleUnitLstOptLength = (productId) => {
    // console.log("productId", productId);
    if (productId != undefined && productId) {
      return productId.unitOpt.length;
    }
  };
  handleSerialNoQty = (element, index) => {
    let { rows } = this.state;
    console.log("serial no", rows);
    console.log({ element, index });
    // this.setState({ serialnopopupwindow: true });
  };
  handleSerialNoValue = (index, value) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.map((v, i) => {
      if (i == index) {
        v["no"] = value;
      }
      return v;
    });

    this.setState({ serialnoarray: fn });
  };
  valueSerialNo = (index) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.find((v, i) => i == index);
    return fn ? fn.no : "";
  };
  renderSerialNo = () => {
    let { rows, serialnoshowindex, serialnoarray } = this.state;
    // console.log({ rows, serialnoshowindex });
    if (serialnoshowindex != -1) {
      let rdata = rows.find((v, i) => i == serialnoshowindex);

      return serialnoarray.map((vi, ii) => {
        return (
          <tr>
            <td>{ii + 1}</td>
            <td>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder=""
                  onChange={(e) => {
                    // console.log(e.target.value);
                    this.handleSerialNoValue(ii, e.target.value);
                  }}
                  value={this.valueSerialNo(ii)}
                />
              </Form.Group>
            </td>
          </tr>
        );
      });
    }
  };
  handleSerialNoSubmit = () => {
    let { rows, serialnoshowindex, serialnoarray } = this.state;

    if (serialnoshowindex != -1) {
      let rdata = rows.map((v, i) => {
        if (i == serialnoshowindex) {
          let no = serialnoarray.filter((vi, ii) => {
            if (vi.no != "") {
              return vi.no;
            }
          });
          v["serialNo"] = no;
          v["qtyH"] = no.length;
        }
        return v;
      });
      this.setState({
        rows: rdata,
        serialnoshowindex: -1,
        serialnoarray: [],
        serialnopopupwindow: false,
      });
    }
  };
  handleAdditionalCharges = (element, index, value) => {
    // console.log({ element, index, value });

    let { additionalCharges } = this.state;
    let fa = additionalCharges.map((v, i) => {
      if (i == index) {
        v[element] = value;
      }
      return v;
    });
    let totalamt = 0;
    fa.map((v) => {
      if (v.amt != "") {
        totalamt += parseFloat(v.amt);
      }
    });
    this.setState({ additionalCharges: fa, additionalChargesTotal: totalamt });
  };
  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleClearProduct = (index) => {
    const { rows } = this.state;
    let frows = [...rows];
    let data = {
      details_id: 0,
      packageId: "",
      units: [
        {
          unitId: "",
          qty: "",
          rate: "",
          base_amt: "",
          unit_conv: "",
        },
      ],
      productId: "",
      unitId: "",
      qtyH: "",
      qtyM: "",
      qtyL: "",
      rateH: "",
      rateM: "",
      rateL: "",
      base_amt_H: 0,
      base_amt_M: 0,
      base_amt_L: 0,
      base_amt: "",
      dis_amt: "",
      dis_per: "",
      dis_per_cal: "",
      dis_amt_cal: "",
      total_amt: "",
      gst: "",
      igst: "",
      cgst: "",
      sgst: "",
      total_igst: "",
      total_cgst: "",
      total_sgst: "",
      final_amt: "",
      serialNo: [],
      discount_proportional_cal: 0,
      additional_charges_proportional_cal: 0,
    };
    frows[index] = data;
    this.setState({ rows: frows }, () => {
      this.handleAdditionalChargesSubmit();
    });
  };
  /**
   * @description Calculate the formula discount + Additional charges
   */
  handleAdditionalChargesSubmit = (discamtval = -1, type = "") => {
    const { rows, additionalChargesTotal } = this.state;
    if (discamtval == "") {
      discamtval = 0;
    }
    if (type != "" && discamtval >= 0) {
      if (type == "sales_discount") {
        this.myRef.current.setFieldValue(
          "sales_discount",
          discamtval != "" ? discamtval : 0
        );
      } else {
        this.myRef.current.setFieldValue(
          "sales_discount_amt",
          discamtval != "" ? discamtval : 0
        );
      }
    }
    let totalamt = 0;
    /**
     * @description calculate indivisual row discount and total amt
     */
    let row_disc = rows.map((v) => {
      if (v["productId"] != "") {
        // if (v['qtyH'] != '' && v['rateH'] != '') {
        //   v['base_amt_H'] = parseInt(v['qtyH']) * parseFloat(v['rateH']);
        // }
        // if (v['qtyM'] != '' && v['rateM'] != '') {
        //   v['base_amt_M'] = parseInt(v['qtyM']) * parseFloat(v['rateM']);
        // }
        // if (v['qtyL'] != '' && v['rateL'] != '') {
        //   v['base_amt_L'] = parseInt(v['qtyL']) * parseFloat(v['rateL']);
        // }

        // v['base_amt'] = v['base_amt_H'] + v['base_amt_M'] + v['base_amt_L'];
        let baseamt = 0;
        v["units"] = v.units.map((vi) => {
          if (vi["qty"] != "" && vi["rate"] != "") {
            vi["base_amt"] = parseInt(vi["qty"]) * parseFloat(vi["rate"]);
          } else {
            vi["base_amt"] = 0;
          }

          vi["unit_conv"] = vi["unitId"] ? vi["unitId"]["unit_conversion"] : "";
          baseamt = parseFloat(baseamt) + parseFloat(vi["base_amt"]);
          return vi;
        });

        v["base_amt"] = baseamt;
        v["total_amt"] = parseFloat(v["base_amt"]);
        if (v["dis_amt"] != "" && v["dis_amt"] > 0) {
          // console.log("v['dis_amt']", v["dis_amt"]);
          v["total_amt"] =
            parseFloat(v["total_amt"]) - parseFloat(v["dis_amt"]);
          v["dis_amt_cal"] = v["dis_amt"];
        }
        if (v["dis_per"] != "" && v["dis_per"] > 0) {
          // console.log("v['dis_per']", v["dis_per"]);
          let per_amt = calculatePercentage(v["total_amt"], v["dis_per"]);
          v["dis_per_cal"] = per_amt;
          v["total_amt"] = v["total_amt"] - per_amt;
        }

        totalamt = parseFloat(totalamt) + parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log({ row_disc });
    // console.log("totalamt", totalamt);
    let ntotalamt = 0;
    /**
     *
     */
    let bdisc = row_disc.map((v, i) => {
      if (v["productId"] != "") {
        if (type != "" && discamtval >= 0) {
          if (type == "sales_discount") {
            // console.log("values", this.myRef.current.values);
            // this.myRef.current.setFieldValue("sales_discount", discamtval);

            let peramt = calculatePercentage(
              totalamt,
              parseFloat(discamtval),
              v["total_amt"]
            );
            v["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              peramt,
              v["total_amt"]
            );

            v["total_amt"] =
              v["total_amt"] -
              calculatePrValue(totalamt, peramt, v["total_amt"]);
          } else {
            v["total_amt"] =
              v["total_amt"] -
              calculatePrValue(
                totalamt,
                parseFloat(discamtval),
                v["total_amt"]
              );
            v["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              parseFloat(discamtval),
              v["total_amt"]
            );
          }
        } else {
          if (
            this.myRef.current.values.sales_discount > 0 &&
            this.myRef.current.values.sales_discount != ""
          ) {
            let peramt = calculatePercentage(
              totalamt,
              this.myRef.current.values.sales_discount,
              v["total_amt"]
            );
            v["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              peramt,
              v["total_amt"]
            );

            v["total_amt"] =
              v["total_amt"] -
              calculatePrValue(totalamt, peramt, v["total_amt"]);
          }
          if (
            this.myRef.current.values.sales_discount_amt > 0 &&
            this.myRef.current.values.sales_discount_amt != ""
          ) {
            v["total_amt"] =
              v["total_amt"] -
              calculatePrValue(
                totalamt,
                this.myRef.current.values.sales_discount_amt,
                v["total_amt"]
              );
            v["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              this.myRef.current.values.sales_discount_amt,
              v["total_amt"]
            );
          }
        }
        ntotalamt = parseFloat(ntotalamt) + parseFloat(v["total_amt"]);
      }
      return v;
    });
    /**
     * Additional Charges
     */
    let addCharges = [];

    addCharges = bdisc.map((v, i) => {
      if (v["productId"] != "") {
        v["total_amt"] = parseFloat(
          v["total_amt"] +
            calculatePrValue(ntotalamt, additionalChargesTotal, v["total_amt"])
        ).toFixed(2);
        v["additional_charges_proportional_cal"] = calculatePrValue(
          ntotalamt,
          additionalChargesTotal,
          v["total_amt"]
        );
      }
      return v;
    });

    let famt = 0;
    let totalbaseamt = 0;
    let totaltaxableamt = 0;
    let totaltaxamt = 0;
    let totalcgstamt = 0;
    let totalsgstamt = 0;
    let totaligstamt = 0;
    let total_discount_proportional_amt = 0;
    let total_additional_charges_proportional_amt = 0;
    let total_sales_discount_amt = 0;

    let taxIgst = [];
    let taxCgst = [];
    let taxSgst = [];
    let totalqtyH = 0;
    let totalqtyM = 0;
    let totalqtyL = 0;
    let totalqty = 0;
    /**
     * GST Calculation
     * **/
    let frow = addCharges.map((v, i) => {
      if (v["productId"] != "") {
        v["total_igst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["igst"])
        ).toFixed(2);
        v["total_cgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["cgst"])
        ).toFixed(2);
        v["total_sgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["sgst"])
        ).toFixed(2);

        v["final_amt"] = parseFloat(
          parseFloat(v["total_amt"]) + parseFloat(v["total_igst"])
        ).toFixed(2);
        totalqtyH += parseInt(v["qtyH"] != "" ? v["qtyH"] : 0);
        totalqtyM += parseInt(v["qtyM"] != "" ? v["qtyM"] : 0);
        totalqtyL += parseInt(v["qtyL"] != "" ? v["qtyL"] : 0);
        totaligstamt += parseFloat(v["total_igst"]).toFixed(2);
        totalcgstamt += parseFloat(v["total_cgst"]).toFixed(2);
        totalsgstamt += parseFloat(v["total_sgst"]).toFixed(2);
        total_sales_discount_amt =
          parseFloat(total_sales_discount_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(v["additional_charges_proportional_cal"]);
        // additional_charges_proportional_cal
        famt = parseFloat(
          parseFloat(famt) + parseFloat(v["final_amt"])
        ).toFixed(2);

        // parseFloat(v["dis_per_cal"] != "" ? v["dis_per_cal"] : 0) -
        // parseFloat(v["dis_amt_cal"] != "" ? v["dis_amt_cal"] : 0)
        let baseamt = parseFloat(v["base_amt"]);
        if (v["dis_amt"] != "" && v["dis_amt"] > 0) {
          baseamt = baseamt - parseFloat(v["dis_amt_cal"]);
        }
        if (v["dis_per"] != "" && v["dis_per"] > 0) {
          baseamt = baseamt - parseFloat(v["dis_per_cal"]);
        }
        // ((isNaN(parseFloat(v["dis_per_cal"]))
        //   ? 0
        //   : parseFloat(v["dis_per_cal"])) -
        //   (isNaN(parseFloat(v["dis_amt_cal"]))
        //     ? 0
        //     : parseFloat(v["dis_amt_cal"])));
        // console.log("baseamt", baseamt);
        totalbaseamt = parseFloat(parseFloat(totalbaseamt) + baseamt).toFixed(
          2
        );

        totaltaxableamt = parseFloat(
          parseFloat(totaltaxableamt) + parseFloat(v["total_amt"])
        ).toFixed(2);
        totaltaxamt = parseFloat(
          parseFloat(totaltaxamt) + parseFloat(v["total_igst"])
        ).toFixed(2);

        // ! Tax Indidual gst % calculation
        if (v.productId != "") {
          if (v.productId.igst > 0) {
            if (taxIgst.length > 0) {
              let innerIgstTax = taxIgst.find(
                (vi) => vi.gst == v.productId.igst
              );
              if (innerIgstTax != undefined) {
                let innerIgstCal = taxIgst.filter((vi) => {
                  if (vi.gst == v.productId.igst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_igst"]);
                  }
                  return vi;
                });
                taxIgst = [...innerIgstCal];
              } else {
                let innerIgstCal = {
                  gst: v.productId.igst,
                  amt: parseFloat(v.total_igst),
                };
                taxIgst = [...taxIgst, innerIgstCal];
              }
            } else {
              let innerIgstCal = {
                gst: v.productId.igst,
                amt: parseFloat(v.total_igst),
              };
              taxIgst = [...taxIgst, innerIgstCal];
            }
          }
          if (v.productId.cgst > 0) {
            if (taxCgst.length > 0) {
              let innerCgstTax = taxCgst.find(
                (vi) => vi.gst == v.productId.cgst
              );
              // console.log("innerTax", innerTax);
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxCgst.filter((vi) => {
                  if (vi.gst == v.productId.cgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_cgst"]);
                  }
                  return vi;
                });
                taxCgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.cgst,
                  amt: parseFloat(v.total_cgst),
                };
                taxCgst = [...taxCgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.cgst,
                amt: parseFloat(v.total_cgst),
              };
              taxCgst = [...taxCgst, innerCgstCal];
            }
          }
          if (v.productId.sgst > 0) {
            if (taxSgst.length > 0) {
              let innerCgstTax = taxSgst.find(
                (vi) => vi.gst == v.productId.sgst
              );
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxSgst.filter((vi) => {
                  if (vi.gst == v.productId.sgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_sgst"]);
                  }
                  return vi;
                });
                taxSgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.sgst,
                  amt: parseFloat(v.total_sgst),
                };
                taxSgst = [...taxSgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.sgst,
                amt: parseFloat(v.total_sgst),
              };
              taxSgst = [...taxSgst, innerCgstCal];
            }
          }
        }
      }
      return v;
    });
    let roundoffamt = Math.round(famt);

    let roffamt = parseFloat(roundoffamt - famt).toFixed(2);

    this.myRef.current.setFieldValue("totalqtyH", totalqtyH);
    this.myRef.current.setFieldValue("totalqtyM", totalqtyM);
    this.myRef.current.setFieldValue("totalqtyL", totalqtyL);

    // this.myRef.current.setFieldValue("totalqty", totalqty);
    this.myRef.current.setFieldValue(
      "total_sales_discount_amt",
      parseFloat(total_sales_discount_amt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "total_discount_proportional_amt",
      parseFloat(total_discount_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_additional_charges_proportional_amt",
      parseFloat(total_additional_charges_proportional_amt).toFixed(2)
    );

    this.myRef.current.setFieldValue("roundoff", roffamt);
    this.myRef.current.setFieldValue(
      "total_base_amt",
      parseFloat(totalbaseamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      parseFloat(totaltaxableamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "totalcgst",
      parseFloat(totalcgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalsgst",
      parseFloat(totalsgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totaligst",
      parseFloat(totaligstamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalamt",
      parseFloat(roundoffamt).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });
  };
  handleRoundOffchange = (v) => {
    // console.log("roundoff", v);
    const { rows, additionalChargesTotal } = this.state;
    let totalamt = 0;
    /**
     * @description calculate indivisual row discount and total amt
     */
    let row_disc = rows.map((v) => {
      // console.log("v", v.final_amt);
      if (v["productId"] != "") {
        // if (v['qtyH'] != '' && v['rateH'] != '') {
        //   v['base_amt_H'] = parseInt(v['qtyH']) * parseFloat(v['rateH']);
        // }
        // if (v['qtyM'] != '' && v['rateM'] != '') {
        //   v['base_amt_M'] = parseInt(v['qtyM']) * parseFloat(v['rateM']);
        // }
        // if (v['qtyL'] != '' && v['rateL'] != '') {
        //   v['base_amt_L'] = parseInt(v['qtyL']) * parseFloat(v['rateL']);
        // }

        // v['base_amt'] = v['base_amt_H'] + v['base_amt_M'] + v['base_amt_L'];
        let baseamt = 0;
        v["units"] = v.units.map((vi) => {
          if (vi["qty"] != "" && vi["rate"] != "") {
            vi["base_amt"] = parseInt(vi["qty"]) * parseFloat(vi["rate"]);
          } else {
            vi["base_amt"] = 0;
          }

          vi["unit_conv"] = vi["unitId"] ? vi["unitId"]["unit_conversion"] : "";
          baseamt = parseFloat(baseamt) + parseFloat(vi["base_amt"]);
          return vi;
        });
        v["base_amt"] = baseamt;
        v["total_amt"] = v["base_amt"];
        if (v["dis_amt"] != "" && v["dis_amt"] > 0) {
          v["total_amt"] =
            parseFloat(v["total_amt"]) - parseFloat(v["dis_amt"]);
          v["dis_amt_cal"] = v["dis_amt"];
        }
        if (v["dis_per"] != "" && v["dis_per"] > 0) {
          let per_amt = calculatePercentage(v["total_amt"], v["dis_per"]);
          v["dis_per_cal"] = per_amt;
          v["total_amt"] = v["total_amt"] - per_amt;
        }
        totalamt += parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log("totalamt", totalamt);
    let ntotalamt = 0;
    /**
     *
     */

    let bdisc = row_disc.map((v, i) => {
      if (v["productId"] != "") {
        if (
          this.myRef.current.values.sales_discount > 0 &&
          this.myRef.current.values.sales_discount != ""
        ) {
          let peramt = calculatePercentage(
            totalamt,
            this.myRef.current.values.sales_discount,
            v["total_amt"]
          );
          v["discount_proportional_cal"] = calculatePrValue(
            totalamt,
            peramt,
            v["total_amt"]
          );

          v["total_amt"] =
            v["total_amt"] - calculatePrValue(totalamt, peramt, v["total_amt"]);
        }
        if (
          this.myRef.current.values.sales_discount_amt > 0 &&
          this.myRef.current.values.sales_discount_amt != ""
        ) {
          v["total_amt"] =
            parseFloat(v["total_amt"]) -
            calculatePrValue(
              totalamt,
              this.myRef.current.values.sales_discount_amt,
              v["total_amt"]
            );
          v["discount_proportional_cal"] = parseFloat(
            calculatePrValue(
              totalamt,
              this.myRef.current.values.sales_discount_amt,
              v["total_amt"]
            )
          ).toFixed(2);
        }

        ntotalamt += parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log("ntotalamt", ntotalamt);
    /**
     * Additional Charges
     */
    let addCharges = [];

    addCharges = bdisc.map((v, i) => {
      if (v["productId"] != "") {
        v["total_amt"] = parseFloat(
          v["total_amt"] +
            calculatePrValue(ntotalamt, additionalChargesTotal, v["total_amt"])
        ).toFixed(2);
        v["additional_charges_proportional_cal"] = parseFloat(
          calculatePrValue(ntotalamt, additionalChargesTotal, v["total_amt"])
        ).toFixed(2);
      }
      return v;
    });

    let famt = 0;
    let totalbaseamt = 0;

    let totaltaxableamt = 0;
    let totaltaxamt = 0;
    let totalcgstamt = 0;
    let totalsgstamt = 0;
    let totaligstamt = 0;
    let total_discount_proportional_amt = 0;
    let total_additional_charges_proportional_amt = 0;
    let total_sales_discount_amt = 0;

    let taxIgst = [];
    let taxCgst = [];
    let taxSgst = [];
    /**
     * GST Calculation
     * **/
    let frow = addCharges.map((v, i) => {
      if (v["productId"] != "") {
        v["total_igst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["igst"])
        ).toFixed(2);
        v["total_cgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["cgst"])
        ).toFixed(2);
        v["total_sgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["sgst"])
        ).toFixed(2);

        v["final_amt"] = parseFloat(
          parseFloat(v["total_amt"]) + parseFloat(v["total_igst"])
        ).toFixed(2);
        totaligstamt =
          parseFloat(totaligstamt) + parseFloat(v["total_igst"]).toFixed(2);
        totalcgstamt =
          parseFloat(totalcgstamt) + parseFloat(v["total_cgst"]).toFixed(2);
        totalsgstamt =
          parseFloat(totalsgstamt) + parseFloat(v["total_sgst"]).toFixed(2);
        // console.log("final_amt", v["final_amt"]);
        famt = parseFloat(
          parseFloat(famt) + parseFloat(v["final_amt"])
        ).toFixed(2);
        // totalbaseamt =
        //   parseFloat(totalbaseamt) + parseFloat(v["base_amt"]).toFixed(2);

        totalbaseamt = parseFloat(
          parseFloat(totalbaseamt) +
            (parseFloat(v["base_amt"]) -
              parseFloat(v["dis_per_cal"] != "" ? v["dis_per_cal"] : 0) -
              parseFloat(v["dis_amt_cal"] != "" ? v["dis_amt_cal"] : 0))
        ).toFixed(2);
        totaltaxableamt =
          parseFloat(totaltaxableamt) + parseFloat(v["total_amt"]).toFixed(2);
        totaltaxamt =
          parseFloat(totaltaxamt) + parseFloat(v["total_igst"]).toFixed(2);
        total_sales_discount_amt =
          parseFloat(total_sales_discount_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(v["additional_charges_proportional_cal"]);
        // ! Tax Indidual gst % calculation
        if (v.productId != "") {
          if (v.productId.igst > 0) {
            if (taxIgst.length > 0) {
              let innerIgstTax = taxIgst.find(
                (vi) => vi.gst == v.productId.igst
              );
              if (innerIgstTax != undefined) {
                let innerIgstCal = taxIgst.filter((vi) => {
                  if (vi.gst == v.productId.igst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_igst"]);
                  }
                  return vi;
                });
                taxIgst = [...innerIgstCal];
              } else {
                let innerIgstCal = {
                  gst: v.productId.igst,
                  amt: parseFloat(v.total_igst),
                };
                taxIgst = [...taxIgst, innerIgstCal];
              }
            } else {
              let innerIgstCal = {
                gst: v.productId.igst,
                amt: parseFloat(v.total_igst),
              };
              taxIgst = [...taxIgst, innerIgstCal];
            }
          }
          if (v.productId.cgst > 0) {
            if (taxCgst.length > 0) {
              let innerCgstTax = taxCgst.find(
                (vi) => vi.gst == v.productId.cgst
              );
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxCgst.filter((vi) => {
                  if (vi.gst == v.productId.cgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_cgst"]);
                  }
                  return vi;
                });
                taxCgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.cgst,
                  amt: parseFloat(v.total_cgst),
                };
                taxCgst = [...taxCgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.cgst,
                amt: parseFloat(v.total_cgst),
              };
              taxCgst = [...taxCgst, innerCgstCal];
            }
          }
          if (v.productId.sgst > 0) {
            if (taxSgst.length > 0) {
              let innerCgstTax = taxSgst.find(
                (vi) => vi.gst == v.productId.sgst
              );
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxSgst.filter((vi) => {
                  if (vi.gst == v.productId.sgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_sgst"]);
                  }
                  return vi;
                });
                taxSgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.sgst,
                  amt: parseFloat(v.total_sgst),
                };
                taxSgst = [...taxSgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.sgst,
                amt: parseFloat(v.total_sgst),
              };
              taxSgst = [...taxSgst, innerCgstCal];
            }
          }
        }
      }
      return v;
    });
    let roundoffamt = Math.round(famt);
    this.myRef.current.setFieldValue(
      "total_discount_proportional_amt",
      parseFloat(total_discount_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_additional_charges_proportional_amt",
      parseFloat(total_additional_charges_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_sales_discount_amt",
      parseFloat(total_sales_discount_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue("roundoff", v);
    // let roffamt = parseFloat(roundoffamt - famt).toFixed(2);
    // this.myRef.current.setFieldValue("roundoff", roundoffamt);
    this.myRef.current.setFieldValue(
      "total_base_amt",
      parseFloat(totalbaseamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      parseFloat(totaltaxableamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totaligst",
      parseFloat(totaligstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalcgst",
      parseFloat(totalcgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalsgst",
      parseFloat(totalsgstamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxamt).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    this.myRef.current.setFieldValue("totalamt", parseFloat(famt).toFixed(2));
    this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });
  };

  handleTranxModal = (status) => {
    this.setState({ transaction_mdl_show: status });
    if (status == false) {
      this.handleAdditionalChargesSubmit();
    }
  };

  handleRowChange = (rows) => {
    this.setState({ rows: rows });
  };
  render() {
    const {
      invoice_data,
      opendiv,
      hidediv,
      invoiceedit,
      salesAccLst,
      supplierNameLst,
      supplierCodeLst,
      rows,
      productLst,
      serialnopopupwindow,
      additionchargesyes,
      lstDisLedger,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      Clietdetailmodal,
      clientinfo,
      taxcal,
      transaction_mdl_show,
      transaction_detail_index,
      lstPackages,
    } = this.state;
    console.log(rows);
    return (
      <div className="">
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                enableReinitialize={true}
                initialValues={invoice_data}
                validationSchema={Yup.object().shape({
                  so_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  salesAccId: Yup.object().required("Select sales account"),
                  sobill_no: Yup.string()
                    .trim()
                    .required("bill no is required"),
                  bill_dt: Yup.string().required("Order date is required"),
                  // clientCodeId: Yup.object().required("select client code"),
                  clientNameId: Yup.object().required("Select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  this.setState({
                    invoice_data: values,
                    opendiv: !opendiv,
                    hidediv: !hidediv,
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
                  <Form
                    onSubmit={handleSubmit}
                    noValidate
                    className="form-style"
                  >
                    {/* {JSON.stringify(errors)}; */}
                    <Row>
                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Order Sr. #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="so_sr_no"
                            id="so_sr_no"
                            onChange={handleChange}
                            value={values.so_sr_no}
                            isValid={touched.so_sr_no && !errors.so_sr_no}
                            isInvalid={!!errors.so_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.so_sr_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Transaction Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <MyDatePicker
                            name="transaction_dt"
                            placeholderText="DD/MM/YYYY"
                            id="transaction_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("transaction_dt", date);
                            }}
                            selected={values.transaction_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />
                          <span className="text-danger errormsg">
                            {errors.transaction_dt}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Order #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Bill No."
                            name="sobill_no"
                            id="sobill_no"
                            onChange={handleChange}
                            value={values.sobill_no}
                            isValid={touched.sobill_no && !errors.sobill_no}
                            isInvalid={!!errors.sobill_no}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.sobill_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Order Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <MyDatePicker
                            name="bill_dt"
                            placeholderText="DD/MM/YYYY"
                            id="bill_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("bill_dt", date);
                            }}
                            selected={values.bill_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />
                          <span className="text-danger errormsg">
                            {errors.bill_dt}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Sales A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={salesAccLst}
                            borderRadius="0px"
                            colors="#729"
                            name="salesAccId"
                            onChange={(v) => {
                              setFieldValue("salesAccId", v);
                            }}
                            value={values.salesAccId}
                          />

                          <span className="text-danger errormsg">
                            {errors.salesAccId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Client Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="clientNameId"
                            onChange={(v) => {
                              // if (v != null) {
                              //   setFieldValue(
                              //     "clientCodeId",
                              //     getSelectValue(supplierCodeLst, v.value)
                              //   );
                              // }
                              setFieldValue("clientNameId", v);
                            }}
                            value={values.clientNameId}
                          />

                          <span className="text-danger errormsg">
                            {errors.clientNameId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="12" className="mt-2 btn_align">
                        <Button className="create-btn " type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                              opendiv: !opendiv,
                              hidediv: !hidediv,
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Collapse>

        {this.state.hidediv && (
          <div className="institute-head p-0 m-3">
            <Row>
              {" "}
              <Col md="12">
                <div className="p-2 supplie-det">
                  <ul>
                    <li>
                      <h6>Order Sr. No. </h6>:{" "}
                      <span>{invoice_data ? invoice_data.so_sr_no : ""}</span>
                    </li>

                    <li>
                      <h6>Order Date </h6>:{" "}
                      <span>
                        {invoice_data
                          ? moment(invoice_data.bill_dt).format("DD-MM-YYYY")
                          : ""}
                      </span>
                    </li>

                    <li>
                      <h6>Client Name </h6>:{" "}
                      <span>
                        {invoice_data ? invoice_data.clientNameId.label : ""}
                      </span>
                    </li>
                    <li style={{ float: "right" }}>
                      <a
                        href="#."
                        // onClick={(e) => {
                        //   e.preventDefault();
                        //   this.setState({ invoiceedit: true });
                        // }}
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({
                            opendiv: !opendiv,
                            hidediv: !hidediv,
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          class="bi bi-pencil svg-style"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        )}

        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          innerRef={this.myRef}
          initialValues={{
            totalamt: 0,
            totalqty: 0,
            roundoff: 0,
            narration: "",
            tcs: 0,
            sales_discount: 0,
            sales_discount_amt: 0,
            total_sales_discount_amt: 0,
            total_base_amt: 0,
            total_tax_amt: 0,
            total_taxable_amt: 0,
            total_dis_amt: 0,
            total_dis_per: 0,
            totalcgstper: 0,
            totalsgstper: 0,
            totaligstper: 0,
            purchase_disc_ledger: "",
            total_discount_proportional_amt: 0,
            total_additional_charges_proportional_amt: 0,
          }}
          enableReinitialize={true}
          // validationSchema={Yup.object().shape({
          //   purchase_sr_no: Yup.string()
          //     .trim()
          //     .required("Purchase no is required"),
          //   transaction_dt: Yup.string().required(
          //     "Transaction date is required"
          //   ),
          //   purchaseId: Yup.object().required("select purchase account"),
          //   invoice_no: Yup.string()
          //     .trim()
          //     .required("invoice no is required"),
          //   invoice_dt: Yup.string().required("invoice dt is required"),
          //   supplierCodeId: Yup.object().required("select supplier code"),
          //   supplierNameId: Yup.object().required("select supplier name"),
          // })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            let requestData = new FormData();
            // !Invoice Data
            requestData.append(
              "bill_dt",
              moment(invoice_data.bill_dt).format("yyyy-MM-DD")
            );
            requestData.append("bill_no", invoice_data.sobill_no);
            requestData.append("sales_acc_id", invoice_data.salesAccId.value);
            requestData.append("sales_sr_no", invoice_data.so_sr_no);
            requestData.append(
              "transaction_dt",
              moment(invoice_data.transaction_dt).format("yyyy-MM-DD")
            );
            requestData.append("debtors_id", invoice_data.clientNameId.value);
            // !Invoice Data
            requestData.append("roundoff", values.roundoff);
            requestData.append("narration", values.narration);
            requestData.append("total_base_amt", values.total_base_amt);
            requestData.append("totalamt", values.totalamt);
            requestData.append("taxable_amount", values.total_taxable_amt);
            requestData.append("totalcgst", values.totalcgst);
            requestData.append("totalsgst", values.totalsgst);
            requestData.append("totaligst", values.totaligst);
            requestData.append("totalqty", values.totalqty);
            requestData.append("tcs", values.tcs);
            requestData.append("sales_discount", values.sales_discount);
            requestData.append("sales_discount_amt", values.sales_discount_amt);
            requestData.append(
              "total_sales_discount_amt",
              values.sales_discount_amt > 0
                ? values.sales_discount_amt
                : values.total_sales_discount_amt
            );
            requestData.append(
              "sales_disc_ledger",
              values.purchase_disc_ledger
                ? values.purchase_disc_ledger.value
                : 0
            );

            let frow = this.state.rows.map((v, i) => {
              let funits = v.units.filter((vi) => {
                vi["unit_id"] = vi.unitId ? vi.unitId.value : "";
                return vi;
              });
              if (v.productId != "") {
                return {
                  details_id: 0,
                  product_id: v.productId.value,
                  unit_id: v.unitId.value,
                  qtyH: v.qtyH != "" ? v.qtyH : 0,
                  rateH: v.rateH != "" ? v.rateH : 0,
                  qtyM: v.qtyM != "" ? v.qtyM : 0,
                  rateM: v.rateM != "" ? v.rateM : 0,
                  qtyL: v.qtyL != "" ? v.qtyL : 0,
                  rateL: v.rateL != "" ? v.rateL : 0,
                  base_amt_H: v.base_amt_H != "" ? v.base_amt_H : 0,
                  base_amt_L: v.base_amt_L != "" ? v.base_amt_L : 0,
                  base_amt_M: v.base_amt_M != "" ? v.base_amt_M : 0,
                  base_amt: v.base_amt != "" ? v.base_amt : 0,
                  dis_amt: v.dis_amt != "" ? v.dis_amt : 0,
                  dis_per: v.dis_per != "" ? v.dis_per : 0,
                  dis_per_cal: v.dis_per_cal != "" ? v.dis_per_cal : 0,
                  dis_amt_cal: v.dis_amt_cal != "" ? v.dis_amt_cal : 0,
                  total_amt: v.total_amt != "" ? v.total_amt : 0,
                  igst: v.igst != "" ? v.igst : 0,
                  cgst: v.cgst != "" ? v.cgst : 0,
                  sgst: v.sgst != "" ? v.sgst : 0,
                  total_igst: v.total_igst != "" ? v.total_igst : 0,
                  total_cgst: v.total_cgst != "" ? v.total_cgst : 0,
                  total_sgst: v.total_sgst != "" ? v.total_sgst : 0,
                  final_amt: v.final_amt != "" ? v.final_amt : 0,
                  serialNo: v.serialNo,
                  discount_proportional_cal:
                    v.discount_proportional_cal != ""
                      ? v.discount_proportional_cal
                      : 0,
                  additional_charges_proportional_cal:
                    v.additional_charges_proportional_cal != ""
                      ? v.additional_charges_proportional_cal
                      : 0,
                  reference_id: v.reference_id ? v.reference_id : "",
                  reference_type: v.reference_type ? v.reference_type : "",
                  units: funits,
                  packageId: v.packageId ? v.packageId.value : "",
                };
              }
            });

            var filtered = frow.filter(function (el) {
              return el != null;
            });
            let additionalChargesfilter = additionalCharges.filter((v) => {
              if (
                v.ledgerId != "" &&
                v.ledgerId != undefined &&
                v.ledgerId != null
              ) {
                v["ledger"] = v["ledgerId"]["value"];
                return v;
              }
            });
            requestData.append(
              "additionalChargesTotal",
              additionalChargesTotal
            );
            requestData.append("row", JSON.stringify(filtered));
            requestData.append(
              "additionalCharges",
              JSON.stringify(additionalChargesfilter)
            );
            requestData.append("sale_type", "sales_invoice");

            if (
              authenticationService.currentUserValue.state &&
              invoice_data &&
              invoice_data.supplierCodeId &&
              invoice_data.supplierCodeId.state !=
                authenticationService.currentUserValue.state
            ) {
              let taxCal = {
                igst: this.state.taxcal.igst,
              };

              requestData.append("taxFlag", false);
              requestData.append("taxCalculation", JSON.stringify(taxCal));
            } else {
              let taxCal = {
                cgst: this.state.taxcal.cgst,
                sgst: this.state.taxcal.sgst,
              };
              // console.log("taxCal", taxCal);
              requestData.append("taxCalculation", JSON.stringify(taxCal));
              requestData.append("taxFlag", true);
            }

            // console.log("requestData", requestData.values());
            // List key/value pairs
            // for (let [name, value] of requestData) {
            //   console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
            // }
            createSalesOrder(requestData)
              .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                  // ShowNotification("Success", res.message);
                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: res.message,
                    is_timeout: true,
                    delay: 1000,
                  });
                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_order_create",
                    to: "tranx_sales_order_list",
                    isNewTab: false,
                  });
                } else {
                  // ShowNotification("Error", res.message);
                  MyNotifications.fire({
                    show: true,
                    icon: "error",
                    title: "Error",
                    msg: res.message,
                    is_button_show: true,
                  });
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
            handleSubmit,
            isSubmitting,
            resetForm,
            setFieldValue,
          }) => (
            <Form
              onSubmit={handleSubmit}
              noValidate
              className="purchase-order-style form-style"
            >
              <div className="row-inside ">
                <Table size="sm" className="tbl-font ">
                  <thead>
                    <tr>
                      <th>#.</th>
                      <th>Particulars</th>
                      <th>Packaging</th>
                      <th colSpan={3} className="text-center">
                        (Unit,Qnty,Rate)
                      </th>

                      <th>Disc Amt</th>
                      <th>Disc %</th>
                      <th>Total Amt</th>
                      <th>GST %</th>
                      <th>Tax Amt</th>
                      <th>Final Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((v, i) => {
                      return (
                        <TRowComponent
                          i={i}
                          setFieldValue={setFieldValue}
                          setElementValue={this.setElementValue.bind(this)}
                          handleChangeArrayElement={this.handleChangeArrayElement.bind(
                            this
                          )}
                          productLst={productLst}
                          handlePlaceHolder={this.handlePlaceHolder.bind(this)}
                          handleUnitLstOptLength={this.handleUnitLstOptLength.bind(
                            this
                          )}
                          isDisabled={false}
                          handleClearProduct={this.handleClearProduct.bind(
                            this
                          )}
                        />
                      );
                    })}

                    <tr
                      className="totalr_fix"
                      style={{ background: "#f5f5f5" }}
                    >
                      <td colSpan={10}></td>
                      <td
                        style={{ background: "#eee", textAlign: "right" }}
                        cellpadding="3"
                        className="qtotalqty"
                      >
                        Round Off
                      </td>
                      <td style={{ background: "#eee" }}>
                        <Form.Control
                          type="text"
                          name="roundoff"
                          readOnly
                          onChange={(v) => {
                            this.handleRoundOffchange(v.target.value);
                          }}
                          value={values.roundoff}
                          style={{
                            textAlign: "right",
                            //paddingRight: "23px",
                          }}
                        />
                      </td>
                    </tr>

                    <tr
                      className="total_fix total_bg"
                      style={{ border: "1px solid #eee" }}
                    >
                      <td colSpan={5}></td>

                      <td
                        colSpan={2}
                        style={{
                          color: "#1e3889",
                          fontWeight: "600",
                          textAlign: "right",
                        }}
                        className="sdisledger"
                      >
                        Total
                      </td>

                      <td></td>

                      <td>
                        <Form.Control
                          type="text"
                          name="totalqtyH"
                          onChange={handleChange}
                          value={values.total_base_amt}
                          readOnly
                          placeholder="000.00"
                        />
                      </td>
                      <td></td>
                      <td>
                        <Form.Control
                          type="text"
                          name="total_tax_amt"
                          onChange={handleChange}
                          value={values.total_tax_amt}
                          readOnly
                          placeholder="000.00"
                        />
                      </td>
                      <td
                        style={{
                          color: "#1e3889",
                          fontWeight: "600",
                          textAlign: "right",
                        }}
                      >
                        <Form.Control
                          type="text"
                          name="totalamt"
                          onChange={handleChange}
                          value={values.totalamt}
                          readOnly
                          style={{
                            textAlign: "right",
                            //paddingRight: "23px",
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <div className="summery mt-2 p-2">
                <Table size="sm" className="tbl-font ">
                  <tbody>
                    <tr
                      className="totalr_fix1"
                      style={{ border: "1px solid #eee" }}
                    >
                      <td></td>
                      <td style={{ width: "7%" }} className="sdisledger">
                        Disc Ledger :{" "}
                      </td>
                      <td style={{ width: "10%" }}>
                        {" "}
                        <Select
                          className="selectTo"
                          components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null,
                            // Menu: () => null,
                          }}
                          onChange={(v) => {
                            setFieldValue("purchase_disc_ledger", v);
                          }}
                          placeholder=""
                          styles={customStyles1}
                          isClearable
                          options={lstDisLedger}
                          borderRadius="0px"
                          colors="#729"
                          name="purchase_disc_ledger"
                        />
                      </td>

                      <td className="sdisledger" style={{ width: "5%" }}>
                        <span> Disc % : </span>
                      </td>
                      <td style={{ width: "5%" }}>
                        <span>
                          <Form.Control
                            type="text"
                            name="sales_discount"
                            onChange={(e) => {
                              // console.log("e", e.target.value);
                              this.handleAdditionalChargesSubmit(
                                e.target.value,
                                "sales_discount"
                              );
                            }}
                            value={values.sales_discount}
                            readOnly={
                              values.purchase_disc_ledger == "" ? true : false
                            }
                          />
                          {/* Cr */}
                        </span>
                      </td>
                      <td className="sdisledger" style={{ width: "6%" }}>
                        <span> Disc Amt : </span>
                      </td>
                      <td style={{ width: "5%" }}>
                        <span>
                          <Form.Control
                            type="text"
                            name="sales_discount_amt"
                            onChange={(e) => {
                              this.handleAdditionalChargesSubmit(
                                e.target.value,
                                "sales_discount_amt"
                              );
                            }}
                            value={values.sales_discount_amt}
                            readOnly={
                              values.purchase_disc_ledger == "" ? true : false
                            }
                          />
                          {/* Cr */}
                        </span>
                      </td>
                      <td></td>

                      <td className="sdisledger" style={{ width: "4%" }}>
                        TCS :{" "}
                      </td>
                      <td style={{ width: "5%" }}>
                        <span>
                          <Form.Control
                            type="text"
                            name="tcs"
                            onChange={handleChange}
                            value={values.tcs}
                          />
                          {/* Dr */}
                        </span>
                      </td>
                      <td
                        className="sdisledger"
                        style={{ width: "8%", fontWeight: "bold" }}
                      >
                        Add. Charges :
                      </td>
                      <td style={{ width: "5%" }}>
                        <span>
                          <Form.Control
                            type="text"
                            name="addch"
                            placeholder="0"
                            value={additionalChargesTotal}
                            readOnly
                          />
                          {/* Dr */}
                        </span>
                      </td>
                      <td className="addchag" style={{ width: "6%" }}>
                        <a
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ additionchargesyes: true });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-plus-square-dotted mt-1"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                          </svg>{" "}
                        </a>
                        {/* Or
                            <a href="/">&nbsp; No</a> */}
                      </td>

                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td
                        style={{ color: "#1e3889", fontWeight: "600" }}
                        className="Achargestot"
                      >
                        TOTAL
                      </td>
                      <td style={{ color: "#1e3889", fontWeight: "600" }}>
                        <Form.Control
                          type="text"
                          name="totalamt"
                          onChange={handleChange}
                          value={values.totalamt}
                          readOnly
                          style={{
                            textAlign: "right",
                            //paddingRight: "23px",
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <div className="summery mt-2 p-2">
                <Row>
                  <Col md="4">
                    <div className="summerytag">
                      <fieldset>
                        <legend>Narration</legend>
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            // rows={5}
                            // cols={25}
                            name="narration"
                            onChange={handleChange}
                            style={{ width: "auto" }}
                            className="purchace-text"
                            value={values.narration}
                            //placeholder="Narration"
                          />
                        </Form.Group>
                      </fieldset>
                    </div>
                  </Col>

                  <Col md="4">
                    <div className="summerytag  ">
                      <fieldset style={{ height: "121px" }}>
                        <legend>Tax Summary : </legend>
                        <Row>
                          <Col md="4">
                            <p>IGST</p>
                            {invoice_data &&
                              invoice_data.clientNameId &&
                              invoice_data.clientNameId.state !=
                                authenticationService.currentUserValue
                                  .state && (
                                <>
                                  {invoice_data &&
                                  invoice_data.clientNameId &&
                                  invoice_data.clientNameId.state !=
                                    authenticationService.currentUserValue.state
                                    ? taxcal.igst.length > 0 && (
                                        <Table>
                                          {/* <tr>
                                              <td
                                                style={{
                                                  background: '#f5f5f5',
                                                  textAlign: 'center',
                                                  fontWeight: 'bold',
                                                }}
                                                colspan="2"
                                              >
                                                IGST
                                              </td>
                                            </tr> */}
                                          {taxcal.igst.map((vi) => {
                                            return (
                                              <tr>
                                                <td>{vi.gst}</td>
                                                <td>
                                                  :{" "}
                                                  {vi.amt
                                                    ? parseFloat(
                                                        vi.amt
                                                      ).toFixed(2)
                                                    : parseFloat(0).toFixed(2)}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </Table>
                                      )
                                    : ""}
                                </>
                              )}
                          </Col>
                          <Col md="4">
                            <p>CGST</p>
                            {authenticationService.currentUserValue.state &&
                              invoice_data &&
                              invoice_data.clientNameId &&
                              invoice_data.clientNameId.state ==
                                authenticationService.currentUserValue
                                  .state && (
                                <>
                                  {authenticationService.currentUserValue
                                    .state &&
                                  invoice_data &&
                                  invoice_data.clientNameId &&
                                  invoice_data.clientNameId.state ==
                                    authenticationService.currentUserValue.state
                                    ? taxcal.cgst.length > 0 && (
                                        <Table>
                                          {/* <tr>
                                              <td
                                                style={{
                                                  background: '#f5f5f5',
                                                  textAlign: 'center',
                                                  fontWeight: 'bold',
                                                }}
                                                colspan="2"
                                              >
                                                CGST
                                              </td>
                                            </tr> */}
                                          {taxcal.cgst.map((vi) => {
                                            return (
                                              <tr>
                                                <td>{vi.gst}</td>
                                                <td>
                                                  :{" "}
                                                  {vi.amt
                                                    ? parseFloat(
                                                        vi.amt
                                                      ).toFixed(2)
                                                    : parseFloat(0).toFixed(2)}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </Table>
                                      )
                                    : ""}
                                </>
                              )}
                          </Col>
                          <Col md="4">
                            <p>SGST</p>
                            {authenticationService.currentUserValue.state &&
                              invoice_data &&
                              invoice_data.clientNameId &&
                              invoice_data.clientNameId.state ==
                                authenticationService.currentUserValue
                                  .state && (
                                <>
                                  {authenticationService.currentUserValue
                                    .state &&
                                    invoice_data &&
                                    invoice_data.clientNameId &&
                                    invoice_data.clientNameId.state ==
                                      authenticationService.currentUserValue
                                        .state &&
                                    taxcal.sgst.length > 0 && (
                                      <Table>
                                        {/* <tr>
                                            <td
                                              style={{
                                                background: '#f5f5f5',
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                              }}
                                              colspan="2"
                                            >
                                              SGST
                                            </td>
                                          </tr> */}
                                        {taxcal.sgst.map((vi) => {
                                          return (
                                            <tr>
                                              <td>{vi.gst}</td>
                                              <td>
                                                :{" "}
                                                {vi.amt
                                                  ? parseFloat(vi.amt).toFixed(
                                                      2
                                                    )
                                                  : parseFloat(0).toFixed(2)}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </Table>
                                    )}
                                </>
                              )}
                          </Col>
                          <Col md="6"></Col>
                        </Row>
                      </fieldset>
                    </div>
                  </Col>

                  <Col md="2">
                    <div className="summerytag ">
                      <fieldset>
                        <legend>Calculations : </legend>
                        <br />
                        <ul className="summerytot pl-3">
                          <li>
                            <h4>Total Base Amt</h4>:{" "}
                            {parseFloat(values.total_base_amt).toFixed(2)}
                          </li>
                          <li>
                            <h4>Taxable Amt</h4>:
                            <span>
                              {" "}
                              {parseFloat(values.total_taxable_amt).toFixed(2)}
                            </span>
                          </li>
                          <li>
                            <h4>Tax Amt</h4>:{" "}
                            {parseFloat(values.total_tax_amt).toFixed(2)}
                          </li>
                          <li>
                            <h4>Final Amt</h4>:{" "}
                            {parseFloat(values.totalamt).toFixed(2)}
                          </li>
                        </ul>
                      </fieldset>
                    </div>
                  </Col>

                  <Col md="2" className="text-center">
                    <ButtonGroup className="pt-4">
                      <Button className="submit-btn mt-2" type="submit">
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn"
                        className="mt-2"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();

                          eventBus.dispatch("page_change", {
                            from: "tranx_sales_order_create",
                            to: "tranx_sales_order_list",
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
            </Form>
          )}
        </Formik>

        <Modal
          show={invoiceedit}
          size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ invoiceedit: false })}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Sales Order
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal ">
            <div className="purchasescreen">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={invoice_data}
                validationSchema={Yup.object().shape({
                  sales_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  salesAccId: Yup.object().required("select sales account"),
                  bill_no: Yup.string().trim().required("bill no is required"),
                  bill_dt: Yup.string().required("Bill dt is required"),
                  // clientCodeId: Yup.object().required("select client code"),
                  clientNameId: Yup.object().required("select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // console.log('values', values);
                  this.setState({
                    invoice_data: values,
                    invoiceedit: false,
                  });
                  // this.props.history.push({
                  //   pathname: '/SalesInvoiceCreate',
                  //   state: values,
                  // });
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
                  <Form onSubmit={handleSubmit} noValidate>
                    <Row>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Order Sr. #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="sales_sr_no"
                            id="sales_sr_no"
                            onChange={handleChange}
                            value={values.sales_sr_no}
                            isValid={touched.sales_sr_no && !errors.sales_sr_no}
                            isInvalid={!!errors.sales_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.sales_sr_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      {/* <Col md="3">
                        <Form.Group>
                          <Form.Label>
                            Transaction Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            className="pl-2"
                            name="transaction_dt"
                            id="transaction_dt"
                            onChange={handleChange}
                            value={values.transaction_dt}
                            isValid={
                              touched.transaction_dt && !errors.transaction_dt
                            }
                            isInvalid={!!errors.transaction_dt}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col> */}

                      <Col md="3">
                        <Form.Group>
                          <Form.Label>
                            Order #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Bill No."
                            name="bill_no"
                            id="bill_no"
                            onChange={handleChange}
                            value={values.bill_no}
                            isValid={touched.bill_no && !errors.bill_no}
                            isInvalid={!!errors.bill_no}
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.bill_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="3">
                        <Form.Group>
                          <Form.Label>
                            Order Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>

                          <MyDatePicker
                            name="bill_dt"
                            id="bill_dt"
                            className="date-style"
                            // dateFormat="dd-MM-yyyy"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("bill_dt", date);
                            }}
                            selected={values.bill_dt}
                          />

                          <span className="text-danger errormsg">
                            {errors.bill_dt}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="4">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Sales A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={salesAccLst}
                            borderRadius="0px"
                            colors="#729"
                            name="salesAccId"
                            onChange={(v) => {
                              setFieldValue("salesAccId", v);
                            }}
                            value={values.salesAccId}
                          />

                          <span className="text-danger errormsg">
                            {errors.salesAccId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="5">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Client Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="clientNameId"
                            onChange={(v) => {
                              setFieldValue("clientNameId", v);
                            }}
                            value={values.clientNameId}
                          />

                          <span className="text-danger errormsg">
                            {errors.clientNameId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="7" className="btn_align mt-4">
                        <Button className="createbtn mt-2" type="submit">
                          Submit
                        </Button>
                        {/* <Button className="alterbtn">Alter</Button> */}
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </Modal.Body>
        </Modal>
        {/* serial no start */}
        <Modal
          show={serialnopopupwindow}
          size="sm"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ serialnopopupwindow: false })}
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Serial No.
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="purchaseumodal p-3">
            <div className="purchasescreen">
              <Form className="serailnoscreoolbar">
                <Table className="serialnotbl">
                  <thead>
                    <tr>
                      <th>#.</th>
                      <th>Serial No.</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderSerialNo()}</tbody>
                </Table>
              </Form>
            </div>
          </Modal.Body>

          <Modal.Footer className="p-1">
            <Button
              className="createbtn seriailnobtn"
              onClick={(e) => {
                e.preventDefault();
                this.handleSerialNoSubmit();
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        {/* additional charges */}
        <Modal
          show={additionchargesyes}
          // size="sm"
          className="mt-5 mainmodal"
          onHide={() => this.handleAdditionalChargesSubmit()}
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Additional Charges
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="purchaseumodal p-2">
            <div className="purchasescreen">
              {additionalCharges.length > 0 && (
                <Table className="serialnotbl additionachargestbl table-bordered">
                  <thead>
                    <tr>
                      <th>#.</th>
                      <th>Ledger</th>
                      <th>Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additionalCharges.map((v, i) => {
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          <td style={{ width: "75%" }}>
                            <Select
                              className="selectTo"
                              components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                              }}
                              placeholder=""
                              styles={customStyles}
                              isClearable
                              options={lstAdditionalLedger}
                              borderRadius="0px"
                              colors="#729"
                              onChange={(value) => {
                                this.handleAdditionalCharges(
                                  "ledgerId",
                                  i,
                                  value
                                );
                              }}
                              value={this.setAdditionalCharges("ledgerId", i)}
                            />
                          </td>
                          <td className="additionamt pr-5 pl-1">
                            <Form.Control
                              type="text"
                              placeholder=""
                              className="mt-1"
                              onChange={(value) => {
                                this.handleAdditionalCharges(
                                  "amt",
                                  i,
                                  value.target.value
                                );
                              }}
                              value={this.setAdditionalCharges("amt", i)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td
                        colSpan={2}
                        style={{ textAlign: "right" }}
                        className="Achargestot"
                      >
                        TOTAL{" "}
                      </td>
                      <td clasName="additionamt pr-5 pl-1">
                        <Form.Control
                          type="text"
                          placeholder=""
                          // onChange={(value) => {
                          //   console.log(value);
                          // }}
                          readOnly
                          value={additionalChargesTotal}
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer className="p-0">
            <Button
              className="createbtn seriailnobtn"
              onClick={(e) => {
                e.preventDefault();

                this.handleAdditionalChargesSubmit();
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={Clietdetailmodal}
          size="sm"
          className="mt-5 mainmodal"
          onHide={() => {
            this.handleClientDetails(false);
          }}
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Client Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-2">
            <div className="purchasescreen">
              {clientinfo && (
                <Table bordered>
                  <thead>
                    <th> Name </th>
                    <th>Address </th>
                    <th>Contact No </th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {clientinfo &&
                          clientinfo.data &&
                          clientinfo.data.sundry_debtors_name}
                      </td>
                      <td>
                        {clientinfo &&
                          clientinfo.data &&
                          clientinfo.data.address}
                      </td>
                      <td>
                        {clientinfo &&
                          clientinfo.data &&
                          clientinfo.data.mobile}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer className="p-1">
            <Button
              //className="createbtn seriailnobtn"
              onClick={() => {
                this.handleClientDetails(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <TransactionModal
          transaction_mdl_show={transaction_mdl_show}
          handleTranxModal={this.handleTranxModal.bind(this)}
          transaction_detail_index={transaction_detail_index}
          lstPackages={lstPackages}
          rows={rows}
          handleRowChange={this.handleRowChange.bind(this)}
        />
      </div>
    );
  }
}
