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
  Container,
  Nav,
  Tab,
  Table,
} from "react-bootstrap";
import { Formik } from "formik";
import edit from "@/assets/images/3x/edit.png";
import save from "@/assets/images/3x/save.png";
import cancel from "@/assets/images/3x/cancel.png";
import exit from "@/assets/images/3x/exit.png";
import upload_photo_placeholder_box from "@/assets/images/3x/upload_photo_placeholder_box.png";
import Select from "react-select";
import * as Yup from "yup";

import {
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
            <h4 className="form-header"> Student Admission</h4>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Nav
                variant="pills"
                className="flex-row tabstyle justify-content-evenly tabbackground text-center"
              >
                <Nav.Item>
                  <Nav.Link eventKey="first">STEP 1</Nav.Link>
                  <a className="text-center" eventKey="first">
                    Student Information
                  </a>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">STEP 2</Nav.Link>
                  <a className="text-center" eventKey="second">
                    Family Information
                  </a>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third">STEP 3</Nav.Link>
                  <a className="text-center" eventKey="third">
                    Last School Life
                  </a>
                </Nav.Item>
              </Nav>

              <Tab.Content className="p-5">
                <Tab.Pane eventKey="first">
                  <>
                    <Row>
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Row>
                          <Col sm="12" md="2" lg="3">
                            <Form.Group className="createnew">
                              <Form.Label>Selection</Form.Label>
                              <Select
                                className="selectTo formbg"
                                styles={customStyles}
                                name="country_id"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col lg="3">
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label>First Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter First Name"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={3}>
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label>Middle Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Middle Name"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={3}>
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label>Last Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Last Name"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                          </Col>

                          <Col lg="3">
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label lg="2" md="2">
                                Gender
                              </Form.Label>
                              <br />
                              <Form.Check
                                inline
                                label="Male"
                                name="gender"
                                value="male"
                                type="radio"
                              />
                              <Form.Check
                                inline
                                label="Female"
                                name="gender"
                                value="female"
                                type="radio"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mb-3 mt-4">
                          <Form.Label className="formlabelsize">DOB</Form.Label>
                          <br />

                          <Col lg={4} md={4} sm={8} className="mb-2">
                            <MyDatePicker
                              className="datepic form-control"
                              styles={customStyles}
                              name="dob"
                              placeholderText="dd/MM/yyyy"
                              id="dob"
                              dateFormat="dd/MM/yyyy"
                            />
                          </Col>
                          <Col lg={2} md={2} sm={8} className="mb-2">
                            <FormControl
                              className="datepic"
                              styles={customStyles}
                              name="dob"
                              placeholderText="dd/MM/yyyy"
                              id="dob"
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6}>
                        <Form.Label className="formlabelsize">
                          Student Photo
                        </Form.Label>
                        <div className="img-style">
                          <div className="upload-btn-wrapper text-center p-3">
                            <img
                              src={upload_photo_placeholder_box}
                              alt="Logo"
                            ></img>
                            <input type="file" name="myfile"></input>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>Birth Place</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Birth Place Name"
                            name="year"
                            id="year"
                            className="formbg"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Nationality</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Mother Tongue</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Religion</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Caste</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Sub Caste</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Category</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>Home Town</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Home Town Name"
                            name="year"
                            id="year"
                            className="formbg"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>Aadhar Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Aadhar No."
                            name="year"
                            id="year"
                            className="formbg"
                          />
                        </Form.Group>
                      </Col>

                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>Saral ID</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Saral ID"
                            name="year"
                            id="year"
                            className="formbg"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <>
                    <Row>
                      <Col lg={8} md={6} sm={6} xs={6}>
                        <Row className="mt-3">
                          <Col lg="3">
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label>Father Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Father Name"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={3}>
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label>Father Occupation</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Father Occupation"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={3}>
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label>Mother Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Mother Name"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                          </Col>

                          <Col lg={3}>
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label>Mother Occupation</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Mother Occupation"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mb-2 mt-4">
                          <Col lg={6}>
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label>Office Address</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Office Address"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                            <Form.Group
                              className="mb-3 checkboxfont"
                              controlId="formBasicCheckbox"
                            >
                              <Form.Check
                                type="checkbox"
                                label="Same as current address"
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={6}>
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label>Permanent Address</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Permanent Address"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2} md={3} sm={3} xs={3} className="">
                        <Form.Label className="formlabelsize">
                          Father Photo
                        </Form.Label>
                        <div className="img-style">
                          <div className="upload-btn-wrapper text-center p-3">
                            <img
                              src={upload_photo_placeholder_box}
                              alt="Logo"
                            ></img>
                            <input type="file" name="myfile"></input>
                          </div>
                        </div>
                      </Col>
                      <Col lg={2} md={3} sm={3} xs={3}>
                        <Form.Label className="formlabelsize">
                          Mother Photo
                        </Form.Label>
                        <div className="img-style">
                          <div className="upload-btn-wrapper text-center p-3">
                            <img
                              src={upload_photo_placeholder_box}
                              alt="Logo"
                            ></img>
                            <input type="file" name="myfile"></input>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>Phone Home</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Phone Home"
                            name="year"
                            id="year"
                            className="formbg"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>Mobile No.</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Mobile No."
                            name="year"
                            id="year"
                            className="formbg"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>Alt Mobile No.</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Alt Mob No."
                            name="year"
                            id="year"
                            className="formbg"
                          />
                        </Form.Group>
                      </Col>

                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>Email ID</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Email id"
                            name="year"
                            id="year"
                            className="formbg"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <>
                    <Row>
                      <Col lg={12} md={6} sm={6} xs={6}>
                        <Row className="mt-3">
                          <Col lg="2">
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label>General Registration No.</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Registration No"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={3}>
                            <Form.Group sm="12" md="2" lg="3">
                              <Form.Label>Name Of Prev. School</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter name of prev. school"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={2}>
                            <Form.Group sm="12" md="2" lg="2">
                              <Form.Label>Standard In Prev. School</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Std In Prev. School"
                                name="year"
                                id="year"
                                className="formbg"
                              />
                            </Form.Group>
                          </Col>

                          <Col lg={2}>
                            <Form.Group className="createnew">
                              <Form.Label>Result</Form.Label>
                              <Select
                                className="selectTo formbg"
                                styles={customStyles}
                                name="country_id"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <div>
                      <p className="formlabelsize admission-granted">
                        STD to which Admission Granted:
                      </p>
                    </div>
                    <hr className="horizontalline stdhorizontalline"></hr>
                    <Row className="mb-4">
                      <Col lg="2">
                        <Form.Label className="formlabelsize">
                          Date Of Admission
                        </Form.Label>
                        <br />

                        <MyDatePicker
                          className="datepic form-control"
                          styles={customStyles}
                          name="dob"
                          placeholderText="dd/MM/yyyy"
                          id="dob"
                          dateFormat="dd/MM/yyyy"
                        />
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Academic Year</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>STD Admitted</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>

                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Division</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Current STD</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={1}>
                        <Form.Group className="createnew">
                          <Form.Label></Form.Label>
                          <FormControl
                            className="datepic"
                            styles={customStyles}
                            name="dob"
                            placeholderText=""
                            id="dob"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={1}>
                        <Form.Group className="createnew">
                          <Form.Label></Form.Label>
                          <FormControl
                            className="datepic"
                            styles={customStyles}
                            name="dob"
                            placeholderText=""
                            id="dob"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Type</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Hostel</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>

                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Bus Concession</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label></Form.Label>
                          <FormControl
                            className="datepic"
                            styles={customStyles}
                            name="dob"
                            placeholderText=""
                            id="dob"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Scholarship</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Student Type</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>NTS</Form.Label>
                          <Select
                            className="selectTo formbg"
                            styles={customStyles}
                            name="country_id"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        <Form.Group className="createnew">
                          <Form.Label>Concession</Form.Label>
                          <FormControl
                            className="datepic"
                            styles={customStyles}
                            name="dob"
                            placeholderText=""
                            id="dob"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
            <div className="p-2 text-center fourbtnfeestrans">
              <Button type="submit" className="submitbtn formbtn affiliated">
                Save
                <img src={save} alt="" className="btsubmit "></img>
              </Button>

              <Button
                type="submit"
                className="submitbtn editbtn formbtn affiliated"
                variant="success"
              >
                Edit
                <img src={edit} alt="" className="btsubmit "></img>
              </Button>

              <Button
                type="submit"
                className="submitbtn cancelbtn formbtn affiliated"
                variant="secondary"
              >
                Cancel
                <img src={cancel} alt="" className="btsubmit "></img>
              </Button>

              <Button
                type="submit"
                className="submitbtn exitbtn formbtn affiliated"
                variant="danger"
              >
                Exit
                <img src={exit} alt="" className="btsubmit "></img>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
