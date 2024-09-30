import React from 'react';
import {
  Button,
  Col,
  Row,
  Form,
  ButtonGroup,
  Modal,
  CloseButton,
} from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import HSNSelect from '@/helpers/HSNSelect';
import TaxSelect from '@/helpers/TaxSelect';
import Select from 'react-select';
import {
  getGroups,
  getBrands,
  getCategory,
  getSubCategory,
  createGroup,
  createBrand,
  createCategory,
  createSubCategory,
  getProductEdit,
  getAllHSN,
  getAllUnit,
  updateProduct,
  get_taxOutlet,
} from '@/services/api_functions';
import UnitConv from './UnitConv';
import {
  ShowNotification,
  calculatePercentage,
  getSelectValue,
  AuthenticationCheck,
  customStyles,
  MyDatePicker,
} from '@/helpers';
import moment from 'moment';

export default class ProductEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product_id: 0,
      show: false,
      toggle: false,
      groupModalShow: false,
      subgroupModalShow: false,
      categoryModalShow: false,
      subcategoryModalShow: false,
      HSNshow: false,
      groupLst: [],
      brandLst: [],
      categoryLst: [],
      subcategoryLst: [],
      unitLevel: ['High', 'Medium', 'Low'],
      unitarray: [],
      initVal: {},
      optHSNList: [],
      optTaxList: [],
      unitLst: [],
      isEditDataSet: false,
    };
  }
  lstUnit = () => {
    getAllUnit()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.unitName };
            });
            this.setState({ unitLst: Opt });
          }
        }
      })
      .catch((error) => {});
  };
  lstGroups = () => {
    getGroups()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.groupName };
            });
            this.setState({ groupLst: Opt });
          }
        }
      })
      .catch((error) => {});
  };
  lstBrand = (id, res = null, initVal = null) => {
    let requestData = new FormData();
    requestData.append('groupId', id);
    getBrands(requestData)
      .then((response) => {
        let res_n = response.data;
        if (res_n.responseStatus == 200) {
          let data = res_n.responseObject;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.subgroupName };
            });

            this.setState({ brandLst: Opt });
            console.log('lstBrand res ', { res, initVal });
            console.log(' this.state ', this.state);
            if (res != null && initVal != null) {
              let { unitarray, unitLst } = this.state;
              let arrayres = [];
              if (res.units.length >= 0) {
                arrayres = unitarray.map(
                  (obj) =>
                    res.units.find((o) => o.unitType === obj.unitType) || obj
                );

                arrayres = arrayres.map((v) => {
                  if (v.unitId) {
                    //   "unitID",
                    //   v.unitId,
                    //   "opt",
                    //   unitLst,
                    //   "res",
                    //   getSelectValue(unitLst, v.unitId)
                    // );
                    v['unitId'] = v.unitId
                      ? getSelectValue(unitLst, v.unitId)
                      : '';
                  }
                  v['unitConv'] = v['unitConversion'] ? v['unitConversion'] : 0;
                  return v;
                });
              }
              initVal['brandId'] = getSelectValue(Opt, res.subGroupId);
              this.setState({ initVal: initVal, unitarray: arrayres }, () => {
                if (res.categoryId) {
                  this.lstCategory(res.subGroupId, res, initVal);
                }
              });
            }
          } else {
            this.setState({ brandLst: [] });
          }
        }
      })
      .catch((error) => {});
  };
  lstCategory = (id, res = null, initVal = null) => {
    let requestData = new FormData();
    requestData.append('subgroupId', id);
    getCategory(requestData)
      .then((response) => {
        let res_n = response.data;
        if (res_n.responseStatus == 200) {
          let data = res_n.responseObject;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.groupName };
            });
            this.setState({ categoryLst: Opt });
            if (res != null && initVal != null) {
              initVal['categoryId'] = getSelectValue(Opt, res.categoryId);
              this.setState({ initVal }, () => {
                if (res.subCategoryId) {
                  this.lstSubCategory(res.categoryId, res, initVal);
                }
              });
            }
          } else {
            this.setState({ categoryLst: [] });
          }
        }
      })
      .catch((error) => {});
  };
  lstSubCategory = (id, res = null, initVal = null) => {
    let requestData = new FormData();
    requestData.append('categoryId', id);
    getSubCategory(requestData)
      .then((response) => {
        let res_n = response.data;
        if (res_n.responseStatus == 200) {
          let data = res_n.responseObject;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.subCategoryName };
            });
            this.setState({ subcategoryLst: Opt });
            if (res != null && initVal != null) {
              initVal['subcategoryId'] = getSelectValue(Opt, res.subCategoryId);

              this.setState({ isEditDataSet: true, initVal });
            }
          } else {
            this.setState({ categoryLst: [] });
          }
        }
      })
      .catch((error) => {});
  };
  initUnitArray = () => {
    let uarray = [];
    const { unitLevel } = this.state;
    unitLevel.map((v, i) => {
      let innerd = {
        unitType: v,
        unitId: 0,
        unitConv: 0,
        unitConvMargn: 0,
        minQty: 0,
        maxQty: 0,
        minDisPer: 0,
        maxDisPer: 0,
        minDisAmt: 0,
        maxDisAmt: 0,
        mrp: 0,
        purchaseRate: 0,
        saleRate: 0,
        minSaleRate: 0,
        unitDetailId: 0,
        // openingQty: 0,
        // openingRate: 0,
        // openingeValuation: 0,
      };
      uarray.push(innerd);
    });
    this.setState({ unitarray: uarray });
  };

  handleChangeUnitArrayElement = (element, value, unittype) => {
    let { unitarray, unitLst } = this.state;
    console.log('unitarray', unitarray);

    let index = 0;

    let funitarray = unitarray.map((v, i) => {
      if (v.unitType == unittype) {
        v[element] = value;
        index = i;

        return v;
      } else {
        return v;
      }
    });
    this.setState({ unitarray: funitarray });

    if (unitarray.length == 0) {
      let fList = unitLst.map((v, i) => {
        if (v.unitType == unittype) {
          v[element] = value;
          index = i;

          return v;
        } else {
          return v;
        }
      });
      this.setState({ unitarray: fList });
    }

    if (index != 0 && (element == 'unitConv' || element == 'unitConvMargn')) {
      let exFn = funitarray.map((v, i) => {
        if (index == i) {
          if (funitarray[i - 1]['mrp'] != 0) {
            let mrp = 0;
            if (
              funitarray[i]['unitConv'] != 0 &&
              funitarray[i]['unitConv'] != '' &&
              funitarray[i]['unitConv'] != undefined
            ) {
              mrp = parseFloat(
                funitarray[i - 1]['mrp'] / funitarray[i]['unitConv']
              ).toFixed(2);
            }
            if (
              funitarray[i]['unitConvMargn'] != 0 &&
              funitarray[i]['unitConvMargn'] != '' &&
              funitarray[i]['unitConvMargn'] != undefined
            ) {
              mrp = parseFloat(
                parseFloat(
                  funitarray[i - 1]['mrp'] / funitarray[i]['unitConv']
                ) +
                  parseFloat(
                    calculatePercentage(
                      parseFloat(
                        funitarray[i - 1]['mrp'] / funitarray[i]['unitConv']
                      ),
                      funitarray[i]['unitConvMargn']
                    )
                  )
              ).toFixed(2);
            }
            v['mrp'] = mrp;
          }
          if (funitarray[i - 1]['purchaseRate'] != 0) {
            let purchaserate = 0;
            if (
              funitarray[i]['unitConv'] != 0 &&
              funitarray[i]['unitConv'] != '' &&
              funitarray[i]['unitConv'] != undefined
            ) {
              purchaserate = parseFloat(
                funitarray[i - 1]['purchaseRate'] / funitarray[i]['unitConv']
              ).toFixed(2);
            }
            if (
              funitarray[i]['unitConvMargn'] != 0 &&
              funitarray[i]['unitConvMargn'] != '' &&
              funitarray[i]['unitConvMargn'] != undefined
            ) {
              // purchaserate = parseFloat(
              //   funitarray[i - 1]["purchaseRate"] / funitarray[i]["unitConv"]
              // ).toFixed(2);
              purchaserate = parseFloat(
                parseFloat(
                  funitarray[i - 1]['purchaseRate'] / funitarray[i]['unitConv']
                ) +
                  parseFloat(
                    calculatePercentage(
                      parseFloat(
                        funitarray[i - 1]['purchaseRate'] /
                          funitarray[i]['unitConv']
                      ),
                      funitarray[i]['unitConvMargn']
                    )
                  )
              ).toFixed(2);
            }

            // v["purchaseRate"] = parseFloat(
            //   funitarray[i - 1]["purchaseRate"] / funitarray[i]["unitConv"]
            // ).toFixed(2);
            v['purchaseRate'] = purchaserate;
          }
          if (funitarray[i - 1]['saleRate'] != 0) {
            let saleRate = 0;
            if (
              funitarray[i]['unitConv'] != 0 &&
              funitarray[i]['unitConv'] != '' &&
              funitarray[i]['unitConv'] != undefined
            ) {
              saleRate = parseFloat(
                funitarray[i - 1]['saleRate'] / funitarray[i]['unitConv']
              ).toFixed(2);
            }
            if (
              funitarray[i]['unitConvMargn'] != 0 &&
              funitarray[i]['unitConvMargn'] != '' &&
              funitarray[i]['unitConvMargn'] != undefined
            ) {
              // saleRate = parseFloat(
              //   funitarray[i - 1]["saleRate"] / funitarray[i]["unitConv"]
              // ).toFixed(2);
              saleRate = parseFloat(
                parseFloat(
                  funitarray[i - 1]['saleRate'] / funitarray[i]['unitConv']
                ) +
                  parseFloat(
                    calculatePercentage(
                      parseFloat(
                        funitarray[i - 1]['saleRate'] /
                          funitarray[i]['unitConv']
                      ),
                      funitarray[i]['unitConvMargn']
                    )
                  )
              ).toFixed(2);
            }

            // v["saleRate"] = parseFloat(
            //   funitarray[i - 1]["saleRate"] / funitarray[i]["unitConv"]
            // ).toFixed(2);
            v['saleRate'] = saleRate;
          }
          if (funitarray[i - 1]['minSaleRate'] != 0) {
            let minSaleRate = 0;
            if (
              funitarray[i]['unitConv'] != 0 &&
              funitarray[i]['unitConv'] != '' &&
              funitarray[i]['unitConv'] != undefined
            ) {
              minSaleRate = parseFloat(
                funitarray[i - 1]['minSaleRate'] / funitarray[i]['unitConv']
              ).toFixed(2);
            }
            if (
              funitarray[i]['unitConvMargn'] != 0 &&
              funitarray[i]['unitConvMargn'] != '' &&
              funitarray[i]['unitConvMargn'] != undefined
            ) {
              // minSaleRate = parseFloat(
              //   funitarray[i - 1]["minSaleRate"] / funitarray[i]["unitConv"]
              // ).toFixed(2);
              minSaleRate = parseFloat(
                parseFloat(
                  funitarray[i - 1]['minSaleRate'] / funitarray[i]['unitConv']
                ) +
                  parseFloat(
                    calculatePercentage(
                      parseFloat(
                        funitarray[i - 1]['minSaleRate'] /
                          funitarray[i]['unitConv']
                      ),
                      funitarray[i]['unitConvMargn']
                    )
                  )
              ).toFixed(2);
            }
            v['minSaleRate'] = minSaleRate;
          }
          return v;
        } else {
          return v;
        }
      });
      this.setState({ unitarray: exFn });
    }
  };

  componentDidMount() {
    // let product_id = this.props.location.state;
    if (AuthenticationCheck()) {
      const { prop_data } = this.props.block;

      this.lstUnit();
      this.lstGroups();
      this.initUnitArray();
      this.lstHSN();
      this.lstTAX();

      this.setState({ product_id: prop_data });
    }
  }

  componentDidUpdate() {
    const {
      unitLst,
      groupLst,
      unitarray,
      optHSNList,
      optTaxList,
      isEditDataSet,
      product_id,
    } = this.state;

    if (
      unitLst.length > 0 &&
      groupLst.length > 0 &&
      unitarray.length > 0 &&
      optHSNList.length > 0 &&
      isEditDataSet == false &&
      product_id != ''
    ) {
      this.getProductDetails();
    }
  }

  lstHSN = () => {
    getAllHSN()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data1 = res.responseObject;
          let options = data1.map(function (data) {
            return {
              value: data.id,
              label: data.hsnno,
              hsndesc: data.hsndesc,
              igst: data.igst,
              cgst: data.cgst,
              sgst: data.sgst,
            };
          });
          this.setState({ optHSNList: options });
        }
      })
      .catch((error) => {});
  };
  lstTAX = () => {
    get_taxOutlet()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data1 = res.responseObject;
          let options = data1.map(function (data) {
            return {
              value: data.id,
              label: data.gst_per,
              sratio: data.ratio,
              igst: data.igst,
              cgst: data.cgst,
              sgst: data.sgst,
            };
          });

          this.setState({ optTaxList: options });
        }
      })
      .catch((error) => {});
  };

  getProductDetails = () => {
    let { product_id } = this.state;
    const formData = new FormData();
    formData.append('product_id', product_id);
    getProductEdit(formData)
      .then((response) => {
        // eslint-disable-next-line eqeqeq
        if (response.data.responseStatus == 200) {
          let { optHSNList, optTaxList, groupLst, unitarray, unitLst } =
            this.state;
          let res = response.data.responseObject;
          // alias: null
          // categoryId: 3
          // description: "Desc"
          // groupId: 2
          // hsnId: 1
          // id: 1
          // isNegativeStocks: false
          // isSerialNumber: false
          // isWarrantyApplicable: true
          //isInventory: true
          // productCode: "PRT56678"
          // productName: "ABC"
          // subCategoryId: 4
          // subGroupId: 3
          // units: [{unitDetailId: 1, unitId: 3, unitType: "High", saleRate: 100, minSaleRate: 100, purchaseRate: 80,…}]
          // warrantyDays: 60
          let initVal = {
            productId: res.id,
            productName: res.productName ? res.productName : '',
            description: res.description ? res.description : '',
            alias: res.alias ? res.alias : '',
            groupId: res.groupId ? getSelectValue(groupLst, res.groupId) : '',
            brandId: '',
            categoryId: '',
            subcategoryId: '',
            bill_dt:
              res.applicableDate && res.applicableDate != ''
                ? new Date(res.applicableDate)
                : '',
            hsnId: res.hsnId ? getSelectValue(optHSNList, res.hsnId) : '',
            taxMasterId: res.taxMasterId
              ? getSelectValue(optTaxList, res.taxMasterId)
              : '',
            // taxMasterId: res.taxMasterId
            //   ? getSelectValue(optTaxList, res.taxMasterId)
            //   : '',
            isSerialNo: res.isSerialNumber
              ? res.isSerialNumber
                ? 'true'
                : 'false'
              : 'false',
            isNegativeStocks: res.isNegativeStocks
              ? res.isNegativeStocks
                ? 'true'
                : 'false'
              : 'false',

            isInventory: res.isInventory
              ? res.isInventory
                ? 'true'
                : 'false'
              : 'false',

            isWarranty: res.isWarrantyApplicable
              ? res.isWarrantyApplicable
                ? 'true'
                : 'false'
              : 'false',
            nodays: res.warrantyDays ? res.warrantyDays : 0,
          };

          this.setState({ isEditDataSet: true, initVal }, () => {
            if (res.subGroupId) {
              this.lstBrand(res.groupId, res, initVal);
            } else {
              this.lstBrand(res.groupId);
              let { unitarray, unitLst } = this.state;
              let arrayres = [];
              if (res.units.length > 0) {
                arrayres = unitarray.map(
                  (obj) =>
                    res.units.find((o) => o.unitType === obj.unitType) || obj
                );

                arrayres = arrayres.map((v) => {
                  if (v.unitId) {
                    v['unitId'] = v.unitId
                      ? getSelectValue(unitLst, v.unitId)
                      : '';
                  }
                  v['unitConv'] = v['unitConversion'] ? v['unitConversion'] : 0;
                  return v;
                });
              }
              this.setState({ isEditDataSet: true, unitarray: arrayres });
            }
          });
        }
      })
      .catch((error) => {});
  };
  handelgroupModalShow = (status) => {
    this.setState({ groupModalShow: status });
  };
  handelsubgroupModalShow = (status) => {
    this.setState({ subgroupModalShow: status });
  };
  handelcategoryModalShow = (status) => {
    this.setState({ categoryModalShow: status });
  };
  handelsubcategoryModalShow = (status) => {
    this.setState({ subcategoryModalShow: status });
  };
  render() {
    // const customStyles = {
    //   control: (base) => ({
    //     ...base,
    //     height: 28,
    //     minHeight: 28,
    //     border: 'none',
    //     borderBottom: '1px solid #ccc',
    //     fontSize: '13px',
    //     //boxShadow: '0 0 0 2px rgb(49 132 253 / 50%)',
    //     boxShadow: 'unset',
    //   }),
    // };
    const {
      groupModalShow,
      subgroupModalShow,
      groupLst,
      brandLst,
      categoryLst,
      subcategoryLst,
      categoryModalShow,
      subcategoryModalShow,
      initVal,
    } = this.state;

    return (
      <div className="">
        <div className="dashboardpg institutepg">
          <div className="d-bg i-bg">
            <div
              className="institute-head productscreen p-2"
              style={{ height: '700px' }}
            >
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  productName: Yup.string()
                    .trim()
                    .required('Product name is required'),
                  hsnId: Yup.object().required('Select HSN'),
                  taxMasterId: Yup.object().required('Select Tax'),

                  // description: Yup.string()
                  //   .trim()
                  //   .required('Product description is required'),
                  groupId: Yup.object().required('Select group'),
                  brandId: Yup.object().required('Select subgroup'),
                  // unitId: Yup.object().required('Select the unitId '),
                  // unitarray: Yup.object().required('select  the units'),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let keys = Object.keys(initVal);
                  let requestData = new FormData();

                  keys.map((v) => {
                    if (
                      values[v] != '' &&
                      v != 'groupId' &&
                      v != 'brandId' &&
                      v != 'categoryId' &&
                      v != 'subcategoryId' &&
                      v != 'hsnId' &&
                      v != 'taxMasterId'
                    ) {
                      requestData.append(v, values[v]);
                    }
                  });
                  if (values['groupId'] != '') {
                    requestData.append('groupId', values['groupId']['value']);
                  }
                  if (values['brandId'] != '') {
                    requestData.append(
                      'subgroupId',
                      values['brandId']['value']
                    );
                  }
                  if (
                    values['categoryId'] != '' &&
                    values['categoryId'] != null &&
                    values['categoryId'] != undefined
                  ) {
                    requestData.append(
                      'categoryId',
                      values['categoryId']['value']
                    );
                  }
                  if (
                    values['subcategoryId'] != '' &&
                    values['subcategoryId'] != null &&
                    values['subcategoryId'] != undefined
                  ) {
                    requestData.append(
                      'subcategoryId',
                      values['subcategoryId']['value']
                    );
                  }
                  requestData.append(
                    'applicable_date',
                    moment(values.bill_dt).format('yyyy-MM-DD')
                  );
                  requestData.append('hsnId', values['hsnId']['value']);
                  requestData.append(
                    'taxMasterId',
                    values['taxMasterId']['value']
                  );
                  let funitarray = this.state.unitarray.map((v) => {
                    if (typeof v.unitId == 'object' && v.unitId != null) {
                      v.unitId = v.unitId.value;
                    }
                    if (v.unitId == null) {
                      v.unitId = 0;
                    }
                    return v;
                  });
                  requestData.append('unit', JSON.stringify(funitarray));
                  updateProduct(requestData)
                    .then((response) => {
                      let res = response.data;
                      if (res.responseStatus == 200) {
                        ShowNotification('Success', res.message);
                        resetForm();
                        this.initUnitArray();
                        // this.props.history.push('/Product');
                        window.electron.ipcRenderer.webPageChange({
                          from: 'productedit',
                          to: 'productlist',
                          isNewTab: false,
                          prop_data: '',
                        });
                      } else {
                        ShowNotification('Error', res.message);
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
                  <Form onSubmit={handleSubmit}>
                    <div className="" style={{ height: '400px' }}>
                      <Row>
                        <Col md="6">
                          {/* {JSON.stringify(errors)} */}
                          {/* <pre>{JSON.stringify(values, undefined, 2)}</pre>
                          <pre>{JSON.stringify(errors, undefined, 2)}</pre> */}
                          <Form.Group>
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                              autofocus
                              type="text"
                              placeholder="Product Name"
                              name="productName"
                              maxMenuHeight={10}
                              id="productName"
                              onChange={handleChange}
                              value={values.productName}
                              isValid={
                                touched.productName && !errors.productName
                              }
                              isInvalid={!!errors.productName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.productName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <div style={{ width: '35%' }}>
                          <Form.Group className="ml-3">
                            <Form.Label>Product Description</Form.Label>
                            {/* <Form.Control
                              type="text"
                              placeholder="Product Description"
                              name="description"
                              id="description"
                              onChange={handleChange}
                              value={values.description}
                              isValid={
                                touched.description && !errors.description
                              }
                              isInvalid={!!errors.description}
                            /> */}
                            <Form.Control
                              as="textarea"
                              rows={3}
                              className="textareaheight"
                              name="description"
                              id="description"
                              onChange={handleChange}
                              value={values.description}
                              isValid={
                                touched.description && !errors.description
                              }
                              isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.description}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        <div style={{ width: '14%' }}>
                          <Form.Group className="ml-4">
                            <Form.Label>Alias</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Alias"
                              name="alias"
                              id="alias"
                              onChange={handleChange}
                              value={values.alias}
                              isValid={touched.alias && !errors.alias}
                              isInvalid={!!errors.alias}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.alias}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        {/* <Col md="2">
                          <Form.Group>
                            <Form.Label>Product Code</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="PRT56678"
                              name="productcode"
                              id="productcode"
                              onChange={handleChange}
                              value={values.productcode}
                              isValid={
                                touched.productcode && !errors.productcode
                              }
                              isInvalid={!!errors.productcode}
                              <Form.Control.Feedback type="invalid">
                              />
                              {errors.productcode}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col> */}
                        <Col md="3">
                          <Form.Group className="createnew">
                            <Form.Label>
                              Brand&nbsp;&nbsp;
                              <a
                                href="#."
                                onClick={(e) => {
                                  this.handelgroupModalShow(true);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-plus-square-dotted"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                </svg>{' '}
                                &nbsp;&nbsp;
                              </a>
                            </Form.Label>
                            <Select
                              isClearable={true}
                              className="selectTo"
                              styles={customStyles}
                              onChange={(v) => {
                                this.lstBrand(v.value);
                                setFieldValue('subcategoryId', null);
                                setFieldValue('brandId', null);
                                setFieldValue('categoryId', null);
                                setFieldValue('groupId', v);
                              }}
                              name="groupId"
                              options={groupLst}
                              value={values.groupId}
                              invalid={errors.groupId ? true : false}
                            />
                            <span className="text-danger">
                              {errors.groupId}
                            </span>
                          </Form.Group>
                          <div className="grp-name">
                            {values.groupId ? values.groupId.label : ''}
                          </div>
                        </Col>
                        <Col md="3">
                          <Form.Group className="createnew">
                            <Form.Label>
                              Group &nbsp;&nbsp;
                              <a
                                href="#."
                                onClick={() => {
                                  this.handelsubgroupModalShow(true);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-plus-square-dotted"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                </svg>{' '}
                                &nbsp;&nbsp;
                              </a>
                            </Form.Label>
                            <Select
                              isClearable={true}
                              className="selectTo"
                              styles={customStyles}
                              onChange={(v) => {
                                this.lstCategory(v.value);
                                setFieldValue('brandId', v);
                                setFieldValue('categoryId', null);
                              }}
                              name="brandId"
                              options={brandLst}
                              value={values.brandId}
                              invalid={errors.brandId ? true : false}
                            />
                            <span className="text-danger">
                              {errors.brandId}
                            </span>
                          </Form.Group>
                          <div className="grp-name">
                            {values.brandId ? values.brandId.label : ''}
                          </div>
                        </Col>

                        <Col md="3">
                          <Form.Group className="createnew">
                            <Form.Label>
                              Category &nbsp;&nbsp;
                              <a
                                href="#."
                                onClick={(e) => {
                                  this.handelcategoryModalShow(true);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-plus-square-dotted"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                </svg>{' '}
                                &nbsp;&nbsp;
                              </a>
                            </Form.Label>
                            <Select
                              isClearable={true}
                              className="selectTo"
                              styles={customStyles}
                              onChange={(v) => {
                                this.lstSubCategory(v.value);
                                setFieldValue('categoryId', v);
                              }}
                              name="categoryId"
                              options={categoryLst}
                              value={values.categoryId}
                              invalid={errors.categoryId ? true : false}
                            />
                            <span className="text-danger">
                              {errors.categoryId}
                            </span>
                          </Form.Group>
                          <div className="grp-name">
                            {values.categoryId ? values.categoryId.label : ''}
                          </div>
                        </Col>
                        <Col md="3">
                          <Form.Group className="createnew">
                            <Form.Label>
                              Sub - Category&nbsp;&nbsp;
                              <a
                                href="#."
                                onClick={(e) => {
                                  this.handelsubcategoryModalShow(true);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-plus-square-dotted"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                </svg>{' '}
                                &nbsp;&nbsp;
                              </a>
                            </Form.Label>
                            <Select
                              isClearable={true}
                              className="selectTo"
                              styles={customStyles}
                              onChange={(v) => {
                                setFieldValue('subcategoryId', v);
                              }}
                              name="subcategoryId"
                              options={subcategoryLst}
                              value={values.subcategoryId}
                              invalid={errors.subcategoryId ? true : false}
                            />
                            <span className="text-danger">
                              {errors.subcategoryId}
                            </span>
                          </Form.Group>
                          <div className="grp-name">
                            {values.subcategoryId
                              ? values.subcategoryId.label
                              : ''}
                          </div>
                        </Col>
                      </Row>
                      <Row className="hsncol">
                        <HSNSelect
                          {...this.props}
                          name="hsnId"
                          value={values.hsnId}
                          setFieldValue={setFieldValue}
                          errors={errors}
                        />
                        <TaxSelect
                          {...this.props}
                          name="taxMasterId"
                          value={values.taxMasterId}
                          setFieldValue={setFieldValue}
                          errors={errors}
                        />

                        <Col md="2">
                          <Form.Group>
                            <Form.Label>
                              Applicable Date{' '}
                              {/* <span className="pt-1 pl-1 req_validation">
                                *
                              </span> */}
                            </Form.Label>
                            <MyDatePicker
                              name="bill_dt"
                              placeholderText="DD/MM/YYYY"
                              id="bill_dt"
                              dateFormat="dd/MM/yyyy"
                              onChange={(date) => {
                                setFieldValue('bill_dt', date);
                              }}
                              selected={values.bill_dt}
                              maxDate={new Date()}
                              className="newdate"
                            />
                            {/* <span className="text-danger errormsg">{errors.bill_dt}</span> */}
                          </Form.Group>
                        </Col>

                        <Col md="1">
                          <Form.Group>
                            <Form.Label>Serial No.</Form.Label>
                            <Form.Control
                              as="select"
                              value={values.isSerialNo}
                              onChange={(e) => {
                                setFieldValue('isSerialNo', e.target.value);
                              }}
                              name="isSerialNo"
                            >
                              <option value="false">No</option>
                              <option value="true"> Yes</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        {/* {values.isSerialNo == "true" && (
                          <div style={{ width: "10%" }}>
                            <Form.Group>
                              <Form.Label>Type</Form.Label>
                              <Form.Control
                                as="select"
                                onChange={(e) => {
                                  setFieldValue("mobileType", e.target.value);
                                }}
                                name="mobileType"
                              >
                                <option value="">None</option>
                                <option value="1">Single Sim</option>
                                <option value="2">Dual Sim</option>
                                <option value="3">Serial No</option>
                              </Form.Control>
                            </Form.Group>
                          </div>
                        )} */}

                        <Col md="1">
                          <Form.Group>
                            <Form.Label>Negative S</Form.Label>
                            <Form.Control
                              as="select"
                              value={values.isNegativeStocks}
                              onChange={(e) => {
                                setFieldValue(
                                  'isNegativeStocks',
                                  e.target.value
                                );
                              }}
                              name="isNegativeStocks"
                            >
                              <option value="false">No</option>
                              <option value="true">Yes</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <Col md="1">
                          <Form.Group>
                            <Form.Label>Warranty</Form.Label>
                            <Form.Control
                              as="select"
                              name="isWarranty"
                              value={values.isWarranty}
                              onChange={(e) => {
                                setFieldValue('isWarranty', e.target.value);
                              }}
                            >
                              <option value="false">No</option>
                              <option value="true">Yes</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        {values.isWarranty != 'false' && (
                          <Col md="1">
                            <div className="">
                              <Form.Group>
                                <Form.Label>Day's</Form.Label>
                                <Form.Control
                                  type="text"
                                  style={{ fontSize: '11px' }}
                                  placeholder="Day's"
                                  name="nodays"
                                  id="nodays"
                                  onChange={handleChange}
                                  value={values.nodays}
                                />
                              </Form.Group>
                            </div>
                          </Col>
                        )}
                        <Col md="1">
                          <Form.Group>
                            <Form.Label>Inventory</Form.Label>
                            <Form.Control
                              as="select"
                              value={values.isInventory}
                              onChange={(e) => {
                                setFieldValue('isInventory', e.target.value);
                              }}
                              name="isInventory"
                            >
                              <option value="false">No</option>
                              <option value="true">Yes</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>

                        {/* <Col md="1">
                          <Form.Group>
                            <Form.Label>Inventory</Form.Label>
                            <Form.Control
                              as="select"
                              value={values.isInventory}
                              onChange={(e) => {
                                setFieldValue('isInventory', e.target.value);
                              }}
                              name="isInventory"
                            >
                              <option value="false">No</option>
                              <option value="true"> Yes</option>
                            </Form.Control>
                          </Form.Group>
                        </Col> */}
                      </Row>
                      <hr style={{ marginTop: '5px', marginBottom: '5px' }} />

                      <Row>
                        {['High', 'Medium', 'Low'].map((v, i) => {
                          return (
                            <UnitConv
                              v={v}
                              setFieldValue={setFieldValue}
                              handleChangeUnitArrayElement={this.handleChangeUnitArrayElement.bind(
                                this
                              )}
                              unitarray={this.state.unitarray}
                            />
                          );
                        })}
                      </Row>

                      <Row>
                        <Col md="12">
                          <ButtonGroup
                            className="pull-right submitbtn pt-2"
                            aria-label="Basic example"
                          >
                            <Button
                              className="createbtn"
                              variant="secondary"
                              type="submit"
                            >
                              Submit
                            </Button>
                            <Button
                              variant="secondary"
                              className="alterbtn"
                              onClick={() => {
                                window.electron.ipcRenderer.webPageChange({
                                  from: 'productedit',
                                  to: 'productlist',
                                  isNewTab: false,
                                  prop_data: '',
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
            </div>
            {/* Group Create Modal */}
            <Modal
              show={groupModalShow}
              size="lg"
              className="groupnewmodal mt-5 mainmodal"
              onHide={() => this.handelgroupModalShow(false)}
              dialogClassName="modal-400w"
              // aria-labelledby="example-custom-modal-styling-title"
              aria-labelledby="contained-modal-title-vcenter"
              //centered
            >
              <Modal.Header
                closeButton
                closeVariant="white"
                className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
              >
                <Modal.Title
                  id="example-custom-modal-styling-title"
                  className=""
                >
                  Group
                </Modal.Title>
                {/* <CloseButton
                  variant="white"
                  className="pull-right"
                  //onClick={this.handleClose}
                  onClick={() => this.handelsubgroupModalShow(false)}
                /> */}
              </Modal.Header>
              <Modal.Body className=" p-4 p-invoice-modal">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  initialValues={{
                    groupName: '',
                  }}
                  validationSchema={Yup.object().shape({
                    groupName: Yup.string()
                      .trim()
                      .required('groupName is required'),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    let requestData = new FormData();
                    requestData.append('groupName', values.groupName);
                    createGroup(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification('Success', res.message);
                          this.lstGroups();
                          this.handelgroupModalShow(false);
                          resetForm();
                        } else {
                          ShowNotification('Error', res.message);
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
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <div className="purchasescreen">
                        <Row>
                          <Col md="9">
                            {/* <Form.Group>
                              <Form.Control
                                className="mb-3"
                                type="text"
                                name="usercode"
                                id="usercode"
                                placeholder="UserCode"
                                onChange={handleChange}
                                value={values.usercode}
                                isValid={touched.usercode && !errors.usercode}
                                isInvalid={!!errors.usercode}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.usercode}
                              </Form.Control.Feedback>
                            </Form.Group>*/}

                            <Form.Group>
                              <Form.Label>Group Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Group Name"
                                name="groupName"
                                id="groupName"
                                onChange={handleChange}
                                value={values.groupName}
                                isValid={touched.groupName && !errors.groupName}
                                isInvalid={!!errors.groupName}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.groupName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md="3" className="mt-4 btn_align">
                            <Button className="createbtn mt-3" type="submit">
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>
            {/* Group Create Modal */}

            {/*  Subgroup create modal*/}
            <Modal
              show={subgroupModalShow}
              size="lg"
              className="brandnewmodal mt-5 mainmodal"
              onHide={() => this.handelsubgroupModalShow(false)}
              dialogClassName="modal-400w"
              // aria-labelledby="example-custom-modal-styling-title"
              aria-labelledby="contained-modal-title-vcenter"
              //centered
            >
              <Modal.Header
                //closeButton
                className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
              >
                <Modal.Title
                  id="example-custom-modal-styling-title"
                  className=""
                >
                  Sub-group
                </Modal.Title>
                <CloseButton
                  variant="white"
                  className="pull-right"
                  //onClick={this.handleClose}
                  onClick={() => this.handelsubgroupModalShow(false)}
                />
              </Modal.Header>
              <Modal.Body className=" p-4 p-invoice-modal">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  initialValues={{
                    groupId: '',
                    brandName: '',
                  }}
                  validationSchema={Yup.object().shape({
                    groupId: Yup.object().required('groupName is required'),
                    brandName: Yup.string()
                      .trim()
                      .required('brandName is required'),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    let requestData = new FormData();
                    requestData.append('groupId', values.groupId.value);
                    requestData.append('brandName', values.brandName);
                    createBrand(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification('Success', res.message);
                          this.lstGroups();
                          this.handelsubgroupModalShow(false);
                          resetForm();
                        } else {
                          ShowNotification('Error', res.message);
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
                    <Form onSubmit={handleSubmit}>
                      <div className="purchasescreen">
                        <Row>
                          <Col md="5">
                            <Form.Group className="createnew">
                              <Form.Label>Select Group</Form.Label>
                              <Select
                                className="selectTo"
                                onChange={(v) => {
                                  setFieldValue('groupId', v);
                                }}
                                name="groupId"
                                styles={customStyles}
                                options={groupLst}
                                value={values.groupId}
                                invalid={errors.groupId ? true : false}
                                //styles={customStyles}
                              />
                              <span className="text-danger">
                                {errors.groupId}
                              </span>
                            </Form.Group>
                          </Col>

                          <Col md="4">
                            <Form.Group>
                              <Form.Label>Subgroup Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="subgroup Name"
                                name="brandName"
                                id="brandName"
                                onChange={handleChange}
                                value={values.brandName}
                                isValid={touched.brandName && !errors.brandName}
                                isInvalid={!!errors.brandName}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.brandName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md="3" className="mt-4 btn_align">
                            <Button className="createbtn mt-3" type="submit">
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>
            {/*  Subgroup create modal*/}
            {/* category */}
            <Modal
              show={categoryModalShow}
              size="lg"
              className="groupnewmodal mt-5 mainmodal"
              onHide={() => this.handelcategoryModalShow(false)}
              dialogClassName="modal-400w"
              // aria-labelledby="example-custom-modal-styling-title"
              aria-labelledby="contained-modal-title-vcenter"
              //centered
            >
              <Modal.Header
                // closeButton
                className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
              >
                <Modal.Title
                  id="example-custom-modal-styling-title"
                  className=""
                >
                  Category
                </Modal.Title>
                <CloseButton
                  variant="white"
                  className="pull-right"
                  //onClick={this.handleClose}
                  onClick={() => this.handelcategoryModalShow(false)}
                />
              </Modal.Header>
              <Modal.Body className=" p-4 p-invoice-modal">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={{
                    groupId: '',
                    brandId: '',
                    categoryName: '',
                  }}
                  validationSchema={Yup.object().shape({
                    groupId: Yup.object().required('select group'),
                    brandId: Yup.object().required('select brand'),
                    categoryName: Yup.string()
                      .trim()
                      .required('categoryName is required'),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    let requestData = new FormData();
                    requestData.append('brandId', values.brandId.value);
                    requestData.append('categoryName', values.categoryName);
                    createCategory(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification('Success', res.message);
                          this.lstGroups();
                          this.handelcategoryModalShow(false);
                          resetForm();
                        } else {
                          ShowNotification('Error', res.message);
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
                    <Form onSubmit={handleSubmit}>
                      <div className="purchasescreen">
                        <Row>
                          <Col md="6">
                            <Form.Group className="createnew">
                              <Form.Label>Select Group</Form.Label>
                              <Select
                                isClearable={true}
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  this.lstBrand(v.value);
                                  setFieldValue('brandId', null);
                                  setFieldValue('groupId', v);
                                }}
                                name="groupId"
                                options={groupLst}
                                value={values.groupId}
                                invalid={errors.groupId ? true : false}
                              />
                              <span className="text-danger">
                                {errors.groupId}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col md="6">
                            <Form.Group className="createnew">
                              <Form.Label>Select Subgroup</Form.Label>
                              <Select
                                isClearable={true}
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  setFieldValue('brandId', v);
                                }}
                                name="brandId"
                                options={brandLst}
                                value={values.brandId}
                                invalid={errors.brandId ? true : false}
                              />
                              <span className="text-danger">
                                {errors.brandId}
                              </span>
                            </Form.Group>
                          </Col>

                          <Col md="6">
                            <Form.Group>
                              <Form.Label>Category Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="category Name"
                                name="categoryName"
                                id="categoryName"
                                onChange={handleChange}
                                value={values.categoryName}
                                isValid={
                                  touched.categoryName && !errors.categoryName
                                }
                                isInvalid={!!errors.categoryName}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.categoryName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md="6" className="mt-4 btn_align">
                            <Button className="createbtn mt-3" type="submit">
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>

            {/* subcategory modal */}
            <Modal
              show={subcategoryModalShow}
              size="lg"
              className="brandnewmodal mt-5 mainmodal"
              onHide={() => this.handelsubcategoryModalShow(false)}
              dialogClassName="modal-400w"
              // aria-labelledby="example-custom-modal-styling-title"
              aria-labelledby="contained-modal-title-vcenter"
              //centered
            >
              <Modal.Header
                // closeButton
                className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
              >
                <Modal.Title
                  id="example-custom-modal-styling-title"
                  className=""
                >
                  Sub - Category
                </Modal.Title>
                <CloseButton
                  variant="white"
                  className="pull-right"
                  //onClick={this.handleClose}
                  onClick={() => this.handelsubcategoryModalShow(false)}
                />
              </Modal.Header>

              <Modal.Body className=" p-4 p-invoice-modal">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={{
                    groupId: '',
                    brandId: '',
                    categoryId: '',
                    subcategoryName: '',
                  }}
                  validationSchema={Yup.object().shape({
                    groupId: Yup.object().required('select group'),
                    brandId: Yup.object().required('select brand'),
                    categoryId: Yup.object().required('select category'),
                    subcategoryName: Yup.string()
                      .trim()
                      .required('subcategoryName is required'),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    let requestData = new FormData();
                    requestData.append('categoryId', values.categoryId.value);
                    requestData.append(
                      'subcategoryName',
                      values.subcategoryName
                    );
                    createSubCategory(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification('Success', res.message);
                          this.lstGroups();
                          this.handelsubcategoryModalShow(false);
                          resetForm();
                        } else {
                          ShowNotification('Error', res.message);
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
                    <Form onSubmit={handleSubmit}>
                      <div className="purchasescreen">
                        <Row>
                          <Col md="6">
                            <Form.Group className="createnew">
                              <Form.Label>Select Group</Form.Label>
                              <Select
                                isClearable={true}
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  this.lstBrand(v.value);
                                  setFieldValue('brandId', null);
                                  setFieldValue('categoryId', null);
                                  setFieldValue('groupId', v);
                                }}
                                name="groupId"
                                options={groupLst}
                                value={values.groupId}
                                invalid={errors.groupId ? true : false}
                              />
                              <span className="text-danger">
                                {errors.groupId}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col md="6">
                            <Form.Group className="createnew">
                              <Form.Label>Select Subgroup</Form.Label>
                              <Select
                                isClearable={true}
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  this.lstCategory(v.value);
                                  setFieldValue('brandId', v);
                                  setFieldValue('categoryId', null);
                                }}
                                name="brandId"
                                options={brandLst}
                                value={values.brandId}
                                invalid={errors.brandId ? true : false}
                              />
                              <span className="text-danger">
                                {errors.brandId}
                              </span>
                            </Form.Group>
                          </Col>

                          <Col md="6">
                            <Form.Group className="createnew">
                              <Form.Label>Category Name</Form.Label>
                              <Select
                                isClearable={true}
                                className="selectTo"
                                styles={customStyles}
                                onChange={(v) => {
                                  setFieldValue('categoryId', v);
                                }}
                                name="categoryId"
                                options={categoryLst}
                                value={values.categoryId}
                                invalid={errors.categoryId ? true : false}
                              />
                              <span className="text-danger">
                                {errors.categoryId}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col md="6">
                            <Form.Group>
                              <Form.Label>SubCategory Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="subcategoryName"
                                name="subcategoryName"
                                id="subcategoryName"
                                onChange={handleChange}
                                value={values.subcategoryName}
                                isValid={
                                  touched.subcategoryName &&
                                  !errors.subcategoryName
                                }
                                isInvalid={!!errors.subcategoryName}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.subcategoryName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md="12" className="mt-4 btn_align">
                            <Button className="createbtn" type="submit">
                              Submit
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
      </div>
    );
  }
}
