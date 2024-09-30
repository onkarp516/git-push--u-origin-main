import { getHeader } from "@/helpers";
import axios from "axios";

import {
  createScholarShipURL,
  getAllScholarShipURL,
  getScholarShipDetailsByIdURL,
  updateScholarShipURL,
  deleteScholarShipURL,
  getStudentListforScholarShipURL,
  assignScholarshipToStudentURL,
  getScholarshipAssignedListURL,
} from "../api";

export function createScholarShip(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    data: values,
    url: createScholarShipURL(),
  });
}

export function getAllScholarShip() {
  return axios({
    headers: getHeader(),
    method: "GET",
    url: getAllScholarShipURL(),
  });
}

export function getScholarShipDetailsById(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    data: values,
    url: getScholarShipDetailsByIdURL(),
  });
}

export function updateScholarShip(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    url: updateScholarShipURL(),
    data: values,
  });
}
export function deleteScholarShip(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    url: deleteScholarShipURL(),
    data: values,
  });
}

export function getStudentListforScholarShip(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    url: getStudentListforScholarShipURL(),
    data: values,
  });
}
export function assignScholarshipToStudent(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    url: assignScholarshipToStudentURL(),
    data: values,
  });
}

export function getScholarshipAssignedList(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    url: getScholarshipAssignedListURL(),
    data: values,
  });
}
