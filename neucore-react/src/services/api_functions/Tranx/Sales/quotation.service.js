import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createSalesQuotationURL,
  getLastSalesQuotationNoURL,
  getSaleQuotationListIdsURL,
  getSaleQuotationListURL,
  getSaleQuotationWithIdsURL,
} from "@/services/api";

export function createSalesQuotation(requestData) {
  return axios({
    url: createSalesQuotationURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

// export function getSalesQuatationList() {
//   return axios({
//     url: getSalesQuatationListURL(),
//     method: "GET",
//     headers: getHeader(),
//   });
// }

export function getLastSalesQuotationNo() {
  return axios({
    url: getLastSalesQuotationNoURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getSaleQuotationList() {
  return axios({
    url: getSaleQuotationListIdsURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getSaleQuotationWithIds(requestData) {
  return axios({
    url: getSaleQuotationWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSalesQuotationList(requestData) {
  return axios({
    url: getSaleQuotationListURL(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}
