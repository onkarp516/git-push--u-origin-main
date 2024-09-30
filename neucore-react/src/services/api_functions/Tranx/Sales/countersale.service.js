import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getCounterSaleLastInvoiceURL,
  createCounterSalesURL,
  getCounterSaleInvoicesURL,
  getCounterSalesClientListURL,
  getCounterSalesWithIdsURL,
  getCounterSalesWithIdURL,
  updateCounterSalesURL,
} from "@/services/api";

export function getCounterSaleLastInvoice() {
  return axios({
    url: getCounterSaleLastInvoiceURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createCounterSales(requestData) {
  return axios({
    url: createCounterSalesURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getCounterSaleInvoices() {
  return axios({
    url: getCounterSaleInvoicesURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getCounterSalesClientList() {
  return axios({
    url: getCounterSalesClientListURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getCounterSalesWithIds(requestData) {
  return axios({
    url: getCounterSalesWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getCounterSalesWithId(requestData) {
  return axios({
    url: getCounterSalesWithIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateCounterSales(requestData) {
  return axios({
    url: updateCounterSalesURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
