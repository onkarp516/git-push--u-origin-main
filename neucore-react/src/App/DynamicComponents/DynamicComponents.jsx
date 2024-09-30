import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import CustComponets from "./CustComponets";
import MultiTab from "@/MultiTab/MultiTab";

import { eventBus, MyNotifications, LoadingComponent } from "@/helpers";
import Menus from "@/Pages/Layout/Menus";
import { authenticationService } from "@/services/api_functions";
import { Modal, Spinner } from "react-bootstrap";
import axios from "axios";
const data = [
  {
    _uid: uuidv4(),
    slug: "login",
    component: "login",
    headline: "Login",
    isActive: true,
    pageName: "Login",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "page1",
    component: "page1",
    headline: "Page1",
    isActive: false,
    pageName: "Page1",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "page2",
    component: "page2",
    headline: "Page2",
    isActive: false,
    pageName: "Page2",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "dashboard",
    component: "dashboard",
    headline: "Dashboard",
    isActive: false,
    pageName: "Dashboard",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "company",
    component: "company",
    headline: "Company",
    isActive: false,
    pageName: "Company",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "companyuser",
    component: "companyuser",
    title: "Company User",
    isActive: false,
    pageName: "Company User",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "mothertongue",
    component: "mothertongue",
    headline: "Mother Tongue",
    isActive: false,
    pageName: "Mother Tongue",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "outlet",
    component: "outlet",
    headline: "Outlet",
    isActive: false,
    pageName: "Branch/Section",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "outletuser",
    component: "outletuser",
    title: "Branch User",
    isActive: false,
    pageName: "Branch User",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "academicyear",
    component: "academicyear",
    title: "Academic Year",
    isActive: false,
    pageName: "Academic Year",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "division",
    component: "division",
    title: "Division",
    isActive: false,
    pageName: "Division",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "catlog",
    component: "catlog",
    headline: "Catlog",
    isActive: false,
    pageName: "Catlog",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "schoolcatlog",
    component: "schoolcatlog",
    headline: "School Catlog",
    isActive: false,
    pageName: "School Catlog",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "religion",
    component: "religion",
    headline: "Religion",
    isActive: false,
    pageName: "Religion",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "bus",
    component: "bus",
    headline: "Bus",
    isActive: false,
    pageName: "Bus",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "scholarship",
    component: "scholarship",
    headline: "ScholarShip",
    isActive: false,
    pageName: "ScholarShip",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "caste",
    component: "caste",
    headline: "Caste",
    isActive: false,
    pageName: "Caste",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "subcaste",
    component: "subcaste",
    headline: "Sub Caste",
    isActive: false,
    pageName: "Sub Caste",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "castecategory",
    component: "castecategory",
    headline: "Caste Category",
    isActive: false,
    pageName: "Caste Category",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "feeshead",
    component: "feeshead",
    headline: "Fee Head",
    isActive: false,
    pageName: "Fee Head",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "feessubhead",
    component: "feessubhead",
    headline: "Fee Sub Head",
    isActive: false,
    pageName: "Fee Sub Head",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "feesmaster",
    component: "feesmaster",
    headline: "Fees Master",
    isActive: false,
    pageName: "Fees Master",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "feesinstallment",
    component: "feesinstallment",
    headline: "Create Fees Installment",
    isActive: false,
    pageName: "Create Fees Installment",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "feesinstallmentList",
    component: "feesinstallmentList",
    headline: "Fees Installment List",
    isActive: false,
    pageName: "Fees Installment List",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "feesinstallmentedit",
    component: "feesinstallmentedit",
    headline: "Fees Installmen Edit",
    isActive: false,
    pageName: "Fee Installment Edit",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "feesmasteredit",
    component: "feesmasteredit",
    headline: "Fees Master Edit",
    isActive: false,
    pageName: "Fees Master",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "feesmasterlist",
    component: "feesmasterlist",
    headline: "Fees Master List",
    isActive: false,
    pageName: "Fees Master List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "studentPaymentList",
    component: "studentPaymentList",
    headline: "Payment List",
    isActive: false,
    pageName: "Payment List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "studentfeespayment",
    component: "studentfeespayment",
    headline: "Student Fees Payment",
    isActive: false,
    pageName: "Student Fees Payment",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "studentcopy",
    component: "studentcopy",
    headline: "Student Copy",
    isActive: false,
    pageName: "Student Copy",
    isNewTab: true,
  },
  {
    _uid: uuidv4(),
    slug: "studentcopyonlydata",
    component: "studentcopyonlydata",
    headline: "Student Copy",
    isActive: false,
    pageName: "Student Copy",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "studentcopywithstructure",
    component: "studentcopywithstructure",
    headline: "Student Copy",
    isActive: false,
    pageName: "Student Copy",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "studentcopyblank",
    component: "studentcopyblank",
    headline: "Student Copy",
    isActive: false,
    pageName: "Student Copy",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "bonafide",
    component: "bonafide",
    headline: "Bonafide",
    isActive: false,
    pageName: "Bonafide",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "bonafide_data",
    component: "bonafide_data",
    headline: "Bonafide Data",
    isActive: false,
    pageName: "Bonafide Data",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "bonafide_offset",
    component: "bonafide_offset",
    headline: "Bonafide Offset",
    isActive: false,
    pageName: "Bonafide Offset",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "lc",
    component: "lc",
    headline: "Lc",
    isActive: false,
    pageName: "Lc",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "outstandinglist",
    component: "outstandinglist",
    headline: "Outstanding List",
    isActive: false,
    pageName: "Outstanding List",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "dailycollection",
    component: "dailycollection",
    headline: "Daily Collection",
    isActive: false,
    pageName: "Daily Collection",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "studentList",
    component: "studentList",
    headline: "Student List",
    isActive: false,
    pageName: "Student List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "studentadmission",
    component: "studentadmission",
    headline: "Student Register",
    isActive: false,
    pageName: "Student Register",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "studentadmissionedit",
    component: "studentadmissionedit",
    headline: "Student Register Edit",
    isActive: false,
    pageName: "Student Register Edit",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "studentpromotion",
    component: "studentpromotion",
    headline: "Student Promotion",
    isActive: false,
    pageName: "Student Promotion",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "studentpromotionlist",
    component: "studentpromotionlist",
    headline: "StudentPromotion List",
    isActive: false,
    pageName: "StudentPromotion List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "studentbus",
    component: "studentbus",
    headline: "StudentBus",
    isActive: false,
    pageName: "StudentBus",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "studentbuslist",
    component: "studentbuslist",
    headline: "StudentBusList",
    isActive: false,
    pageName: "StudentBus List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "studentscholarshiplist",
    component: "studentscholarshiplist",
    headline: "StudentScholarShipList",
    isActive: false,
    pageName: "Student scholarShip List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "studentscholarship",
    component: "studentscholarship",
    headline: "StudentScholarShip",
    isActive: false,
    pageName: "Student ScholarShip ",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "unit",
    component: "unit",
    headline: "Unit",
    isActive: false,
    pageName: "Unit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "hsn",
    component: "hsn",
    headline: "HSN",
    isActive: false,
    pageName: "HSN",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tax",
    component: "tax",
    headline: "Tax",
    isActive: false,
    pageName: "Tax",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "associategroup",
    component: "associategroup",
    title: "Ledger Group",
    isActive: false,
    pageName: "Ledger Group",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "ledgerlist",
    component: "ledgerlist",
    title: "Ledger List",
    isActive: false,
    pageName: "Ledger List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "ledgercreate",
    component: "ledgercreate",
    title: "Ledger Create",
    isActive: false,
    pageName: "Ledger Create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "ledgeredit",
    component: "ledgeredit",
    title: "Ledger Edit",
    isActive: false,
    pageName: "Ledger Edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "ledgerdetails",
    component: "ledgerdetails",
    title: "Ledger Details",
    isActive: false,
    pageName: "Ledger Details",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "ledgervoucherdetails",
    component: "ledgervoucherdetails",
    title: "Ledger Voucher Details",
    isActive: false,
    pageName: "Ledger Voucher Details",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "productlist",
    component: "productlist",
    title: "Product List",
    isActive: false,
    pageName: "Product List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "productcreate",
    component: "productcreate",
    title: "Product Create",
    isActive: false,
    pageName: "Product Create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "productedit",
    component: "productedit",
    title: "Product Edit",
    isActive: false,
    pageName: "Product Edit",
    isNewTab: false,
  },
  /****************Tranx Purchase Challan Start ***************************/
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_challan_create",
    component: "tranx_purchase_challan_create",
    headline: "Purchase Challan Create",
    isActive: false,
    pageName: "Purchase Challan Create",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_purchase_challan_list",
    component: "tranx_purchase_challan_list",
    headline: "Purchase Challan List",
    isActive: false,
    pageName: "Purchase Challan List",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_purchase_challan_edit",
    component: "tranx_purchase_challan_edit",
    headline: "Purchase Challan Edit",
    isActive: false,
    pageName: "Purchase Challan Edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_challan_to_invoice",
    component: "tranx_purchase_challan_to_invoice",
    headline: "Purchase Challan To Invoice",
    isActive: false,
    pageName: "Purchase Challan To Invoice",
    isNewTab: false,
  },

  /****************Tranx Purchase Order Start ***************************/

  {
    _uid: uuidv4(),
    slug: "tranx_purchase_order_list",
    component: "tranx_purchase_order_list",
    headline: "Purchase Order List",
    isActive: false,
    pageName: "Purchase Order List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_order_create",
    component: "tranx_purchase_order_create",
    headline: "Purchase Order Create",
    isActive: false,
    pageName: "Purchase Order Create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_order_edit",
    component: "tranx_purchase_order_edit",
    headline: "Purchase Order Edit",
    isActive: false,
    pageName: "Purchase Order Edit",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_order_to_invoice",
    component: "tranx_purchase_order_to_invoice",
    headline: "Purchase Order To Invoice",
    isActive: false,
    pageName: "Purchase Order To Invoice",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_purchase_order_to_challan",
    component: "tranx_purchase_order_to_challan",
    headline: "Purchase Order To Challan",
    isActive: false,
    pageName: "Purchase Order To Challan",
    isNewTab: false,
  },

  /**************************Tranx Purchase Invoice Start **************************/
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_invoice_list",
    component: "tranx_purchase_invoice_list",
    headline: "Purchase Invoice List",
    isActive: false,
    pageName: "Purchase Invoice List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_invoice_create",
    component: "tranx_purchase_invoice_create",
    headline: "Purchase Invoice Create",
    isActive: false,
    pageName: "Purchase Invoice Create",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_challan_list",
    component: "tranx_sales_challan_list",
    headline: "Sales Challan List",
    isActive: false,
    pageName: "Sales Challan List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_challan_create",
    component: "tranx_sales_challan_create",
    headline: "Sales Challan Create",
    isActive: false,
    pageName: "Sales Challan Create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_challan_to_invoice",
    component: "tranx_sales_challan_to_invoice",
    headline: "Sales Challan To Invoice",
    isActive: false,
    pageName: "Sales Challan To Invoice",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_invoice_list",
    component: "tranx_sales_invoice_list",
    headline: "Sale Invoice List",
    isActive: false,
    pageName: "Sale Invoice List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "salesinvoicedetail",
    component: "salesinvoicedetail",
    headline: "Sale Invoice Details",
    isActive: false,
    pageName: "Sale Invoice Details",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_purchase_invoice_edit",
    component: "tranx_purchase_invoice_edit",
    headline: "Purchase Invoice Edit",
    isActive: false,
    pageName: "Purchase Invoice Edit",
    isNewTab: false,
  },

  /**************************Tranx Purchase Debit_note(Purchase Return) Start **************************/

  {
    _uid: uuidv4(),
    slug: "tranx_debit_note_list",
    component: "tranx_debit_note_list",
    headline: "Debit Note List",
    isActive: false,
    pageName: "Debit Note List",
    isNewTab: false,
  },
  /**************************Tranx Sales Order Start **************************/

  {
    _uid: uuidv4(),
    slug: "tranx_sales_order_list",
    component: "tranx_sales_order_list",
    headline: "Sales Order List",
    isActive: false,
    pageName: "Sales Order List",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_order_create",
    component: "tranx_sales_order_create",
    headline: "Sales Order Create",
    isActive: false,
    pageName: "Sales Order Create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_order_to_challan",
    component: "tranx_sales_order_to_challan",
    headline: "Sales Order To Challan",
    isActive: false,
    pageName: "Sales Order To Challan",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_order_to_invoice",
    component: "tranx_sales_order_to_invoice",
    headline: "Sales Order To Invoice",
    isActive: false,
    pageName: "Sales Order To Invoice",
    isNewTab: false,
  },

  /************************Transaction Sales Quotation Start***********************/

  {
    _uid: uuidv4(),
    slug: "tranx_sales_quotation_list",
    component: "tranx_sales_quotation_list",
    headline: "Sales Quotation List",
    isActive: false,
    pageName: "Sales Quotation List",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_quotation_create",
    component: "tranx_sales_quotation_create",
    headline: "Sales Quotation Create",
    isActive: false,
    pageName: "Sales Quotation Create",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_quotation_to_challan",
    component: "tranx_sales_quotation_to_challan",
    headline: "Sales Quotation To Challan",
    isActive: false,
    pageName: "Sales Quotation To Challan",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_quotation_to_invoice",
    component: "tranx_sales_quotation_to_invoice",
    headline: "Sales Quotation To Invoice",
    isActive: false,
    pageName: "Sales Quotation To Invoice",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_invoice_create",
    component: "tranx_sales_invoice_create",
    headline: "Sale Invoice Create",
    isActive: false,
    pageName: "Sale Invoice Create",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),

    slug: "tranx_sales_quotation_to_order",
    component: "tranx_sales_quotation_to_order",
    headline: "Sales Quotation To Order",
    isActive: false,
    pageName: "Sales Quotation To Order",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_invoice_edit",
    component: "tranx_sales_invoice_edit",
    headline: "Sale Invoice Edit",
    isActive: false,
    pageName: "Sale Invoice Edit",
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_countersale_list",
    component: "tranx_sales_countersale_list",
    headline: "Counter Sale List",
    isActive: false,
    pageName: "Counter Sale List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_sales_countersale_create",
    component: "tranx_sales_countersale_create",
    headline: "Counter Sale Create",
    isActive: false,
    pageName: "Counter Sale Create",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "tranx_sales_countersale_edit",
    component: "tranx_sales_countersale_edit",
    headline: "Counter Sale Edit",
    isActive: false,
    pageName: "Counter Sale Edit",
    isNewTab: false,
  },

  /*****************Tranx Vouchers Start***********************/

  {
    _uid: uuidv4(),
    slug: "tranx_contra_List",
    component: "tranx_contra_List",
    headline: "Contra List",
    isActive: false,
    pageName: "Contra List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "tranx_contra",
    component: "tranx_contra",
    headline: "Contra",
    isActive: false,
    pageName: "Contra",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "voucher_credit_List",
    component: "voucher_credit_List",
    headline: "Voucher Credit List",
    isActive: false,
    pageName: "Voucher Credit List",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "voucher_credit_note",
    component: "voucher_credit_note",
    headline: "Voucher Credit Note",
    isActive: false,
    pageName: "Voucher Credit Note",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "voucher_debit_note_List",
    component: "voucher_debit_note_List",
    headline: "Voucher Debit List",
    isActive: false,
    pageName: "Voucher Debit List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_debit_note",
    component: "voucher_debit_note",
    headline: "Voucher Debit Note",
    isActive: false,
    pageName: "Voucher Debit Note",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_receipt_list",
    component: "voucher_receipt_list",
    headline: "Receipt List",
    isActive: false,
    pageName: "Receipt List",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "voucher_receipt_details",
    component: "voucher_receipt_details",
    headline: "Receipt Details",
    isActive: false,
    pageName: "Receipt Details",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "profitbalance",
    component: "profitbalance",
    headline: "ProfitBalance",
    isActive: false,
    pageName: "ProfitBalance",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "profitandloss1",
    component: "profitandloss1",
    headline: "ProfitAndLoss",
    isActive: false,
    pageName: "ProfitAndLoss",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "profitandloss2",
    component: "profitandloss2",
    headline: "ProfitAndLoss2",
    isActive: false,
    pageName: "ProfitAndLoss2",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "profitandloss3",
    component: "profitandloss3",
    headline: "ProfitAndLoss3",
    isActive: false,
    pageName: "ProfitAndLoss3",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_journal_list",
    component: "voucher_journal_list",
    headline: "Journal List",
    isActive: false,
    pageName: "Journal List",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "voucher_journal_details",
    component: "voucher_journal_details",
    headline: "Journal Details",
    isActive: false,
    pageName: "Journal Details",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_journal",
    component: "voucher_journal",
    headline: "Journal",
    isActive: false,
    pageName: "Journal",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "voucher_receipt",
    component: "voucher_receipt",
    headline: "Receipt",
    isActive: false,
    pageName: "Receipt",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "voucher_paymentlist",
    component: "voucher_paymentlist",
    headline: "Payment List",
    isActive: false,
    pageName: "Payment List",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "voucher_payment",
    component: "voucher_payment",
    headline: "Payment",
    isActive: false,
    pageName: "Payment",
    isNewTab: false,
  },
  // ! User Management

  {
    _uid: uuidv4(),
    slug: "user_mgnt_list",
    component: "user_mgnt_list",
    headline: "User List",
    isActive: false,
    pageName: "User List",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "user_mgnt_create",
    component: "user_mgnt_create",
    headline: "User Create",
    isActive: false,
    pageName: "User Create",
    isNewTab: false,
  },

  {
    _uid: uuidv4(),
    slug: "user_mgnt_mst_actions",
    component: "user_mgnt_mst_actions",
    title: "Master Actions",
    isActive: false,
    pageName: "Master Actions",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "user_mgnt_mst_modules",
    component: "user_mgnt_mst_modules",
    title: "Master Modules",
    isActive: false,
    pageName: "Master Modules",
    isNewTab: false,
  },
  {
    _uid: uuidv4(),
    slug: "user_mgnt_mst_module_mapping",
    component: "user_mgnt_mst_module_mapping",
    title: "Master Module Mapping",
    isActive: false,
    pageName: "Master Module Mapping",
    isNewTab: false,
  },
];

// const LoadingComponent = () => {
//   return (
//     <div className="bg-transparent text-center">
//       <Spinner animation="border" role="status" variant="primary">
//         <span className="visually-hidden">Loading...</span>
//       </Spinner>
//     </div>
//   );
// };

// ! Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // console.log("config >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", config);
    eventBus.dispatch("is_loading", true);

    return config;
  },
  (error) => {
    eventBus.dispatch("is_loading", false);
    console.log("error ", error);
    return Promise.reject(error);
  }
);

//! For POST requests
axios.interceptors.response.use(
  (res) => {
    // console.log("res >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", res);
    eventBus.dispatch("is_loading", false);
    return res;
  },
  (err) => {
    eventBus.dispatch("is_loading", false);
    console.log("error ", err);
    return Promise.reject(err);
  }
);

export default class DynamicComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMultiTab: false,
      selectedPageTitle: "Page1",
      isNewTab: false,
      data: data,
      isShowMenu: false,
      is_loading: false,
    };
  }
  handleLoading = (status) => {
    this.setState({ is_loading: status });
  };

  pageChange = (slug) => {
    // console.log({ slug });
    let { data } = this.state;
    let pageName = "";
    let pslug = "";
    let fromslug = "";
    let isMultiScreen = "";
    let prop_data = "";
    let p_isNewTab = "";
    if (typeof slug == "string") {
      pslug = slug;
    } else if (typeof slug == "object") {
      pslug = slug["to"] ? slug["to"] : "";
      fromslug = slug["from"] ? slug["from"] : "";
      isMultiScreen = slug["isMultiScreen"] ? slug["isMultiScreen"] : "";
      prop_data = slug["prop_data"] ? slug["prop_data"] : "";
      p_isNewTab = slug["isNewTab"] != undefined ? slug["isNewTab"] : "";
    }
    // console.log({ p_isNewTab });
    let fdata = data.filter((v) => {
      v.isActive = false;
      return v;
    });

    let activeNewTabStatus = p_isNewTab;
    let FThemeRoutes = fdata.map((v) => {
      if (slug == "logout") {
        authenticationService.logout();
        if (v.slug == "login") {
          this.setState({ isMultiTab: false });
          v.isActive = true;
        }
      } else if (v.slug == pslug) {
        // console.log("v======------------->>>>>>>>", v);

        pageName = v.pageName;
        // console.log("inner p_isNewTab", { p_isNewTab });
        if (p_isNewTab === false) {
          activeNewTabStatus = p_isNewTab;
        } else if (p_isNewTab === true) {
          activeNewTabStatus = p_isNewTab;
        } else {
          activeNewTabStatus = v.isNewTab;
        }
        v.isActive = true;
        v["handleToggleMultiScreen"] = this.handleToggleMultiScreen.bind(this);
        v["handleMultiScreen"] = this.handleMultiScreen.bind(this);
        v["handleisNewTab"] = this.handleisNewTab.bind(this);
        v["prop_data"] = prop_data ? (prop_data != "" ? prop_data : "") : "";
      }
      // console.log("slug", { v });
      return v;
    });

    // console.log("outer p_isNewTab", { p_isNewTab });
    // console.log("outer activeNewTabStatus", { activeNewTabStatus });
    this.setState(
      {
        data: FThemeRoutes,
        selectedPageTitle: pageName,
        isNewTab: activeNewTabStatus,
      },
      () => {}
    );
  };
  handleMainState = ({ statekey, statevalue }) => {
    this.setState({ [statekey]: statevalue });
  };
  componentDidMount() {
    eventBus.on("page_change", this.pageChange);
    eventBus.on("handle_multiscreen", this.handleMultiScreen);
    eventBus.on("handle_main_state", this.handleMainState);
    eventBus.on("is_loading", this.handleLoading);
  }

  componentWillUnmount() {
    eventBus.remove("page_change");
    eventBus.remove("handle_multiscreen");
    eventBus.remove("handle_main_state");
    eventBus.remove("is_loading");
  }

  handleToggleMultiScreen = () => {
    this.setState({ isMultiTab: !this.state.isMultiTab });
  };
  handleMultiScreen = (status) => {
    this.setState({ isMultiTab: status });
  };

  handleisNewTab = (status) => {
    this.setState({ isNewTab: status });
  };

  render() {
    let {
      isMultiTab,
      selectedPageTitle,
      isNewTab,
      data,
      isShowMenu,
      is_loading,
    } = this.state;
    return (
      <div>
        <MyNotifications />
        {/* <Modal
          show={is_loading}
          backdrop="static"
          keyboard={false}
          size={"sm"}
          centered
          className="bg-transparent"
          dialogClassName="bg-transparent"
          contentClassName="bg-transparent border-0"
        >
      </Modal> */}
        {LoadingComponent(is_loading)}
        {isShowMenu == true && <Menus />}
        {isMultiTab == true ? (
          <>
            <MultiTab title={selectedPageTitle} isNewTab={isNewTab}>
              {data.map((block) => {
                if (block.isActive) {
                  return CustComponets(block);
                }
              })}
            </MultiTab>
          </>
        ) : (
          data.map((block) => {
            if (block.isActive) {
              return CustComponets(block);
            }
          })
        )}
      </div>
    );
  }
}
