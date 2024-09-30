import React from "react";
import {
  Button,
  Col,
  Row,
  Navbar,
  NavDropdown,
  Item,
  Nav,
  Form,
  Container,
  InputGroup,
  Table,
  Alert,
  Modal,
  CloseButton,
  Collapse,
} from "react-bootstrap";
import Select from "react-select";
import {
  ShowNotification,
  getSelectValue,
  AuthenticationCheck,
  getHeader,
  customStyles,
  MyNotifications,
  eventBus,
  isActionExist,
} from "@/helpers";
import { Formik } from "formik";
// import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";

// import refresh from "@render/assets/images/refresh.png";

import {
  createGroup,
  getGroups,
  createBrand,
  getBrands,
  getAllBrands,
  updateBrand,
  get_subgroups,
} from "@/services/api_functions";
// import GroupSelectList from "@/helpers/GroupSelectList";

export default class Brand extends React.Component {
  constructor(props) {
    super(props);
    this.brandFormRef = React.createRef();
    this.state = {
      show: false,
      groupModalShow: false,
      showDiv: true,
      opendiv: false,
      groupLst: [],
      getsubgrouptable: [],
      data: [],
      initVal: {
        id: "",
        groupId: "",
        brandName: "",
      },
    };
  }

  handelgroupModalShow = (status) => {
    this.setState({ groupModalShow: status });
  };
  handleClose = () => {
    this.setState({ show: false }, () => {
      this.pageReload();
    });
  };
  setInitValue = () => {
    let initVal = {
      id: "",
      groupId: "",
      brandName: "",
    };
    this.setState({ initVal: initVal, opendiv: false });
  };
  lstGroups = (setVal = null) => {
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

            if (setVal != null && Opt.length > 0) {
              let { groupLst, initVal } = this.state;

              let current = this.brandFormRef.current;
              current.setFieldValue(
                "groupId",
                getSelectValue(groupLst, parseInt(setVal))
              );

              initVal["groupId"] = getSelectValue(groupLst, parseInt(setVal));
              this.setState({ initVal: initVal });
            }
          }
        }
      })

      .catch((error) => {});
  };

  letsubgrouplst = () => {
    getAllBrands()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ getsubgrouptable: res.responseObject });
        }
      })
      .catch((error) => {
        this.setState({ getsubgrouptable: [] });
      });
  };

  handleModal = (status) => {
    if (status == true) {
      this.setInitValue();
    }
    this.setState({ show: status }, () => {
      // this.pageReload();
    });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstGroups();
      this.setInitValue();
      this.letsubgrouplst();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }

  pageReload = () => {
    this.componentDidMount();
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_subgroups(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          // this.setUpdateData(result.responseObject);
          let ob = result.responseObject;
          let initVal = {
            id: ob.id,
            groupId: getSelectValue(this.state.groupLst, ob.groupId),
            brandName: ob.subgroupName,
          };
          this.setState({ initVal: initVal, opendiv: true });
        } else {
          ShowNotification("Error", result.message);
        }
      })
      .catch((error) => {});
  };

  render() {
    const {
      show,
      groupLst,
      data,
      initVal,
      groupModalShow,
      opendiv,
      showDiv,
      getsubgrouptable,
    } = this.state;

    const columns = [
      {
        id: "group_name", // database column name
        field: "groupName", // response parameter name
        label: "Group Name",
        resizable: true,
      },
      {
        id: "subgroup_name", // database column name
        field: "subgroupName", // response parameter name
        label: "Subgroup Name",
        resizable: true,
      },
    ];

    return (
      <div className="">
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Create Group</h4>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                innerRef={this.brandFormRef}
                enableReinitialize={true}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  groupId: Yup.object()
                    .nullable()
                    .required("Group name is required"),
                  brandName: Yup.string()
                    .nullable()
                    .trim()
                    .required("Sub group name is required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let requestData = new FormData();
                  requestData.append("groupId", values.groupId.value);
                  requestData.append("brandName", values.brandName);
                  if (values.id == "") {
                    createBrand(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);

                          this.handleModal(false);
                          resetForm();
                          this.props.handleRefresh(true);
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {});
                  } else {
                    requestData.append("id", values.id);
                    updateBrand(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);

                          this.handleModal(false);
                          resetForm();
                          this.props.handleRefresh(true);

                          this.setInitValue();
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
                  <Form onSubmit={handleSubmit} className="form-style">
                    <Row>
                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Select Brand
                            <a
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                this.handelgroupModalShow(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-plus-square-dotted m-2"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                              </svg>{" "}
                            </a>
                          </Form.Label>
                          <Select
                            isClearable={true}
                            autoFocus="true"
                            className="selectTo"
                            styles={customStyles}
                            onChange={(v) => {
                              setFieldValue("groupId", v);
                            }}
                            name="groupId"
                            options={groupLst}
                            value={values.groupId}
                            invalid={errors.groupId ? true : false}
                          />
                          <span className="text-danger errormsg">
                            {errors.groupId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="4">
                        <Form.Group>
                          <Form.Label>Brand Name </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=" Brand Name"
                            name="brandName"
                            id="brandName"
                            onChange={handleChange}
                            value={values.brandName}
                            isValid={touched.brandName && !errors.brandName}
                            isInvalid={!!errors.brandName}
                          />
                          <span className="text-danger errormsg">
                            {errors.brandName}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="5" className="mt-4 pt-1 btn_align">
                        <Button className="submit-btn" type="submit">
                          {values.id == "" ? "Submit" : "Update"}
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ opendiv: !opendiv }, () => {
                              this.pageReload();
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
        <div className="wrapper_div mb-2" style={{ height: "84vh" }}>
          {/* {!opendiv && ( */}
          <Row className="p-2">
            <Col md="3">
              <Form>
                <Form.Group className="  mt-1" controlId="formBasicSearch">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    className="search-box"
                  />
                  {/* <Button type="submit">x</Button> */}
                </Form.Group>
              </Form>
            </Col>

            <Col md="9" className="mt-2 text-end">
              {/* {this.state.hide == 'true'} */}
              {!opendiv && (
                <Button
                  className="create-btn mr-2"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   this.setState({ opendiv: !opendiv });
                  // }}

                  onClick={(e) => {
                    e.preventDefault();
                    if (isActionExist("brand", "create")) {
                      this.setState({ opendiv: !opendiv });
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
                  aria-controls="example-collapse-text"
                  aria-expanded={opendiv}
                  // onClick={this.open}
                >
                  Create
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-plus-square-dotted svg-style"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg>
                </Button>
              )}

              <Button
                className="ml-2 refresh-btn"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.handleRefresh(true);
                }}
              >
                Refresh
              </Button>
            </Col>
          </Row>
          {/* )} */}

          <div className="table_wrapper row-inside denomination-style">
            {/* {getsubgrouptable.length > 0 && ( */}
            <Table hover size="sm" className="tbl-font">
              <thead>
                {/* <div className="scrollbar_hd"> */}
                <tr>
                  {this.state.showDiv && <th> #.</th>}
                  <th>Brand Name</th>
                  <th>Group Name</th>
                </tr>
                {/* </div> */}
              </thead>
              <tbody className="tabletrcursor">
                {/* <div className="scrollban_new"> */}
                {getsubgrouptable.length > 0 ? (
                  getsubgrouptable.map((v, i) => {
                    return (
                      <tr
                        onDoubleClick={(e) => {
                          this.handleFetchData(v.id);
                        }}

                        // onDoubleClick={(e) => {
                        //   if (isActionExist("brand", "edit")) {
                        //     if (v.default_ledger == false) {
                        //       this.setUpdateValue(v.id);
                        //     } else {
                        //       ShowNotification(
                        //         "Error",
                        //         "Permission denied to update (Default Ledgers)"
                        //       );
                        //     }
                        //   } else {
                        //     MyNotifications.fire({
                        //       show: true,
                        //       icon: "error",
                        //       title: "Error",
                        //       msg: "Permission is denied!",
                        //       is_button_show: true,
                        //     });
                        //   }
                        // }}
                      >
                        <td>{i + 1}</td>
                        <td>{v.groupName}</td>
                        <td>{v.subgroupName}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colspan="3" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
                {/* </div> */}
              </tbody>
            </Table>
            {/* )} */}
          </div>

          {/* Group Create Modal */}
          <Modal
            show={groupModalShow}
            size="md"
            className=" mt-5 mainmodal"
            onHide={() => this.handelgroupModalShow(false)}
            dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header>
              <Modal.Title>Brand</Modal.Title>
              <CloseButton
                // variant="white"
                className="pull-right"
                //onClick={this.handleClose}
                onClick={() => this.handelgroupModalShow(false)}
              />
            </Modal.Header>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={{
                groupName: "",
              }}
              validationSchema={Yup.object().shape({
                groupName: Yup.string()
                  .trim()
                  .required("Group name is required"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let requestData = new FormData();
                requestData.append("groupName", values.groupName);
                createGroup(requestData)
                  .then((response) => {
                    let res = response.data;
                    if (res.responseStatus == 200) {
                      resetForm();
                      ShowNotification("Success", res.message);
                      this.lstGroups(res.responseObject);
                      this.handelgroupModalShow(false);
                      // this.props.handleRefresh(true);
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
                handleSubmit,
                isSubmitting,
                resetForm,
              }) => (
                <Form onSubmit={handleSubmit} className="form-style">
                  <Modal.Body className=" p-2">
                    <div className="common-form-style">
                      <Row>
                        <Col md="9">
                          <Form.Group>
                            <Form.Label>Brand Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Brand Name"
                              name="groupName"
                              id="groupName"
                              onChange={handleChange}
                              value={values.groupName}
                              isValid={touched.groupName && !errors.groupName}
                              isInvalid={!!errors.groupName}
                            />
                            {/* <Form.Control.Feedback type="invalid"> */}
                            <span className="text-danger errormsg">
                              {errors.groupName}
                            </span>
                            {/* </Form.Control.Feedback> */}
                          </Form.Group>
                        </Col>
                        {/* <Col md="3" className="mt-4 btn_align">
                          <Button className="createbtn mt-2" type="submit">
                            Submit
                          </Button>
                        </Col> */}
                      </Row>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary submit-btn" type="submit">
                      Submit
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
          {/* Group Create Modal */}
        </div>
      </div>
    );
  }
}
