import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createDivisionURL,
  getAllDivisionsURL,
  getDivisionByIdURL,
  updateDivisionURL,
  getDivisionsByStandardURL,
} from "@/services/api";

export function createDivision(requestData) {
  return axios({
    url: createDivisionURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getAllDivisions() {
  return axios({
    url: getAllDivisionsURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function updateDivision(requestData) {
  return axios({
    url: updateDivisionURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getDivisionById(values) {
  return axios({
    url: getDivisionByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getDivisionsByStandard(values) {
  return axios({
    url: getDivisionsByStandardURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
