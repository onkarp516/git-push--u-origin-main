import React, { Component } from "react";
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
  img,
  FormControl,
  InputGroup,
  Table,
  Alert,
  Modal,
  Tab,
  Card,
  Accordion,
  CloseButton,
  Tabs,
} from "react-bootstrap";

import login_background_suyash_gurukul from "@/assets/images/login_background_suyash_gurukul.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import login_background from "@/assets/images/3x/login_background.png";
import suyash_gurukul_logo from "@/assets/images/3x/suyash_gurukul_logo.png";
import {
  faUser as faSolidUser,
  faLock,
  faPlusSquare,
  faAngleDown,
  faSearch,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { authenticationService } from "@/services/api_functions";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  ShowNotification,
  AuthenticationCheck,
  eventBus,
  MyNotifications,
} from "@/helpers";

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Container
          fluid
          className="layout-style"
          style={{
            backgroundImage: `url(${login_background_suyash_gurukul})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "100vh",
            // marginTop:"10px"
          }}
        >
          <Row>
            <Col
              md={{ span: 3, offset: 9 }}
              lg={{ span: 3, offset: 9 }}
              sm={{ span: 3, offset: 9 }}
              className="login-layout"
            >
              <Row>
                <Col md={4} xs={12} className="logo-style">
                  <img alt="logo" src={suyash_gurukul_logo} />
                </Col>
                <Col md={12} xs={12}>
                  <p className="title-style">Welcome to Suyash Vidyalay</p>
                  <p className="title1-style">Login to your account</p>
                </Col>
              </Row>
              <Row>
                <Col md={12} xs={12}>
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={{
                      usercode: "",
                      password: "",
                    }}
                    validationSchema={Yup.object().shape({
                      usercode: Yup.string()
                        .trim()
                        .required("Username is required"),
                      password: Yup.string()
                        .trim()
                        .required("Password is required"),
                    })}
                    onSubmit={(value, { setSubmitting }) => {
                      setSubmitting(false);
                      authenticationService.login(value).then(
                        (response) => {
                          if (response.status == 200) {
                            localStorage.setItem(
                              "authenticationService",
                              response.token
                            );
                            // this.props.block.handleMultiScreen(true);
                            MyNotifications.fire({
                              show: true,
                              icon: "success",
                              title: "Success",
                              msg: "Login Done Successfully",
                              is_timeout: true,
                              delay: 1000,
                            });
                            eventBus.dispatch("handle_multiscreen", true);
                            eventBus.dispatch("handle_main_state", {
                              statekey: "isShowMenu",
                              statevalue: true,
                            });
                            eventBus.dispatch("page_change", "dashboard");
                          } else {
                            setSubmitting(false);
                            if (response.responseStatus == 401) {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: response.message,
                                is_button_show: true,
                              });
                            } else {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: "Server Error! Please Check Your Connectivity",
                              });
                              console.log(
                                "Server Error! Please Check Your Connectivity"
                              );
                            }
                          }
                        },
                        (error) => {
                          setSubmitting(false);
                          console.log("error", error);
                          // ShowNotification('Error', 'Error! ');
                        }
                      );
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
                      <Form
                        onSubmit={handleSubmit}
                        noValidation
                        className="login-form-style mt-3"
                      >
                        <Row>
                          <Col md={8} xs={12} className="form-control-width">
                            <InputGroup className="mb-3">
                              <InputGroup.Text className="form-control-icon">
                                <FontAwesomeIcon icon={faSolidUser} />
                              </InputGroup.Text>
                              <FormControl
                                placeholder="Username"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                name="usercode"
                                id="usercode"
                                type="text"
                                onChange={handleChange}
                                value={values.usercode}
                              />
                            </InputGroup>
                            <span className="text-danger">
                              {errors.usercode}
                            </span>
                          </Col>
                          <Col md={8} xs={12} className="form-control-width">
                            <InputGroup className="mb-3">
                              <InputGroup.Text className="form-control-icon">
                                <FontAwesomeIcon icon={faLock} />
                              </InputGroup.Text>
                              <FormControl
                                placeholder="Password"
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                name="password"
                                id="password"
                                type="password"
                                onChange={handleChange}
                                value={values.password}
                              />
                            </InputGroup>
                            <span className="text-danger">
                              {errors.password}
                            </span>
                          </Col>
                          <Col
                            md={8}
                            xs={12}
                            className="form-control-width mt-4"
                          >
                            <Button
                              variant="primary login-btn-style"
                              type="submit"
                            >
                              Login
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col
              md={11}
              lg={11}
              sm={11}
              className="bottom-style text-start mt-5"
            >
              <p className="title1-style">Designed & developed by</p>
              <p className="title2-style">Truethic Solutions</p>
              <hr className="hr-style" />
              <p className="title3-style">
                Copyright @ 2022Truethic Solution *v1.0
              </p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
