import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getPurchaseAccountsURL,
  getSundryCreditorsURL,
  getProductURL,
  createPurchaseInvoiceURL,
  getPurchaseInvoiceListURL,
  getLastPurchaseInvoiceNoURL,
  getPurchaseInvoiceByIdURL,
  editPurchaseInvoiceURL,
  getPurchaseInvoiceShowByIdURL,
  listTranxDebitesNotesUrl,
} from "@/services/api";

export function getPurchaseAccounts() {
  return axios({
    url: getPurchaseAccountsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getSundryCreditors() {
  return axios({
    url: getSundryCreditorsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getProduct() {
  return axios({
    url: getProductURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createPurchaseInvoice(requestData) {
  return axios({
    url: createPurchaseInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getPurchaseInvoiceList() {
  return axios({
    url: getPurchaseInvoiceListURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getLastPurchaseInvoiceNo() {
  return axios({
    url: getLastPurchaseInvoiceNoURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getPurchaseInvoiceById(requestData) {
  return axios({
    url: getPurchaseInvoiceByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function editPurchaseInvoice(requestData) {
  return axios({
    url: editPurchaseInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPurchaseInvoiceShowById(requestData) {
  return axios({
    url: getPurchaseInvoiceShowByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function listTranxDebitesNotes(requestData) {
  return axios({
    url: listTranxDebitesNotesUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
