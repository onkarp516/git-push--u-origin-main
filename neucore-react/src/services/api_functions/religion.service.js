import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createReligionURL,
  getReligionListURL,
  getReligionByIdURL,
  updateReligionURL,
} from "../api";

export function createReligion(values) {
  return axios({
    url: createReligionURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getReligionById(values) {
  return axios({
    url: getReligionByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getReligion() {
  return axios({
    url: getReligionListURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function updateReligion(values) {
  return axios({
    url: updateReligionURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
