import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createInstituteURL,
  getInstitutesURL,
  createInstituteUserURL,
  getInstituteByIdURL,
  updateInstituteByIdURL,
  getInstituteUserByIdURL,
  updateInstituteUserURL,
} from "../api";

export function createInstitute(requestData) {
  return axios({
    url: createInstituteURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getInstitutes() {
  return axios({
    url: getInstitutesURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createInstituteUser(requestData) {
  return axios({
    url: createInstituteUserURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getInstituteById(requestData) {
  return axios({
    url: getInstituteByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateInstituteById(requestData) {
  return axios({
    url: updateInstituteByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getInstituteUserById(requestData) {
  return axios({
    url: getInstituteUserByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateInstituteUser(requestData) {
  return axios({
    url: updateInstituteUserURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
