import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createSalesOrderURL,
  getLastSalesOrderURL,
  getSaleOrderListURL,
  getSaleOrderWithIdsURL,
  getAllSalesOrdersURL,
  getSundryDebtorsIdUrlOder,
} from "@/services/api";

export function createSalesOrder(requestData) {
  return axios({
    url: createSalesOrderURL(),
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
//
export function getLastSalesOrder() {
  return axios({
    url: getLastSalesOrderURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getAllSalesOrders() {
  return axios({
    url: getAllSalesOrdersURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getSaleOrderList() {
  return axios({
    url: getSaleOrderListURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getSaleOrderWithIds(requestData) {
  return axios({
    url: getSaleOrderWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSundryDebtorsIdOrderClient(requestData) {
  return axios({
    url: getSundryDebtorsIdUrlOder(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
