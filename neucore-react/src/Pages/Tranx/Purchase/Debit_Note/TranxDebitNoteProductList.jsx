import React from 'react';
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  ButtonGroup,
  Modal,
  CloseButton,
  Collapse,
} from 'react-bootstrap';
import { Formik } from 'formik';

import * as Yup from 'yup';

import moment from 'moment';
import Select from 'react-select';
import {
  getPurchaseAccounts,
  getSundryCreditors,
  getProduct,
  createPurchaseInvoice,
  getDiscountLedgers,
  getAdditionalLedgers,
  authenticationService,
  getPurchaseInvoiceById,
  create_purchase_returns_invoices,
  getTranxPurchaseProductListBillNo,
  getTranxDebitNoteListInvoiceBillSC,
} from '@render/services/api_functions';

import {
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
} from '@render/helpers';
import TRowComponent from '../../Components/TRowComponent';

const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 26,
    minHeight: 26,
    border: 'none',
    padding: '0 6px',
    boxShadow: 'none',
    //lineHeight: "10",
    background: 'transparent',
    // borderBottom: '1px solid #ccc',
    // '&:focus': {
    //   borderBottom: '1px solid #1e3989',
    // },
  }),
};

let adjOptions = [
  {
    label: 'Adjustment',
    value: 'adjustment',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
];

export default class TranxDebitNoteProductList extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.AdjustBillRef = React.createRef();
    this.state = {
      show: false,
      opendiv: false,
      hidediv: true,
      invoice_data: '',
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
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
      taxcal: { igst: [], cgst: [], sgst: [] },
      purchaseReturnData: '',
      purchaseReturnObject: '',
      isEditDataSet: false,
      rowDelDetailsIds: [],
      invoiceLstSC: [],
      selectedBills: [],
      initVal: {
        debit_note_sr: 1,
        transaction_dt: moment().format('YYYY-MM-DD'),
        purchaseId: '',
        invoice_no: '',
        invoice_dt: '',
        from_date: '',
        to_date: '',
        supplierCodeId: '',
        supplierNameId: '',
        purchase_return_invoice: '',
        outstanding: '',
        source: '',
        pur_invoice_id: '',
        pur_challan_id: '',
      },

      adjusmentbillmodal: false,
    };
  }

  handeladjusmentbillmodal = (status) => {
    this.setState({ adjusmentbillmodal: status });
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
              (v) => v.label.trim().toLowerCase() != 'round off'
            );
            // console.log({ fOpt });
            this.setState({ lstAdditionalLedger: fOpt });
          }
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
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
      .catch((error) => {
        console.log('error', error);
      });
  };

  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        // console.log("res", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ purchaseAccLst: opt });
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  lstSundryCreditors = () => {
    getSundryCreditors()
      .then((response) => {
        // console.log('res', response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return {
              label: v.name,
              value: parseInt(v.id),
              code: v.ledger_code,
              state: v.state,
            };
          });
          let codeopt = res.list.map((v, i) => {
            return {
              label: v.ledger_code,
              value: parseInt(v.id),
              name: v.name,
              state: v.state,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,
          });
        }
      })
      .catch((error) => {
        console.log('error', error);
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
        console.log('error', error);
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
        details_id: 0,
        productId: '',
        unitId: '',
        qtyH: '',
        qtyM: '',
        qtyL: '',
        rateH: '',
        rateM: '',
        rateL: '',
        base_amt_H: 0,
        base_amt_M: 0,
        base_amt_L: 0,
        base_amt: '',
        dis_amt: '',
        dis_per: '',
        dis_per_cal: '',
        dis_amt_cal: '',
        total_amt: '',
        gst: '',
        igst: '',
        cgst: '',
        sgst: '',
        total_igst: '',
        total_cgst: '',
        total_sgst: '',
        final_amt: '',
        serialNo: [],
        discount_proportional_cal: 0,
        additional_charges_proportional_cal: 0,
        reference_id: '',
        reference_type: '',
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
  initAdditionalCharges = (len = null) => {
    // additionalCharges
    let lst = [];
    let condition = 5;
    if (len != null) {
      condition = len;
    }
    for (let index = 0; index < condition; index++) {
      let data = {
        additional_charges_details_id: 0,
        ledger_id: '',
        amt: '',
      };
      lst.push(data);
    }
    if (len != null) {
      let addLst = [...this.state.additionalCharges, ...lst];
      this.setState({ additionalCharges: addLst });
    } else {
      this.setState({ additionalCharges: lst });
    }
  };

  handleSubmitSCList = (value) => {
    console.log('value', value);
    // this.setState({ initVal: value });

    // debugger;

    let reqData = new FormData();
    reqData.append('sundry_creditor_id', value);

    getTranxDebitNoteListInvoiceBillSC(reqData)
      .then((response) => {
        // console.log('before response', response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let lst = res.data;
          this.setState({
            invoiceLstSC: lst,
            selected_values: value,
          });
        } else {
          ShowNotification('Error', 'Data not found');
          this.setState({
            invoiceLstSC: lst,
          });
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  setPurchaseInvoiceEditData = () => {
    console.log('purchaseReturnData', this.state.purchaseReturnData);
    const data = this.state.purchaseReturnData;

    let formData = new FormData();
    formData.append('pur_invoice_id', data.returnData.id);

    getTranxPurchaseProductListBillNo(formData)
      .then((response) => {
        let res = response.data;
        console.log('Edit response', res);
        if (res.responseStatus == 200) {
          let { invoice_data, row, additional_charges } = res;

          const {
            purchaseAccLst,
            supplierNameLst,
            supplierCodeLst,
            productLst,
            lstAdditionalLedger,
            lstDisLedger,
          } = this.state;

          console.log({ invoice_data, supplierCodeLst });

          let initInvoiceData = {
            id: invoice_data.id,
            po_sr_no: invoice_data.invoice_no,
            invoice_dt: moment(invoice_data.po_date).format('YYYY-MM-DD'),
            invoice_dt: new Date(invoice_data.invoice_dt),
            purchase_sr_no: 1,
            transaction_dt: moment(invoice_data.transaction_dt).format(
              'YYYY-MM-DD'
            ),

            // po_date: moment(invoice_data.po_date).format('YYYY-MM-DD'),
            // purchase_id: getSelectValue(
            //   purchaseAccLst,
            //   invoice_data.purchase_id
            // ),
            purchase_order: invoice_data.purchase_order,
            supplier_id: getSelectValue(
              supplierCodeLst,
              parseInt(invoice_data.supplierId)
            ),
            supplier_name: getSelectValue(
              supplierNameLst,
              parseInt(invoice_data.supplierId)
            ),
            transport_name: invoice_data.transport_name,
            reference: invoice_data.reference,
          };
          console.log('initInvoiceData', initInvoiceData);
          let initRowData = [];
          if (row.length > 0) {
            row.map((v) => {
              let productId = getSelectValue(productLst, v.product_id);
              let inner_data = {
                details_id: v.details_id,
                productId: productId,
                unitId: '',
                qtyH: v.qtyH > 0 ? v.qtyH : '',
                qtyM: v.qtyM > 0 ? v.qtyM : '',
                qtyL: v.qtyL > 0 ? v.qtyL : '',
                rateH: v.rateH > 0 ? v.rateH : '',
                rateM: v.rateM > 0 ? v.rateM : '',
                rateL: v.rateL > 0 ? v.rateL : '',
                base_amt_H: v.base_amt_H > 0 ? v.base_amt_H : '',
                base_amt_M: v.base_amt_M > 0 ? v.base_amt_M : '',
                base_amt_L: v.base_amt_L > 0 ? v.base_amt_L : '',
                base_amt: v.base_amt > 0 ? v.base_amt : '',
                dis_amt: v.dis_amt > 0 ? v.dis_amt : '',
                dis_per: v.dis_per > 0 ? v.dis_per : '',
                dis_per_cal: '',
                dis_amt_cal: '',
                total_amt: '',
                gst: productId.igst,
                igst: productId.igst,
                cgst: productId.cgst,
                sgst: productId.sgst,
                total_igst: '',
                total_cgst: '',
                total_sgst: '',
                final_amt: '',
                serialNo: [],
                discount_proportional_cal: 0,
                additional_charges_proportional_cal: 0,
              };
              initRowData.push(inner_data);
            });
          }

          console.log('initRowData', { initRowData });
          let InitAdditionalCharges = [];
          let totalAdditionalCharges = 0;
          console.log('addional_charges--->', additional_charges);
          if (additional_charges.length > 0) {
            additional_charges.map((v) => {
              let data = {
                additional_charges_details_id: v.additional_charges_details_id,
                ledger_id:
                  v.ledger_id > 0
                    ? getSelectValue(lstAdditionalLedger, v.ledger_id)
                    : '',
                amt: v.amt > 0 ? v.amt : '',
              };
              totalAdditionalCharges += parseFloat(v.amt);
              InitAdditionalCharges.push(data);
            });
          }

          if (res.discountLedgerId > 0) {
            let discountLedgerId = getSelectValue(
              lstDisLedger,
              res.discountLedgerId
            );
            this.myRef.current.setFieldValue(
              'purchase_disc_ledger',
              discountLedgerId
            );
            this.myRef.current.setFieldValue(
              'purchase_discount',
              res.discountInPer
            );
            this.myRef.current.setFieldValue(
              'purchase_discount_amt',
              res.discountInAmt
            );
          }
          this.myRef.current.setFieldValue('tcs', res.tcs);
          this.myRef.current.setFieldValue('narration', res.narration);

          this.setState(
            {
              purchaseReturnObject: this.state.purchaseReturnData.returnIntiVal,
              invoice_data: initInvoiceData,
              initVal: this.state.purchaseReturnData.returnIntiVal,
              rows: initRowData,
              isEditDataSet: true,
              additionalCharges: InitAdditionalCharges,
              additionalChargesTotal: totalAdditionalCharges,
            },
            () => {
              this.handleAdditionalChargesSubmit();
              this.handleSubmitSCList(initInvoiceData.supplier_id.value);
            }
          );
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  handleRowClick = (v) => {
    console.log({ v });
    let prop_data = {
      returnIntiVal: this.state.initVal,
      returnData: v,
    };

    this.setState(
      { invoiceedit: false, purchaseReturnData: prop_data, show: false },
      () => {
        this.setPurchaseInvoiceEditData();
      }
    );
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstPurchaseAccounts();
      this.lstSundryCreditors();
      this.lstProduct();
      this.lstDiscountLedgers();
      this.lstAdditionalLedgers();
      this.initRow();
      this.initAdditionalCharges();
      // let invoice_data = this.props.location.state;
      // this.setState({ purchaseReturnData: invoice_data });
      const { prop_data } = this.props.block;
      console.log('prop_data', { prop_data });
      this.setState({ purchaseReturnData: prop_data });
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
      purchaseReturnData,
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
      purchaseReturnData != ''
    ) {
      this.setPurchaseInvoiceEditData();
    }
  }
  handleClearProduct = (index) => {
    const { rows, rowDelDetailsIds } = this.state;
    let frows = [...rows];
    let data = {
      details_id: 0,
      productId: '',
      unitId: '',
      qtyH: '',
      qtyM: '',
      qtyL: '',
      rateH: '',
      rateM: '',
      rateL: '',
      base_amt_H: 0,
      base_amt_M: 0,
      base_amt_L: 0,
      base_amt: '',
      dis_amt: '',
      dis_per: '',
      dis_per_cal: '',
      dis_amt_cal: '',
      total_amt: '',
      gst: '',
      igst: '',
      cgst: '',
      sgst: '',
      total_igst: '',
      total_cgst: '',
      total_sgst: '',
      final_amt: '',
      serialNo: [],
      discount_proportional_cal: 0,
      additional_charges_proportional_cal: 0,
    };
    frows[index] = data;
    let rowsplice = rows.splice(index, 1);
    let details_id = rowsplice[0]['details_id'];
    if (details_id > 0) {
      if (!rowDelDetailsIds.includes(details_id)) {
        rowDelDetailsIds.push(details_id);
      }
    }

    this.setState({ rows: frows }, () => {
      this.handleAdditionalChargesSubmit();
    });
  };
  /**
   *
   * @param {*} product
   * @param {*} element
   * @description to return place holder according to product unit
   * @returns
   */
  handlePlaceHolder = (product, element) => {
    // console.log({ product, element });
    if (product != '') {
      if (element == 'qtyH') {
        if (product.unitOpt.length > 0) {
          return product.unitOpt[0].label;
        }
      }
      if (element == 'rateH') {
        if (product.unitOpt.length > 0) {
          return product.unitOpt[0].label;
        }
      }
      if (element == 'qtyM') {
        if (product.unitOpt.length > 1) {
          return product.unitOpt[1].label;
        }
      }
      if (element == 'rateM') {
        if (product.unitOpt.length > 1) {
          return product.unitOpt[1].label;
        }
      }
      if (element == 'qtyL') {
        if (product.unitOpt.length > 2) {
          return product.unitOpt[2].label;
        }
      }
      if (element == 'rateL') {
        if (product.unitOpt.length > 2) {
          return product.unitOpt[2].label;
        }
      }
    }
    return '';
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
        if (element == 'productId' && value != null && value != undefined) {
          v['igst'] = value.igst;
          v['gst'] = value.igst;
          v['cgst'] = value.cgst;
          v['sgst'] = value.sgst;
          if (value.isSerialNumber == true) {
            let serialnoarray = [];
            for (let index = 0; index < 100; index++) {
              serialnoarray.push({ no: '' });
            }
            v['serialNo'] = serialnoarray;
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
    // console.log("elementCheck", elementCheck);
    // console.log("element", element);
    return elementCheck ? elementCheck[element] : '';
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
    console.log('serial no', rows);
    console.log({ element, index });
    // this.setState({ serialnopopupwindow: true });
  };
  handleSerialNoValue = (index, value) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.map((v, i) => {
      if (i == index) {
        v['no'] = value;
      }
      return v;
    });

    this.setState({ serialnoarray: fn });
  };
  valueSerialNo = (index) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.find((v, i) => i == index);
    return fn ? fn.no : '';
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
            if (vi.no != '') {
              return vi.no;
            }
          });
          v['serialNo'] = no;
          v['qtyH'] = no.length;
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
      if (v.amt != '') {
        totalamt += parseFloat(v.amt);
      }
    });
    this.setState({ additionalCharges: fa, additionalChargesTotal: totalamt });
  };
  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : '';
  };
  /**
   * @description Calculate the formula discount + Additional charges
   */
  handleAdditionalChargesSubmit = (discamtval = -1, type = '') => {
    const { rows, additionalChargesTotal } = this.state;
    console.log('rows init --====+++++++-->', rows);
    console.log('additionalCharges -->', additionalChargesTotal);
    if (discamtval == '') {
      discamtval = 0;
    }
    if (type != '' && discamtval >= 0) {
      if (type == 'purchase_discount') {
        this.myRef.current.setFieldValue(
          'purchase_discount',
          discamtval != '' ? discamtval : 0
        );
      } else {
        this.myRef.current.setFieldValue(
          'purchase_discount_amt',
          discamtval != '' ? discamtval : 0
        );
      }
    }
    let totalamt = 0;
    /**
     * @description calculate indivisual row discount and total amt
     */
    let row_disc = rows.map((v) => {
      if (v['productId'] != '') {
        if (v['qtyH'] != '' && v['rateH'] != '') {
          v['base_amt_H'] = parseInt(v['qtyH']) * parseFloat(v['rateH']);
        }
        if (v['qtyM'] != '' && v['rateM'] != '') {
          v['base_amt_M'] = parseInt(v['qtyM']) * parseFloat(v['rateM']);
        }
        if (v['qtyL'] != '' && v['rateL'] != '') {
          v['base_amt_L'] = parseInt(v['qtyL']) * parseFloat(v['rateL']);
        }

        v['base_amt'] = v['base_amt_H'] + v['base_amt_M'] + v['base_amt_L'];

        v['total_amt'] = parseFloat(v['base_amt']);

        if (v['dis_amt'] != '' && v['dis_amt'] > 0) {
          // console.log("v['dis_amt']", v["dis_amt"]);
          v['total_amt'] =
            parseFloat(v['total_amt']) - parseFloat(v['dis_amt']);
          v['dis_amt_cal'] = v['dis_amt'];
        }
        if (v['dis_per'] != '' && v['dis_per'] > 0) {
          // console.log("v['dis_per']", v["dis_per"]);
          let per_amt = calculatePercentage(v['total_amt'], v['dis_per']);
          v['dis_per_cal'] = parseFloat(per_amt);
          v['total_amt'] = parseFloat(v['total_amt']) - per_amt;
        }

        totalamt = parseFloat(totalamt) + parseFloat(v['total_amt']);
      }
      // console.log("VVVVVVVVVVVVV", v);
      return v;
    });

    // console.log({ row_disc });
    // console.log("totalamt", totalamt);
    let ntotalamt = 0;
    /**
     *
     */
    let bdisc = row_disc.map((v, i) => {
      if (v['productId'] != '') {
        if (type != '' && discamtval >= 0) {
          if (type == 'purchase_discount') {
            // console.log("values", this.myRef.current.values);
            // this.myRef.current.setFieldValue("purchase_discount", discamtval);

            let peramt = calculatePercentage(
              totalamt,
              parseFloat(discamtval),
              v['total_amt']
            );
            v['discount_proportional_cal'] = calculatePrValue(
              totalamt,
              peramt,
              v['total_amt']
            );

            v['total_amt'] =
              v['total_amt'] -
              calculatePrValue(totalamt, peramt, v['total_amt']);
          } else {
            v['total_amt'] =
              v['total_amt'] -
              calculatePrValue(
                totalamt,
                parseFloat(discamtval),
                v['total_amt']
              );
            v['discount_proportional_cal'] = calculatePrValue(
              totalamt,
              parseFloat(discamtval),
              v['total_amt']
            );
          }
        } else {
          if (
            this.myRef.current.values.purchase_discount > 0 &&
            this.myRef.current.values.purchase_discount != ''
          ) {
            let peramt = calculatePercentage(
              totalamt,
              this.myRef.current.values.purchase_discount,
              v['total_amt']
            );
            v['discount_proportional_cal'] = calculatePrValue(
              totalamt,
              peramt,
              v['total_amt']
            );

            v['total_amt'] =
              v['total_amt'] -
              calculatePrValue(totalamt, peramt, v['total_amt']);
          }
          if (
            this.myRef.current.values.purchase_discount_amt > 0 &&
            this.myRef.current.values.purchase_discount_amt != ''
          ) {
            v['total_amt'] =
              v['total_amt'] -
              calculatePrValue(
                totalamt,
                this.myRef.current.values.purchase_discount_amt,
                v['total_amt']
              );
            v['discount_proportional_cal'] = calculatePrValue(
              totalamt,
              this.myRef.current.values.purchase_discount_amt,
              v['total_amt']
            );
          }
        }
        ntotalamt = parseFloat(ntotalamt) + parseFloat(v['total_amt']);
      }
      return v;
    });
    // console.log({ bdisc });
    /**
     * Additional Charges
     */
    let addCharges = [];

    addCharges = bdisc.map((v, i) => {
      if (v['productId'] != '') {
        v['total_amt'] = parseFloat(
          v['total_amt'] +
            calculatePrValue(ntotalamt, additionalChargesTotal, v['total_amt'])
        ).toFixed(2);
        v['additional_charges_proportional_cal'] = calculatePrValue(
          ntotalamt,
          additionalChargesTotal,
          v['total_amt']
        );
      }
      return v;
    });

    // console.log("addCharges", addCharges);
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
    let totalqtyH = 0;
    let totalqtyM = 0;
    let totalqtyL = 0;

    let taxIgst = [];
    let taxCgst = [];
    let taxSgst = [];
    /**
     * GST Calculation
     * **/
    let frow = addCharges.map((v, i) => {
      if (v['productId'] != '') {
        v['total_igst'] = parseFloat(
          calculatePercentage(v['total_amt'], v['productId']['igst'])
        ).toFixed(2);
        v['total_cgst'] = parseFloat(
          calculatePercentage(v['total_amt'], v['productId']['cgst'])
        ).toFixed(2);
        v['total_sgst'] = parseFloat(
          calculatePercentage(v['total_amt'], v['productId']['sgst'])
        ).toFixed(2);

        v['final_amt'] = parseFloat(
          parseFloat(v['total_amt']) + parseFloat(v['total_igst'])
        ).toFixed(2);
        totalqtyH += parseInt(v['qtyH'] != '' ? v['qtyH'] : 0);
        totalqtyM += parseInt(v['qtyM'] != '' ? v['qtyM'] : 0);
        totalqtyL += parseInt(v['qtyL'] != '' ? v['qtyL'] : 0);
        totaligstamt += parseFloat(v['total_igst']).toFixed(2);
        totalcgstamt += parseFloat(v['total_cgst']).toFixed(2);
        totalsgstamt += parseFloat(v['total_sgst']).toFixed(2);
        total_purchase_discount_amt =
          parseFloat(total_purchase_discount_amt) +
          parseFloat(v['discount_proportional_cal']);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(v['discount_proportional_cal']);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(v['additional_charges_proportional_cal']);
        // additional_charges_proportional_cal
        famt = parseFloat(
          parseFloat(famt) + parseFloat(v['final_amt'])
        ).toFixed(2);

        // parseFloat(v["dis_per_cal"] != "" ? v["dis_per_cal"] : 0) -
        // parseFloat(v["dis_amt_cal"] != "" ? v["dis_amt_cal"] : 0)
        let baseamt = parseFloat(v['base_amt']);
        if (v['dis_amt'] != '' && v['dis_amt'] > 0) {
          baseamt = baseamt - parseFloat(v['dis_amt_cal']);
        }
        if (v['dis_per'] != '' && v['dis_per'] > 0) {
          baseamt = baseamt - parseFloat(v['dis_per_cal']);
        }

        totalbaseamt = parseFloat(parseFloat(totalbaseamt) + baseamt).toFixed(
          2
        );

        totaltaxableamt = parseFloat(
          parseFloat(totaltaxableamt) + parseFloat(v['total_amt'])
        ).toFixed(2);
        totaltaxamt = parseFloat(
          parseFloat(totaltaxamt) + parseFloat(v['total_igst'])
        ).toFixed(2);

        // ! Tax Indidual gst % calculation
        if (v.productId != '') {
          if (v.productId.igst > 0) {
            if (taxIgst.length > 0) {
              let innerIgstTax = taxIgst.find(
                (vi) => vi.gst == v.productId.igst
              );
              if (innerIgstTax != undefined) {
                let innerIgstCal = taxIgst.filter((vi) => {
                  if (vi.gst == v.productId.igst) {
                    vi['amt'] =
                      parseFloat(vi['amt']) + parseFloat(v['total_igst']);
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
                    vi['amt'] =
                      parseFloat(vi['amt']) + parseFloat(v['total_cgst']);
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
                    vi['amt'] =
                      parseFloat(vi['amt']) + parseFloat(v['total_sgst']);
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

    // console.log("frow---====++++>", frow);
    let roundoffamt = Math.round(famt);

    let roffamt = parseFloat(roundoffamt - famt).toFixed(2);
    this.myRef.current.setFieldValue(
      'total_purchase_discount_amt',
      parseFloat(total_purchase_discount_amt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      'total_discount_proportional_amt',
      parseFloat(total_discount_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      'total_additional_charges_proportional_amt',
      parseFloat(total_additional_charges_proportional_amt).toFixed(2)
    );

    this.myRef.current.setFieldValue('roundoff', roffamt);
    this.myRef.current.setFieldValue(
      'total_base_amt',
      parseFloat(totalbaseamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      'total_taxable_amt',
      parseFloat(totaltaxableamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      'totalcgst',
      parseFloat(totalcgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      'totalsgst',
      parseFloat(totalsgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      'totaligst',
      parseFloat(totaligstamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      'total_tax_amt',
      parseFloat(totaltaxamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      'totalamt',
      parseFloat(roundoffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue('totalqtyH', totalqtyH);
    this.myRef.current.setFieldValue('totalqtyM', totalqtyM);
    this.myRef.current.setFieldValue('totalqtyL', totalqtyL);
    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    this.setState(
      { rows: frow, additionchargesyes: false, taxcal: taxState },
      () => {
        if (this.state.rows.length != 10) {
          this.initRow(10 - this.state.rows.length);
        }
        if (this.state.additionalCharges.length != 5) {
          this.initAdditionalCharges(5 - this.state.additionalCharges.length);
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
      if (v['productId'] != '') {
        if (v['qtyH'] != '' && v['rateH'] != '') {
          v['base_amt_H'] = parseInt(v['qtyH']) * parseFloat(v['rateH']);
        }
        if (v['qtyM'] != '' && v['rateM'] != '') {
          v['base_amt_M'] = parseInt(v['qtyM']) * parseFloat(v['rateM']);
        }
        if (v['qtyL'] != '' && v['rateL'] != '') {
          v['base_amt_L'] = parseInt(v['qtyL']) * parseFloat(v['rateL']);
        }

        v['base_amt'] = v['base_amt_H'] + v['base_amt_M'] + v['base_amt_L'];
        v['total_amt'] = v['base_amt'];
        if (v['dis_amt'] != '' && v['dis_amt'] > 0) {
          v['total_amt'] =
            parseFloat(v['total_amt']) - parseFloat(v['dis_amt']);
          v['dis_amt_cal'] = v['dis_amt'];
        }
        if (v['dis_per'] != '' && v['dis_per'] > 0) {
          let per_amt = calculatePercentage(v['total_amt'], v['dis_per']);
          v['dis_per_cal'] = per_amt;
          v['total_amt'] = v['total_amt'] - per_amt;
        }
        totalamt += parseFloat(v['total_amt']);
      }
      return v;
    });

    // console.log("totalamt", totalamt);
    let ntotalamt = 0;
    /**
     *
     */

    let bdisc = row_disc.map((v, i) => {
      if (v['productId'] != '') {
        if (
          this.myRef.current.values.purchase_discount > 0 &&
          this.myRef.current.values.purchase_discount != ''
        ) {
          let peramt = calculatePercentage(
            totalamt,
            this.myRef.current.values.purchase_discount,
            v['total_amt']
          );
          v['discount_proportional_cal'] = calculatePrValue(
            totalamt,
            peramt,
            v['total_amt']
          );

          v['total_amt'] =
            v['total_amt'] - calculatePrValue(totalamt, peramt, v['total_amt']);
        }
        if (
          this.myRef.current.values.purchase_discount_amt > 0 &&
          this.myRef.current.values.purchase_discount_amt != ''
        ) {
          v['total_amt'] =
            parseFloat(v['total_amt']) -
            calculatePrValue(
              totalamt,
              this.myRef.current.values.purchase_discount_amt,
              v['total_amt']
            );
          v['discount_proportional_cal'] = parseFloat(
            calculatePrValue(
              totalamt,
              this.myRef.current.values.purchase_discount_amt,
              v['total_amt']
            )
          ).toFixed(2);
        }

        ntotalamt += parseFloat(v['total_amt']);
      }
      return v;
    });

    // console.log("ntotalamt", ntotalamt);
    /**
     * Additional Charges
     */
    let addCharges = [];

    addCharges = bdisc.map((v, i) => {
      if (v['productId'] != '') {
        v['total_amt'] = parseFloat(
          v['total_amt'] +
            calculatePrValue(ntotalamt, additionalChargesTotal, v['total_amt'])
        ).toFixed(2);
        v['additional_charges_proportional_cal'] = parseFloat(
          calculatePrValue(ntotalamt, additionalChargesTotal, v['total_amt'])
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

    let totalqtyH = 0;
    let totalqtyM = 0;
    let totalqtyL = 0;
    /**
     * GST Calculation
     * **/
    let frow = addCharges.map((v, i) => {
      if (v['productId'] != '') {
        v['total_igst'] = parseFloat(
          calculatePercentage(v['total_amt'], v['productId']['igst'])
        ).toFixed(2);
        v['total_cgst'] = parseFloat(
          calculatePercentage(v['total_amt'], v['productId']['cgst'])
        ).toFixed(2);
        v['total_sgst'] = parseFloat(
          calculatePercentage(v['total_amt'], v['productId']['sgst'])
        ).toFixed(2);

        v['final_amt'] = parseFloat(
          parseFloat(v['total_amt']) + parseFloat(v['total_igst'])
        ).toFixed(2);
        totalqtyH += parseInt(v['qtyH'] != '' ? v['qtyH'] : 0);
        totalqtyM += parseInt(v['qtyM'] != '' ? v['qtyM'] : 0);
        totalqtyL += parseInt(v['qtyL'] != '' ? v['qtyL'] : 0);
        totaligstamt =
          parseFloat(totaligstamt) + parseFloat(v['total_igst']).toFixed(2);
        totalcgstamt =
          parseFloat(totalcgstamt) + parseFloat(v['total_cgst']).toFixed(2);
        totalsgstamt =
          parseFloat(totalsgstamt) + parseFloat(v['total_sgst']).toFixed(2);
        // console.log("final_amt", v["final_amt"]);
        famt = parseFloat(
          parseFloat(famt) + parseFloat(v['final_amt'])
        ).toFixed(2);
        // totalbaseamt =
        //   parseFloat(totalbaseamt) + parseFloat(v["base_amt"]).toFixed(2);

        totalbaseamt = parseFloat(
          parseFloat(totalbaseamt) +
            (parseFloat(v['base_amt']) -
              parseFloat(v['dis_per_cal'] != '' ? v['dis_per_cal'] : 0) -
              parseFloat(v['dis_amt_cal'] != '' ? v['dis_amt_cal'] : 0))
        ).toFixed(2);
        totaltaxableamt =
          parseFloat(totaltaxableamt) + parseFloat(v['total_amt']).toFixed(2);
        totaltaxamt =
          parseFloat(totaltaxamt) + parseFloat(v['total_igst']).toFixed(2);
        total_purchase_discount_amt =
          parseFloat(total_purchase_discount_amt) +
          parseFloat(v['discount_proportional_cal']);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(v['discount_proportional_cal']);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(v['additional_charges_proportional_cal']);
        // ! Tax Indidual gst % calculation
        if (v.productId != '') {
          if (v.productId.igst > 0) {
            if (taxIgst.length > 0) {
              let innerIgstTax = taxIgst.find(
                (vi) => vi.gst == v.productId.igst
              );
              if (innerIgstTax != undefined) {
                let innerIgstCal = taxIgst.filter((vi) => {
                  if (vi.gst == v.productId.igst) {
                    vi['amt'] =
                      parseFloat(vi['amt']) + parseFloat(v['total_igst']);
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
                    vi['amt'] =
                      parseFloat(vi['amt']) + parseFloat(v['total_cgst']);
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
                    vi['amt'] =
                      parseFloat(vi['amt']) + parseFloat(v['total_sgst']);
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
    this.myRef.current.setFieldValue('totalqtyH', totalqtyH);
    this.myRef.current.setFieldValue('totalqtyM', totalqtyM);
    this.myRef.current.setFieldValue('totalqtyL', totalqtyL);
    this.myRef.current.setFieldValue(
      'total_discount_proportional_amt',
      parseFloat(total_discount_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      'total_additional_charges_proportional_amt',
      parseFloat(total_additional_charges_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      'total_purchase_discount_amt',
      parseFloat(total_purchase_discount_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue('roundoff', v);
    // let roffamt = parseFloat(roundoffamt - famt).toFixed(2);
    // this.myRef.current.setFieldValue("roundoff", roundoffamt);
    this.myRef.current.setFieldValue(
      'total_base_amt',
      parseFloat(totalbaseamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      'total_taxable_amt',
      parseFloat(totaltaxableamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      'totaligst',
      parseFloat(totaligstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      'totalcgst',
      parseFloat(totalcgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      'totalsgst',
      parseFloat(totalsgstamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      'total_tax_amt',
      parseFloat(totaltaxamt).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    this.myRef.current.setFieldValue('totalamt', parseFloat(famt).toFixed(2));
    this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });
  };

  handleBillsSelection = (id, status) => {
    let { selectedBills } = this.state;
    if (status == true) {
      if (!selectedBills.includes(id)) {
        selectedBills = [...selectedBills, id];
      }
    } else {
      selectedBills = selectedBills.filter((v) => v != id);
    }
    this.setState({
      selectedBills: selectedBills,
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });

    this.setState({
      selectedBill: value,
    });
  };

  render() {
    const {
      opendiv,
      hidediv,
      invoice_data,
      invoiceedit,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      rows,
      show,
      productLst,
      serialnopopupwindow,
      additionchargesyes,
      lstDisLedger,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      taxcal,
      rowDelDetailsIds,
      initVal,
      invoiceLstSC,
      purchaseReturnData,
      purchaseReturnObject,
      adjusmentbillmodal,
      selectedBills,
    } = this.state;
    return (
      <div className="">
        <div className="dashboardpg institutepg">
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
                    enableReinitialize={true}
                    initialValues={initVal}
                    validationSchema={Yup.object().shape({
                      debit_note_sr: Yup.string()
                        .trim()
                        .required('Purchase no is required'),
                      transaction_dt: Yup.string().required(
                        'Transaction date is required'
                      ),
                      purchaseId: Yup.object().required(
                        'Select purchase account'
                      ),
                      purchase_return_invoice: Yup.string()
                        .trim()
                        .required('purchase_return_invoice no is required'),
                      supplierCodeId: Yup.object().required(
                        'Select supplier code'
                      ),
                      supplierNameId: Yup.object().required(
                        'Select supplier name'
                      ),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      console.log('Submit');
                      console.log('values', values);

                      this.handleSubmitSCList(values.supplierCodeId.value);
                      this.setState({ show: true, opendiv: false });
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
                      <div className="m-0  purchasescreen mb-2">
                        <Form onSubmit={handleSubmit} noValidate>
                          <Row>
                            <Col md="1">
                              <Form.Group>
                                <Form.Label>
                                  Pur_Return #.
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>{' '}
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  className="pl-2"
                                  placeholder=" "
                                  name="debit_note_sr"
                                  id="debit_note_sr"
                                  onChange={handleChange}
                                  value={values.debit_note_sr}
                                  isValid={
                                    touched.debit_note_sr &&
                                    !errors.debit_note_sr
                                  }
                                  isInvalid={!!errors.debit_note_sr}
                                  readOnly={true}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.debit_note_sr}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>
                                  Transaction Date{' '}
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
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
                            </Col>{' '}
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>
                                  Pur_Return Invoice #.{' '}
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Invoice No."
                                  name="purchase_return_invoice"
                                  id="purchase_return_invoice"
                                  onChange={handleChange}
                                  value={values.purchase_return_invoice}
                                  isValid={
                                    touched.purchase_return_invoice &&
                                    !errors.purchase_return_invoice
                                  }
                                  isInvalid={!!errors.purchase_return_invoice}
                                  readOnly
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.purchase_return_invoice}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md="4">
                              <Form.Group className="createnew">
                                <Form.Label>
                                  Purchase A/c
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                <Select
                                  autoFocus
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable
                                  options={purchaseAccLst}
                                  borderRadius="0px"
                                  colors="#729"
                                  name="purchaseId"
                                  onChange={(v) => {
                                    setFieldValue('purchaseId', v);
                                  }}
                                  value={values.purchaseId}
                                />

                                <span className="text-danger errormsg">
                                  {errors.purchaseId}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group className="createnew">
                                <Form.Label>
                                  Supplier Code{' '}
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
                                    setFieldValue('supplierCodeId', v);
                                    if (v != null) {
                                      setFieldValue(
                                        'supplierNameId',
                                        getSelectValue(supplierNameLst, v.value)
                                      );
                                    }
                                  }}
                                  value={values.supplierCodeId}
                                />

                                <span className="text-danger errormsg">
                                  {errors.supplierCodeId}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md="4">
                              <Form.Group className="createnew">
                                <Form.Label>
                                  Supplier Name{' '}
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
                                    if (v != null) {
                                      setFieldValue(
                                        'supplierCodeId',
                                        getSelectValue(supplierCodeLst, v.value)
                                      );
                                    }
                                    setFieldValue('supplierNameId', v);
                                  }}
                                  value={values.supplierNameId}
                                />

                                <span className="text-danger errormsg">
                                  {errors.supplierNameId}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>
                                  Ledger Balance{' '}
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Ledger Balance"
                                  name="outstanding"
                                  id="outstanding"
                                  onChange={handleChange}
                                  value={
                                    values.supplierNameId &&
                                    values.supplierNameId.ledger_balance +
                                      ' ' +
                                      values.supplierNameId.ledger_balance_type
                                  }
                                  readOnly
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.outstanding}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md="6" className="btn_align mt-4">
                              <Button className="createbtn mt-3" type="submit">
                                Submit
                              </Button>

                              <Button
                                className="ml-2 mt-3 alterbtn"
                                type="submit"
                                //className="alterbtn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // this.myRef.current.resetForm();
                                  this.setState({ opendiv: !opendiv });
                                }}
                              >
                                Cancel
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    )}
                  </Formik>
                </div>
              </div>
            </Collapse>

            {!opendiv && (
              <Row>
                <Col md="11">
                  <div className="p-2 supplie-det">
                    <ul>
                      <li>
                        <h6>Purchase Return Sr. #. </h6>:{' '}
                        <span>{initVal ? initVal.debit_note_sr : ''}</span>
                      </li>
                      <li>
                        <h6>Transaction Date </h6>:{' '}
                        <span>
                          {initVal
                            ? moment(initVal.transaction_dt).format(
                                'DD-MM-YYYY'
                              )
                            : ''}
                        </span>
                      </li>
                      <li>
                        <h6>Invoice No.</h6>:{' '}
                        <span>
                          12005454
                        </span>
                      </li>
                      <li>
                        <h6>Supplier Name </h6>:{' '}
                        <span>
                          {initVal
                            ? initVal.supplierNameId &&
                              initVal.supplierNameId.label
                            : ''}
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

          {/* <h6>Purchase Invoice</h6> */}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={{
              totalamt: 0,
              totalqty: 0,
              roundoff: 0,
              narration: '',
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
              purchase_disc_ledger: '',
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

              console.log({ invoice_data, initVal });

              console.log('submit call');
              this.setState({ adjusmentbillmodal: true });
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
                <div className="d-bg i-bg" style={{ height: '680px' }}>
                  <div className="institutetbl p-2">
                    <div className="table_wrapper3">
                      <Table
                        size="sm"
                        className="key mb-0 purchacetbl"
                        style={{ width: '100%' }}
                      >
                        <thead>
                          <tr>
                            <th>#.</th>
                            <th>Particulars</th>
                            <th>Qnty</th>
                            <th>Rate</th>
                            <th>Disc Amt</th>
                            <th>Disc %</th>
                            <th>Total Amt</th>
                            <th>GST %</th>
                            <th>Tax Amt</th>
                            <th>Final Amt</th>
                          </tr>
                          <tr className="unithead">
                            <td></td>
                            <td></td>
                            <td>
                              <tr>
                                <td>
                                  <Form.Control
                                    type="text"
                                    placeholder="H"
                                    readonly
                                    disabled
                                    style={{ background: '#fff' }}
                                  />
                                </td>
                                <td>
                                  <Form.Control
                                    type="text"
                                    placeholder="M"
                                    readonly
                                    disabled
                                    style={{ background: '#fff' }}
                                  />
                                </td>
                                <td>
                                  {' '}
                                  <Form.Control
                                    type="text"
                                    placeholder="L"
                                    readonly
                                    disabled
                                    style={{ background: '#fff' }}
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
                                    disabled
                                    style={{ background: '#fff' }}
                                  />
                                </td>
                                <td>
                                  {' '}
                                  <Form.Control
                                    type="text"
                                    placeholder="M"
                                    readonly
                                    disabled
                                    style={{ background: '#fff' }}
                                  />
                                </td>
                                <td>
                                  {' '}
                                  <Form.Control
                                    type="text"
                                    placeholder="L"
                                    readonly
                                    disabled
                                    style={{ background: '#fff' }}
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
                              <TRowComponent
                                i={i}
                                setFieldValue={setFieldValue}
                                setElementValue={this.setElementValue.bind(
                                  this
                                )}
                                handleChangeArrayElement={this.handleChangeArrayElement.bind(
                                  this
                                )}
                                productLst={productLst}
                                handlePlaceHolder={this.handlePlaceHolder.bind(
                                  this
                                )}
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
                            style={{ background: '#f5f5f5' }}
                            className="totalr_fix1"
                          >
                            <td></td>

                            <td
                              style={{ background: '#eee', textAlign: 'right' }}
                              className="qtotalqty"
                            >
                              Total Qnty
                            </td>
                            <tr>
                              <td style={{ background: '#eee' }}>
                                <Form.Control
                                  type="text"
                                  name="totalqtyH"
                                  onChange={handleChange}
                                  value={values.totalqtyH}
                                  readOnly
                                />
                              </td>
                              <td style={{ background: '#eee' }}>
                                <Form.Control
                                  type="text"
                                  name="totalqtyM"
                                  onChange={handleChange}
                                  value={values.totalqtyM}
                                  readOnly
                                />
                              </td>
                              <td style={{ background: '#eee' }}>
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
                              style={{ background: '#eee', textAlign: 'right' }}
                              cellpadding="3"
                              className="qtotalqty"
                            >
                              Round Off
                            </td>
                            <td style={{ background: '#eee' }}>
                              <Form.Control
                                type="text"
                                name="roundoff"
                                onChange={(v) => {
                                  this.handleRoundOffchange(v.target.value);
                                }}
                                value={values.roundoff}
                                style={{
                                  textAlign: 'right',
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
                        <tr style={{ border: '1px solid #eee' }}>
                          <td></td>
                          <td style={{ width: '7%' }}>Disc Ledger : </td>
                          <td style={{ width: '10%' }}>
                            {' '}
                            <Select
                              className="selectTo"
                              components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                                // Menu: () => null,
                              }}
                              onChange={(v) => {
                                setFieldValue('purchase_disc_ledger', v);
                              }}
                              placeholder=""
                              styles={customStyles1}
                              isClearable
                              options={lstDisLedger}
                              borderRadius="0px"
                              colors="#729"
                              name="purchase_disc_ledger"
                              value={values.purchase_disc_ledger}
                            />
                          </td>

                          <td style={{ width: '5%' }}>
                            <span> Disc % : </span>
                          </td>
                          <td style={{ width: '5%' }}>
                            <span>
                              <Form.Control
                                type="text"
                                name="purchase_discount"
                                onChange={(e) => {
                                  // console.log("e", e.target.value);
                                  this.handleAdditionalChargesSubmit(
                                    e.target.value,
                                    'purchase_discount'
                                  );
                                }}
                                value={values.purchase_discount}
                                readOnly={
                                  values.purchase_disc_ledger == ''
                                    ? true
                                    : false
                                }
                              />
                              {/* Cr */}
                            </span>
                          </td>
                          <td style={{ width: '5%' }}>
                            <span> Dis Amt : </span>
                          </td>
                          <td style={{ width: '5%' }}>
                            <span>
                              <Form.Control
                                type="text"
                                name="purchase_discount_amt"
                                onChange={(e) => {
                                  this.handleAdditionalChargesSubmit(
                                    e.target.value,
                                    'purchase_discount_amt'
                                  );
                                }}
                                value={values.purchase_discount_amt}
                                readOnly={
                                  values.purchase_disc_ledger == ''
                                    ? true
                                    : false
                                }
                              />
                              {/* Cr */}
                            </span>
                          </td>
                          <td></td>

                          <td></td>

                          {/* <td style={{ width: "4%" }}>CGST : </td>
                          <td style={{ width: "5%" }}>
                            <span>
                              {" "}
                              <Form.Control
                                type="text"
                                name="totalcgst"
                                onChange={handleChange}
                                value={values.totalcgst}
                                readOnly
                              />{" "}

                            </span>
                          </td> */}
                          <td></td>
                          {/* <td style={{ width: "4%" }}>SGST : </td>
                          <td style={{ width: "5%" }}>
                            <span>
                              <Form.Control
                                type="text"
                                name="totalsgst"
                                onChange={handleChange}
                                value={values.totalsgst}
                                readOnly
                              />

                            </span>
                          </td> */}
                          <td></td>
                          <td style={{ width: '4%' }}>TCS : </td>
                          <td style={{ width: '5%' }}>
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
                          <td style={{ width: '8%', fontWeight: 'bold' }}>
                            Add. Charges :
                          </td>
                          <td style={{ width: '5%' }}>
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
                          <td className="addchag" style={{ width: '6%' }}>
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
                              </svg>{' '}
                            </a>
                            {/* Or
                            <a href="/">&nbsp; No</a> */}
                          </td>
                          {/* <td></td>
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
                          <td></td>*/}
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
                          <td style={{ color: '#1e3889', fontWeight: '600' }}>
                            TOTAL
                          </td>
                          <td style={{ color: '#1e3889', fontWeight: '600' }}>
                            <Form.Control
                              type="text"
                              name="totalamt"
                              onChange={handleChange}
                              value={values.totalamt}
                              readOnly
                              style={{
                                textAlign: 'right',
                                //paddingRight: "23px",
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <div className="summery pl-2 pr-2">
                    <Row>
                      <Col md="3">
                        <div className="summerytag narrationdiv">
                          <fieldset>
                            <legend>Narration</legend>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                              <Form.Control
                                as="textarea"
                                // rows={5}
                                // cols={25}
                                name="narration"
                                onChange={handleChange}
                                style={{ width: 'auto' }}
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
                                                  background: '#f5f5f5',
                                                  textAlign: 'center',
                                                  fontWeight: 'bold',
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
                                                    :{' '}
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
                                      : ''}
                                  </Col>
                                )}

                              {AuthenticationCheck() &&
                                authenticationService.currentUserValue.state &&
                                invoice_data &&
                                invoice_data.supplierCodeId &&
                                invoice_data.supplierCodeId.state ==
                                  authenticationService.currentUserValue
                                    .state && (
                                  <Col md="4">
                                    {AuthenticationCheck() &&
                                    authenticationService.currentUserValue
                                      .state &&
                                    invoice_data &&
                                    invoice_data.supplierCodeId &&
                                    AuthenticationCheck() &&
                                    invoice_data.supplierCodeId.state ==
                                      authenticationService.currentUserValue
                                        .state
                                      ? taxcal.cgst.length > 0 && (
                                          <Table>
                                            <tr>
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
                                            </tr>
                                            {taxcal.cgst.map((vi) => {
                                              return (
                                                <tr>
                                                  <td>{vi.gst}</td>
                                                  <td>
                                                    :{' '}
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
                                      : ''}
                                  </Col>
                                )}

                              {AuthenticationCheck() &&
                                authenticationService.currentUserValue.state &&
                                invoice_data &&
                                invoice_data.supplierCodeId &&
                                AuthenticationCheck() &&
                                invoice_data.supplierCodeId.state ==
                                  authenticationService.currentUserValue
                                    .state && (
                                  <Col md="4">
                                    {AuthenticationCheck() &&
                                      authenticationService.currentUserValue
                                        .state &&
                                      invoice_data &&
                                      invoice_data.supplierCodeId &&
                                      AuthenticationCheck() &&
                                      invoice_data.supplierCodeId.state ==
                                        authenticationService.currentUserValue
                                          .state &&
                                      taxcal.sgst.length > 0 && (
                                        <Table>
                                          <tr>
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
                                          </tr>
                                          {taxcal.sgst.map((vi) => {
                                            return (
                                              <tr>
                                                <td>{vi.gst}</td>
                                                <td>
                                                  :{' '}
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
                                    <h4>Total Base Amt</h4>:{' '}
                                    {parseFloat(values.total_base_amt).toFixed(
                                      2
                                    )}
                                  </li>
                                  <li>
                                    <h4>Taxable Amt</h4>:
                                    <span>
                                      {' '}
                                      {parseFloat(
                                        values.total_taxable_amt
                                      ).toFixed(2)}
                                    </span>
                                  </li>
                                  <li>
                                    <h4>Tax Amt</h4>:{' '}
                                    {parseFloat(values.total_tax_amt).toFixed(
                                      2
                                    )}
                                  </li>
                                  <li>
                                    <h4>Final Amt</h4>:{' '}
                                    {parseFloat(values.totalamt).toFixed(2)}
                                  </li>
                                </ul>
                              </Col>
                            </Row>
                          </fieldset>
                        </div>
                        {/* <ul>
                          <li>
                            <div>
                              <h4>Summery</h4>
                            </div>
                          </li>
                        </ul>
                        <ul>
                          <li className="summerydiv">
                            <Form.Group>
                              <Form.Label>Total Base Amt : </Form.Label>
                            </Form.Group>
                          </li>

                          <li className="summerydiv">
                            <span>

                              {parseFloat(values.total_base_amt).toFixed(2)}
                            </span>
                          </li>
                        </ul>
                        &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <ul>
                          <li className="summerydiv">
                            <Form.Group>
                              <Form.Label>Total Dis : </Form.Label>
                            </Form.Group>
                          </li>

                          <li className="summerydiv">
                            <span>

                              {parseFloat(values.total_dis_amt).toFixed(2)}
                            </span>
                          </li>
                        </ul>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <ul>
                          <li className="summerydiv">
                            <Form.Group>
                              <Form.Label>Total Dis %: </Form.Label>
                            </Form.Group>
                          </li>

                          <li className="summerydiv">
                            <span>

                              {parseFloat(values.total_dis_per).toFixed(2)}
                            </span>
                          </li>
                        </ul>
                        &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <ul>
                          <li className="summerydiv" md="1">
                            <Form.Group>
                              <Form.Label>Taxable Amt : </Form.Label>
                            </Form.Group>
                          </li>

                          <li className="summerydiv">

                            <span>

                              {parseFloat(values.total_taxable_amt).toFixed(2)}
                            </span>
                          </li>
                        </ul>
                        &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <ul>
                          <li className="summerydiv" md="1">
                            <Form.Group>
                              <Form.Label>Tax Amt : </Form.Label>
                            </Form.Group>
                          </li>
                          <li className="summerydiv">
                            <span>

                              {parseFloat(values.total_tax_amt).toFixed(2)}
                            </span>
                          </li>
                        </ul>
                        &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <ul>
                          <li className="summerydiv" md="1">
                            <Form.Group>
                              <Form.Label>Final Amt : </Form.Label>
                            </Form.Group>
                          </li>
                          <li className="summerydiv">
                            <span>

                              {parseFloat(values.totalamt).toFixed(2)}
                            </span>
                          </li>
                        </ul> */}
                      </Col>

                      <Col md="2">
                        <ButtonGroup
                          className="pull-right submitbtn mt-5 pt-5"
                          aria-label="Basic example"
                        >
                          <Button
                            className="mid-btn mt-4"
                            variant="secondary"
                            type="submit"
                          >
                            Submit
                          </Button>
                          <Button
                            variant="secondary"
                            className=" mt-4"
                            onClick={(e) => {
                              e.preventDefault();
                              // window.electron.ipcRenderer.webPageChange({
                              //   from: 'tranx_debit_note_product_list',
                              //   to: 'tranx_debit_note_list',
                              //   isNewTab: false,
                              // });
                              // this.handleSubmitSCList(values);
                              this.setState({ show: true });
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
                    {/* <Row>
                      <Col md="9"></Col>
                      <Col md="3">
                        <div className="confirm-yes mt-2 pt-2 pb-2 pl-2">
                          <h5>Confirm</h5>
                          <p className="mr-4 pr-4">Are you sure ? </p>
                          <Button
                            className="save-btn p-1"
                            variant="secondary"
                            type="Save"
                          >
                            Save
                          </Button>
                          <Button
                            className="save-btn p-1"
                            variant="secondary"
                            type="Save"
                          >
                            Cancel
                          </Button>
                        </div>
                      </Col>
                    </Row> */}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* invoice list of supplier */}
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
              Purchase Return
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
            <div className="purchasescreen">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  debit_note_sr: Yup.string()
                    .trim()
                    .required('Purchase no is required'),
                  transaction_dt: Yup.string().required(
                    'Transaction date is required'
                  ),
                  purchaseId: Yup.object().required('select purchase account'),
                  purchase_return_invoice: Yup.string()
                    .trim()
                    .required('purchase_return_invoice no is required'),
                  supplierCodeId: Yup.object().required('select supplier code'),
                  supplierNameId: Yup.object().required('select supplier name'),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  console.log('values', values);
                  this.handleSubmitSCList(values.supplierCodeId.value);
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
                  <Form onSubmit={handleSubmit} noValidate className="p-2">
                    {/* <Row>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Debit note V.#.
                            <span className="pt-1 pl-1 req_validation">
                              *
                            </span>{' '}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="debit_note_sr"
                            id="debit_note_sr"
                            onChange={handleChange}
                            value={values.debit_note_sr}
                            isValid={
                              touched.debit_note_sr && !errors.debit_note_sr
                            }
                            isInvalid={!!errors.debit_note_sr}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.debit_note_sr}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>
                            Transaction Date{' '}
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
                      </Col>{' '}
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>
                            Pur. Return Invoice #.{' '}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Invoice No."
                            name="purchase_return_invoice"
                            id="purchase_return_invoice"
                            onChange={handleChange}
                            value={values.purchase_return_invoice}
                            isValid={
                              touched.purchase_return_invoice &&
                              !errors.purchase_return_invoice
                            }
                            isInvalid={!!errors.purchase_return_invoice}
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.purchase_return_invoice}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="4">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Purchase Acc.{' '}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            autoFocus
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={purchaseAccLst}
                            borderRadius="0px"
                            colors="#729"
                            name="purchaseId"
                            onChange={(v) => {
                              setFieldValue('purchaseId', v);
                            }}
                            value={values.purchaseId}
                          />

                          <span className="text-danger errormsg">
                            {errors.purchaseId}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row> */}

                    <Row>
                      <Col md="3">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Supplier Code{' '}
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
                              setFieldValue('supplierCodeId', v);
                              if (v != null) {
                                setFieldValue(
                                  'supplierNameId',
                                  getSelectValue(supplierNameLst, v.value)
                                );
                              }
                            }}
                            value={values.supplierCodeId}
                          />

                          <span className="text-danger errormsg">
                            {errors.supplierCodeId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="4">
                        <Form.Group className="createnew">
                          <Form.Label>
                            Supplier Name{' '}
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
                              if (v != null) {
                                setFieldValue(
                                  'supplierCodeId',
                                  getSelectValue(supplierCodeLst, v.value)
                                );
                              }
                              setFieldValue('supplierNameId', v);
                            }}
                            value={values.supplierNameId}
                          />

                          <span className="text-danger errormsg">
                            {errors.supplierNameId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>
                            Ledger Balance #.{' '}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ledger Balance"
                            name="outstanding"
                            id="outstanding"
                            onChange={handleChange}
                            value={
                              values.supplierNameId &&
                              values.supplierNameId.ledger_balance +
                                ' ' +
                                values.supplierNameId.ledger_balance_type
                            }
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.outstanding}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="2" className="btn_align mt-4">
                        <Button className="createbtn mt-2" type="submit">
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>

              {invoiceLstSC.length > 0 && (
                <div className="all_bills">
                  <div className="bills_dt">
                    <div className="institutetbl pb-2 pt-0 pl-2 pr-2">
                      <div className="purchase-head mb-2"></div>
                      <Table className="serialnotbl mb-0">
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left' }}> #.</th>
                            <th style={{ textAlign: 'left' }}>Bill #.</th>

                            <th style={{ textAlign: 'left' }}>Bill Date</th>
                            <th style={{ textAlign: 'right' }}>Bill Amt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceLstSC.map((v, i) => {
                            return (
                              <tr
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log('v', v);
                                  this.handleRowClick(v);
                                }}
                              >
                                <td>{i + 1}</td>
                                <td>{v.invoice_no}</td>

                                <td>
                                  {moment(v.invoice_date).format('DD/MM/YYYY')}
                                </td>
                                <td className="btn_align">{v.total_amount}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
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
                          <td style={{ width: '75%' }}>
                            <Select
                              className="selectTo"
                              components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                              }}
                              placeholder=""
                              styles={customStyles1}
                              isClearable
                              options={lstAdditionalLedger}
                              borderRadius="0px"
                              colors="#729"
                              onChange={(value) => {
                                this.handleAdditionalCharges(
                                  'ledger_id',
                                  i,
                                  value
                                );
                              }}
                              value={this.setAdditionalCharges('ledger_id', i)}
                            />
                          </td>
                          <td className="additionamt pr-5 pl-1">
                            <Form.Control
                              type="text"
                              placeholder=""
                              onChange={(value) => {
                                this.handleAdditionalCharges(
                                  'amt',
                                  i,
                                  value.target.value
                                );
                              }}
                              value={this.setAdditionalCharges('amt', i)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={2} style={{ textAlign: 'right' }}>
                        Total:{' '}
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
          show={show}
          size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ show: false })}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
          animation={false}
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Debit Note
            </Modal.Title>
            {/* <CloseButton
              variant="white"
              className="pull-right"
              onClick={this.handleClose}
              // onClick={() => this.handlesupplierdetailsModalShow(false)}
            /> */}
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
            <div className="purchasescreen">
              {invoiceLstSC.length > 0 && (
                <div className="all_bills">
                  {/* <h6>Bills</h6> */}
                  <div className="bills_dt">
                    <div className="institutetbl pb-2 pt-0 pl-2 pr-2">
                      <div className="table_wrapper1">
                        <Table className="serialnotbl  mb-0">
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left' }} className="">
                                {' '}
                                #.
                              </th>
                              <th style={{ textAlign: 'left' }} className="">
                                Bill #.
                              </th>
                              <th style={{ textAlign: 'left' }} className="">
                                Bill Amt
                              </th>
                              <th style={{ textAlign: 'left' }} className="">
                                Bill Date
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceLstSC.map((v, i) => {
                              return (
                                <tr
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log('v', v);
                                    this.handleRowClick(v);
                                  }}
                                >
                                  <td>{i + 1}</td>
                                  <td>{v.invoice_no}</td>
                                  <td>{v.total_amount}</td>
                                  <td>
                                    {moment(v.invoice_date).format(
                                      'DD/MM/YYYY'
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>

        {/* Adjustment and pending bill modal  start*/}
        <Modal
          show={adjusmentbillmodal}
          // size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ adjusmentbillmodal: false })}
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Adjust Bills
            </Modal.Title>
            {/* <CloseButton
              variant="white"
              className="pull-right"
              // onClick={this.handleClose}
              onClick={() => this.handeladjusmentbillmodal(false)}
            /> */}
          </Modal.Header>

          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.AdjustBillRef}
            initialValues={{
              newReference: '',
              credit: '',
              refund: '',
              cr: '',
            }}
            validationSchema={Yup.object().shape({
              newReference: Yup.string().required('Select Option'),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              console.log('values', values);

              let requestData = new FormData();

              console.log({ invoice_data, initVal, invoiceLstSC });
              if (values.newReference == 'credit') {
                requestData.append('type', values.newReference);
                requestData.append('value', values.cr_value);
              } else if (values.newReference == 'refund') {
                requestData.append('type', values.newReference);
              }

              // console.log('purchaseReturnData.returnData', purchaseReturnData);
              // requestData.append(
              //   'source',
              //   purchaseReturnData.returnData.source
              // );

              // !Invoice Data
              if (purchaseReturnData.returnData.source == 'pur_invoice') {
                requestData.append(
                  'source',
                  purchaseReturnData.returnData.source
                );
                requestData.append(
                  'pur_invoice_id',
                  purchaseReturnData.returnData.id
                );
              } else if (
                purchaseReturnData.returnData.source == 'pur_challan'
              ) {
                requestData.append(
                  'source',
                  purchaseReturnData.returnData.source
                );
                requestData.append(
                  'pur_challan_id',
                  purchaseReturnData.returnData.id
                );
              }
              requestData.append(
                'pur_return_invoice_no',
                initVal.purchase_return_invoice
              );
              requestData.append('return_invoice_id', invoice_data.id);
              requestData.append(
                'purchase_account_id',
                initVal.purchaseId.value
              );

              requestData.append(
                'purchase_return_sr_no',
                initVal.debit_note_sr
              );

              requestData.append('transaction_dt', initVal.transaction_dt);
              requestData.append(
                'supplier_code_id',
                initVal.supplierCodeId.value
              );
              // !Invoice Data

              let returnValues = this.myRef.current.values;
              requestData.append('roundoff', returnValues.roundoff);
              if (returnValues.narration && returnValues.narration != '') {
                requestData.append('narration', returnValues.narration);
              }

              requestData.append('total_base_amt', returnValues.total_base_amt);
              requestData.append('totalamt', returnValues.totalamt);
              requestData.append(
                'taxable_amount',
                returnValues.total_taxable_amt
              );
              requestData.append('totalcgst', returnValues.totalcgst);
              requestData.append('totalsgst', returnValues.totalsgst);
              requestData.append('totaligst', returnValues.totaligst);
              requestData.append('totalqty', returnValues.totalqty);
              requestData.append('tcs', returnValues.tcs);
              requestData.append(
                'purchase_discount',
                returnValues.purchase_discount
              );
              requestData.append(
                'purchase_discount_amt',
                returnValues.purchase_discount_amt
              );
              requestData.append(
                'total_purchase_discount_amt',
                returnValues.purchase_discount_amt > 0
                  ? returnValues.purchase_discount_amt
                  : returnValues.total_purchase_discount_amt
              );
              requestData.append(
                'purchase_disc_ledger',
                returnValues.purchase_disc_ledger
                  ? returnValues.purchase_disc_ledger.value
                  : 0
              );

              let frow = this.state.rows.map((v, i) => {
                if (v.productId != '') {
                  return {
                    details_id: v.details_id,
                    product_id: v.productId.value,
                    unit_id: v.unitId.value,
                    qtyH: v.qtyH != '' ? v.qtyH : 0,
                    rateH: v.rateH != '' ? v.rateH : 0,
                    qtyM: v.qtyM != '' ? v.qtyM : 0,
                    rateM: v.rateM != '' ? v.rateM : 0,
                    qtyL: v.qtyL != '' ? v.qtyL : 0,
                    rateL: v.rateL != '' ? v.rateL : 0,
                    base_amt_H: v.base_amt_H != '' ? v.base_amt_H : 0,
                    base_amt_L: v.base_amt_L != '' ? v.base_amt_L : 0,
                    base_amt_M: v.base_amt_M != '' ? v.base_amt_M : 0,
                    base_amt: v.base_amt != '' ? v.base_amt : 0,
                    dis_amt: v.dis_amt != '' ? v.dis_amt : 0,
                    dis_per: v.dis_per != '' ? v.dis_per : 0,
                    dis_per_cal: v.dis_per_cal != '' ? v.dis_per_cal : 0,
                    dis_amt_cal: v.dis_amt_cal != '' ? v.dis_amt_cal : 0,
                    total_amt: v.total_amt != '' ? v.total_amt : 0,
                    igst: v.igst != '' ? v.igst : 0,
                    cgst: v.cgst != '' ? v.cgst : 0,
                    sgst: v.sgst != '' ? v.sgst : 0,
                    total_igst: v.total_igst != '' ? v.total_igst : 0,
                    total_cgst: v.total_cgst != '' ? v.total_cgst : 0,
                    total_sgst: v.total_sgst != '' ? v.total_sgst : 0,
                    final_amt: v.final_amt != '' ? v.final_amt : 0,
                    serialNo: v.serialNo,
                    discount_proportional_cal: v.discount_proportional_cal,
                    additional_charges_proportional_cal:
                      v.additional_charges_proportional_cal,
                    reference_id: v.reference_id != 'NA' ? v.reference_id : '',
                    reference_type:
                      v.reference_type != 'NA' ? v.reference_type : '',
                  };
                }
              });

              var filtered = frow.filter(function (el) {
                return el != null;
              });

              let additionalChargesfilter = additionalCharges.filter((v) => {
                if (
                  v.ledgerId != '' &&
                  v.ledgerId != undefined &&
                  v.ledgerId != null
                ) {
                  v['ledger'] = v['ledgerId']['value'];
                  return v;
                }
              });
              requestData.append(
                'additionalChargesTotal',
                additionalChargesTotal
              );
              requestData.append('row', JSON.stringify(filtered));
              requestData.append(
                'additionalCharges',
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

                requestData.append('taxFlag', false);
                requestData.append('taxCalculation', JSON.stringify(taxCal));
              } else {
                let taxCal = {
                  cgst: this.state.taxcal.cgst,
                  sgst: this.state.taxcal.sgst,
                };
                // console.log("taxCal", taxCal);
                requestData.append('taxCalculation', JSON.stringify(taxCal));
                requestData.append('taxFlag', true);
              }

              let filterRowDetail = [];
              if (rowDelDetailsIds.length > 0) {
                filterRowDetail = rowDelDetailsIds.map((v) => {
                  return { del_id: v };
                });
              }
              requestData.append(
                'rowDelDetailsIds',
                JSON.stringify(filterRowDetail)
              );
              console.log('requestData', requestData.values());
              // List key/value pairs
              for (let [name, value] of requestData) {
                console.log(`Formdata ${name} = ${value}`); // key1 = value1, then key2 = value2
              }

              console.log('submit call');
              create_purchase_returns_invoices(requestData)
                .then((response) => {
                  let res = response.data;
                  if (res.responseStatus == 200) {
                    ShowNotification('Success', res.message);
                    resetForm();
                    this.initRow();

                    window.electron.ipcRenderer.webPageChange({
                      from: 'tranx_debit_note_product_list',
                      to: 'tranx_debit_note_list',
                      isNewTab: false,
                    });
                  } else {
                    ShowNotification('Error', res.message);
                  }
                })
                .catch((error) => {
                  console.log('error', error);
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
              <Form onSubmit={handleSubmit}>
                {/* {JSON.stringify(values)} */}
                <Modal.Body className="purchaseumodal p-4 p-invoice-modal ">
                  <div className="purchasescreen pb-2 pt-0 pl-2 pr-2">
                    <Row>
                      <Col md="12">
                        <Form.Group>
                          <Form.Label>
                            {/* Adjust Bill <span className="redstar">*</span> */}
                          </Form.Label>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group className="gender nightshiftlabel">
                          <Form.Label>
                            <input
                              name="newReference"
                              type="radio"
                              value="credit"
                              checked={
                                values.newReference === 'credit' ? true : false
                              }
                              onChange={handleChange}
                              className="mr-3"
                            />
                            <span className="ml-3">&nbsp;&nbsp;Credit</span>
                          </Form.Label>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="nightshiftlabel">
                          <Form.Label className="ml-3">
                            <input
                              name="newReference"
                              type="radio"
                              value="refund"
                              onChange={handleChange}
                              checked={
                                values.newReference === 'refund' ? true : false
                              }
                              className="mr-3"
                            />
                            <span className="ml-3">&nbsp;&nbsp;Refund</span>
                          </Form.Label>

                          <span className="text-danger">
                            {errors.newReference && 'Select Option'}
                          </span>
                        </Form.Group>
                      </Col>

                      {values.newReference === 'credit' && (
                        <Row className="mt-4">
                          <hr></hr>
                          <Col md="12">
                            <Form.Group>
                              <Form.Label>
                                Credit<span className="redstar">*</span>
                              </Form.Label>
                            </Form.Group>
                          </Col>
                          <Col md="3">
                            <Form.Group className="gender nightshiftlabel">
                              <Form.Label>
                                <input
                                  name="cr_value"
                                  type="radio"
                                  value="immediate"
                                  checked={
                                    values.cr_value === 'immediate'
                                      ? true
                                      : false
                                  }
                                  onChange={handleChange}
                                  className="mr-3"
                                />
                                <span className="ml-3">
                                  &nbsp;&nbsp;Immediate
                                </span>
                              </Form.Label>
                            </Form.Group>
                          </Col>
                          <Col md="3">
                            <Form.Group className="nightshiftlabel">
                              <Form.Label className="ml-3">
                                <input
                                  name="cr_value"
                                  type="radio"
                                  value="future"
                                  onChange={handleChange}
                                  checked={
                                    values.cr_value === 'future' ? true : false
                                  }
                                  className="mr-3"
                                />
                                <span className="ml-3">&nbsp;&nbsp;Future</span>
                              </Form.Label>

                              <span className="text-danger">
                                {errors.cr_values && 'Select Option'}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      )}

                      <Col md="12" className="btn_align">
                        <Button
                          className="createbtn"
                          type="submit"
                          style={{ marginTop: '-9px' }}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                    {/* <Row>
                      <Form.Group className="createnew">
                        <Select
                          autoFocus
                          className="selectTo adjustment_selectto"
                          styles={customStyles}
                          isClearable
                          options={adjOptions}
                          borderRadius="0px"
                          colors="#729"
                          name="adjustmentId"
                          id="adjustmentId"
                          placeholder="Adjustment"
                          onChange={(v) => {
                            setFieldValue('adjustmentId', v);
                          }}
                          value={values.adjustmentId}
                        />{' '}
                        <span className="text-danger">
                          {errors.adjustmentId}
                        </span>
                      </Form.Group>
                    </Row> */}

                    {/* <Row>
                      <pre>{JSON.stringify(values, undefined, 2)}</pre>
                      <Table className="allbill_tbl mb-0 ">
                        <thead>
                          <tr>
                            <th className="pt-0 pb-0">-</th>
                            <th className="pb-1 pt-0">Bill #.</th>
                            <th className="pb-1 pt-0">Balance</th>
                            <th className="pb-1 pt-0">Bill Date</th>
                            <th className="pb-1 pt-0">Bill Amt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceLstSC.map((v, i) => {
                            return (
                              <tr>
                                <td>
                                  <Form.Group className="ml-1 mb-1 challanlist">
                                    <Form.Check
                                      type="radio"
                                      name="selectedBill"
                                      id={'selected_bill' + i}
                                      onChange={this.handleChange}
                                      // checked={
                                      //   values.selectedBill == v.id
                                      //     ? true
                                      //     : false
                                      // }
                                      onChange={(e) => {
                                        setFieldValue(
                                          'selectedBill',
                                          e.target.value
                                        );
                                      }}
                                      value={v.id}
                                    />
                                  </Form.Group>
                                </td>
                                <td>{v.invoice_no}</td>
                                <td>-</td>
                                <td>
                                  {moment(v.invoice_date).format('DD/MM/YYYY')}
                                </td>
                                <td>{v.total_amount}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Row> */}
                  </div>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        </Modal>

        {/* Adjustment and pending bill modal  end */}
      </div>
    );
  }
}