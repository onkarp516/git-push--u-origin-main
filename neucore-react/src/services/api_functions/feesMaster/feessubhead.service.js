
import { getHeader } from "@/helpers";
import axios from "axios";
import {
    createFeeSubHeadURL,
    getAllSubFeeHeadsURL,
    getSubFeeHeadByIdURL,
    updateFeeSubHeadURL,
  getFeeHeadsByBranchURL,
} from "@/services/api";

export function createFeeSubHead(requestData) {
  return axios({
    url: createFeeSubHeadURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getAllSubFeeHeads() {
  return axios({
    url: getAllSubFeeHeadsURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getSubFeeHeadById(requestData) {
  return axios({
    url: getSubFeeHeadByIdURL(),
    method: "POST",
    data: requestData,
    headers: getHeader(),
  });
}
export function updateFeeSubHead(requestData) {
  return axios({
    url: updateFeeSubHeadURL(),
    method: "POST",
    data: requestData,
    headers: getHeader(),
  });
}