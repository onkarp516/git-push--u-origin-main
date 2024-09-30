import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getSalesAccountsURL,
  getSundryDebtorsURL,
  createSalesInvoiceURL,
  getProductEditURL,
  getSalesInvoiceListURL,
  getLastSalesInvoiceNoURL,
  getPurchaseInvoiceByIdURL,
  editPurchaseInvoiceURL,
  getSundryDebtorsIdUrl,
  get_outstanding_sales_return_amtUrl,
  getSaleInvoiceDetailsURL,
} from "@/services/api";

export function getSalesAccounts() {
  return axios({
    url: getSalesAccountsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getSundryDebtors() {
  return axios({
    url: getSundryDebtorsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createSalesInvoice(requestData) {
  return axios({
    url: createSalesInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSaleInvoiceDetails(requestData) {
  return axios({
    url: getSaleInvoiceDetailsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

// export function getProductEdit(requestData) {
//   return axios({
//     url: getProductEditURL(),
//     data: requestData,
//     method: "POST",
//     headers: getHeader(),
//   });
// }

export function getSalesInvoiceList(Values) {
  return axios({
    url: getSalesInvoiceListURL(),
    method: "POST",
    data: Values,
    headers: getHeader(),
  });
}
export function getLastSalesInvoiceNo() {
  return axios({
    url: getLastSalesInvoiceNoURL(),
    method: "GET",
    headers: getHeader(),
  });
}
// Sales Invoice List

export function getSundryDebtorsIdClient(requestData) {
  return axios({
    url: getSundryDebtorsIdUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_outstanding_sales_return_amt(requestData) {
  return axios({
    url: get_outstanding_sales_return_amtUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
