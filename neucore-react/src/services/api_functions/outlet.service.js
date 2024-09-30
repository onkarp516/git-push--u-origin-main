import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createOutletURL,
  getListOfCompanyURL,
  getAllBranchesURL,
  updateOutletURL,
  getOutletByIdURL,
  getBranchesByOutletUrl,
} from "../api";

export function createOutlet(requestData) {
  return axios({
    url: createOutletURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateOutlet(requestData) {
  return axios({
    url: updateOutletURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getOutletById(requestData) {
  return axios({
    url: getOutletByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getListCompany() {
  return axios({
    url: getListOfCompanyURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getAllBranches() {
  return axios({
    url: getAllBranchesURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getBranchesByInstitute(requestData) {
  return axios({
    url: getBranchesByOutletUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
