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
import { Formik } from "formik";

import * as Yup from "yup";

// import refresh from "@render/assets/images/refresh.png";

import {
  ShowNotification,
  getHeader,
  CustomDTHeader,
  AuthenticationCheck,
  isActionExist,
  MyNotifications,
  eventBus,
} from "@/helpers";
import axios from "axios";

import {
  createGroup,
  getGroups,
  updateGroup,
  get_outlet_groups,
  get_group,
} from "@/services/api_functions";
export default class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      showDiv: false,
      opendiv: false,
      data: [],
      getgrouptable: [],
      initValue: { id: "", groupName: "" },
    };
  }

  setInitValue = () => {
    let initValue = { id: "", groupName: "" };
    this.setState({ initValue: initValue, opendiv: false });
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    console.log("id", id);
    reqData.append("id", id);
    get_group(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          // this.setUpdateData(result.responseObject);

          this.setState({ initValue: result.responseObject, opendiv: true });
        } else {
          ShowNotification("Error", result.message);
        }
      })
      .catch((error) => {});
  };

  letgrouplst = () => {
    get_outlet_groups()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ getgrouptable: res.responseObject });
        }
      })
      .catch((error) => {});
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.setInitValue();
      this.letgrouplst();
    }
  }

  pageReload = () => {
    this.componentDidMount();
  };

  handleKeyDown = (event) => {
    event.stopPropagation();
    const { rowVirtualizer, config, id } = this.tableManager.current;
    const { scrollToOffset, scrollToIndex } = rowVirtualizer;
    const { header } = config.additionalProps;
    const { currentScrollPosition, setcurrentscrollposition } = header;
    let scrollPosition = 0;
    switch (event.key) {
      case "ArrowUp":
        let elem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
        if (elem != undefined && elem != null) {
          let up_row_id = elem.getAttribute("data-row-id");
          let up_id = elem.getAttribute("data-row-index");
          let uprowIndex = parseInt(up_id) - 1;
          if (uprowIndex > 0) {
            document
              .querySelectorAll(`#${id} .rgt-row-focus`)
              .forEach((cell) => cell.classList.remove("rgt-row-focus"));

            document
              .querySelectorAll(`#${id} .rgt-row-${uprowIndex}`)
              .forEach((cell) => cell.classList.add("rgt-row-focus"));
            scrollToIndex(uprowIndex - 3);
          }
        }

        break;

      case "ArrowDown":
        let downelem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
        if (downelem != undefined && downelem != null) {
          let d_id = downelem.getAttribute("data-row-index");
          let rowIndex = parseInt(d_id) + 1;
          document
            .querySelectorAll(`#${id} .rgt-row-focus`)
            .forEach((cell) => cell.classList.remove("rgt-row-focus"));
          document
            .querySelectorAll(`#${id} .rgt-row-${rowIndex}`)
            .forEach((cell) => cell.classList.add("rgt-row-focus"));
          scrollToIndex(rowIndex + 2);
        }
        break;
      case "e":
        if (id != undefined && id != null) {
          let downelem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
          if (downelem != undefined && downelem != null) {
            let d_index_id = downelem.getAttribute("data-row-index");
            let data_id = downelem.getAttribute("data-row-id");
            let rowIndex = parseInt(d_index_id) + 1;

            this.handleFetchData(data_id);
          }
        }
        break;

      default:
        break;
    }
  };

  handleRowClick = ({ rowIndex }) => {
    const { id } = this.tableManager.current;
    document
      .querySelectorAll(`#${id} .rgt-row-focus`)
      .forEach((cell) => cell.classList.remove("rgt-row-focus"));

    document
      .querySelectorAll(`#${id} .rgt-row-${rowIndex}`)
      .forEach((cell) => cell.classList.add("rgt-row-focus"));
  };

  render() {
    const { show, data, initValue, opendiv, getgrouptable, showDiv } =
      this.state;

    const columns = [
      {
        id: "group_name", // database column name
        field: "groupName", // response parameter name
        label: "Group Name",
        resizable: true,
      },
    ];
    return (
      <div className="">
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Create Brand</h4>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={initValue}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                  groupName: Yup.string()
                    .trim()
                    .required("Group name is required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let requestData = new FormData();
                  requestData.append("groupName", values.groupName);
                  if (values.id == "") {
                    createGroup(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          resetForm();
                          this.props.handleRefresh(true);
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {});
                  } else {
                    requestData.append("id", values.id);
                    updateGroup(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          resetForm();
                          this.props.handleRefresh(true);
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
                }) => (
                  <Form onSubmit={handleSubmit} className="form-style">
                    <Row>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>Brand Name</Form.Label>
                          <Form.Control
                            autoFocus="1"
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
                      <Col md="9" className="mt-4 pt-1 btn_align">
                        <Button className="submit-btn" type="submit">
                          {values.id == "" ? "Submit" : "Update"}
                        </Button>
                        <Button
                          // type="submit"
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
          {/* <h6>Group</h6> */}

          <Row className="p-2">
            <Col md="3">
              <Form>
                <Form.Group className="mt-1" controlId="formBasicSearch">
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
              {!opendiv && (
                <Button
                  className="create-btn mr-2"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   this.setState({ opendiv: !opendiv });
                  // }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isActionExist("group", "create")) {
                      // eventBus.dispatch("page_change", "group");
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

          {/* <Footer /> */}
          <Form>
            <div className="table_wrapper row-inside denomination-style">
              {/* {getgrouptable.length > 0 && ( */}
              <Table hover size="sm" className="tbl-font">
                <thead>
                  {/* <div className="scrollbar_hd"> */}
                  <tr>
                    <th>#.</th>

                    <th>Brand Name</th>
                  </tr>
                  {/* </div> */}
                </thead>
                <tbody className="tabletrcursor">
                  {/* <div className="scrollban_new"> */}
                  {getgrouptable.length > 0 ? (
                    getgrouptable.map((v, i) => {
                      return (
                        <tr
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            this.handleFetchData(v.id);
                          }}
                          // onDoubleClick={(e) => {
                          //   if (isActionExist("group", "edit")) {
                          //     if (v.default_ledger == false) {
                          //       this.handleFetchData(v.id);
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
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                  {/* </div> */}
                </tbody>
              </Table>
              {/* )} */}
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
