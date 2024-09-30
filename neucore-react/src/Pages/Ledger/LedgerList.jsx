import React from "react";
import { Button, Col, Row, Form, Table } from "react-bootstrap";

import {
  ShowNotification,
  AuthenticationCheck,
  eventBus,
  isActionExist,
  MyNotifications,
  numberWithCommasIN,
} from "@/helpers";
import { getLedgers } from "@/services/api_functions";
import view_icon_3 from "@/assets/images/3x/view_icon_3.svg";
export default class LedgerList extends React.Component {
  constructor(props) {
    super(props);
    this.tableManager = React.createRef(null);
    this.state = {
      show: false,
      orgData: [],
      lstLedger: [],
      lstLedgerFiltered: [],
      isLedgerFilterd: true,
      opendiv: false,
      showDiv: true,
      totalDr: 0,
      totalCr: 0,
    };
  }
  getlstLedger = () => {
    getLedgers()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            { lstLedger: res.responseList, orgData: res.responseList },
            () => {
              this.getFilterLstLedger();
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  getFilterLstLedger = () => {
    let { isLedgerFilterd, lstLedger } = this.state;

    if (lstLedger.length > 0) {
      let filterLst = lstLedger;
      if (isLedgerFilterd) {
        filterLst = filterLst.filter(
          (v) => v.dr > 0 || v.cr > 0 || v.rdr > 0 || v.rcr > 0
        );
      }
      this.setState({ lstLedgerFiltered: filterLst });
    }
  };

  getDebitTotalAmount = () => {
    let { lstLedger } = this.state;
    let debitamt = 0;
    lstLedger.map((v) => {
      debitamt = parseFloat(debitamt) + parseFloat(v["dr"]);
    });

    return isNaN(debitamt) ? 0 : numberWithCommasIN(debitamt, true, 2);
  };

  getCreditTotalAmount = () => {
    let { lstLedger } = this.state;
    let creditamt = 0;
    lstLedger.map((v) => {
      creditamt = parseFloat(creditamt) + parseFloat(v["cr"]);
    });

    return isNaN(creditamt) ? 0 : numberWithCommasIN(creditamt, true, 2);
  };

  pageReload = () => {
    this.componentDidMount();
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getlstLedger();
    }
  }

  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter((v) =>
      v.ledger_name.toLowerCase().includes(vi.toLowerCase())
    );
    this.setState({ lstLedger: orgData_F });
  };

  render() {
    const {
      show,
      lstLedgerFiltered,
      isLedgerFilterd,
      lstLedger,
      totalDr,
      totalCr,
    } = this.state;

    return (
      <div className="wrapper_div">
        <div className="cust_table">
          <Row style={{ padding: "8px" }} className="headpart">
            <Col md="3">
              <div className="">
                <Form>
                  <Form.Group className="mt-1" controlId="formBasicSearch">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      className="search-box"
                      onChange={(e) => {
                        this.handleSearch(e.target.value);
                      }}
                    />
                    {/* <Button type="submit">x</Button> */}
                  </Form.Group>
                </Form>
              </div>
            </Col>

            <Col md="9" className="btn_align mainbtn_create">
              <div id="example-collapse-text">
                <div className="mb-2">
                  <Button
                    className="create-btn mr-2"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      eventBus.dispatch("page_change", "ledgercreate");
                      // if (isActionExist("ledger-list", "create")) {
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
                </div>
              </div>
            </Col>
          </Row>

          {/* {lstLedger.length > 0 && ( */}
          <div className="table_wrapper denomination-style">
            {/* {isActionExist("ledger-list", "list") && ( */}
            <Table hover size="sm" className="tbl-font">
              <thead>
                <tr>
                  {this.state.showDiv && <th>#.</th>}
                  <th>Ledger Name</th>
                  <th>Group Name</th>
                  <th className="">Debit</th>
                  <th className="">Credit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lstLedger.map((v, i) => {
                  let grpName = "";
                  if (v.group_name != "") {
                    grpName = v.group_name;
                  } else if (v.subprinciple_name != "") {
                    grpName = v.subprinciple_name;
                  } else if (v.principle_name != "") {
                    grpName = v.principle_name;
                  }

                  return (
                    <tr
                      onDoubleClick={(e) => {
                        if (isActionExist("ledger-list", "edit")) {
                          if (v.default_ledger == false) {
                            // this.setUpdateValue(v.id);
                            eventBus.dispatch("page_change", {
                              from: "ledgerlist",
                              to: "ledgeredit",
                              prop_data: v.ledgerId,
                              isNewTab: false,
                            });
                          } else {
                            ShowNotification(
                              "Error",
                              "Permission denied to update (Default Ledgers)"
                            );
                          }
                        } else {
                          MyNotifications.fire({
                            show: true,
                            title: "Error",
                            icon: "error",
                            msg: "Permission is denied!",
                            is_button_show: true,
                          });
                        }
                      }}
                      className="cursur_pointer"
                    >
                      <td>{i + 1}</td>
                      <td>{v.ledger_name}</td>
                      <td>{grpName}</td>
                      <td>{numberWithCommasIN(v.dr, true, 2)}</td>
                      <td>{numberWithCommasIN(v.cr, true, 2)}</td>

                      <td
                        onClick={(e) => {
                          if (v.default_ledger == false) {
                            eventBus.dispatch("page_change", {
                              from: "ledgerlist",
                              to: "ledgerdetails",
                              prop_data: v,
                              isNewTab: false,
                            });
                          } else {
                            ShowNotification(
                              "Error",
                              "Permission denied to update (Default Ledgers)"
                            );
                            MyNotifications.fire({
                              show: true,
                              icon: "warning",
                              title: "Warning",
                              msg: "Permission denied to update (Default Ledgers)",
                              delay: 1000,
                            });
                          }
                        }}
                      >
                        <img src={view_icon_3} title="View" />
                      </td>
                    </tr>
                  );
                })}

                {lstLedger.length == 0 && (
                  <tr>
                    <td colSpan={6}>No Data Found</td>
                  </tr>
                )}
              </tbody>
              {lstLedger.length > 0 && (
                <tfoot>
                  <tr className="fontbold">
                    <th colSpan={3}>Total</th>
                    <th>{this.getDebitTotalAmount()}</th>
                    <th>{this.getCreditTotalAmount()}</th>
                    <th></th>
                  </tr>
                </tfoot>
              )}
            </Table>
            {/* )} */}
          </div>
          {/* )} */}
        </div>
      </div>
    );
  }
}
