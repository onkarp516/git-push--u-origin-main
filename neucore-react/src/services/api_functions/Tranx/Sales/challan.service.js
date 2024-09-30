import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createSalesChallanURL,
  getLastSalesChallanNoURL,
  getSaleChallanListURL,
  getSaleChallanWithIdsURL,
  getSalesChallanListURL,
} from "@/services/api";

export function createSalesChallan(requestData) {
  return axios({
    url: createSalesChallanURL(),
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
export function getLastSalesChallanNo() {
  return axios({
    url: getLastSalesChallanNoURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getSaleChallanList() {
  return axios({
    url: getSalesChallanListURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getSaleChallanWithIds(requestData) {
  return axios({
    url: getSaleChallanWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
