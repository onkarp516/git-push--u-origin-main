import React from "react";
import { Button, Col, Row, Form, Table, Collapse } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import Select from "react-select";
import {
  customStyles,
  ShowNotification,
  getSelectValue,
  AuthenticationCheck,
  isActionExist,
  MyNotifications,
} from "@/helpers";
import {
  createAssociateGroup,
  updateAssociateGroup,
  getUnderList,
  getAssociateGroups,
  get_associate_group,
} from "@/services/api_functions";

export default class AssociateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      hide: false,
      opendiv: false,
      showDiv: true,
      initValue: {
        associates_id: "",
        associates_group_name: "",
        underId: "",
      },
      undervalue: [],
      associategroupslst: [],
    };
    this.open = this.open.bind(this);
  }

  open() {
    const { showDiv } = this.state;
    this.setState({
      showDiv: !showDiv,
    });
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
          document // const customStyles = {
            //   control: (base) => ({
            //     ...base,
            //     height: 31,
            //     minHeight: 31,
            //     border: 'none',
            //     borderBottom: '1px solid #ccc',
            //     fontSize: '13px',
            //     //paddingBottom: "12px",
            //     boxShadow: 'none',
            //     //lineHeight: "20px",
            //   }),
            // };
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

            this.setUpdateValue(data_id);
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

  handlFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_associate_group(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          // this.setState({ undervalue: Opt });
        }
      })
      .catch((error) => {
        this.setState({ undervalue: [] });
      });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  lstUnders = () => {
    getUnderList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          let Opt = data.map((v, i) => {
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
  handleModal = (status) => {
    if (status == true) {
      let initValue = {
        associates_id: "",
        associates_group_name: "",
        underId: "",
      };
      this.setState({ initValue: initValue }, () => {
        this.setState({ show: status });
      });
    } else {
      this.setState({ show: status });
    }
  };
  setInitValue = () => {
    let initValue = {
      associates_id: "",
      underId: "",
      associates_group_name: "",
    };

    this.setState({ initValue: initValue, opendiv: false });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.setInitValue();
      this.lstUnders();
      this.lstAssociateGroups();
    }
  }
  lstAssociateGroups = () => {
    getAssociateGroups()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ associategroupslst: res.responseObject });
        }
      })
      .catch((error) => {});
  };

  setUpdateValue = (data) => {
    let { undervalue } = this.state;
    let underOptID;
    if (data.under_prefix_separator == "P") {
      underOptID = getSelectValue(undervalue, data.principle_id);
    } else if (data.under_prefix_separator == "PG") {
      underOptID = getSelectValue(
        undervalue,
        data.principle_id + "_" + data.sub_principle_id
      );
    } else if (data.under_prefix_separator == "AG") {
      underOptID = getSelectValue(
        undervalue,
        data.principle_id + "_" + data.sub_principle_id + "_" + data.under_id
      );
    }

    let initValue = {
      associates_id: data.associates_id,
      associates_group_name: data.associates_name,
      underId: underOptID,
    };
    this.setState({ initValue: initValue, opendiv: true });
  };
  render() {
    const columns = [
      {
        id: "associates_name", // database column name
        field: "associatesName", // response parameter name
        label: "Ledger Group",
        resizable: true,
      },
      {
        id: "under",
        field: "under",
        label: "Under",
        resizable: true,
      },
    ];

    const {
      show,
      initValue,
      undervalue,
      associategroupslst,
      opendiv,
      showDiv,
    } = this.state;

    return (
      <div className="">
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header"> Ledger Group</h4>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={initValue}
                validationSchema={Yup.object().shape({
                  associates_group_name: Yup.string()
                    .trim()
                    .required("Ledger Group is required"),
                  underId: Yup.object().nullable().required("Select Under"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let requestData = new FormData();

                  requestData.append(
                    "associates_group_name",
                    values.associates_group_name
                  );

                  if (values.underId != null) {
                    requestData.append(
                      "principle_id",
                      values.underId ? values.underId.principle_id : ""
                    );
                  }

                  if (
                    values.underId != null &&
                    values.underId.sub_principle_id != ""
                  ) {
                    requestData.append(
                      "sub_principle_id",
                      values.underId
                        ? values.underId.sub_principle_id
                          ? values.underId.sub_principle_id
                          : ""
                        : ""
                    );
                  }

                  if (
                    values.underId != null &&
                    values.underId.under_prefix != ""
                  ) {
                    requestData.append(
                      "under_prefix",
                      values.underId ? values.underId.under_prefix : ""
                    );
                  }

                  if (values.associates_id == "") {
                    createAssociateGroup(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);

                          resetForm();
                          this.pageReload();
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {});
                  } else {
                    requestData.append("associates_id", values.associates_id);
                    updateAssociateGroup(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);

                          resetForm();
                          this.pageReload();
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
                        <Form.Group>
                          <Form.Label>
                            Under{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>{" "}
                          </Form.Label>
                          <Select
                            isClearable={true}
                            styles={customStyles}
                            className="selectTo"
                            onChange={(v) => {
                              setFieldValue("underId", v);
                            }}
                            name="underId"
                            id="underId"
                            options={undervalue}
                            value={values.underId}
                            invalid={errors.underId ? true : false}
                          />
                          <span className="text-danger errormsg">
                            {errors.underId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="4">
                        <Form.Group>
                          <Form.Label>
                            Ledger Group{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ledger Group"
                            name="associates_group_name"
                            id="associates_group_name"
                            onChange={handleChange}
                            value={values.associates_group_name}
                            isValid={
                              touched.associates_group_name &&
                              !errors.associates_group_name
                            }
                            isInvalid={!!errors.associates_group_name}
                          />
                          <span className="text-danger errormsg">
                            {errors.associates_group_name}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="5" className="btn_align pt-4 mt-1">
                        <Button className="submit-btn" type="submit">
                          {values.associates_id == "" ? "Submit" : "Update"}
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
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
        <div className="wrapper_div">
          <Row className="p-2">
            <Col md="3">
              <Form>
                <Form.Group className="mt-1" controlId="formBasicSearch">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    className="search-box"
                  />
                </Form.Group>
              </Form>
            </Col>

            <Col md="9" className="mt-2 text-end">
              {!opendiv && (
                <Button
                  className="create-btn mr-2"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ opendiv: !opendiv });
                    // if (isActionExist("associate-group", "create")) {
                    // } else {
                    //   MyNotifications.fire({
                    //     show: true,
                    //     icon: "error",
                    //     title: "Error",
                    //     msg: "Permission is denied!",
                    //     is_button_show: true,
                    //   });
                    // }
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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  this.pageReload();
                }}
              >
                Refresh
              </Button>
            </Col>
          </Row>
          <div className="table_wrapper row-inside denomination-style">
            {/* {isActionExist("associate-group", "list") && ( */}
            <Table
              hover
              size="sm"
              className="tbl-font"
              //  responsive
            >
              <thead>
                <tr>
                  {this.state.showDiv && <th>#.</th>}
                  <th>Under</th>
                  <th>Ledger Group</th>
                </tr>
              </thead>
              <tbody className="tabletrcursor">
                {associategroupslst.length > 0 ? (
                  associategroupslst.map((v, i) => {
                    return (
                      <tr
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          if (isActionExist("associate-group", "edit")) {
                            this.setUpdateValue(v);
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
                        <td>{i + 1}</td>
                        <td>{v.under_name}</td>
                        <td>{v.associates_name}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            {/* )} */}
          </div>
        </div>
      </div>
    );
  }
}
