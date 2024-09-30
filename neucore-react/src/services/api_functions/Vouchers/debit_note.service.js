import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getTranxDebitNoteLastURL,
  getTranxDebitNoteListInvoiceBillSCURL,
  getTranxPurchaseProductListBillNoURL,
  create_purchase_returns_invoicesURL,
  get_outstanding_pur_return_amtURL,
  getPurchaseReturnLstUrl,
  list_debit_notesURL,
  get_last_record_debitnoteURL,
  create_debitURL,
} from "@/services/api";

export function getTranxDebitNoteLast() {
  return axios({
    url: getTranxDebitNoteLastURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getTranxDebitNoteListInvoiceBillSC(requestData) {
  return axios({
    url: getTranxDebitNoteListInvoiceBillSCURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function getTranxPurchaseProductListBillNo(requestData) {
  return axios({
    url: getTranxPurchaseProductListBillNoURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function create_purchase_returns_invoices(requestData) {
  return axios({
    url: create_purchase_returns_invoicesURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function get_outstanding_pur_return_amt(requestData) {
  return axios({
    url: get_outstanding_pur_return_amtURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function getPurchaseReturnLst(requestData) {
  return axios({
    url: getPurchaseReturnLstUrl(),
    method: "GET",
    headers: getHeader(),
    data: requestData,
  });
}
export function list_debit_notes() {
  return axios({
    url: list_debit_notesURL(),
    method: "GET",
    headers: getHeader(),
    
  });
}
export function getTranxDebitNoteLastRecord() {
  return axios({
    url: get_last_record_debitnoteURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createDebitNote(requestData) {
  return axios({
    url: create_debitURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}