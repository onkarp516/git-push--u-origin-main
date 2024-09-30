import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createCasteURL,
  getAllCastesURL,
  getCasteByIdURL,
  updateCasteURL,
  getCastesByReligionURL,
} from "../api";

export function createCaste(values) {
  return axios({
    url: createCasteURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getCasteById(values) {
  return axios({
    url: getCasteByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getAllCastes() {
  return axios({
    url: getAllCastesURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function updateCaste(values) {
  return axios({
    url: updateCasteURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getCastesByReligion(values) {
  return axios({
    url: getCastesByReligionURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
