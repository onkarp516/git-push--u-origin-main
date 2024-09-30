import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getPurchaseAccountsURL,
  getSundryCreditorsURL,
  getProductURL,
  createPOInvoiceURL,
  getProductEditURL,
  getPOInvoiceListURL,
  getPOURL,
  getPOInvoiceWithIdsURL,
  getLastPOInvoiceNoURL,
  getPurchaseInvoiceByIdURL,
  editPurchaseInvoiceURL,
  getPOPendingOrderWithIdsURL,
  getPurchaseOrderByIdURL,
  getPurchaseOrderEditByIdURL,
} from "@/services/api";

export function createPOInvoice(requestData) {
  return axios({
    url: createPOInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPOInvoiceList() {
  return axios({
    url: getPOInvoiceListURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getPO() {
  return axios({
    url: getPOURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getPOInvoiceWithIds(requestData) {
  return axios({
    url: getPOInvoiceWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPOPendingOrderWithIds(requestData) {
  return axios({
    url: getPOPendingOrderWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getLastPOInvoiceNo() {
  return axios({
    url: getLastPOInvoiceNoURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getPurchaseOrderById(requestData) {
  return axios({
    url: getPurchaseOrderByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getPurchaseOrderEditById(requestData) {
  return axios({
    url: getPurchaseOrderEditByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
