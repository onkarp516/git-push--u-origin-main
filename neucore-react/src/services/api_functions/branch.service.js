import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createBranchURL,
  getBranchesURL,
  createBranchUserURL,
  getBranchesByUserURL,
  getBranchByIdURL,
  updateBranchByIdURL,
  getBranchByInstituteAndUserURL,
  get_branches_superAdminURL,
  get_branches_super_adminURL,
  getBAdminUsersURL,
  get_b_user_by_idURL,
} from "../api";

export function createBranch(requestData) {
  return axios({
    url: createBranchURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getBranch() {
  return axios({
    url: getBranchesURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_b_User_By_Id(requestData) {
  return axios({
    url: get_b_user_by_idURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getBAdminUser() {
  return axios({
    url: getBAdminUsersURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getBranchByInstituteAndUser() {
  return axios({
    url: getBranchByInstituteAndUserURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getBranchById(requestData) {
  return axios({
    url: getBranchByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function updateBranchById(requestData) {
  return axios({
    url: updateBranchByIdURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function createBranchUser(requestData) {
  return axios({
    url: createBranchUserURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getBranchesByUser() {
  return axios({
    url: getBranchesByUserURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_branches_superAdmin(values) {
  return axios({
    url: get_branches_superAdminURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function get_branches_super_admin() {
  return axios({
    url: get_branches_super_adminURL(),
    method: "GET",
    headers: getHeader(),
  });
}
