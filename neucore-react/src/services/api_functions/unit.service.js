import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createUnitURL,
  getAllUnitURL,
  updateUnitURL,
  get_units_by_IdURL,
} from "../api";

export function createUnit(requestData) {
  return axios({
    url: createUnitURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateUnit(requestData) {
  return axios({
    url: updateUnitURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getAllUnit() {
  return axios({
    url: getAllUnitURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_units(values) {
  return axios({
    url: get_units_by_IdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
