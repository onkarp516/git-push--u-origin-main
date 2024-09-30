import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  ButtonGroup,
  Modal,
  InputGroup,
  FormControl,
  Collapse,
} from "react-bootstrap";
import { Formik } from "formik";
// import '../../assets/scss/style.scss';
import * as Yup from "yup";

import moment from "moment";
import Select from "react-select";
import {
  getProduct,
  getCounterSalesWithId,
  updateCounterSales,
  getSundryDebtors,
  getProductPackageList,
} from "@/services/api_functions";
import TransactionModal from "../../Components/TransactionModal";

import {
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  customStyles,
  eventBus,
} from "@/helpers";

const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 26,
    minHeight: 26,
    border: "none",
    padding: "0 6px",
    boxShadow: "none",
    //lineHeight: "10",
    background: "transparent",
  }),
};

export default class CounterSaleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      opendiv: false,
      hidediv: false,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      invoiceedit: false,
      createproductmodal: false,
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
      counter_sales_data: {
        id: 1,
        counter_sales_no: 1,
        transaction_dt: moment().format("YYYY-MM-DD"),
        customer_name: "",
        customer_mobile: "",
      },
      prop_data: "",
      isEditDataSet: false,
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
  lstProduct = () => {
    getProduct()
      .then((response) => {
        // console.log("res", response);
        let res = response.data;
        let opt = res.responseObject.map((v) => {
          let unitOpt = v.units.map((vi) => {
            return { label: vi.unitCode, value: vi.id };
          });
          return {
            label: v.productName,
            value: v.id,
            igst: v.igst,
            hsnId: v.hsnId,
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
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  /**
   * @description Initialize Product Row
   */
  initRow = (len = null) => {
    let lst = [];
    let condition = 10;
    if (len != null) {
      condition = len;
    }
    for (let index = 0; index < condition; index++) {
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
        isDisabled: false,
      };
      lst.push(data);
    }
    if (len != null) {
      let Initrows = [...this.state.rows, ...lst];
      this.setState({ rows: Initrows });
    } else {
      this.setState({ rows: lst });
    }
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

  setBillEditData = () => {
    const { prop_data } = this.state;
    let reqData = new FormData();
    reqData.append("counter_sales_id", prop_data);
    getCounterSalesWithId(reqData)
      .then((response) => {
        console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.data;
          let rdata = data.productList;
          const { productLst } = this.state;
          let initRowData = [];
          if (rdata.length > 0) {
            rdata.map((v) => {
              let productId = getSelectValue(productLst, v.product_id);
              let inner_data = {
                details_id: v.id ? v.id : 0,
                productId: productId,
                unitId: "",
                qtyH: v.qtyH > 0 ? v.qtyH : "",
                qtyM: v.qtyM > 0 ? v.qtyM : "",
                qtyL: v.qtyL > 0 ? v.qtyL : "",
                rateH: v.rateH > 0 ? v.rateH : "",
                rateM: v.rateM > 0 ? v.rateM : "",
                rateL: v.rateL > 0 ? v.rateL : "",
                base_amt_H: v.base_amt_H > 0 ? v.base_amt_H : "",
                base_amt_M: v.base_amt_M > 0 ? v.base_amt_M : "",
                base_amt_L: v.base_amt_L > 0 ? v.base_amt_L : "",
                base_amt: v.base_amt > 0 ? v.base_amt : "",
                dis_amt: v.dis_amt > 0 ? v.dis_amt : "",
                dis_per: v.dis_per > 0 ? v.dis_per : "",
                dis_per_cal: "",
                dis_amt_cal: "",
                total_amt: "",
                gst: productId.igst ? productId.igst : 0,
                igst: productId.igst ? productId.igst : 0,
                cgst: productId.cgst ? productId.cgst : 0,
                sgst: productId.sgst ? productId.sgst : 0,
                total_igst: "",
                total_cgst: "",
                total_sgst: "",
                final_amt: "",
                serialNo: [],
                discount_proportional_cal: 0,
                additional_charges_proportional_cal: 0,
                isDisabled: true,
              };
              initRowData.push(inner_data);
            });
          }
          this.setState(
            {
              counter_sales_data: data.counter_sales_data,
              isEditDataSet: true,
              rows: initRowData,
            },
            () => {
              this.handleAdditionalChargesSubmit();
            }
          );
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

  componentDidMount() {
    this.lstSundrydebtors();
    this.lstProduct();
    this.initRow();

    console.log("this.props.", this.props);
    let counter_sales_data = this.props.block.prop_data;

    console.log({ counter_sales_data });
    this.setState({ prop_data: counter_sales_data });
  }
  componentDidUpdate() {
    const { productLst, isEditDataSet } = this.state;
    console.log({
      productLst,
      isEditDataSet,
    });
    if (productLst.length > 0 && isEditDataSet == false) {
      console.log("componentDidUpdate call");
      this.setBillEditData();
    }

    // const { prop_data, isEditDataSet } = this.state;
    // if (isEditDataSet == false && prop_data != '') {
    //   this.setBillEditData();
    // }
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
      if (type == "purchase_discount") {
        this.myRef.current.setFieldValue(
          "purchase_discount",
          discamtval != "" ? discamtval : 0
        );
      } else {
        this.myRef.current.setFieldValue(
          "purchase_discount_amt",
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

        v["base_amt"] = baseamt;

        v["total_amt"] = isNaN(parseFloat(v["base_amt"]))
          ? 0
          : parseFloat(v["base_amt"]);
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
      // console.log("vvvvvv============------------>", { v });
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
          if (type == "purchase_discount") {
            // console.log("values", this.myRef.current.values);
            // this.myRef.current.setFieldValue("purchase_discount", discamtval);

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
            this.myRef.current.values.purchase_discount > 0 &&
            this.myRef.current.values.purchase_discount != ""
          ) {
            let peramt = calculatePercentage(
              totalamt,
              this.myRef.current.values.purchase_discount,
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
            this.myRef.current.values.purchase_discount_amt > 0 &&
            this.myRef.current.values.purchase_discount_amt != ""
          ) {
            v["total_amt"] =
              v["total_amt"] -
              calculatePrValue(
                totalamt,
                this.myRef.current.values.purchase_discount_amt,
                v["total_amt"]
              );
            v["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              this.myRef.current.values.purchase_discount_amt,
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
        v["total_amt"] = isNaN(v["total_amt"]) ? 0 : v["total_amt"];
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
    let total_purchase_discount_amt = 0;

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
        // v["total_igst"] = parseFloat(
        //   calculatePercentage(v["total_amt"], v["productId"]["igst"])
        // ).toFixed(2);
        // v["total_cgst"] = parseFloat(
        //   calculatePercentage(v["total_amt"], v["productId"]["cgst"])
        // ).toFixed(2);
        // v["total_sgst"] = parseFloat(
        //   calculatePercentage(v["total_amt"], v["productId"]["sgst"])
        // ).toFixed(2);

        v["total_igst"] = parseFloat(0).toFixed(2);
        v["total_cgst"] = parseFloat(0).toFixed(2);
        v["total_sgst"] = parseFloat(0).toFixed(2);

        v["final_amt"] = parseFloat(
          parseFloat(v["total_amt"]) + parseFloat(v["total_igst"])
        ).toFixed(2);
        totalqtyH += parseInt(v["qtyH"] != "" ? v["qtyH"] : 0);
        totalqtyM += parseInt(v["qtyM"] != "" ? v["qtyM"] : 0);
        totalqtyL += parseInt(v["qtyL"] != "" ? v["qtyL"] : 0);
        totaligstamt += parseFloat(v["total_igst"]).toFixed(2);
        totalcgstamt += parseFloat(v["total_cgst"]).toFixed(2);
        totalsgstamt += parseFloat(v["total_sgst"]).toFixed(2);
        total_purchase_discount_amt =
          parseFloat(total_purchase_discount_amt) +
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
        /*if (v.productId != "") {
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
        }*/
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
      "total_purchase_discount_amt",
      parseFloat(total_purchase_discount_amt).toFixed(2)
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
    this.setState(
      { rows: frow, additionchargesyes: false, taxcal: taxState },
      () => {
        if (this.state.rows.length != 10) {
          this.initRow(10 - this.state.rows.length);
        }
      }
    );
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
        v["total_amt"] = baseamt;

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
          this.myRef.current.values.purchase_discount > 0 &&
          this.myRef.current.values.purchase_discount != ""
        ) {
          let peramt = calculatePercentage(
            totalamt,
            this.myRef.current.values.purchase_discount,
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
          this.myRef.current.values.purchase_discount_amt > 0 &&
          this.myRef.current.values.purchase_discount_amt != ""
        ) {
          v["total_amt"] =
            parseFloat(v["total_amt"]) -
            calculatePrValue(
              totalamt,
              this.myRef.current.values.purchase_discount_amt,
              v["total_amt"]
            );
          v["discount_proportional_cal"] = parseFloat(
            calculatePrValue(
              totalamt,
              this.myRef.current.values.purchase_discount_amt,
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
    let total_purchase_discount_amt = 0;

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
        total_purchase_discount_amt =
          parseFloat(total_purchase_discount_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(v["additional_charges_proportional_cal"]);
        // ! Tax Indidual gst % calculation
        // if (v.productId != "") {
        //   if (v.productId.igst > 0) {
        //     if (taxIgst.length > 0) {
        //       let innerIgstTax = taxIgst.find(
        //         (vi) => vi.gst == v.productId.igst
        //       );
        //       if (innerIgstTax != undefined) {
        //         let innerIgstCal = taxIgst.filter((vi) => {
        //           if (vi.gst == v.productId.igst) {
        //             vi["amt"] =
        //               parseFloat(vi["amt"]) + parseFloat(v["total_igst"]);
        //           }
        //           return vi;
        //         });
        //         taxIgst = [...innerIgstCal];
        //       } else {
        //         let innerIgstCal = {
        //           gst: v.productId.igst,
        //           amt: parseFloat(v.total_igst),
        //         };
        //         taxIgst = [...taxIgst, innerIgstCal];
        //       }
        //     } else {
        //       let innerIgstCal = {
        //         gst: v.productId.igst,
        //         amt: parseFloat(v.total_igst),
        //       };
        //       taxIgst = [...taxIgst, innerIgstCal];
        //     }
        //   }
        //   if (v.productId.cgst > 0) {
        //     if (taxCgst.length > 0) {
        //       let innerCgstTax = taxCgst.find(
        //         (vi) => vi.gst == v.productId.cgst
        //       );
        //       if (innerCgstTax != undefined) {
        //         let innerCgstCal = taxCgst.filter((vi) => {
        //           if (vi.gst == v.productId.cgst) {
        //             vi["amt"] =
        //               parseFloat(vi["amt"]) + parseFloat(v["total_cgst"]);
        //           }
        //           return vi;
        //         });
        //         taxCgst = [...innerCgstCal];
        //       } else {
        //         let innerCgstCal = {
        //           gst: v.productId.cgst,
        //           amt: parseFloat(v.total_cgst),
        //         };
        //         taxCgst = [...taxCgst, innerCgstCal];
        //       }
        //     } else {
        //       let innerCgstCal = {
        //         gst: v.productId.cgst,
        //         amt: parseFloat(v.total_cgst),
        //       };
        //       taxCgst = [...taxCgst, innerCgstCal];
        //     }
        //   }
        //   if (v.productId.sgst > 0) {
        //     if (taxSgst.length > 0) {
        //       let innerCgstTax = taxSgst.find(
        //         (vi) => vi.gst == v.productId.sgst
        //       );
        //       if (innerCgstTax != undefined) {
        //         let innerCgstCal = taxSgst.filter((vi) => {
        //           if (vi.gst == v.productId.sgst) {
        //             vi["amt"] =
        //               parseFloat(vi["amt"]) + parseFloat(v["total_sgst"]);
        //           }
        //           return vi;
        //         });
        //         taxSgst = [...innerCgstCal];
        //       } else {
        //         let innerCgstCal = {
        //           gst: v.productId.sgst,
        //           amt: parseFloat(v.total_sgst),
        //         };
        //         taxSgst = [...taxSgst, innerCgstCal];
        //       }
        //     } else {
        //       let innerCgstCal = {
        //         gst: v.productId.sgst,
        //         amt: parseFloat(v.total_sgst),
        //       };
        //       taxSgst = [...taxSgst, innerCgstCal];
        //     }
        //   }
        // }
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
      "total_purchase_discount_amt",
      parseFloat(total_purchase_discount_amt).toFixed(2)
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
      counter_sales_data,
      invoiceedit,
      opendiv,
      hidediv,
      createproductmodal,
      purchaseAccLst,
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
      taxcal,
      transaction_mdl_show,
      transaction_detail_index,
      lstPackages,
    } = this.state;
    return (
      <div className="">
        <div className="dashboardpg institutepg">
          {/* <h6>Purchase Invoice</h6> */}
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
              purchase_discount: 0,
              purchase_discount_amt: 0,
              total_purchase_discount_amt: 0,
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
              if (counter_sales_data.counter_sales_no != "") {
                requestData.append(
                  "counter_sales_no",
                  counter_sales_data.counter_sales_no
                );
              }
              if (counter_sales_data.transaction_dt != "") {
                requestData.append(
                  "transaction_dt",
                  counter_sales_data.transaction_dt
                );
              }
              if (counter_sales_data.customer_name != "") {
                requestData.append(
                  "customer_name",
                  counter_sales_data.customer_name
                );
              }
              if (counter_sales_data.customer_mobile != "") {
                requestData.append(
                  "customer_mobile",
                  counter_sales_data.customer_mobile
                );
              }

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

              let frow = this.state.rows.map((v, i) => {
                let funits = v.units.filter((vi) => {
                  vi["unit_id"] = vi.unitId ? vi.unitId.value : "";
                  return vi;
                });
                if (v.productId != "") {
                  return {
                    details_id: v.details_id ? v.details_id : 0,
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
                    total_amt: v.total_amt,
                    igst: v.igst,
                    cgst: v.cgst,
                    sgst: v.sgst,
                    total_igst: v.total_igst,
                    total_cgst: v.total_cgst,
                    total_sgst: v.total_sgst,
                    final_amt: v.final_amt,
                    serialNo: v.serialNo,
                    discount_proportional_cal: v.discount_proportional_cal,
                    additional_charges_proportional_cal:
                      v.additional_charges_proportional_cal,
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

              // List key/value pairs
              // for (let [name, value] of requestData) {
              //   console.log(`${name} => ${value}`); // key1 = value1, then key2 = value2
              // }
              updateCounterSales(requestData)
                .then((response) => {
                  let res = response.data;
                  if (res.responseStatus == 201) {
                    ShowNotification("Success", res.message);
                    resetForm();
                    this.initRow();
                    setTimeout(() => {
                      this.props.history.push("/Counter_Sale");
                    }, 1200);
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
              handleSubmit,
              isSubmitting,
              resetForm,
              setFieldValue,
            }) => (
              <Form
                onSubmit={handleSubmit}
                noValidate
                className="new_trnx_design"
              >
                <div className="d-bg i-bg" style={{ height: "900px" }}>
                  <div className="institute-head pt-2 pl-2 pr-2 pb-0">
                    <Collapse in={opendiv}>
                      <div
                        id="example-collapse-text"
                        className="p-invoice-modal create_box"
                      >
                        <div className="institute-head m-0 mb-2 purchasescreen">
                          <Formik
                            validateOnChange={false}
                            validateOnBlur={false}
                            initialValues={counter_sales_data}
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
                            onSubmit={(
                              values,
                              { setSubmitting, resetForm }
                            ) => {
                              // console.log("values", values);
                              this.setState({
                                counter_sales_data: values,
                                invoiceedit: false,
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
                              <Form onSubmit={handleSubmit} noValidate>
                                <Row>
                                  <Col md="2">
                                    <Form.Group>
                                      <Form.Label>Bill #.</Form.Label>
                                      <Form.Control
                                        type="text"
                                        className="pl-2"
                                        placeholder=" "
                                        name="counter_sales_no"
                                        id="counter_sales_no"
                                        onChange={handleChange}
                                        value={values.counter_sales_no}
                                        isValid={
                                          touched.counter_sales_no &&
                                          !errors.counter_sales_no
                                        }
                                        isInvalid={!!errors.counter_sales_no}
                                        readOnly={true}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.counter_sales_no}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col md="3">
                                    <Form.Group>
                                      <Form.Label>Bill Date</Form.Label>
                                      <Form.Control
                                        type="date"
                                        className="pl-2"
                                        name="transaction_dt"
                                        id="transaction_dt"
                                        onChange={handleChange}
                                        value={values.transaction_dt}
                                        isValid={
                                          touched.transaction_dt &&
                                          !errors.transaction_dt
                                        }
                                        isInvalid={!!errors.transaction_dt}
                                        readOnly={true}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.transaction_dt}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>

                                  <Col md="4">
                                    <Form.Group>
                                      <Form.Label>Customer Name</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Customer Name"
                                        name="customer_name"
                                        id="customer_name"
                                        onChange={handleChange}
                                        value={values.customer_name}
                                        isValid={
                                          touched.customer_name &&
                                          !errors.customer_name
                                        }
                                        isInvalid={!!errors.customer_name}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.customer_name}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col md="3">
                                    <Form.Group>
                                      <Form.Label>Mobile No.</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Mobile No."
                                        name="customer_mobile"
                                        id="customer_mobile"
                                        onChange={handleChange}
                                        value={values.customer_mobile}
                                        isValid={
                                          touched.customer_mobile &&
                                          !errors.customer_mobile
                                        }
                                        isInvalid={!!errors.customer_mobile}
                                        maxLength={10}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.customer_mobile}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col md="12" className="btn_align mt-2">
                                    <Button className="createbtn" type="submit">
                                      Submit
                                    </Button>
                                    <Button
                                      className="ml-2 mt-2 alterbtn"
                                      type="submit"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        // this.po_ref.current.resetForm();
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
                      <Row>
                        <Col md="9">
                          <div className="p-2 supplie-det">
                            <ul>
                              <li>
                                <h6>Bill No. #. </h6>:{" "}
                                <span>
                                  {counter_sales_data
                                    ? counter_sales_data.counter_sales_no
                                    : ""}
                                </span>
                              </li>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <li>
                                <h6>Bill Date </h6>:{" "}
                                <span>
                                  {counter_sales_data
                                    ? moment(
                                        counter_sales_data.transaction_dt
                                      ).format("DD-MM-YYYY")
                                    : ""}
                                </span>
                              </li>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <li>
                                <h6>Customer Name </h6>:{" "}
                                <span>
                                  {counter_sales_data
                                    ? counter_sales_data.customer_name
                                    : ""}
                                </span>
                              </li>
                              <li className="pull-right editpencil">
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
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-pencil"
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
                    )}
                  </div>

                  <div className="institutetbl p-2">
                    <div className="table_wrapper3">
                      <Table
                        size="sm"
                        className="key mb-0 purchacetbl"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>#.</th>
                            <th>Particulars</th>
                            <th>Qty</th>
                            {/* <th style={{ width: "5%" }}>Qty</th> */}
                            <th>Rate</th>
                            {/* <th>Base Amt</th> */}
                            {/* <th>Dis Amt</th>
                          <th>Dis %</th> */}
                            <th>Total Amt</th>
                            {/* <th>GST %</th>
                          <th>Tax Amt</th>
                          <th>Final Amt</th> */}
                          </tr>
                          <tr className="unithead">
                            <td></td>
                            <td className="pt-0 pb-0">
                              <a
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({ createproductmodal: true });
                                }}
                                href="#."
                                className="createprdct"
                              >
                                Create Product
                              </a>
                            </td>
                            <td>
                              <tr>
                                <td>
                                  <Form.Control
                                    type="text"
                                    placeholder="H"
                                    readonly
                                    style={{ background: "#fff" }}
                                  />
                                </td>
                                <td>
                                  <Form.Control
                                    type="text"
                                    placeholder="M"
                                    readonly
                                    style={{ background: "#fff" }}
                                  />
                                </td>
                                <td>
                                  {" "}
                                  <Form.Control
                                    type="text"
                                    placeholder="L"
                                    readonly
                                    style={{ background: "#fff" }}
                                  />
                                </td>
                              </tr>
                            </td>
                            {/* <td></td> */}
                            <td>
                              <tr>
                                <td>
                                  <Form.Control
                                    type="text"
                                    placeholder="H"
                                    readonly
                                    style={{ background: "#fff" }}
                                  />
                                </td>
                                <td>
                                  {" "}
                                  <Form.Control
                                    type="text"
                                    placeholder="M"
                                    readonly
                                    style={{ background: "#fff" }}
                                  />
                                </td>
                                <td>
                                  {" "}
                                  <Form.Control
                                    type="text"
                                    placeholder="L"
                                    readonly
                                    style={{ background: "#fff" }}
                                  />
                                </td>
                              </tr>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((v, i) => {
                            return (
                              <tr className="entryrow">
                                <td style={{ width: "2%" }}>{i + 1}</td>
                                <td
                                  style={{
                                    width: "40%",
                                    background: "#f5f5f5",
                                  }}
                                >
                                  <Select
                                    className="selectTo"
                                    components={{
                                      DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    placeholder=""
                                    styles={customStyles1}
                                    isClearable
                                    options={productLst}
                                    borderRadius="0px"
                                    colors="#729"
                                    onChange={(value, triggeredAction) => {
                                      if (triggeredAction.action === "clear") {
                                        this.handleClearProduct(i);
                                      } else {
                                        this.handleChangeArrayElement(
                                          "productId",
                                          value,
                                          i,
                                          setFieldValue
                                        );
                                      }
                                    }}
                                    value={this.setElementValue("productId", i)}
                                  />
                                </td>
                                <td>
                                  <tr>
                                    <td>
                                      {" "}
                                      <Form.Control
                                        type="text"
                                        placeholder={this.handlePlaceHolder(
                                          this.setElementValue("productId", i),
                                          "qtyH"
                                        )}
                                        className="unitreadonly"
                                        onChange={(value) => {
                                          this.handleChangeArrayElement(
                                            "qtyH",
                                            value.target.value,
                                            i,
                                            setFieldValue
                                          );
                                        }}
                                        value={this.setElementValue("qtyH", i)}
                                        readOnly={
                                          this.handleUnitLstOptLength(
                                            this.setElementValue("productId", i)
                                          ) > 0
                                            ? false
                                            : true
                                        }
                                        maxLength={4}
                                        // onBlur={this.handleSerialNoQty(
                                        //   this.setElementValue("productId", i),
                                        //   i
                                        // )}
                                      />
                                    </td>
                                    <td>
                                      {" "}
                                      <Form.Control
                                        type="text"
                                        placeholder={this.handlePlaceHolder(
                                          this.setElementValue("productId", i),
                                          "qtyM"
                                        )}
                                        className="unitreadonly"
                                        onChange={(value) => {
                                          this.handleChangeArrayElement(
                                            "qtyM",
                                            value.target.value,
                                            i,
                                            setFieldValue
                                          );
                                        }}
                                        value={this.setElementValue("qtyM", i)}
                                        readOnly={
                                          this.handleUnitLstOptLength(
                                            this.setElementValue("productId", i)
                                          ) > 1
                                            ? false
                                            : true
                                        }
                                        maxLength={4}
                                      />
                                    </td>
                                    <td>
                                      {" "}
                                      <Form.Control
                                        type="text"
                                        placeholder={this.handlePlaceHolder(
                                          this.setElementValue("productId", i),
                                          "qtyL"
                                        )}
                                        className="unitreadonly"
                                        onChange={(value) => {
                                          this.handleChangeArrayElement(
                                            "qtyL",
                                            value.target.value,
                                            i,
                                            setFieldValue
                                          );
                                        }}
                                        value={this.setElementValue("qtyL", i)}
                                        readOnly={
                                          this.handleUnitLstOptLength(
                                            this.setElementValue("productId", i)
                                          ) > 2
                                            ? false
                                            : true
                                        }
                                        maxLength={4}
                                      />
                                    </td>
                                  </tr>
                                </td>
                                <td>
                                  <tr>
                                    <td>
                                      <Form.Control
                                        type="text"
                                        placeholder={this.handlePlaceHolder(
                                          this.setElementValue("productId", i),
                                          "rateH"
                                        )}
                                        className="unitreadonly"
                                        onChange={(value) => {
                                          this.handleChangeArrayElement(
                                            "rateH",
                                            value.target.value,
                                            i,
                                            setFieldValue
                                          );
                                        }}
                                        value={this.setElementValue("rateH", i)}
                                        readOnly={
                                          this.handleUnitLstOptLength(
                                            this.setElementValue("productId", i)
                                          ) > 0
                                            ? false
                                            : true
                                        }
                                        maxLength={6}
                                      />
                                    </td>
                                    <td>
                                      {" "}
                                      <Form.Control
                                        type="text"
                                        placeholder={this.handlePlaceHolder(
                                          this.setElementValue("productId", i),
                                          "rateM"
                                        )}
                                        className="unitreadonly"
                                        onChange={(value) => {
                                          this.handleChangeArrayElement(
                                            "rateM",
                                            value.target.value,
                                            i,
                                            setFieldValue
                                          );
                                        }}
                                        value={this.setElementValue("rateM", i)}
                                        readOnly={
                                          this.handleUnitLstOptLength(
                                            this.setElementValue("productId", i)
                                          ) > 1
                                            ? false
                                            : true
                                        }
                                        maxLength={6}
                                      />
                                    </td>
                                    <td>
                                      {" "}
                                      <Form.Control
                                        type="text"
                                        placeholder={this.handlePlaceHolder(
                                          this.setElementValue("productId", i),
                                          "rateL"
                                        )}
                                        className="unitreadonly"
                                        onChange={(value) => {
                                          this.handleChangeArrayElement(
                                            "rateL",
                                            value.target.value,
                                            i,
                                            setFieldValue
                                          );
                                        }}
                                        value={this.setElementValue("rateL", i)}
                                        readOnly={
                                          this.handleUnitLstOptLength(
                                            this.setElementValue("productId", i)
                                          ) > 2
                                            ? false
                                            : true
                                        }
                                        maxLength={6}
                                      />
                                    </td>
                                  </tr>
                                </td>

                                {/* <td>
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  onChange={(value) => {
                                    this.handleChangeArrayElement(
                                      "dis_amt",
                                      value.target.value,
                                      i,
                                      setFieldValue
                                    );
                                  }}
                                  value={this.setElementValue("dis_amt", i)}
                                />
                              </td>
                              <td style={{ width: "4%" }}>
                                <Form.Control
                                  type="text"
                                  onChange={(value) => {
                                    this.handleChangeArrayElement(
                                      "dis_per",
                                      value.target.value,
                                      i,
                                      setFieldValue
                                    );
                                  }}
                                  value={this.setElementValue("dis_per", i)}
                                />
                              </td> */}
                                <td>
                                  <Form.Control
                                    type="text"
                                    placeholder=""
                                    onChange={(value) => {
                                      this.handleChangeArrayElement(
                                        "total_amt",
                                        value.target.value,
                                        i,
                                        setFieldValue
                                      );
                                    }}
                                    style={{
                                      textAlign: "right",
                                      paddingRight: "23px",
                                    }}
                                    value={this.setElementValue("total_amt", i)}
                                  />
                                </td>
                                {/* <td style={{ width: "4%" }}>
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  className="gstreadonly"
                                  onChange={(value) => {
                                    this.handleChangeArrayElement(
                                      "gst",
                                      value.target.value,
                                      i,
                                      setFieldValue
                                    );
                                  }}
                                  value={this.setElementValue("gst", i)}
                                  readOnly
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  className="gstreadonly"
                                  onChange={(value) => {
                                    this.handleChangeArrayElement(
                                      "total_igst",
                                      value.target.value,
                                      i,
                                      setFieldValue
                                    );
                                  }}
                                  value={this.setElementValue("total_igst", i)}
                                  readOnly
                                  style={{
                                    textAlign: "right",
                                    paddingRight: "23px",
                                  }}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  style={{
                                    textAlign: "right",
                                    //paddingRight: "23px",
                                  }}
                                  className="gstreadonly"
                                  onChange={(value) => {
                                    this.handleChangeArrayElement(
                                      "final_amt",
                                      value.target.value,
                                      i,
                                      setFieldValue
                                    );
                                  }}
                                  value={this.setElementValue("final_amt", i)}
                                />
                              </td>
                            </tr> */}
                              </tr>
                            );
                          })}

                          <tr
                            className="totalr_fix"
                            style={{ background: "#f5f5f5" }}
                          >
                            <td></td>

                            <td
                              style={{ background: "#eee", textAlign: "right" }}
                            >
                              Total Qty
                            </td>
                            <tr>
                              <td style={{ background: "#eee" }}>
                                <Form.Control
                                  type="text"
                                  name="totalqtyH"
                                  onChange={handleChange}
                                  value={values.totalqtyH}
                                  readOnly
                                />
                              </td>
                              <td style={{ background: "#eee" }}>
                                <Form.Control
                                  type="text"
                                  name="totalqtyM"
                                  onChange={handleChange}
                                  value={values.totalqtyM}
                                  readOnly
                                />
                              </td>
                              <td style={{ background: "#eee" }}>
                                <Form.Control
                                  type="text"
                                  name="totalqtyL"
                                  onChange={handleChange}
                                  value={values.totalqtyL}
                                  readOnly
                                />
                              </td>
                            </tr>
                            {/* <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td> */}
                            {/* <td></td>
                          <td></td> */}
                            <td
                              style={{ background: "#eee", textAlign: "right" }}
                            >
                              Round Off&nbsp;
                            </td>
                            <td style={{ background: "#eee" }}>
                              <Form.Control
                                type="text"
                                name="roundoff"
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
                            className="total_fix"
                            style={{ border: "1px solid #eee" }}
                          >
                            <td
                              style={{
                                color: "rgb(30,57,137)",
                                fontWeight: "600",
                                textAlign: "right",
                              }}
                              colSpan="4"
                            >
                              TOTAL&nbsp;
                            </td>
                            <td
                              style={{
                                color: "#1e3889",
                                fontWeight: "600",
                                textAlign: "right",
                              }}
                              colSpan="4"
                              readOnly
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
                  </div>
                  <div className="summery pl-2 pr-2">
                    <Row>
                      <Col md="6">
                        <div className="summerytag narrationdiv">
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
                      <Col md="6">
                        <ButtonGroup
                          className="pull-right submitbtn"
                          aria-label="Basic example"
                        >
                          <Button
                            className="mid-btn"
                            variant="secondary"
                            type="submit"
                          >
                            Submit
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", {
                                from: "tranx_sales_countersale_edit",
                                to: "tranx_sales_countersale_list",
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
                  {/* <div className="summery pl-2 pr-2">
                    <Row>
                      <Col md="3">
                        <div className="summerytag narrationdiv">
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
                      <Col md="7">
                        <div className="summerytag">
                          <fieldset>
                            <legend>Summary</legend>
                            <Row>
                              <Col md="4">
                                <ul className="summerytot pl-3">
                                  <li>
                                    <h4>Total Base Amt</h4>:{" "}
                                    {parseFloat(values.total_base_amt).toFixed(
                                      2
                                    )}
                                  </li>
                                  <li>
                                    <h4>Taxable Amt</h4>:
                                    <span>
                                      {" "}
                                      {parseFloat(
                                        values.total_taxable_amt
                                      ).toFixed(2)}
                                    </span>
                                  </li>
                                  <li>
                                    <h4>Tax Amt</h4>:{" "}
                                    {parseFloat(values.total_tax_amt).toFixed(
                                      2
                                    )}
                                  </li>
                                  <li>
                                    <h4>Final Amt</h4>:{" "}
                                    {parseFloat(values.totalamt).toFixed(2)}
                                  </li>
                                </ul>
                              </Col>
                            </Row>
                          </fieldset>
                        </div>
                      </Col>

                      <Col md="2">
                        <ButtonGroup
                          className="pull-right submitbtn pt-1"
                          aria-label="Basic example"
                        >
                          <Button
                            className="mid-btn"
                            variant="secondary"
                            type="submit"
                          >
                            Submit
                          </Button>
                          <Button variant="secondary">Cancel</Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="9"></Col>
                    </Row>
                  </div> */}
                </div>
              </Form>
            )}
          </Formik>
        </div>

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
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Counter Sales
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal ">
            <div className="institute-head purchasescreen">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={counter_sales_data}
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
                  // console.log("values", values);
                  this.setState({
                    counter_sales_data: values,
                    invoiceedit: false,
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
                  <Form onSubmit={handleSubmit} noValidate>
                    <Row>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>Bill #.</Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="counter_sales_no"
                            id="counter_sales_no"
                            onChange={handleChange}
                            value={values.counter_sales_no}
                            isValid={
                              touched.counter_sales_no &&
                              !errors.counter_sales_no
                            }
                            isInvalid={!!errors.counter_sales_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.counter_sales_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>Bill Date</Form.Label>
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
                      </Col>

                      <Col md="4">
                        <Form.Group>
                          <Form.Label>Customer Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Customer Name"
                            name="customer_name"
                            id="customer_name"
                            onChange={handleChange}
                            value={values.customer_name}
                            isValid={
                              touched.customer_name && !errors.customer_name
                            }
                            isInvalid={!!errors.customer_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.customer_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>Mobile No.</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Mobile No."
                            name="customer_mobile"
                            id="customer_mobile"
                            onChange={handleChange}
                            value={values.customer_mobile}
                            isValid={
                              touched.customer_mobile && !errors.customer_mobile
                            }
                            isInvalid={!!errors.customer_mobile}
                            maxLength={10}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.customer_mobile}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="12" className="btn_align mt-2">
                        <Button className="createbtn" type="submit">
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </Modal.Body>
        </Modal>

        {/* create product start */}
        <Modal
          show={createproductmodal}
          //size="lg"
          dialogClassName="modal-90w"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ createproductmodal: false })}
          // aria-labelledby="contained-modal-title-vcenter"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Create Product
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="purchaseumodal p-2">
            <div className="institute-head purchasescreen">
              <Form className=""></Form>
            </div>
          </Modal.Body>

          <Modal.Footer className="p-1">
            <Button className="createbtn seriailnobtn">Submit</Button>
          </Modal.Footer>
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
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Serial No.
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="purchaseumodal p-2">
            <div className="institute-head purchasescreen">
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
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Additional Charges
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="purchaseumodal p-2">
            <div className="institute-head purchasescreen">
              {additionalCharges.length > 0 && (
                <Table className="serialnotbl additionachargestbl  table-bordered">
                  <thead>
                    <tr>
                      <th>#.</th>
                      <th>Ledger</th>
                      <th> Amt</th>
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
                      <td colSpan={2} style={{ textAlign: "right" }}>
                        Total:{" "}
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