import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createSubCastURL,
  getSubCastesURL,
  getSubCasteByIdURL,
  updateSubCasteURL,
  getSubCasteByCasteURL,
} from "../api";

export function createSubCaste(values) {
  return axios({
    url: createSubCastURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getSubCasteById(values) {
  return axios({
    url: getSubCasteByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getSubCastes() {
  return axios({
    url: getSubCastesURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function updateSubCaste(values) {
  return axios({
    url: updateSubCasteURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getSubCasteByCaste(values) {
  return axios({
    url: getSubCasteByCasteURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
