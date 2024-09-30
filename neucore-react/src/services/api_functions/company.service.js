import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createCompanyURL,
  getCompanyByIdURL,
  updateCompanyURL,
  get_companies_super_adminURL,
  createCompanyUserURL,
  get_c_admin_usersURL,
  get_user_by_idURL,
  getGSTTypesURL,
  listOfCompaniesURL,
} from "../api";

export function createCompany(requestData) {
  return axios({
    url: createCompanyURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateCompany(requestData) {
  return axios({
    url: updateCompanyURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getCompanyById(requestData) {
  return axios({
    url: getCompanyByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_companies_super_admin() {
  return axios({
    url: get_companies_super_adminURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createCompanyUser(requestData) {
  return axios({
    url: createCompanyUserURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_c_admin_users() {
  return axios({
    url: get_c_admin_usersURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_user_by_id(requestData) {
  return axios({
    url: get_user_by_idURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getGSTTypes() {
  return axios({
    url: getGSTTypesURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function listOfCompanies() {
  return axios({
    url: listOfCompaniesURL(),
    method: "GET",
    headers: getHeader(),
  });
}
