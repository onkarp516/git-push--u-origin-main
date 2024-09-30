import React, { Component } from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  ButtonGroup,
} from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";
import {
  authenticationService,
  get_companies_super_admin,
  createCompanyUser,
  get_c_admin_users,
  get_user_by_id,
  updateInstituteUser,
  getSysAllPermissions,
} from "@/services/api_functions";
import Select from "react-select";
import {
  EMAILREGEXP,
  numericRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  customStyles,
  eventBus,
  ArraySplitChunkElement,
  MyNotifications,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

export default class UserCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opendiv: false,
      opCompanyList: [],
      data: [],
      InitVal: {
        id: "",
        companyId: "",
        fullName: "",
        mobileNumber: "",
        userRole: "USER",
        email: "",
        gender: "",
        usercode: "",
        password: "",
      },
      userRole: "USER",
      sysPermission: [],
      userPermission: [],
    };
    this.ref = React.createRef();
  }

  listSysPermission = () => {
    getSysAllPermissions()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.userActions;
          if (data.length > 0) {
            let splitdata = ArraySplitChunkElement(data, 4);
            this.setState({ sysPermission: splitdata });
          }
        } else {
          this.setState({ sysPermission: [] });
        }
      })
      .catch((error) => {
        this.setState({ sysPermission: [] });
        console.log("error", error);
      });
  };

  listGetCompany = (status = false) => {
    get_companies_super_admin()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let Opt = [];
          if (d.length > 0) {
            Opt = d.map(function (values) {
              return { value: values.id, label: values.companyName };
            });
          }
          this.setState({ opCompanyList: Opt }, () => {
            let instituteId = getValue(
              Opt,
              authenticationService.currentUserValue.instituteId
            );
            this.ref.current.setFieldValue("instituteId", instituteId);
          });
        }
      })
      .catch((error) => {
        this.setState({ opInstituteList: [] });
        console.log("error", error);
      });
  };

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.listSysPermission();
      this.listGetCompany();
      this.setInitValue();
      mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      mousetrap.bindGlobal("ctrl+c", this.setInitValue);
    }
  }

  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+s", this.handleSubmitForm);
    mousetrap.unbindGlobal("ctrl+c", this.setInitValue);
  }

  setInitValue = () => {
    this.ref.current.resetForm();
    this.setState({
      opendiv: false,
      opCompanyList: [],
      data: [],
      InitVal: {
        id: "",
        companyId: "",
        fullName: "",
        mobileNumber: "",
        userRole: "USER",
        email: "",
        gender: "",
        usercode: "",
        password: "",
      },
      userRole: "USER",
    });
  };

  handleActionSelection = (status, mapping_id, action_id) => {
    let { userPermission } = this.state;
    if (status == true) {
      let user = {
        mapping_id: mapping_id,
        actions: [action_id],
      };
      let is_new = true;
      userPermission = userPermission.map((v) => {
        if (v.mapping_id == mapping_id) {
          if (!v.actions.includes(action_id)) {
            let v_action = v.actions;
            v.actions = [...v_action, action_id];
            is_new = false;
          }
        }
        return v;
      });

      if (is_new == true) {
        userPermission = [...userPermission, user];
      }
      this.setState({ userPermission: userPermission });
    } else if (status == false) {
      userPermission = userPermission.map((v) => {
        if (v.mapping_id == mapping_id) {
          if (v.actions.includes(action_id)) {
            let v_action = v.actions;
            v.actions = v_action.filter((vi) => vi != action_id);
          }
        }
        return v;
      });

      this.setState({
        userPermission: userPermission.length > 0 ? userPermission : [],
      });
    }
  };

  getActionSelectionOption = (mapping_id, action_id) => {
    let { userPermission } = this.state;
    let res = false;
    userPermission.map((v) => {
      if (v.mapping_id == mapping_id) {
        if (v.actions.includes(action_id)) {
          res = true;
        }
      }
    });

    return res;
  };
  validationSchema = () => {
    if (this.state.InitVal.id == "") {
      return Yup.object().shape({
        companyId: Yup.object().required("Select company"),
        fullName: Yup.string().trim().required("Full name is required"),
        mobileNumber: Yup.string()
          .trim()
          .matches(numericRegExp, "Enter valid mobile number")
          .required("Mobile number is required"),
        email: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .trim()
              .matches(EMAILREGEXP, "Enter valid email id")
              .required("Email is required");
          }
          return Yup.string().notRequired();
        }),
        gender: Yup.string().trim().required("Gender is required"),
        password: Yup.string().trim().required("Password is required"),
        usercode: Yup.string().trim().required("Usercode is required"),
      });
    } else {
      return Yup.object().shape({
        companyId: Yup.object().required("select company"),
        fullName: Yup.string().trim().required("Full Name is required"),
        mobileNumber: Yup.string()
          .trim()
          .matches(numericRegExp, "Enter valid mobile number")
          .required("Mobile Number is required"),
        email: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .trim()
              .matches(EMAILREGEXP, "Enter valid email id")
              .required("Email is required");
          }
          return Yup.string().notRequired();
        }),
        gender: Yup.string().trim().required("gender is required"),
        // password: Yup.string().trim().required("password is required"),
        usercode: Yup.string().trim().required("usercode is required"),
      });
    }
  };

  pageReload = () => {
    this.componentDidMount();
  };
  render() {
    const { opCompanyList, InitVal, sysPermission, userPermission } =
      this.state;
    return (
      <div className="">
        <div id="example-collapse-text" className="common-form-style m-2">
          <div className="mb-2 m-0">
            {/* <h4 className="form-header">  User</h4> */}
            <Formik
              validateOnChange={false}
              // validateOnBlur={false}
              enableReinitialize={true}
              initialValues={InitVal}
              innerRef={this.ref}
              validationSchema={this.validationSchema()}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let keys = Object.keys(InitVal);
                let requestData = new FormData();
                keys.map((v) => {
                  if (values[v] != "" && v != "companyId") {
                    requestData.append(v, values[v]);
                  }
                });
                requestData.append("companyId", values.companyId.value);
                requestData.append(
                  "user_permissions",
                  JSON.stringify(this.state.userPermission)
                );
                // Display the key/value pairs
                for (var pair of requestData.entries()) {
                  console.log(pair[0] + ", " + pair[1]);
                }

                if (values.id == "") {
                  createCompanyUser(requestData)
                    .then((response) => {
                      setSubmitting(false);
                      let res = response.data;
                      if (res.responseStatus == 200) {
                        //   ShowNotification("Success", res.message);
                        resetForm();
                        MyNotifications.fire({
                          show: true,
                          icon: "success",
                          title: "Success",
                          msg: res.message,
                          is_timeout: true,
                          delay: 1000,
                        });

                        this.pageReload();
                      } else {
                        //   ShowNotification("Error", res.message);
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
                      setSubmitting(false);
                      console.log("error", error);
                      // ShowNotification(
                      //   "Error",
                      //   "Not allowed duplicate user code "
                      // );
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: error,
                        is_button_show: true,
                      });
                    });
                } else {
                  updateInstituteUser(requestData)
                    .then((response) => {
                      setSubmitting(false);
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

                        this.pageReload();
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
                      setSubmitting(false);
                      console.log("error", error);
                    });
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
                  <Row className="mt-4 row-border">
                    <Col md="12" className="mb-4">
                      <h5 className="title-style">User Details</h5>
                      <Row className="m-0">
                        <Col md="3">
                          <Form.Group className="createnew">
                            <Form.Label>Company Name</Form.Label>
                            <Select
                              isClearable={true}
                              className="selectTo"
                              styles={customStyles}
                              onChange={(v) => {
                                if (v != null) {
                                  setFieldValue("companyId", v);
                                } else {
                                  setFieldValue("companyId", "");
                                }
                              }}
                              name="companyId"
                              options={opCompanyList}
                              value={values.companyId}
                              invalid={errors.companyId ? true : false}
                            />
                            <span className="text-danger errormsg">
                              {errors.companyId && errors.companyId}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Full Name"
                              name="fullName"
                              id="fullName"
                              onChange={handleChange}
                              value={values.fullName}
                              isValid={touched.fullName && !errors.fullName}
                              isInvalid={!!errors.fullName}
                            />
                            <span className="text-danger errormsg">
                              {errors.fullName}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="2">
                          <Form.Group>
                            <Form.Label>Mobile No</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder=" Mobile No"
                              name="mobileNumber"
                              id="mobileNumber"
                              onChange={handleChange}
                              value={values.mobileNumber}
                              isValid={
                                touched.mobileNumber && !errors.mobileNumber
                              }
                              isInvalid={!!errors.mobileNumber}
                              maxLength={10}
                            />
                            <span className="text-danger errormsg">
                              {errors.mobileNumber}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Email"
                              name="email"
                              id="email"
                              onChange={handleChange}
                              value={values.email}
                              isValid={touched.email && !errors.email}
                              isInvalid={!!errors.email}
                            />
                            <span className="text-danger errormsg">
                              {errors.email}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mt-4 m-0">
                        <Col md="2">
                          <Form.Group>
                            <Form.Label className="mb-0">Gender</Form.Label>
                          </Form.Group>
                          <Form.Group className="gender1 custom-control-inline radiotag">
                            <Form.Check
                              type="radio"
                              label="Male"
                              className="pr-3"
                              name="gender"
                              id="gender1"
                              value="male"
                              onChange={handleChange}
                              checked={values.gender == "male" ? true : false}
                            />
                            <Form.Check
                              type="radio"
                              label="Female"
                              name="gender"
                              id="gender2"
                              value="female"
                              className=""
                              onChange={handleChange}
                              checked={values.gender == "female" ? true : false}
                            />
                          </Form.Group>
                          <span className="text-danger errormsg">
                            {errors.gender && "Please select gender."}
                          </span>
                        </Col>
                        <Col md="2">
                          <Form.Group>
                            <Form.Label>User Code</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="User Code"
                              name="usercode"
                              id="usercode"
                              onChange={handleChange}
                              value={values.usercode}
                              isValid={touched.usercode && !errors.usercode}
                              isInvalid={!!errors.usercode}
                            />
                            <span className="text-danger errormsg">
                              {errors.usercode}
                            </span>
                          </Form.Group>
                        </Col>
                        {values.id == "" && (
                          <Col md="2">
                            <Form.Group>
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                id="password"
                                onChange={handleChange}
                                value={values.password}
                                isValid={touched.password && !errors.password}
                                isInvalid={!!errors.password}
                              />
                              <span className="text-danger errormsg">
                                {errors.password}
                              </span>
                            </Form.Group>
                          </Col>
                        )}
                        {!values.id == "" && <Col md="3"></Col>}
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-4 row-border">
                    <Col md="12" className="mb-4">
                      <h5 className="title-style">Permissions</h5>
                      {sysPermission &&
                        sysPermission.length > 0 &&
                        sysPermission.map((v, i) => {
                          return (
                            <>
                              <Row className="m-0">
                                {v &&
                                  v.length > 0 &&
                                  v.map((vi, ii) => {
                                    return (
                                      <>
                                        <Col md={2}>
                                          <Form.Group>
                                            <Form.Label className="mb-3">
                                              {vi.name}
                                            </Form.Label>
                                            <div>
                                              {vi.actions &&
                                                vi.actions.length > 0 &&
                                                vi.actions.map((vii, iii) => {
                                                  return (
                                                    <>
                                                      <Form.Check
                                                        inline
                                                        type={"checkbox"}
                                                        id={`check-api-${iii}-${ii}-${i}`}
                                                      >
                                                        <Form.Check.Input
                                                          type={"checkbox"}
                                                          defaultChecked={false}
                                                          name={`actions-${iii}-${ii}-${i}`}
                                                          checked={this.getActionSelectionOption(
                                                            vi.id,
                                                            vii.id
                                                          )}
                                                          onChange={(e) => {
                                                            this.handleActionSelection(
                                                              e.target.checked,
                                                              vi.id,
                                                              vii.id
                                                            );
                                                          }}
                                                          value={vii.id}
                                                        />
                                                        <Form.Check.Label>
                                                          {vii.name}
                                                        </Form.Check.Label>
                                                      </Form.Check>
                                                    </>
                                                  );
                                                })}
                                            </div>

                                            <span className="text-danger errormsg">
                                              {errors.unitCode}
                                            </span>
                                          </Form.Group>
                                        </Col>
                                      </>
                                    );
                                  })}
                              </Row>
                            </>
                          );
                        })}
                      {sysPermission &&
                        sysPermission.length > 0 &&
                        sysPermission.map((v, i) => {
                          return (
                            <>
                              <Form.Group>
                                <Form.Label className="mb-3">
                                  {v.name}
                                </Form.Label>
                                <div>
                                  {v.actions &&
                                    v.actions.length > 0 &&
                                    v.actions.map((vi, ii) => {
                                      return (
                                        <>
                                          <Form.Check
                                            inline
                                            type={"checkbox"}
                                            id={`check-api-${ii}-${i}`}
                                          >
                                            <Form.Check.Input
                                              type={"checkbox"}
                                              defaultChecked={false}
                                              name="actionsOptions"
                                              // checked={this.getActionSelectionOption(
                                              //   values,
                                              //   v.value
                                              // )}
                                              onChange={(e) => {
                                                this.handleActionSelection(
                                                  e.target.checked,
                                                  v.id,
                                                  vi.id
                                                );
                                              }}
                                              value={vi.id}
                                            />
                                            <Form.Check.Label>
                                              {vi.name}
                                            </Form.Check.Label>
                                          </Form.Check>
                                        </>
                                      );
                                    })}
                                </div>

                                <span className="text-danger errormsg">
                                  {errors.unitCode}
                                </span>
                              </Form.Group>
                              {/* <p>{v.name}</p> */}

                              {/* "V"=> {JSON.stringify(v)} */}
                            </>
                          );
                        })}
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md="12">
                      <ButtonGroup
                        className="float-end"
                        aria-label="Basic example"
                      >
                        <Button
                          className="submit-btn"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {values.id == "" ? "Submit" : "Update"}
                        </Button>
                        <Button
                          className="cancel-btn"
                          variant="secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "user_mgnt_list");
                          }}
                        >
                          Cancel
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}
