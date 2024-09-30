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
  getPurchaseAccounts,
  getSundryCreditors,
  getProduct,
  createPOInvoice,
  getDiscountLedgers,
  getAdditionalLedgers,
  authenticationService,
  getPurchaseOrderById,
} from "@/services/api_functions";

import {
  getSelectValue,
  calculatePercentage,
  AuthenticationCheck,
  customStyles,
  MyDatePicker,
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
    background: "transparent",
  }),
};

export default class TranxPurchaseOrderEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      invoice_data: "",
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
      taxcal: { igst: [], cgst: [], sgst: [] },
      purchaseEditData: "",
      isEditDataSet: false,
      rowDelDetailsIds: [],
      opendiv: false,
      hidediv: true,
    };
  }

  lstAdditionalLedgers = () => {
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
            this.setState({ lstAdditionalLedger: fOpt });
          }
        }
      })
      .catch((error) => {});
  };
  lstDiscountLedgers = () => {
    getDiscountLedgers()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.name };
            });
            this.setState({ lstDisLedger: Opt });
          }
        }
      })
      .catch((error) => {});
  };

  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ purchaseAccLst: opt });
        }
      })
      .catch((error) => {});
  };
  lstSundryCreditors = () => {
    getSundryCreditors()
      .then((response) => {
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
      .catch((error) => {});
  };

  lstProduct = () => {
    getProduct()
      .then((response) => {
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
      .catch((error) => {});
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
        details_id: 0,
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

  /*Update Purchase Order */

  setPurchaseOrderEditData = () => {
    const id = this.state.purchaseEditData;
    let formData = new FormData();
    formData.append("id", id);
    getPurchaseOrderById(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoice_data, row, addional_charges } = res;

          const {
            purchaseAccLst,
            supplierNameLst,
            supplierCodeLst,
            productLst,
            lstAdditionalLedger,
            lstDisLedger,
          } = this.state;

          let initInvoiceData = {
            id: invoice_data.id,
            po_sr_no: invoice_data.po_sr_no,
            po_no: invoice_data.purchase_order,
            po_invoice_dt: new Date(invoice_data.po_date),
            po_transaction_dt: moment(invoice_data.po_date).format(
              "YYYY-MM-DD"
            ),
            purchaseId: getSelectValue(
              purchaseAccLst,
              invoice_data.purchase_id
            ),
            purchase_order: invoice_data.purchase_order,
            supplierCodeId: getSelectValue(
              supplierCodeLst,
              parseInt(invoice_data.supplier_id)
            ),
            supplierNameId: getSelectValue(
              supplierNameLst,
              parseInt(invoice_data.supplier_id)
            ),
            transport_name: invoice_data.transport_name,
            reference: invoice_data.reference,
          };
          let initRowData = [];
          if (row.length > 0) {
            row.map((v) => {
              let productId = getSelectValue(productLst, v.product_id);
              let inner_data = {
                details_id: v.details_id,
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
                gst: productId.igst,
                igst: productId.igst,
                cgst: productId.cgst,
                sgst: productId.sgst,
                total_igst: "",
                total_cgst: "",
                total_sgst: "",
                final_amt: "",
                serialNo: [],
                discount_proportional_cal: 0,
                additional_charges_proportional_cal: 0,
              };
              initRowData.push(inner_data);
            });
          }

          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
            },
            () => {
              this.handleAdditionalChargesSubmit();
            }
          );
        }
      })
      .catch((error) => {});
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstPurchaseAccounts();
      this.lstSundryCreditors();
      this.lstProduct();
      // this.lstUnit();
      this.initRow();
      this.initAdditionalCharges();
      this.lstDiscountLedgers();
      this.lstAdditionalLedgers();
      const { prop_data } = this.props.block;
      this.setState({ purchaseEditData: prop_data });
    } else {
    }
  }
  componentDidUpdate() {
    const {
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      productLst,
      lstAdditionalLedger,
      isEditDataSet,
      purchaseEditData,
      lstDisLedger,
    } = this.state;

    if (
      purchaseAccLst.length > 0 &&
      supplierNameLst.length > 0 &&
      supplierCodeLst.length > 0 &&
      productLst.length > 0 &&
      lstAdditionalLedger.length > 0 &&
      lstDisLedger.length > 0 &&
      isEditDataSet == false &&
      purchaseEditData != ""
    ) {
      this.setPurchaseOrderEditData();
    }
  }
  /**
   *
   * @param {*} product
   * @param {*} element
   * @description to return place holder according to product unit
   * @returns
   */
  handlePlaceHolder = (product, element) => {
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
      this.handleAdditionalChargesSubmit();
    });
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    return elementCheck ? elementCheck[element] : "";
  };

  handleUnitLstOpt = (productId) => {
    if (productId != undefined && productId) {
      return productId.unitOpt;
    }
  };
  handleUnitLstOptLength = (productId) => {
    if (productId != undefined && productId) {
      return productId.unitOpt.length;
    }
  };
  handleSerialNoQty = (element, index) => {
    let { rows } = this.state;
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
        if (v["qtyH"] != "" && v["rateH"] != "") {
          v["base_amt_H"] = parseInt(v["qtyH"]) * parseFloat(v["rateH"]);
        }
        if (v["qtyM"] != "" && v["rateM"] != "") {
          v["base_amt_M"] = parseInt(v["qtyM"]) * parseFloat(v["rateM"]);
        }
        if (v["qtyL"] != "" && v["rateL"] != "") {
          v["base_amt_L"] = parseInt(v["qtyL"]) * parseFloat(v["rateL"]);
        }

        v["base_amt"] = v["base_amt_H"] + v["base_amt_M"] + v["base_amt_L"];
        v["total_amt"] = parseFloat(v["base_amt"]);
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

        totalamt = parseFloat(totalamt) + parseFloat(v["total_amt"]);
      }
      return v;
    });

    let ntotalamt = 0;

    let addCharges = [];

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
    let frow = row_disc.map((v, i) => {
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

        let baseamt = parseFloat(v["base_amt"]);
        if (v["dis_amt"] != "" && v["dis_amt"] > 0) {
          baseamt = baseamt - parseFloat(v["dis_amt_cal"]);
        }
        if (v["dis_per"] != "" && v["dis_per"] > 0) {
          baseamt = baseamt - parseFloat(v["dis_per_cal"]);
        }
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
    const { rows, additionalChargesTotal } = this.state;
    let totalamt = 0;
    /**
     * @description calculate indivisual row discount and total amt
     */
    let row_disc = rows.map((v) => {
      if (v["productId"] != "") {
        if (v["qtyH"] != "" && v["rateH"] != "") {
          v["base_amt_H"] = parseInt(v["qtyH"]) * parseFloat(v["rateH"]);
        }
        if (v["qtyM"] != "" && v["rateM"] != "") {
          v["base_amt_M"] = parseInt(v["qtyM"]) * parseFloat(v["rateM"]);
        }
        if (v["qtyL"] != "" && v["rateL"] != "") {
          v["base_amt_L"] = parseInt(v["qtyL"]) * parseFloat(v["rateL"]);
        }

        v["base_amt"] = v["base_amt_H"] + v["base_amt_M"] + v["base_amt_L"];
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

    let ntotalamt = 0;
    /**
     *
     */

    /**
     * Additional Charges
     */
    let addCharges = [];

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
    let frow = row_disc.map((v, i) => {
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
  render() {
    const {
      invoice_data,
      invoiceedit,
      createproductmodal,
      purchaseAccLst,
      supplierNameLst,
      opendiv,
      hidediv,
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
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let requestData = new FormData();

              requestData.append(
                "pur_order_date",
                moment(invoice_data.pur_order_date).format("yyyy-MM-DD")
              );
              requestData.append("id", invoice_data.id);
              requestData.append("pur_order_no", invoice_data.purchase_order);
              requestData.append("purchase_id", invoice_data.purchase_id.value);
              requestData.append("pur_order_sr_no", invoice_data.po_sr_no);
              requestData.append("transport_name", invoice_data.transport_name);
              requestData.append("reference", invoice_data.reference);
              requestData.append(
                "supplier_code_id",
                invoice_data.supplierCodeId.value
              );
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
              requestData.append("purchase_discount", values.purchase_discount);
              requestData.append(
                "purchase_discount_amt",
                values.purchase_discount_amt
              );
              requestData.append(
                "total_purchase_discount_amt",
                values.purchase_discount_amt > 0
                  ? values.purchase_discount_amt
                  : values.total_purchase_discount_amt
              );
              requestData.append(
                "purchase_disc_ledger",
                values.purchase_disc_ledger
                  ? values.purchase_disc_ledger.value
                  : 0
              );

              let frow = this.state.rows.map((v, i) => {
                if (v.productId != "") {
                  return {
                    details_id: v.details_id,
                    product_id: v.productId.value,
                    unit_id: v.unitId.value,
                    qtyH: v.qtyH,
                    rateH: v.rateH,
                    qtyM: v.qtyM,
                    rateM: v.rateM,
                    qtyL: v.qtyL,
                    rateL: v.rateL,
                    base_amt_H: v.base_amt_H,
                    base_amt_L: v.base_amt_L,
                    base_amt_M: v.base_amt_M,
                    base_amt: v.base_amt,
                    dis_amt: v.dis_amt,
                    dis_per: v.dis_per,
                    dis_per_cal: v.dis_per_cal,
                    dis_amt_cal: v.dis_amt_cal,
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
                requestData.append("taxCalculation", JSON.stringify(taxCal));
                requestData.append("taxFlag", true);
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
              <Form
                onSubmit={handleSubmit}
                noValidate
                className="new_trnx_design"
              >
                <div className="d-bg i-bg" style={{ height: "900px" }}>
                  {/* {JSON.stringify(invoice_data)} */}
                  <div className="institute-head p-2">
                    <Collapse in={opendiv}>
                      <div
                        id="example-collapse-text"
                        className="p-invoice-modal create_box"
                      >
                        <div className="institute-head m-0 mb-2 purchasescreen">
                          <Formik
                            validateOnChange={false}
                            validateOnBlur={false}
                            initialValues={invoice_data}
                            validationSchema={Yup.object().shape({
                              po_sr_no: Yup.string()
                                .trim()
                                .required("Purchase no is required"),
                              po_transaction_dt: Yup.string().required(
                                "Transaction date is required"
                              ),
                              purchaseId: Yup.object().required(
                                "select purchase account"
                              ),
                              po_invoice_dt: Yup.string().required(
                                "invoice dt is required"
                              ),
                              supplierCodeId: Yup.object().required(
                                "select supplier code"
                              ),
                              supplierNameId: Yup.object().required(
                                "select supplier name"
                              ),
                            })}
                            onSubmit={(
                              values,
                              { setSubmitting, resetForm }
                            ) => {
                              this.setState({
                                invoice_data: values,
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
                                {JSON.stringify(errors)}
                                <Row>
                                  <Col md="2">
                                    <Form.Group>
                                      <Form.Label>
                                        P. O. Sr. #.{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=" "
                                        name="po_sr_no"
                                        id="po_sr_no"
                                        onChange={handleChange}
                                        value={values.po_sr_no}
                                        isValid={
                                          touched.po_sr_no && !errors.po_sr_no
                                        }
                                        isInvalid={!!errors.po_sr_no}
                                        readOnly={true}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.po_sr_no}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col md="3">
                                    <Form.Group>
                                      <Form.Label>
                                        Transaction Date{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <Form.Control
                                        type="date"
                                        name="po_transaction_dt"
                                        id="po_transaction_dt"
                                        onChange={handleChange}
                                        value={values.po_transaction_dt}
                                        isValid={
                                          touched.po_transaction_dt &&
                                          !errors.po_transaction_dt
                                        }
                                        isInvalid={!!errors.po_transaction_dt}
                                        readOnly={true}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.po_transaction_dt}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col md="2">
                                    <Form.Group>
                                      <Form.Label>
                                        Order #.{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Order No."
                                        name="po_no"
                                        id="po_no"
                                        onChange={handleChange}
                                        value={values.po_no}
                                        isValid={touched.po_no && !errors.po_no}
                                        isInvalid={!!errors.po_no}
                                        readOnly={true}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.po_no}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col md="4">
                                    <Form.Group className="createnew">
                                      <Form.Label>
                                        Purchase A/c.{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <Select
                                        className="selectTo"
                                        styles={customStyles}
                                        isClearable
                                        options={purchaseAccLst}
                                        borderRadius="0px"
                                        colors="#729"
                                        name="purchaseId"
                                        onChange={(v) => {
                                          setFieldValue("purchaseId", v);
                                        }}
                                        value={values.purchaseId}
                                      />
                                      <span className="text-danger">
                                        {errors.purchaseId}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                  <Col md="3">
                                    <Form.Group>
                                      <Form.Label>
                                        Order Date{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <MyDatePicker
                                        name="po_invoice_dt"
                                        placeholderText="DD/MM/YYYY"
                                        id="po_invoice_dt"
                                        dateFormat="dd/MM/yyyy"
                                        onChange={(date) => {
                                          setFieldValue("po_invoice_dt", date);
                                        }}
                                        selected={values.po_invoice_dt}
                                        maxDate={new Date()}
                                        className="newdate"
                                      />

                                      <span className="text-danger errormsg">
                                        {errors.po_invoice_dt}
                                      </span>
                                    </Form.Group>
                                  </Col>

                                  <Col md="3">
                                    <Form.Group className="createnew">
                                      <Form.Label>
                                        Supplier Code{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>

                                      <Select
                                        className="selectTo"
                                        styles={customStyles}
                                        isClearable
                                        options={supplierCodeLst}
                                        borderRadius="0px"
                                        colors="#729"
                                        name="supplierCodeId"
                                        onChange={(v) => {
                                          setFieldValue("supplierCodeId", v);
                                          setFieldValue(
                                            "supplierNameId",
                                            getSelectValue(
                                              supplierNameLst,
                                              v.value
                                            )
                                          );
                                        }}
                                        value={values.supplierCodeId}
                                      />

                                      <span className="text-danger">
                                        {errors.supplierCodeId}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                  <Col md="4">
                                    <Form.Group className="createnew">
                                      <Form.Label>
                                        Supplier Name{" "}
                                        <span className="pt-1 pl-1 req_validation">
                                          *
                                        </span>
                                      </Form.Label>
                                      <Select
                                        className="selectTo"
                                        styles={customStyles}
                                        isClearable
                                        options={supplierNameLst}
                                        borderRadius="0px"
                                        colors="#729"
                                        name="supplierNameId"
                                        onChange={(v) => {
                                          setFieldValue(
                                            "supplierCodeId",
                                            getSelectValue(
                                              supplierCodeLst,
                                              v.value
                                            )
                                          );
                                          setFieldValue("supplierNameId", v);
                                        }}
                                        value={values.supplierNameId}
                                      />

                                      <span className="text-danger">
                                        {errors.supplierNameId}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                  <Col md="2" className="mt-4 btn_align">
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
                                <h6>Purchase Order Sr. #. </h6>:{" "}
                                <span>
                                  {invoice_data ? invoice_data.po_sr_no : ""}
                                </span>
                              </li>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <li>
                                <h6>Order Date </h6>:{" "}
                                <span>
                                  {invoice_data
                                    ? moment(invoice_data.po_invoice_dt).format(
                                        "DD-MM-YYYY"
                                      )
                                    : ""}
                                </span>
                              </li>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <li>
                                <h6>Supplier Name</h6>:{" "}
                                <span>
                                  {invoice_data
                                    ? invoice_data.supplier_id &&
                                      invoice_data.supplier_id.name
                                    : ""}
                                </span>
                              </li>
                              <li className="pull-right editpencil">
                                <a
                                  href="#."
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
                            <th>Rate</th>
                            <th>Dis Amt</th>
                            <th>Dis %</th>
                            <th>Total Amt</th>
                            <th>GST %</th>
                            <th>Tax Amt</th>
                            <th>Final Amt</th>
                          </tr>
                          <tr className="unithead">
                            <td></td>
                            <td className="pt-0 pb-0"></td>
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
                                    width: "30%",
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
                                    // borderRadius="0px"
                                    // colors="#729"
                                    theme={(theme) => ({
                                      ...theme,
                                      height: "26px",
                                      borderRadius: "5px",
                                    })}
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

                                <td>
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
                                </td>
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
                                <td style={{ width: "4%" }}>
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
                                    value={this.setElementValue(
                                      "total_igst",
                                      i
                                    )}
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
                              className="qtotalqty"
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
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {/* <td></td>
                          <td></td> */}
                            <td
                              className="qtotalqty"
                              style={{ background: "#eee", textAlign: "right" }}
                              cellpadding="3"
                            >
                              Round Off
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

                          <tr className="total_fix">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td
                              className="total_fix"
                              style={{ color: "#1e3889", fontWeight: "600" }}
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
                    <Table size="sm" className="mb-0 key1 f-totaltbl">
                      <tbody>
                        <tr style={{ border: "1px solid #eee" }}>
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
                          <td></td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <div className="summery p-2">
                    <Row>
                      <Col md="3">
                        <div className="summerytag narrationdiv">
                          <fieldset>
                            <legend>Narration</legend>
                            <Form.Group>
                              <Form.Control
                                as="textarea"
                                name="narration"
                                onChange={handleChange}
                                style={{ width: "auto" }}
                                className="purchace-text"
                                value={values.narration}
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
                              {invoice_data &&
                                invoice_data.supplierCodeId &&
                                invoice_data.supplierCodeId.state !=
                                  authenticationService.currentUserValue
                                    .state && (
                                  <Col md="4">
                                    {invoice_data &&
                                    invoice_data.supplierCodeId &&
                                    invoice_data.supplierCodeId.state !=
                                      authenticationService.currentUserValue
                                        .state
                                      ? taxcal.igst.length > 0 && (
                                          <Table>
                                            <tr>
                                              <td
                                                style={{
                                                  background: "#f5f5f5",
                                                  textAlign: "center",
                                                  fontWeight: "bold",
                                                }}
                                                colspan="2"
                                              >
                                                IGST
                                              </td>
                                            </tr>
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
                                                      : parseFloat(0).toFixed(
                                                          2
                                                        )}
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </Table>
                                        )
                                      : ""}
                                  </Col>
                                )}
                              {authenticationService.currentUserValue.state &&
                                invoice_data &&
                                invoice_data.supplierCodeId &&
                                invoice_data.supplierCodeId.state ==
                                  authenticationService.currentUserValue
                                    .state && (
                                  <Col md="4">
                                    {authenticationService.currentUserValue
                                      .state &&
                                    invoice_data &&
                                    invoice_data.supplierCodeId &&
                                    invoice_data.supplierCodeId.state ==
                                      authenticationService.currentUserValue
                                        .state
                                      ? taxcal.cgst.length > 0 && (
                                          <Table>
                                            <tr>
                                              <td
                                                style={{
                                                  background: "#f5f5f5",
                                                  textAlign: "center",
                                                  fontWeight: "bold",
                                                }}
                                                colspan="2"
                                              >
                                                CGST
                                              </td>
                                            </tr>
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
                                                      : parseFloat(0).toFixed(
                                                          2
                                                        )}
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </Table>
                                        )
                                      : ""}
                                  </Col>
                                )}

                              {authenticationService.currentUserValue.state &&
                                invoice_data &&
                                invoice_data.supplierCodeId &&
                                invoice_data.supplierCodeId.state ==
                                  authenticationService.currentUserValue
                                    .state && (
                                  <Col md="4">
                                    {authenticationService.currentUserValue
                                      .state &&
                                      invoice_data &&
                                      invoice_data.supplierCodeId &&
                                      invoice_data.supplierCodeId.state ==
                                        authenticationService.currentUserValue
                                          .state &&
                                      taxcal.sgst.length > 0 && (
                                        <Table>
                                          <tr>
                                            <td
                                              style={{
                                                background: "#f5f5f5",
                                                textAlign: "center",
                                                fontWeight: "bold",
                                              }}
                                              colspan="2"
                                            >
                                              SGST
                                            </td>
                                          </tr>
                                          {taxcal.sgst.map((vi) => {
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
                                      )}
                                  </Col>
                                )}
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
                          {/* <Button variant="secondary">Draft</Button> */}
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
                              // window.electron.ipcRenderer.webPageChange({
                              //   from: "tranx_purchase_order_edit",
                              //   to: "tranx_purchase_order_list",
                              //   isNewTab: false,
                              // });
                              eventBus.dispatch(
                                "page_change",
                                "tranx_purchase_order_list"
                              );
                            }}
                          >
                            Cancel
                          </Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="9"></Col>
                    </Row>
                  </div>
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
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Purchase Order
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal ">
            <div className="purchasescreen">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={invoice_data}
                validationSchema={Yup.object().shape({
                  po_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  po_transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  purchaseId: Yup.object().required("select purchase account"),
                  po_invoice_dt: Yup.string().required(
                    "invoice dt is required"
                  ),
                  supplierCodeId: Yup.object().required("select supplier code"),
                  supplierNameId: Yup.object().required("select supplier name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  this.setState({ invoice_data: values, invoiceedit: false });
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
                    {JSON.stringify(errors)}
                    <Row>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            P. O. Sr. #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=" "
                            name="po_sr_no"
                            id="po_sr_no"
                            onChange={handleChange}
                            value={values.po_sr_no}
                            isValid={touched.po_sr_no && !errors.po_sr_no}
                            isInvalid={!!errors.po_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.po_sr_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>
                            Transaction Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="po_transaction_dt"
                            id="po_transaction_dt"
                            onChange={handleChange}
                            value={values.po_transaction_dt}
                            isValid={
                              touched.po_transaction_dt &&
                              !errors.po_transaction_dt
                            }
                            isInvalid={!!errors.po_transaction_dt}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.po_transaction_dt}
                          </Form.Control.Feedback>
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
                            placeholder="Order No."
                            name="po_no"
                            id="po_no"
                            onChange={handleChange}
                            value={values.po_no}
                            isValid={touched.po_no && !errors.po_no}
                            isInvalid={!!errors.po_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.po_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="4">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Purchase A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={purchaseAccLst}
                            borderRadius="0px"
                            colors="#729"
                            name="purchaseId"
                            onChange={(v) => {
                              setFieldValue("purchaseId", v);
                            }}
                            value={values.purchaseId}
                          />
                          <span className="text-danger">
                            {errors.purchaseId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>
                            Order Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <MyDatePicker
                            name="po_invoice_dt"
                            placeholderText="dd/MM/yyyy"
                            id="po_invoice_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("po_invoice_dt", date);
                            }}
                            selected={values.po_invoice_dt}
                            maxDate={new Date()}
                            className="newdate"
                          />

                          <span className="text-danger errormsg">
                            {errors.po_invoice_dt}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Supplier Code{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>

                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={supplierCodeLst}
                            borderRadius="0px"
                            colors="#729"
                            name="supplierCodeId"
                            onChange={(v) => {
                              setFieldValue("supplierCodeId", v);
                              setFieldValue(
                                "supplierNameId",
                                getSelectValue(supplierNameLst, v.value)
                              );
                            }}
                            value={values.supplierCodeId}
                          />

                          <span className="text-danger">
                            {errors.supplierCodeId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="4">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Supplier Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="supplierNameId"
                            onChange={(v) => {
                              setFieldValue(
                                "supplierCodeId",
                                getSelectValue(supplierCodeLst, v.value)
                              );
                              setFieldValue("supplierNameId", v);
                            }}
                            value={values.supplierNameId}
                          />

                          <span className="text-danger">
                            {errors.supplierNameId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="2" className="mt-4 btn_align">
                        <Button className="createbtn" type="submit">
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
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Create Product
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="purchaseumodal p-2">
            <div className="purchasescreen">
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
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Serial No.
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="purchaseumodal p-2">
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
      </div>
    );
  }
}
