import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createStandardURL,
  getAllStandardsURL,
  getStandardByIdURL,
  updateStandardURL,
  getStandardsByBranchURL,
} from "@/services/api";

export function createStandard(requestData) {
  return axios({
    url: createStandardURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getAllStandards() {
  return axios({
    url: getAllStandardsURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function updateStandard(requestData) {
  return axios({
    url: updateStandardURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getStandardById(values) {
  return axios({
    url: getStandardByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getStandardsByBranch(values) {
  return axios({
    url: getStandardsByBranchURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
