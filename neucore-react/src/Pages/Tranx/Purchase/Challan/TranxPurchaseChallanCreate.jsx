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
  createPOChallanInvoice,
  getDiscountLedgers,
  getAdditionalLedgers,
  authenticationService,
  listGetPO,
  getPOPendingOrderWithIds,
  getPOInvoiceWithIds,
  getProductPackageList,
} from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  customStyles,
  MyDatePicker,
  eventBus,
  MyNotifications,
  isActionExist,
} from "@/helpers";
import TransactionModal from "../../Components/TransactionModal";
import TRowComponent from "../../Components/TRowComponent";

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

export default class POOrder extends React.Component {
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
      pendingorderprdctsmodalshow: false,
      pendingordermodal: false,
      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      opPOList: [],
      purchasePendingOrderLst: [],
      selectedCounterSalesBills: [],
      selectedOrderToInvoice: [],
      isAllChecked: false,
      selectedProductDetails: [],
      selectedPendingOrder: [],
      lstPackages: [],
      transaction_mdl_show: false,
      transaction_detail_index: 0,
      opendiv: false,
      hidediv: true,
    };
  }
  setBillEditData = () => {
    const { selectedPendingOrder } = this.state;
    console.log("selectedPendingOrder", selectedPendingOrder);
    let purchase_order_id = selectedPendingOrder.map((v) => {
      return { id: v };
    });
    let reqData = new FormData();
    reqData.append("purchase_order_id", JSON.stringify(purchase_order_id));
    getPOInvoiceWithIds(reqData)
      .then((response) => {
        console.log("POInvoice", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let rdata = res.data;
          let initRowData = [];
          const { productLst } = this.state;
          if (rdata.length > 0) {
            rdata.map((v) => {
              let productId = getSelectValue(productLst, v.product_id);
              let inner_data = {
                details_id: v.details_id ? v.details_id : 0,
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
                isDisabled: true,
                reference_id: v.reference_id ? v.reference_id : null,
                reference_type: v.reference_type ? v.reference_type : "",
              };
              initRowData.push(inner_data);
            });
          }

          this.setState(
            {
              rows: initRowData,
              isEditDataSet: true,
              pendingordermodal: false,
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

  lstPOPendingOrder = (values) => {
    const { invoice_data } = this.state;
    let { supplierCodeId } = invoice_data;

    let reqData = new FormData();
    reqData.append(
      "supplier_code_id",
      supplierCodeId ? supplierCodeId.value : ""
    );
    getPOPendingOrderWithIds(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          if (res.data.length > 0) {
            this.setState({
              purchasePendingOrderLst: res.data,
              pendingordermodal: true,
            });
          } else {
            MyNotifications.fire({
              show: true,
              icon: "error",
              title: "Error",
              msg: "No bills found",
              is_button_show: true,
            });
            // ShowNotification("Error", "No bills found");
          }
        }
      })
      .catch((error) => {
        this.setState({ purchasePendingOrderLst: [] });
      });
  };

  handlePendingOrderSelection = (id, status) => {
    let { selectedPendingOrder } = this.state;
    if (status == true) {
      if (!selectedPendingOrder.includes(id)) {
        selectedPendingOrder = [...selectedPendingOrder, id];
      }
    } else {
      selectedPendingOrder = selectedPendingOrder.filter((v) => v != id);
    }
    this.setState({
      selectedPendingOrder: selectedPendingOrder,
    });
  };
  handlePendingOrderSelectionAll = (status) => {
    const { purchasePendingOrderLst } = this.state;

    let lstSelected = [];
    if (status == true) {
      lstSelected = purchasePendingOrderLst.map((v) => v.id);
    }
    this.setState({
      isAllChecked: status,
      selectedPendingOrder: lstSelected,
    });
  };

  handlePendingOrder = () => {
    this.lstPOPendingOrder();
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

  componentDidMount() {
    this.lstPurchaseAccounts();
    this.lstSundryCreditors();
    this.lstProduct();
    // this.lstUnit();
    this.initRow();
    this.initAdditionalCharges();
    this.lstDiscountLedgers();
    this.lstAdditionalLedgers();
    let get_data = this.props.block;
    this.setState({ invoice_data: get_data.prop_data });
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

        v["base_amt"] = baseamt;
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
    /**
     *
     */
    let bdisc = row_disc.map((v, i) => {
      if (v["productId"] != "") {
        if (type != "" && discamtval >= 0) {
          if (type == "purchase_discount") {
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
          v["discount_proportional_cal"] = calculatePrValue(totalamt, peramt);

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
        famt = parseFloat(
          parseFloat(famt) + parseFloat(v["final_amt"])
        ).toFixed(2);

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
      invoiceedit,
      createproductmodal,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      rows,
      productLst,
      serialnopopupwindow,
      pendingorderprdctsmodalshow,
      pendingordermodal,
      additionchargesyes,
      lstDisLedger,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      taxcal,
      purchasePendingOrderLst,
      isAllChecked,
      selectedPendingOrder,
      transaction_mdl_show,
      transaction_detail_index,
      lstPackages,
      opendiv,
      hidediv,
    } = this.state;
    return (
      <div className="">
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={invoice_data}
                validationSchema={Yup.object().shape({
                  pc_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  pc_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  pc_transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  purchaseId: Yup.object().required("Select 1purchase account"),

                  supplierCodeId: Yup.object().required("Select supplier code"),
                  supplierNameId: Yup.object().required("Select supplier name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  this.setState({
                    invoice_data: values,
                    opendiv: false,
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
                    <Row>
                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Purchase Challan. Sr
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=" "
                            name="pc_sr_no"
                            id="pc_sr_no"
                            onChange={handleChange}
                            value={values.pc_sr_no}
                            isValid={touched.pc_sr_no && !errors.pc_sr_no}
                            isInvalid={!!errors.pc_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pc_sr_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Transaction Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="pc_transaction_dt"
                            id="pc_transaction_dt"
                            onChange={handleChange}
                            value={values.pc_transaction_dt}
                            isValid={
                              touched.pc_transaction_dt &&
                              !errors.pc_transaction_dt
                            }
                            isInvalid={!!errors.pc_transaction_dt}
                            readOnly={true}
                            className="date-style"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pc_transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Invoice #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Invoice No."
                            name="pc_no"
                            id="pc_no"
                            onChange={handleChange}
                            value={values.pc_no}
                            isValid={touched.pc_no && !errors.pc_no}
                            isInvalid={!!errors.pc_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pc_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Challan Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <MyDatePicker
                            name="pc_invoice_date"
                            placeholderText="DD/MM/YYYY"
                            id="pc_invoice_date"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("pc_invoice_date", date);
                            }}
                            selected={values.pc_invoice_date}
                            minDate={new Date()}
                            className="date-style"
                          />

                          <span className="text-danger errormsg">
                            {errors.pc_invoice_date}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="2">
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
                      <Col md="3">
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
                    </Row>
                    <Row>
                      <Col md="12" className="btn_align mt-4">
                        <Button className="create-btn" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            this.myRef.current.resetForm();
                            // this.po_ref.current.resetForm();
                            this.setState({
                              opendiv: !opendiv,
                              // hidediv: !hidediv,
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

        {!opendiv && (
          <div className="institute-head p-0 m-3">
            <Row>
              <Col md="10">
                <div className="p-2 supplie-det">
                  <ul>
                    <li>
                      <h6>Purchase Sr. #. </h6>:{" "}
                      <span>{invoice_data ? invoice_data.pc_sr_no : ""}</span>
                    </li>
                    <li>
                      <h6>Challan Date </h6>:{" "}
                      <span>
                        {invoice_data
                          ? moment(invoice_data.pc_invoice_date).format(
                              "DD-MM-YYYY"
                            )
                          : ""}
                      </span>
                    </li>
                    <li>
                      <h6>Challan No. </h6>:{" "}
                      <span> {invoice_data ? invoice_data.pc_no : ""}</span>
                    </li>
                    <li>
                      <h6>Supplier Name </h6>:{" "}
                      <span>
                        {invoice_data ? invoice_data.supplierNameId.label : ""}
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
              <Col md="2" className="text-end">
                <Button
                  className="create-btn mt-1 btn_align"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Pending Order list");
                    // this.handlePendingOrder();
                    this.lstPOPendingOrder();
                  }}
                >
                  Pending Orders
                </Button>
              </Col>
            </Row>
          </div>
        )}
        {/* <h6>Purchase Challan</h6> */}
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          innerRef={this.myRef}
          enableReinitialize={true}
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
          onSubmit={(values, { setSubmitting, resetForm }) => {
            let requestData = new FormData();

            // !Invoice Data
            requestData.append(
              "pur_challan_date",
              moment(invoice_data.pc_invoice_date).format("yyyy-MM-DD")
            );
            requestData.append("pur_challan_sr_no", invoice_data.pc_sr_no);
            requestData.append("pur_challan_no", invoice_data.pc_no);
            requestData.append("purchase_id", invoice_data.purchaseId.value);
            requestData.append(
              "transaction_date",
              invoice_data.pc_transaction_dt
            );
            requestData.append(
              "supplier_code_id",
              invoice_data.supplierCodeId.value
            );

            // !Invoice Data

            requestData.append("roundoff", values.roundoff);
            if (values.narration != "") {
              requestData.append("narration", values.narration);
            }
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

            createPOChallanInvoice(requestData)
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
                  resetForm();
                  this.initRow();
                  eventBus.dispatch(
                    "page_change",
                    "tranx_purchase_challan_list"
                  );
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
              .catch((error) => {});
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
                      <th>Package</th>
                      <th colSpan={3} className="text-center">
                        (Unit,Qnty,Rate)
                      </th>
                      {/* <th>Base Amt</th> */}
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
                <Row>
                  <Col md="4">
                    <div className="summerytag  ">
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
                            //placeholder="Narration"
                          />
                        </Form.Group>
                      </fieldset>
                    </div>
                  </Col>

                  <Col md="4">
                    <div className="summerytag">
                      <fieldset style={{ height: "121px" }}>
                        <legend>Tax Summary : </legend>
                        <Row>
                          {/* IGST */}
                          <Col md="4">
                            <p className="pl-2">IGST</p>
                            {invoice_data &&
                              invoice_data.supplierCodeId &&
                              invoice_data.supplierCodeId.state !=
                                authenticationService.currentUserValue
                                  .state && (
                                <>
                                  {invoice_data &&
                                  invoice_data.supplierCodeId &&
                                  invoice_data.supplierCodeId.state !=
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
                          {/* CGST */}
                          <Col md="4">
                            <p>CGST</p>
                            {authenticationService.currentUserValue.state &&
                              invoice_data &&
                              invoice_data.supplierCodeId &&
                              invoice_data.supplierCodeId.state ==
                                authenticationService.currentUserValue
                                  .state && (
                                <>
                                  {authenticationService.currentUserValue
                                    .state &&
                                  invoice_data &&
                                  invoice_data.supplierCodeId &&
                                  invoice_data.supplierCodeId.state ==
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
                          {/* SGST */}
                          <Col md="4">
                            <p>SGST</p>
                            {authenticationService.currentUserValue.state &&
                              invoice_data &&
                              invoice_data.supplierCodeId &&
                              invoice_data.supplierCodeId.state ==
                                authenticationService.currentUserValue
                                  .state && (
                                <>
                                  {authenticationService.currentUserValue
                                    .state &&
                                    invoice_data &&
                                    invoice_data.supplierCodeId &&
                                    invoice_data.supplierCodeId.state ==
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
                        </Row>
                      </fieldset>
                    </div>
                  </Col>

                  <Col md="2">
                    <div className="summerytag">
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
                        onClick={(e) => {
                          e.preventDefault();

                          eventBus.dispatch("page_change", {
                            from: "tranx_purchase_challan_create",
                            to: "tranx_purchase_challan_list",
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
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Purchase Challan Invoice
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal ">
            <div className="purchasescreen">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={invoice_data}
                validationSchema={Yup.object().shape({
                  pc_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  pc_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  pc_transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  purchaseId: Yup.object().required("Select 1purchase account"),
                  invoice_no: Yup.string()
                    .trim()
                    .required("invoice no is required"),
                  // invoice_dt: Yup.string().required('invoice dt is required'),
                  invoice_dt: Yup.string().required("invoice_date is required"),
                  supplierCodeId: Yup.object().required("Select supplier code"),
                  supplierNameId: Yup.object().required("Select supplier name"),
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
                    <Row>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            P. Challan. Sr. #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=" "
                            name="pc_sr_no"
                            id="pc_sr_no"
                            onChange={handleChange}
                            value={values.pc_sr_no}
                            isValid={touched.pc_sr_no && !errors.pc_sr_no}
                            isInvalid={!!errors.pc_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pc_sr_no}
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
                            name="pc_transaction_dt"
                            id="pc_transaction_dt"
                            onChange={handleChange}
                            value={values.pc_transaction_dt}
                            isValid={
                              touched.pc_transaction_dt &&
                              !errors.pc_transaction_dt
                            }
                            isInvalid={!!errors.pc_transaction_dt}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pc_transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="3">
                        <Form.Group>
                          <Form.Label>
                            Invoice #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Invoice No."
                            name="pc_no"
                            id="pc_no"
                            onChange={handleChange}
                            value={values.pc_no}
                            isValid={touched.pc_no && !errors.pc_no}
                            isInvalid={!!errors.pc_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pc_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>
                            Challan Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <MyDatePicker
                            name="pc_invoice_date"
                            placeholderText="dd/MM/yyyy"
                            id="pc_invoice_date"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("pc_invoice_date", date);
                            }}
                            selected={values.pc_invoice_date}
                            minDate={new Date()}
                            className="newdate"
                          />

                          <span className="text-danger errormsg">
                            {errors.pc_invoice_date}
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
                      <Col md="5">
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
                      <Col md="4" className="btn_align mt-4">
                        <Button className="createbtn mt-2" type="submit">
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
          className="mt-5"
          onHide={() => this.setState({ createproductmodal: false })}
          // aria-labelledby="contained-modal-title-vcenter"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header
            closeButton
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
          className="mt-5"
          onHide={() => this.setState({ serialnopopupwindow: false })}
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header
            closeButton
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
                if (isActionExist("tranx_purchase_challan_create", "create")) {
                  eventBus.dispatch(
                    "page_change",
                    "tranx_purchase_challan_list"
                  );
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
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Pending Order start */}
        <Modal
          show={pendingordermodal}
          //size="lg"
          dialogClassName="modal-90w"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ pendingordermodal: false })}
          // aria-labelledby="contained-modal-title-vcenter"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Pending Orders
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
            <div className="pmt-select-ledger">
              <Table className="mb-2">
                <tr>
                  {/* <th className="">
                    <Form.Group
                      controlId="formBasicCheckbox"
                      className="ml-1 mb-1 pmt-allbtn"
                    >
                      <Form.Check type="checkbox" />
                    </Form.Group>
                    <span className="pt-2 mt-2">Invoice #.</span>
                  </th> */}

                  <th className="">
                    <Form.Group controlId="formBasicCheckbox" className="pl-0">
                      <Form.Check
                        className="pmt-allbtn"
                        type="checkbox"
                        checked={isAllChecked === true ? true : false}
                        onChange={(e) => {
                          // e.preventDefault();
                          this.handlePendingOrderSelectionAll(e.target.checked);
                        }}
                        label="Order #."
                      />
                    </Form.Group>
                    {/* <span className="pt-2 mt-2">&nbsp;Order #.</span> */}
                  </th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }} className="pl-2">
                    Amt
                  </th>
                </tr>
                <tbody>
                  {purchasePendingOrderLst.map((v, i) => {
                    return (
                      <tr className="bgclass">
                        <td className="pt-1 p2-1 pl-1 pb-0">
                          <Form.Group
                            controlId="formBasicCheckbox"
                            className=""
                          >
                            <Form.Check
                              type="checkbox"
                              checked={selectedPendingOrder.includes(
                                parseInt(v.id)
                              )}
                              onChange={(e) => {
                                // e.preventDefault();
                                this.handlePendingOrderSelection(
                                  v.id,
                                  e.target.checked
                                );
                              }}
                              label={v.invoice_no}
                            />
                          </Form.Group>
                          {/* <span className="pt-2 mt-2"> {v.invoice_no}</span> */}
                        </td>
                        <td>{v.invoice_date}</td>

                        <td style={{ textAlign: "right" }} className="p-1">
                          {v.total_amount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Modal.Body>

          <Modal.Footer className="p-1">
            <Button
              className="createbtn seriailnobtn"
              onClick={(e) => {
                e.preventDefault();
                this.setBillEditData();
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        {/* pending order product  end*/}
        <Modal
          show={pendingorderprdctsmodalshow}
          size="lg"
          dialogClassName="modal-90w"
          className="mt-5"
          onHide={() => this.setState({ pendingorderprdctsmodalshow: false })}
          // aria-labelledby="contained-modal-title-vcenter"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header
            closeButton
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Convert to Challan
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
            <div className="pmt-select-ledger">
              {/* <h6>Shivshankar Pharmaceticul Distributers</h6> */}
              <Table className="mb-2">
                <tr>
                  <th className="pt-1 p2-1 pl-1 pb-0">
                    {/* <Form.Group
                      controlId="formBasicCheckbox"
                      className="ml-1 mb-1 pmt-allbtn"
                    >
                      <Form.Check type="checkbox" />
                    </Form.Group>
                    <span className="pt-2 mt-2">Invoice #.</span> */}

                    <Form.Group controlId="formBasicCheckbox" className="pl-1">
                      <Form.Check type="checkbox" label="Invoice #." />
                      {/* <span className="pt-2 mt-2">Invoice #.</span> */}
                    </Form.Group>
                  </th>
                  <th>Pur Sr. No.</th>
                  <th>Transaction Dt</th>
                  <th>Invoice Dt</th>
                  <th>Products</th>
                  <th>Supplier Name</th>
                  {/* <th className="pl-2">Amt</th> */}
                  {/* <th>Status</th> */}
                </tr>
                <tbody>
                  <tr className="bgclass">
                    <td className="pt-1 p2-1 pl-1 pb-0">
                      <Form.Group controlId="formBasicCheckbox" className="">
                        <Form.Check type="checkbox" label="12345" />
                      </Form.Group>
                    </td>
                    <td>1</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">ABC product</td>
                    <td className="p-1">Kiran Enterprises</td>
                  </tr>
                  <tr className="bgclass">
                    <td className="pt-1 p2-1 pl-1 pb-0">
                      <Form.Group controlId="formBasicCheckbox" className="">
                        <Form.Check type="checkbox" label="12345" />
                      </Form.Group>
                    </td>
                    <td>1</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">ABC product</td>
                    <td className="p-1">Kiran Enterprises</td>
                  </tr>
                  <tr className="bgclass">
                    <td className="pt-1 p2-1 pl-1 pb-0">
                      <Form.Group controlId="formBasicCheckbox" className="">
                        <Form.Check type="checkbox" label="12345" />
                      </Form.Group>
                    </td>
                    <td>1</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">ABC product</td>
                    <td className="p-1">Kiran Enterprises</td>
                  </tr>
                  <tr className="bgclass">
                    <td className="pt-1 p2-1 pl-1 pb-0">
                      <Form.Group controlId="formBasicCheckbox" className="">
                        <Form.Check type="checkbox" label="12345" />
                      </Form.Group>
                    </td>
                    <td>1</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">ABC product</td>
                    <td className="p-1">Kiran Enterprises</td>
                  </tr>
                  <tr className="bgclass">
                    <td className="pt-1 p2-1 pl-1 pb-0">
                      <Form.Group controlId="formBasicCheckbox" className="">
                        <Form.Check type="checkbox" label="12345" />
                      </Form.Group>
                    </td>
                    <td>1</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">ABC product</td>
                    <td className="p-1">Kiran Enterprises</td>
                  </tr>
                  <tr className="bgclass">
                    <td className="pt-1 p2-1 pl-1 pb-0">
                      <Form.Group controlId="formBasicCheckbox" className="">
                        <Form.Check type="checkbox" label="12345" />
                      </Form.Group>
                    </td>
                    <td>1</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">03-03-2021</td>
                    <td className="p-1">ABC product</td>
                    <td className="p-1">Kiran Enterprises</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Modal.Body>

          <Modal.Footer className="p-1">
            <Button className="createbtn seriailnobtn">
              Convert To Challan
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
