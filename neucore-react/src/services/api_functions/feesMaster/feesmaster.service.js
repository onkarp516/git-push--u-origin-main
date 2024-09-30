import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createFeesMasterUrl,
  getFeesMastersUrl,
  getFeesMasterByIdUrl,
  getSubFeeHeadsByFeeHeadUrl,
  updateFeesMasterUrl,
} from "@/services/api";

export function createFeesMaster(requestData) {
  return axios({
    url: createFeesMasterUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getFeesMasters() {
  return axios({
    url: getFeesMastersUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function updateFeesMaster(requestData) {
  return axios({
    url: updateFeesMasterUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getFeesMasterById(requestData) {
  return axios({
    url: getFeesMasterByIdUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getSubFeeHeadsByFeeHead(requestData) {
  return axios({
    url: getSubFeeHeadsByFeeHeadUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
