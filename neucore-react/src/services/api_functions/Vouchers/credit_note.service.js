import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getTranxCreditNoteLastURL,
  getTranxCreditNoteListInvoiceBillSCURL,
  getTranxSalesProductListBillNoURL,
  get_sales_invoice_by_id_with_pr_idsURL,
  create_sales_returns_invoicesURL,
  list_credit_notesUrl,
  getTranxCreditNoteLastRecordURL,
  create_creditUrl,
} from "@/services/api";

export function getTranxCreditNoteLast() {
  return axios({
    url: getTranxCreditNoteLastURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getTranxCreditNoteListInvoiceBillSC(requestData) {
  return axios({
    url: getTranxCreditNoteListInvoiceBillSCURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function getTranxSalesProductListBillNo(requestData) {
  return axios({
    url: getTranxSalesProductListBillNoURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function get_sales_invoice_by_id_with_pr_ids(requestData) {
  return axios({
    url: get_sales_invoice_by_id_with_pr_idsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function create_sales_returns_invoices(requestData) {
  return axios({
    url: create_sales_returns_invoicesURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function list_credit_notes() {
  return axios({
    url: list_credit_notesUrl(),
    method: "Get",
    headers: getHeader(),
    
  });
}
export function getTranxCreditNoteLastRecord() {
  return axios({
    url: getTranxCreditNoteLastRecordURL(),
    method: "GET",
    headers: getHeader(),
    
    
  });
}

export function create_credit(requestData) {
  return axios({
    url: create_creditUrl(),
    method: "POST",
    headers: getHeader(),
    data:requestData,
    
  });
}