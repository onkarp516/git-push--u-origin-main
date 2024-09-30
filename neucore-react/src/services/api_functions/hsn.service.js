import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createHSNURL,
  getAllHSNURL,
  updateHSNURL,
  get_hsn_by_IdURL,
} from "../api";

export function createHSN(requestData) {
  return axios({
    url: createHSNURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateHSN(requestData) {
  return axios({
    url: updateHSNURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getAllHSN() {
  return axios({
    url: getAllHSNURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_hsn(values) {
  return axios({
    url: get_hsn_by_IdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
