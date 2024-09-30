import React, { Component } from "react";
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";

import { DropdownSubmenu, NavDropdownMenu } from "@/CustMenu";

import Datetime from "./Datetime";
import Profile_menu from "./Profile_menu";
import dashboard from "@/assets/images/1x/menu_dashboard.png";
import menu_master from "@/assets/images/1x/menu_master.png";
import menu_transaction from "@/assets/images/1x/menu_transaction.png";
import menu_account_entry from "@/assets/images/1x/menu_account_entry.png";
import menu_reports from "@/assets/images/1x/menu_reports.png";
import menu_utilities from "@/assets/images/1x/menu_utilities.png";
import { eventBus } from "@/helpers";
import { authenticationService } from "@/services/api_functions";
import { isParentExist, isActionExist } from "@/helpers";
export default class Menus extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <>
        <Navbar bg="light" expand="lg" sticky="top">
          <Container fluid className="menu-style">
            {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
            {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
            <Navbar.Collapse id="responsive-navbar-nav">
              {" "}
              {authenticationService.currentUserValue &&
                authenticationService.currentUserValue.userRole ===
                  "SADMIN" && (
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                    <Nav.Link
                      href="#."
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                    >
                      <img alt="" src={dashboard} /> Dashboard
                    </Nav.Link>
                    <NavDropdownMenu
                      // show={true}
                      title={
                        <span>
                          <img alt="" src={menu_master} /> Master
                        </span>
                      }
                    >
                      {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item> */}
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "company");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Company
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "companyuser");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Company User
                      </NavDropdown.Item>
                      {/* <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "outlet");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Outlet
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "outletuser");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Outlet User
                      </NavDropdown.Item> */}
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "mothertongue");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Mother Tongue
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "religion");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Religion
                      </NavDropdown.Item>

                      {/* <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "mothertongue");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Religion
                      </NavDropdown.Item> */}

                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "caste");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Caste
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "subcaste");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Sub Caste
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "castecategory");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Caste Category
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "bus");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Bus
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "scholarship");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        ScholarShip
                      </NavDropdown.Item>
                    </NavDropdownMenu>
                    <NavDropdownMenu
                      // show={true}
                      title={
                        <span>
                          <img alt="" src={menu_master} /> User Management
                        </span>
                      }
                    >
                      {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item> */}
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "user_mgnt_mst_actions"
                          );
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Actions
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "user_mgnt_mst_modules"
                          );
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Modules
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "user_mgnt_mst_module_mapping"
                          );
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Modules Mapping
                      </NavDropdown.Item>
                    </NavDropdownMenu>
                  </Nav>
                )}
              {authenticationService.currentUserValue &&
                authenticationService.currentUserValue.userRole ===
                  "BADMIN" && (
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                    <Nav.Link
                      href="#."
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                    >
                      <img alt="" src={dashboard} /> Dashboard
                    </Nav.Link>
                    {isParentExist("master") && (
                      <NavDropdownMenu
                        // show={true}
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Master
                          </span>
                        }
                      >
                        {isParentExist("student") && (
                          <DropdownSubmenu
                            href="#"
                            title={
                              <span>
                                <img alt="" src={menu_master} /> Student
                              </span>
                            }
                          >
                            {/* {isActionExist("school-catlog", "list") && ( */}
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch(
                                  "page_change",
                                  "schoolcatlog"
                                );
                              }}
                            >
                              School Catlog
                            </NavDropdown.Item>
                            {/* )} */}

                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "studentList");
                              }}
                            >
                              Student List
                            </NavDropdown.Item>

                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch(
                                  "page_change",
                                  "studentpromotionlist"
                                );
                              }}
                            >
                              Student Promotion
                            </NavDropdown.Item>
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch(
                                  "page_change",
                                  "studentbuslist"
                                );
                              }}
                            >
                              Student Transportation
                            </NavDropdown.Item>
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch(
                                  "page_change",
                                  "studentscholarshiplist"
                                );
                              }}
                            >
                              Student Scholar Ship
                            </NavDropdown.Item>
                          </DropdownSubmenu>
                        )}
                        {/* {isParentExist("fees") && ( */}
                        <DropdownSubmenu
                          href="#"
                          title={
                            <span>
                              <img alt="" src={menu_master} /> Fees
                            </span>
                          }
                        >
                          {/* {isActionExist("fees-head", "list") && ( */}
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "feeshead");
                            }}
                          >
                            Fee Head
                          </NavDropdown.Item>
                          {/* )} */}
                          {/* {isActionExist("sub-head", "list") && ( */}
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "feessubhead");
                            }}
                          >
                            Sub Head
                          </NavDropdown.Item>
                          {/* )}
                          {isActionExist("fees-master", "list") && ( */}
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch(
                                "page_change",
                                "feesmasterlist"
                              );
                            }}
                          >
                            Fees Master
                          </NavDropdown.Item>
                          {/* )}
                          {isActionExist("fees-installment", "list") && ( */}
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch(
                                "page_change",
                                "feesinstallmentList"
                              );
                            }}
                          >
                            Fees Installment
                          </NavDropdown.Item>
                          {/* )} */}
                        </DropdownSubmenu>
                        {/* )} */}
                        {isParentExist("account") && (
                          <DropdownSubmenu
                            href="#"
                            title={
                              <span>
                                <img alt="" src={menu_master} /> Account
                              </span>
                            }
                          >
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "ledgerlist");
                              }}
                            >
                              Ledger
                            </NavDropdown.Item>

                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch(
                                  "page_change",
                                  "associategroup"
                                );
                              }}
                            >
                              Ledger Group
                            </NavDropdown.Item>
                          </DropdownSubmenu>
                        )}
                        {isParentExist("inventory") && (
                          <DropdownSubmenu
                            href="#action/3.7"
                            title={
                              <span>
                                <img alt="" src={menu_master} /> Inventory
                              </span>
                            }
                            // show={true}
                          >
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "catlog");
                              }}
                            >
                              Catlog
                            </NavDropdown.Item>
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "hsn");
                              }}
                            >
                              HSN
                            </NavDropdown.Item>
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "unit");
                              }}
                            >
                              Unit
                            </NavDropdown.Item>
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "productlist");
                              }}
                            >
                              Product
                            </NavDropdown.Item>
                          </DropdownSubmenu>
                        )}
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "tax");
                          }}
                        >
                          <img alt="" src={menu_master} />
                          Tax Management
                        </NavDropdown.Item>
                      </NavDropdownMenu>
                    )}
                    <NavDropdownMenu
                      title={
                        <span>
                          <img alt="" src={menu_transaction} /> Transaction
                        </span>
                      }
                    >
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "studentPaymentList"
                          );
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Fees Payment
                      </NavDropdown.Item>
                      {/* <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "studentcopy");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Student Copy
                      </NavDropdown.Item> */}
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "bonafide");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Bonafide
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "bonafide_data");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Bonafide Data
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "bonafide_offset");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Bonafide Offset
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "lc");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        LC
                      </NavDropdown.Item>

                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Purchase
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_order_list"
                            );
                          }}
                        >
                          Order
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_challan_list"
                            );
                          }}
                        >
                          Challan
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_invoice_list"
                            );
                          }}
                        >
                          Invoice
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_debit_note_list"
                            );
                          }}
                        >
                          Purchase Return
                        </NavDropdown.Item>
                      </DropdownSubmenu>

                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Sales
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_quotation_list"
                            );
                          }}
                        >
                          Quotation
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_order_list"
                            );
                          }}
                        >
                          Order
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_challan_list"
                            );
                          }}
                        >
                          Challan
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_invoice_list"
                            );
                          }}
                        >
                          Invoice
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Sales Return
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_countersale_list"
                            );
                          }}
                        >
                          Counter Sales
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                    </NavDropdownMenu>
                    <NavDropdownMenu
                      title={
                        <span>
                          <img
                            alt="menu_account_entry"
                            src={menu_account_entry}
                          />
                          Account Entry
                        </span>
                      }
                    >
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Vouchers
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_receipt_list"
                            );
                          }}
                        >
                          Receipt
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_paymentlist"
                            );
                          }}
                        >
                          Payment
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_contra_List"
                            );
                          }}
                        >
                          Contra
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_journal_list"
                            );
                          }}
                        >
                          Journal
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_debit_note_List"
                            );
                          }}
                        >
                          Debit Note
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_credit_List"
                            );
                          }}
                        >
                          Credit Note
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Banking Operation
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#action/8.1">
                          Cheque Printing
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          PDC Summary
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Bank Reconcilation
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                    </NavDropdownMenu>
                    <NavDropdownMenu
                      title={
                        <span>
                          <img alt="menu_account_entry" src={menu_reports} />
                          Reports
                        </span>
                      }
                    >
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "outstandinglist");
                        }}
                      >
                        Outstanding List
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "dailycollection");
                        }}
                      >
                        Daily Collection
                      </NavDropdown.Item>
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Account
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#action/8.1">
                          Balance Sheet
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "profitbalance");
                          }}
                        >
                          Profit & Loss
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Trail Balance
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Cash / Bank Book
                        </NavDropdown.Item>
                      </DropdownSubmenu>

                      <NavDropdown.Item href="#action/3.1">
                        Day Book
                      </NavDropdown.Item>
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Inventory
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#action/8.1">
                          Clossing stock
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Stock Summary
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Movement Analysis
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Reorder Level
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                      <DropdownSubmenu
                        href="#."
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Voucher Registers
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#.">Sales</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Purchase</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Payment</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Receipt</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Contra</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Journal</NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Debit Note
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Credit Note
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                    </NavDropdownMenu>
                    <NavDropdownMenu
                      title={
                        <span>
                          <img alt="menu_account_entry" src={menu_utilities} />
                          Utilities
                        </span>
                      }
                    >
                      <NavDropdown.Item href="#.">Import</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Export</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Backup</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Restore</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Setting</NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "user_mgnt_list");
                        }}
                      >
                        User Management
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#.">
                        Barcode / QR Code Management
                      </NavDropdown.Item>
                    </NavDropdownMenu>
                  </Nav>
                )}
              {authenticationService.currentUserValue &&
                authenticationService.currentUserValue.userRole ===
                  "CADMIN" && (
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                    <Nav.Link
                      href="#."
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                    >
                      <img alt="" src={dashboard} /> Dashboard
                    </Nav.Link>
                    <NavDropdownMenu
                      // show={true}
                      title={
                        <span>
                          <img alt="" src={menu_master} /> Master
                        </span>
                      }
                    >
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "outlet");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Branch/Section
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "outletuser");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Branch/Section User
                      </NavDropdown.Item>

                      {isParentExist("account") && (
                        <DropdownSubmenu
                          href="#"
                          title={
                            <span>
                              <img alt="" src={menu_master} /> Account
                            </span>
                          }
                        >
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "ledgerlist");
                            }}
                          >
                            Ledger
                          </NavDropdown.Item>

                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch(
                                "page_change",
                                "associategroup"
                              );
                            }}
                          >
                            Ledger Group
                          </NavDropdown.Item>
                        </DropdownSubmenu>
                      )}
                    </NavDropdownMenu>

                    <NavDropdownMenu
                      title={
                        <span>
                          <img alt="" src={menu_transaction} /> Transaction
                        </span>
                      }
                    >
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Purchase
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_order_list"
                            );
                          }}
                        >
                          Order
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_challan_list"
                            );
                          }}
                        >
                          Challan
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_invoice_list"
                            );
                          }}
                        >
                          Invoice
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_debit_note_list"
                            );
                          }}
                        >
                          Purchase Return
                        </NavDropdown.Item>
                      </DropdownSubmenu>

                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Sales
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_quotation_list"
                            );
                          }}
                        >
                          Quotation
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_order_list"
                            );
                          }}
                        >
                          Order
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_challan_list"
                            );
                          }}
                        >
                          Challan
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_invoice_list"
                            );
                          }}
                        >
                          Invoice
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Sales Return
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_countersale_list"
                            );
                          }}
                        >
                          Counter Sales
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                    </NavDropdownMenu>

                    <NavDropdownMenu
                      title={
                        <span>
                          <img
                            alt="menu_account_entry"
                            src={menu_account_entry}
                          />
                          Account Entry
                        </span>
                      }
                    >
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Vouchers
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_receipt_list"
                            );
                          }}
                        >
                          Receipt
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_paymentlist"
                            );
                          }}
                        >
                          Payment
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_contra_List"
                            );
                          }}
                        >
                          Contra
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_journal_list"
                            );
                          }}
                        >
                          Journal
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_debit_note_List"
                            );
                          }}
                        >
                          Debit Note
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_credit_List"
                            );
                          }}
                        >
                          Credit Note
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Banking Operation
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#action/8.1">
                          Cheque Printing
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          PDC Summary
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Bank Reconcilation
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                    </NavDropdownMenu>
                  </Nav>
                )}
              {authenticationService.currentUserValue &&
                authenticationService.currentUserValue.userRole === "USER" && (
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                    <Nav.Link
                      href="#."
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                    >
                      <img alt="" src={dashboard} /> Dashboard
                    </Nav.Link>
                    {isParentExist("master") && (
                      <NavDropdownMenu
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Master
                          </span>
                        }
                      >
                        {isParentExist("account") && (
                          <DropdownSubmenu
                            href="#"
                            title={
                              <span>
                                <img alt="" src={menu_master} /> Account
                              </span>
                            }
                          >
                            {isActionExist("ledger-list", "list") && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "ledgerlist"
                                  );
                                }}
                              >
                                Ledger
                              </NavDropdown.Item>
                            )}
                            {isActionExist("associate-group", "list") && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "associategroup"
                                  );
                                }}
                              >
                                Ledger Group
                              </NavDropdown.Item>
                            )}
                          </DropdownSubmenu>
                        )}

                        <DropdownSubmenu
                          href="#."
                          title={
                            <span>
                              <img alt="" src={menu_master} /> Inventory
                            </span>
                          }
                          // show={true}
                        >
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "catlog");
                            }}
                          >
                            Catlog
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "hsn");
                            }}
                          >
                            HSN
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "unit");
                            }}
                          >
                            Unit
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "productlist");
                            }}
                          >
                            Product
                          </NavDropdown.Item>
                        </DropdownSubmenu>
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "tax");
                          }}
                        >
                          <img alt="" src={menu_master} />
                          Tax Management
                        </NavDropdown.Item>
                      </NavDropdownMenu>
                    )}
                    <NavDropdownMenu
                      title={
                        <span>
                          <img alt="" src={menu_transaction} /> Transaction
                        </span>
                      }
                    >
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Purchase
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_order_list"
                            );
                          }}
                        >
                          Order
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_challan_list"
                            );
                          }}
                        >
                          Challan
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_invoice_list"
                            );
                          }}
                        >
                          Invoice
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_debit_note_list"
                            );
                          }}
                        >
                          Purchase Return
                        </NavDropdown.Item>
                      </DropdownSubmenu>

                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Sales
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_quotation_list"
                            );
                          }}
                        >
                          Quotation
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_order_list"
                            );
                          }}
                        >
                          Order
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_challan_list"
                            );
                          }}
                        >
                          Challan
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_invoice_list"
                            );
                          }}
                        >
                          Invoice
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Sales Return
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_countersale_list"
                            );
                          }}
                        >
                          Counter Sales
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                    </NavDropdownMenu>
                    <NavDropdownMenu
                      title={
                        <span>
                          <img
                            alt="menu_account_entry"
                            src={menu_account_entry}
                          />
                          Account Entry
                        </span>
                      }
                    >
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Vouchers
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_receipt_list"
                            );
                          }}
                        >
                          Receipt
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_paymentlist"
                            );
                          }}
                        >
                          Payment
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_contra_List"
                            );
                          }}
                        >
                          Contra
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_journal_list"
                            );
                          }}
                        >
                          Journal
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_debit_note_List"
                            );
                          }}
                        >
                          Debit Note
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_credit_List"
                            );
                          }}
                        >
                          Credit Note
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Banking Operation
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#action/8.1">
                          Cheque Printing
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          PDC Summary
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Bank Reconcilation
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                    </NavDropdownMenu>
                    <NavDropdownMenu
                      title={
                        <span>
                          <img alt="menu_account_entry" src={menu_reports} />
                          Reports
                        </span>
                      }
                    >
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Account
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#action/8.1">
                          Balance Sheet
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Profit & Loss
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Trail Balance
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Cash / Bank Book
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                      <NavDropdown.Item href="#action/3.1">
                        Day Book
                      </NavDropdown.Item>
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Inventory
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#action/8.1">
                          Clossing stock
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Stock Summary
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Movement Analysis
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Reorder Level
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                      <DropdownSubmenu
                        href="#."
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Voucher Registers
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#.">Sales</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Purchase</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Payment</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Receipt</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Contra</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Journal</NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Debit Note
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Credit Note
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                    </NavDropdownMenu>
                    <NavDropdownMenu
                      title={
                        <span>
                          <img alt="menu_account_entry" src={menu_utilities} />
                          Utilities
                        </span>
                      }
                    >
                      <NavDropdown.Item href="#.">Import</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Export</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Backup</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Restore</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Setting</NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "user_mgnt_list");
                        }}
                      >
                        User Management
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#.">
                        Barcode / QR Code Management
                      </NavDropdown.Item>
                    </NavDropdownMenu>
                  </Nav>
                )}
              {authenticationService.currentUserValue &&
                authenticationService.currentUserValue.userRole === "USER" && (
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                    <Nav.Link
                      href="#."
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                    >
                      <img alt="" src={dashboard} /> Dashboard
                    </Nav.Link>
                    {isParentExist("master") && (
                      <NavDropdownMenu
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Master
                          </span>
                        }
                      >
                        {isParentExist("account") && (
                          <DropdownSubmenu
                            href="#"
                            title={
                              <span>
                                <img alt="" src={menu_master} /> Account
                              </span>
                            }
                          >
                            {isActionExist("ledger-list", "list") && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "ledgerlist"
                                  );
                                }}
                              >
                                Ledger
                              </NavDropdown.Item>
                            )}
                            {isActionExist("associate-group", "list") && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "associategroup"
                                  );
                                }}
                              >
                                Ledger Group
                              </NavDropdown.Item>
                            )}
                          </DropdownSubmenu>
                        )}

                        <DropdownSubmenu
                          href="#."
                          title={
                            <span>
                              <img alt="" src={menu_master} /> Inventory
                            </span>
                          }
                          // show={true}
                        >
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "catlog");
                            }}
                          >
                            Catlog
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "hsn");
                            }}
                          >
                            HSN
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "unit");
                            }}
                          >
                            Unit
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "productlist");
                            }}
                          >
                            Product
                          </NavDropdown.Item>
                        </DropdownSubmenu>
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "tax");
                          }}
                        >
                          <img alt="" src={menu_master} />
                          Tax Management
                        </NavDropdown.Item>
                      </NavDropdownMenu>
                    )}
                    <NavDropdownMenu
                      title={
                        <span>
                          <img alt="" src={menu_transaction} /> Transaction
                        </span>
                      }
                    >
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Purchase
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_order_list"
                            );
                          }}
                        >
                          Order
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_challan_list"
                            );
                          }}
                        >
                          Challan
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_invoice_list"
                            );
                          }}
                        >
                          Invoice
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_debit_note_list"
                            );
                          }}
                        >
                          Purchase Return
                        </NavDropdown.Item>
                      </DropdownSubmenu>

                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Sales
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_quotation_list"
                            );
                          }}
                        >
                          Quotation
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_order_list"
                            );
                          }}
                        >
                          Order
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_challan_list"
                            );
                          }}
                        >
                          Challan
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_invoice_list"
                            );
                          }}
                        >
                          Invoice
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Sales Return
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_countersale_list"
                            );
                          }}
                        >
                          Counter Sales
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                    </NavDropdownMenu>
                    <NavDropdownMenu
                      title={
                        <span>
                          <img
                            alt="menu_account_entry"
                            src={menu_account_entry}
                          />
                          Account Entry
                        </span>
                      }
                    >
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Vouchers
                          </span>
                        }
                      >
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_receipt_list"
                            );
                          }}
                        >
                          Receipt
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_paymentlist"
                            );
                          }}
                        >
                          Payment
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_contra_List"
                            );
                          }}
                        >
                          Contra
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_journal_list"
                            );
                          }}
                        >
                          Journal
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_debit_note_List"
                            );
                          }}
                        >
                          Debit Note
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "voucher_credit_List"
                            );
                          }}
                        >
                          Credit Note
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Banking Operation
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#action/8.1">
                          Cheque Printing
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          PDC Summary
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Bank Reconcilation
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                    </NavDropdownMenu>
                    <NavDropdownMenu
                      title={
                        <span>
                          <img alt="menu_account_entry" src={menu_reports} />
                          Reports
                        </span>
                      }
                    >
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Account
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#action/8.1">
                          Balance Sheet
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Profit & Loss
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Trail Balance
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Cash / Bank Book
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                      <NavDropdown.Item href="#action/3.1">
                        Day Book
                      </NavDropdown.Item>
                      <DropdownSubmenu
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Inventory
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#action/8.1">
                          Clossing stock
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Stock Summary
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Movement Analysis
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Reorder Level
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                      <DropdownSubmenu
                        href="#."
                        title={
                          <span>
                            <img alt="" src={menu_master} /> Voucher Registers
                          </span>
                        }
                      >
                        <NavDropdown.Item href="#.">Sales</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Purchase</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Payment</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Receipt</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Contra</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Journal</NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Debit Note
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Credit Note
                        </NavDropdown.Item>
                      </DropdownSubmenu>
                    </NavDropdownMenu>
                    <NavDropdownMenu
                      title={
                        <span>
                          <img alt="menu_account_entry" src={menu_utilities} />
                          Utilities
                        </span>
                      }
                    >
                      <NavDropdown.Item href="#.">Import</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Export</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Backup</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Restore</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Setting</NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "user_mgnt_list");
                        }}
                      >
                        User Management
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#.">
                        Barcode / QR Code Management
                      </NavDropdown.Item>
                    </NavDropdownMenu>
                  </Nav>
                )}
              <Datetime />
              <Nav.Link style={{ cursor: "none" }}>
                {authenticationService.currentUserValue &&
                authenticationService.currentUserValue.branchName != null
                  ? authenticationService.currentUserValue.branchName
                  : authenticationService.currentUserValue.CompanyName != null
                  ? authenticationService.currentUserValue.CompanyName
                  : ""}
              </Nav.Link>
              <Profile_menu />
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}
