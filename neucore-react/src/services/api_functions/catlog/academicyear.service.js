import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createAcademicYearURL,
  getAcademicYearURL,
  getAcademicByIdURL,
  updateAcademicURL,
  getAcademicYearByBranchURL,
} from "@/services/api";

export function createAcademicYear(requestData) {
  return axios({
    url: createAcademicYearURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getAcademicYear() {
  return axios({
    url: getAcademicYearURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function updateAcademic(requestData) {
  return axios({
    url: updateAcademicURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getAcademicById(values) {
  return axios({
    url: getAcademicByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getAcademicYearByBranch(requestData) {
  return axios({
    url: getAcademicYearByBranchURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
