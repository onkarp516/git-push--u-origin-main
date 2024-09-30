import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createMothertongueURL,
  getMothertongueURL,
  getMotherTongueByIdURL,
  updateMotherTongueURL,
} from "../api";

export function createMothertongue(values) {
  return axios({
    url: createMothertongueURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getMotherTongueById(values) {
  return axios({
    url: getMotherTongueByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getMothertongue() {
  return axios({
    url: getMothertongueURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function updateMotherTongue(values) {
  return axios({
    url: updateMotherTongueURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
