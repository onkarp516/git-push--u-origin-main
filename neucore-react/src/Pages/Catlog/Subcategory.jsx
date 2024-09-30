import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  Collapse,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import Select from "react-select";
import {
  getGroups,
  getBrands,
  getCategory,
  createSubCategory,
  getAllSubCategory,
  updateSubCategory,
  get_subcategory,
  createGroup,
  createBrand,
  createCategory,
} from "@/services/api_functions";

import {
  getHeader,
  ShowNotification,
  getSelectValue,
  AuthenticationCheck,
  customStyles,
  customStylesWhite,
  isActionExist,
  MyNotifications,
  eventBus,
} from "@/helpers";
export default class SubCategory extends React.Component {
  constructor(props) {
    super(props);
    this.subCategoryFormRef = React.createRef();
    this.state = {
      show: false,
      opendiv: false,
      showDiv: false,
      groupLst: [],
      brandLst: [],
      categoryLst: [],
      getsubcategorytable: [],
      data: [],
      initVal: {
        id: "",
        groupId: "",
        brandId: "",
        categoryId: "",
        subcategoryName: "",
      },
    };
  }

  handelsubgroupModalShow = (status, initObject = null) => {
    if (status == true) {
      let subGroupInitValue = {
        groupId: initObject.groupId,
        brandName: "",
      };
      this.setState({
        initVal: initObject,
        subGroupInitValue: subGroupInitValue,
        subgroupModalShow: status,
      });
    } else {
      this.setState({
        subgroupModalShow: status,
      });
    }
  };

  handelcategoryModalShow = (status, initObject = null) => {
    if (status == true) {
      let categoryInitValue = {
        groupId: initObject.groupId,
        brandId: initObject.brandId,
        categoryName: "",
      };
      this.setState({
        initVal: initObject,
        categoryInitValue: categoryInitValue,
        categoryModalShow: status,
      });
    } else {
      this.setState({
        categoryModalShow: status,
      });
    }
  };

  setInitValue = () => {
    let initVal = {
      id: "",
      brandId: "",
      categoryId: "",
      subcategoryName: "",
    };
    this.setState({ initVal: initVal, opendiv: false });
  };

  letsubcategorylst = () => {
    getAllSubCategory()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ getsubcategorytable: res.responseObject });
        }
      })
      .catch((error) => {
        this.setState({ getsubcategorytable: [] });
      });
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
              let current = this.subCategoryFormRef.current;
              current.setFieldValue(
                "groupId",
                getSelectValue(Opt, parseInt(setVal))
              );

              let { initVal } = this.state;
              initVal["groupId"] = getSelectValue(Opt, parseInt(setVal));
              this.setState({ initVal: initVal });
            }
          }
        }
      })
      .catch((error) => {});
  };
  lstBrand = (id, v = null, subgroupId = null) => {
    let requestData = new FormData();
    requestData.append("groupId", id);
    getBrands(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.subgroupName };
            });
            this.setState({ brandLst: Opt }, () => {
              if (v != null && subgroupId != null) {
                let { initVal } = this.state;
                initVal["brandId"] = getSelectValue(Opt, parseInt(subgroupId));
                this.setState({ initVal: initVal }, () => {
                  if (v.categoryId != "") {
                    this.lstCategory(subgroupId, initVal);
                  }
                });
              } else if (v != null && Opt.length > 0) {
                let { initVal } = this.state;
                initVal["categoryId"] = v.categoryId;
                initVal["brandId"] = getSelectValue(
                  Opt,
                  parseInt(v.subgroupId)
                );
                this.setState({ initVal: initVal }, () => {
                  if (v.categoryId != "") {
                    this.lstCategory(v.subgroupId, initVal);
                  }
                });
              }
            });
          } else {
            this.setState({ brandLst: [] });
          }
        }
      })
      .catch((error) => {});
  };
  lstCategory = (id, v = null, categoryId = null) => {
    let requestData = new FormData();
    requestData.append("subgroupId", id);
    getCategory(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.groupName };
            });
            this.setState({ categoryLst: Opt }, () => {
              if (v != null && categoryId != null) {
                let { initVal } = this.state;
                initVal["categoryId"] = getSelectValue(
                  Opt,
                  parseInt(categoryId)
                );
                this.setState({ initVal: initVal, opendiv: true });
              } else if (v != null && Opt.length > 0) {
                let { initVal } = this.state;
                initVal["categoryId"] = getSelectValue(
                  Opt,
                  parseInt(v.categoryId)
                );
                this.setState({ initVal: initVal, opendiv: true });
              }
            });
          } else {
            this.setState({ categoryLst: [] });
          }
        }
      })
      .catch((error) => {});
  };

  handleModal = (status) => {
    if (status == true) {
      this.setInitValue();
    }
    this.setState({ show: status }, () => {
      this.pageReload();
    });
  };
  handleClose = () => {
    this.setState({ show: false });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstGroups();
      this.setInitValue();
      this.letsubcategorylst();
    }
  }

  pageReload = () => {
    this.componentDidMount();
  };

  handleClose = () => {
    this.setState({ show: false }, () => {
      this.pageReload();
    });
  };
  handelgroupModalShow = (status) => {
    this.setState({ groupModalShow: status });
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

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_subcategory(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;

          let initVal = {
            id: res.id,
            groupId: getSelectValue(this.state.groupLst, res.groupId),
            brandId: "",
            categoryId: "",
            subcategoryName: res.subcategoryName,
          };
          this.setState({ initVal: initVal, opendiv: true }, () => {
            this.lstBrand(res.groupId, res);
          });
        } else {
          ShowNotification("Error", result.message);
        }
      })
      .catch((error) => {});
  };

  render() {
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
      {
        id: "category_name", // database column name
        field: "categoryName", // response parameter name
        label: "Category Name",
        resizable: true,
      },
      {
        id: "subcategory_name", // database column name
        field: "subcategoryName", // response parameter name
        label: "Subcategory Name",
        resizable: true,
      },
    ];

    const {
      show,
      groupLst,
      brandLst,
      categoryLst,
      categoryModalShow,
      data,
      initVal,
      opendiv,
      groupModalShow,
      subgroupModalShow,
      subcategoryModalShow,
      getsubcategorytable,
      showDiv,
      subGroupInitValue,
      categoryInitValue,
    } = this.state;

    return (
      <div className="">
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Create Sub Category</h4>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                innerRef={this.subCategoryFormRef}
                enableReinitialize={true}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  groupId: Yup.object().required("Select group"),
                  brandId: Yup.object().required("Select  sub group"),
                  categoryId: Yup.object().required("Select category"),
                  subcategoryName: Yup.string()
                    .trim()
                    .required("Sub category name is required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let requestData = new FormData();
                  requestData.append("categoryId", values.categoryId.value);
                  requestData.append("subcategoryName", values.subcategoryName);
                  if (values.id == "") {
                    createSubCategory(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          //this.lstGroups();
                          this.handleModal(false);
                          //this.lstSubcategory();
                          //this.setInitValue();
                          resetForm();
                          this.props.handleRefresh(true);
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {});
                  } else {
                    requestData.append("id", values.id);
                    updateSubCategory(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          //this.lstGroups();
                          this.handleModal(false);
                          //this.lstSubcategory();
                          //this.setInitValue();

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
                  setFieldValue,
                }) => (
                  <Form onSubmit={handleSubmit} className="form-style">
                    {/* {JSON.stringify(values, undefined, 2)} */}
                    <Row>
                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Select Brand
                            <a
                              href="#."
                              onClick={(e) => {
                                this.handelgroupModalShow(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                class="bi bi-plus-square-dotted svg-style"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                              </svg>{" "}
                            </a>
                          </Form.Label>
                          <Select
                            autoFocus="true"
                            isClearable={true}
                            styles={customStyles}
                            className="selectTo"
                            onChange={(v) => {
                              setFieldValue("groupId", v);
                              setFieldValue("brandId", "");
                              setFieldValue("categoryId", "");
                              if (v != null) {
                                this.lstBrand(v.value);
                              } else {
                                this.setState({ brandLst: [] });
                              }
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
                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Select Group
                            <a
                              href="#."
                              onClick={(e) => {
                                this.handelsubgroupModalShow(true, values);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                class="bi bi-plus-square-dotted svg-style"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                              </svg>{" "}
                            </a>
                          </Form.Label>
                          <Select
                            isClearable={true}
                            styles={customStyles}
                            className="selectTo"
                            onChange={(v) => {
                              setFieldValue("brandId", v);
                              setFieldValue("categoryId", "");
                              if (v != null) {
                                this.lstCategory(v.value);
                              } else {
                                this.setState({ categoryLst: [] });
                              }
                            }}
                            name="brandId"
                            options={brandLst}
                            value={values.brandId}
                            invalid={errors.brandId ? true : false}
                          />
                          <span className="text-danger errormsg">
                            {errors.brandId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Select Category
                            <a
                              href="#."
                              onClick={(e) => {
                                this.handelcategoryModalShow(true, values);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                class="bi bi-plus-square-dotted svg-style"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                              </svg>{" "}
                            </a>
                          </Form.Label>
                          <Select
                            isClearable={true}
                            styles={customStyles}
                            className="selectTo"
                            onChange={(v) => {
                              setFieldValue("categoryId", v);
                            }}
                            name="categoryId"
                            options={categoryLst}
                            value={values.categoryId}
                            invalid={errors.categoryId ? true : false}
                          />
                          <span className="text-danger errormsg">
                            {errors.categoryId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>Sub Category Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Sub Category Name"
                            name="subcategoryName"
                            id="subcategoryName"
                            onChange={handleChange}
                            value={values.subcategoryName}
                            isValid={
                              touched.subcategoryName && !errors.subcategoryName
                            }
                            isInvalid={!!errors.subcategoryName}
                          />
                          {/* <Form.Control.Feedback type="invalid"> */}
                          <span className="text-danger errormsg">
                            {errors.subcategoryName}
                          </span>
                          {/* </Form.Control.Feedback> */}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md="12" className="mt-2 btn_align">
                        <Button className="submit-btn" type="submit">
                          Submit
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
          <Row className="p-2">
            <Col md="3">
              <div className="">
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
              </div>
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
                    if (isActionExist("subcategory", "create")) {
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
            {/* {getsubcategorytable.length > 0 && ( */}
            <Table
              hover
              size="sm"
              className="tbl-font"
              // className="new_tbldesign"
              //responsive
            >
              <thead>
                {/* <div className="scrollbar_hd"> */}
                <tr>
                  {/* {this.state.showDiv && ( */}
                  <th>#.</th>
                  {/* )} */}
                  <th>Brand Name</th>
                  <th> Group Name</th>
                  <th>Category Name</th>
                  <th>Sub Category Name</th>
                </tr>
                {/* </div> */}
              </thead>
              <tbody className="tabletrcursor">
                {/* <div className="scrollban_new"> */}
                {getsubcategorytable.length > 0 ? (
                  getsubcategorytable.map((v, i) => {
                    return (
                      <tr
                        onDoubleClick={(e) => {
                          this.handleFetchData(v.id);
                        }}
                        // onDoubleClick={(e) => {
                        //   if (isActionExist("subcategory", "edit")) {
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
                        <td>{v.categoryName}</td>
                        <td>{v.subcategoryName}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
                {/* </div> */}
              </tbody>
            </Table>
            {/* )} */}
          </div>
        </div>

        {/* Group Create Modal */}
        <Modal
          show={groupModalShow}
          size="md"
          className="mt-5 mainmodal"
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
              groupName: Yup.string().trim().required("Group name is required"),
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
              <Form onSubmit={handleSubmit}>
                <Modal.Body className=" p-2 ">
                  <div className="common-form-style">
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
                          <Button className="createbtn mt-3" type="submit">
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
          <Modal.Header>
            <Modal.Title>Group</Modal.Title>
            <CloseButton
              // variant="white"
              className="pull-right"
              //onClick={this.handleClose}
              onClick={() => this.handelsubgroupModalShow(false)}
            />
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={subGroupInitValue}
            validationSchema={Yup.object().shape({
              groupId: Yup.object().required("Group name is required"),
              brandName: Yup.string()
                .trim()
                .required("Sub group name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let requestData = new FormData();
              requestData.append("groupId", subGroupInitValue.groupId.value);
              requestData.append("brandName", values.brandName);
              createBrand(requestData)
                .then((response) => {
                  let res = response.data;
                  if (res.responseStatus == 200) {
                    ShowNotification("Success", res.message);
                    this.lstBrand(
                      subGroupInitValue.groupId.value,
                      initVal,
                      res.responseObject
                    );
                    this.handelsubgroupModalShow(false);
                    resetForm();
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
              setFieldValue,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Modal.Body className=" p-2">
                  <div className="common-form-style">
                    <Row>
                      <Col md="5">
                        <Form.Group className="">
                          <Form.Label>Select Brand</Form.Label>
                          <Select
                            isDisabled={true}
                            className="selectTo"
                            onChange={(v) => {
                              setFieldValue("groupId", v);
                            }}
                            name="groupId"
                            styles={customStylesWhite}
                            options={groupLst}
                            value={values.groupId}
                            invalid={errors.groupId ? true : false}
                            //styles={customStyles}
                          />
                          <span className="text-danger errormsg">
                            {errors.groupId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="4">
                        <Form.Group>
                          <Form.Label> Group Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=" Group Name"
                            name="brandName"
                            id="brandName"
                            onChange={handleChange}
                            value={values.brandName}
                            isValid={touched.brandName && !errors.brandName}
                            isInvalid={!!errors.brandName}
                          />
                          {/* <Form.Control.Feedback type="invalid"> */}
                          <span className="text-danger errormsg">
                            {errors.brandName}
                          </span>
                          {/* </Form.Control.Feedback> */}
                        </Form.Group>
                      </Col>
                      {/* <Col md="3" className="mt-3 btn_align">
                          <Button className="createbtn mt-4" type="submit">
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
          <Modal.Header>
            <Modal.Title>Category</Modal.Title>
            <CloseButton
              // variant="white"
              className="pull-right"
              //onClick={this.handleClose}
              onClick={() => this.handelcategoryModalShow(false)}
            />
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={categoryInitValue}
            validationSchema={Yup.object().shape({
              groupId: Yup.object().required("Select group"),
              brandId: Yup.object().required("Select sub group name "),
              categoryName: Yup.string()
                .trim()
                .required("Category name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let requestData = new FormData();
              requestData.append("groupId", categoryInitValue.groupId.value);
              requestData.append("brandId", categoryInitValue.brandId.value);
              requestData.append("categoryName", values.categoryName);
              createCategory(requestData)
                .then((response) => {
                  let res = response.data;
                  if (res.responseStatus == 200) {
                    resetForm();
                    ShowNotification("Success", res.message);
                    this.lstCategory(
                      categoryInitValue.brandId.value,
                      initVal,
                      res.responseObject
                    );
                    this.handelcategoryModalShow(false);
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
              setFieldValue,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Modal.Body className=" p-2">
                  <div className="common-form-style">
                    <Row>
                      <Col md="4">
                        <Form.Group className="">
                          <Form.Label>Select Brand</Form.Label>
                          <Select
                            isDisabled={true}
                            isClearable={true}
                            className="selectTo"
                            styles={customStylesWhite}
                            onChange={(v) => {
                              setFieldValue("groupId", v);
                              setFieldValue("brandId", "");
                              if (v != null) {
                                this.lstBrand(v.value);
                              } else {
                                this.setState({ brandLst: [] });
                              }
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
                        <Form.Group className="">
                          <Form.Label>Select Group</Form.Label>
                          <Select
                            isDisabled={true}
                            isClearable={true}
                            className="selectTo"
                            styles={customStylesWhite}
                            onChange={(v) => {
                              setFieldValue("brandId", v);
                            }}
                            name="brandId"
                            options={brandLst}
                            value={values.brandId}
                            invalid={errors.brandId ? true : false}
                          />
                          <span className="text-danger errormsg">
                            {errors.brandId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="4">
                        <Form.Group>
                          <Form.Label>Category Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Category Name"
                            name="categoryName"
                            id="categoryName"
                            onChange={handleChange}
                            value={values.categoryName}
                            isValid={
                              touched.categoryName && !errors.categoryName
                            }
                            isInvalid={!!errors.categoryName}
                          />
                          {/* <Form.Control.Feedback type="invalid"> */}
                          <span className="text-danger errormsg">
                            {errors.categoryName}
                          </span>
                          {/* </Form.Control.Feedback> */}
                        </Form.Group>
                      </Col>
                      {/* <Col md="6" className="mt-4 btn_align">
                          <Button className="createbtn mt-3" type="submit">
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
      </div>
    );
  }
}
