import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createFeeHeadURL,
  getAllFeeHeadsURL,
  getFeeHeadByIdURL,
  updateFeeHeadURL,
  getFeeHeadsByBranchURL,
  updateFeeHeadNormalURL,
} from "@/services/api";

export function createFeeHead(requestData) {
  return axios({
    url: createFeeHeadURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getAllFeeHeads() {
  return axios({
    url: getAllFeeHeadsURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function updateFeeHead(requestData) {
  return axios({
    url: updateFeeHeadURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateFeeHeadNormal(requestData) {
  return axios({
    url: updateFeeHeadNormalURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getFeeHeadById(values) {
  return axios({
    url: getFeeHeadByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getFeeHeadsByBranch(values) {
  return axios({
    url: getFeeHeadsByBranchURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
