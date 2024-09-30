import React from "react";
import { Button, Col, Row, Form, InputGroup, Table } from "react-bootstrap";
import { getProductLst, get_product_List } from "@/services/api_functions";
import {
  AuthenticationCheck,
  MyDatePicker,
  eventBus,
  MyNotifications,
  isActionExist,
  ShowNotification,
} from "@/helpers";

export default class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      brandshow: false,
      opendiv: false,
      showDiv: false,
      productdetaillistmodal: false,
      getproducttable: [],
      productLst: [],
    };
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  letproductlst = () => {
    getProductLst()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ getproducttable: res.data });
        }
      })
      .catch((error) => {
        this.setState({ getproducttable: [] });
      });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  handleFetchData = (id) => {
    // window.electron.ipcRenderer.webPageChange({
    //   from: "productlist",
    //   to: "productedit",
    //   isNewTab: false,
    //   prop_data: id,
    // });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.letproductlst();
    }
  }

  render() {
    const columns = [
      {
        id: "product_name", // database column name
        field: "productName", // response parameter name
        label: "Product Name",
        resizable: true,
      },
      {
        id: "alias", // database column name
        field: "alias", // response parameter name
        label: "Search Code",
        resizable: true,
      },
      {
        id: "group_name", // database column name
        field: "groupName", // response parameter name
        label: "Brand Name",
        resizable: true,
      },
      {
        id: "subgroup_name", // database column name
        field: "subgroupName", // response parameter name
        label: "Group Name",
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
      brandshow,
      productLst,
      productdetaillistmodal,
      showDiv,
      opendiv,
      getproducttable,
    } = this.state;
    return (
      <div className="wrapper_div">
        <div className="cust_table">
          {!opendiv && (
            <Row style={{ padding: "8px" }}>
              <Col md="3">
                <div className="">
                  <Form>
                    <Form.Group
                      className="search_btn_style mt-1"
                      controlId="formBasicSearch"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        className="main_search"
                      />
                      {/* <Button type="submit">x</Button> */}
                    </Form.Group>
                  </Form>
                </div>
              </Col>
              <Col md="5">
                <InputGroup className="mb-3 ">
                  <MyDatePicker
                    placeholderText="DD/MM/YYYY"
                    id="bill_dt"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="FROM DATE"
                    // onChange={(date) => {
                    //   setFieldValue('bill_dt', date);
                    // }}
                    // selected={values.bill_dt}
                    maxDate={new Date()}
                    className="date-style"
                  />
                  <InputGroup.Text id="basic-addon2" className=" mt-1">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                  </InputGroup.Text>
                  <MyDatePicker
                    placeholderText="DD/MM/YYYY"
                    id="bill_dt"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="TO DATE"
                    // onChange={(date) => {
                    //   setFieldValue('bill_dt', date);
                    // }}
                    // selected={values.bill_dt}
                    maxDate={new Date()}
                    className="date-style"
                  />
                </InputGroup>
              </Col>
              <Col md="4" className="btn_align mainbtn_create">
                {/* {this.state.hide == 'true'} */}
                <Button
                  className="create-btn mr-2"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   // this.setState({ opendiv: !opendiv });
                  //   // window.electron.ipcRenderer.webPageChange(
                  //   //   "productcreate"
                  //   // );
                  //   eventBus.dispatch("page_change", "productcreate");
                  // }}

                  onClick={(e) => {
                    e.preventDefault();
                    if (isActionExist("productlist", "create")) {
                      eventBus.dispatch("page_change", "productcreate");
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
                  Create
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-plus-square-dotted svg-style"
                    viewBox="0 0 16 16"
                  >
                    Create
                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg>
                </Button>
                <Button
                  className="ml-2 refresh-btn"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    this.pageReload();
                  }}
                >
                  Refresh
                </Button>
              </Col>
            </Row>
          )}
          {/* {getproducttable.length > 0 && ( */}
          <div className="table_wrapper p-2 denomination-style">
            <Table hover size="sm" className="tbl-font">
              <thead>
                {/* <div className="scrollbar_hd"> */}
                <tr>
                  <th>Sr. #.</th>

                  <th>Product Name</th>
                  <th>Search Code</th>
                  <th>Brand</th>
                  <th>Group</th>
                  <th>Category</th>
                  <th>Subcategoty</th>
                  {/* <th style={{ textAlign: "center" }}>Quantity</th> */}
                  {/* <th style={{ textAlign: "center" }}>Rate</th> */}
                </tr>
                {/* <tr className="bg_prdct_list">
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>
                    <tr className="hml_padding">
                      <th>H</th>
                      <th>M</th>
                      <th>L</th>
                    </tr>
                  </th>
                  <th>
                    <tr className="hml_padding">
                      <th>H</th>
                      <th>M</th>
                      <th>L</th>
                    </tr>
                  </th>
                </tr> */}
                {/* </div> */}
              </thead>
              <tbody>
                {/* <div className="scrollban_new"> */}
                {getproducttable.map((v, i) => {
                  return (
                    <tr
                      // onDoubleClick={(e) => {
                      //   e.preventDefault();
                      //   this.handleFetchData(v.id);
                      // }}

                      onDoubleClick={(e) => {
                        if (isActionExist("productlist", "edit")) {
                          if (v.default_ledger == false) {
                            this.setUpdateValue(v.id);
                          } else {
                            ShowNotification(
                              "Error",
                              "Permission denied to update (Default Ledgers)"
                            );
                          }
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
                      <td style={{ width: "3%" }}>{i + 1}</td>

                      <td>{v.product_name}</td>
                      <td>{v.search_coce}</td>
                      <td>{v.brand_name}</td>
                      <td>{v.group_name}</td>
                      <td>{v.category_name}</td>
                      <td>{v.subcategory_name}</td>
                      {/* <td>
                        <tr>
                          <td style={{ textAlign: "right", width: "5%" }}>
                            0.00
                          </td>
                          <td style={{ textAlign: "right", width: "5%" }}>
                            0.00
                          </td>
                          <td style={{ textAlign: "right", width: "5%" }}>
                            0.00
                          </td>
                        </tr>
                      </td>
                      <td>
                        <tr>
                          <td style={{ textAlign: "right", width: "5%" }}>
                            0.00
                          </td>
                          <td style={{ textAlign: "right", width: "5%" }}>
                            0.00
                          </td>
                          <td style={{ textAlign: "right", width: "5%" }}>
                            0.00
                          </td>
                        </tr>
                      </td> */}
                    </tr>
                  );
                })}
                {/* </div> */}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
