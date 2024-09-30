import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createSubCategoryURL,
  getAllSubCategoryURL,
  getSubCategoryURL,
  updateSubCategoryURL,
  get_subcategoryURL,
} from "@/services/api";

export function createSubCategory(requestData) {
  return axios({
    url: createSubCategoryURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateSubCategory(requestData) {
  return axios({
    url: updateSubCategoryURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getSubCategory(requestData) {
  return axios({
    url: getSubCategoryURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getAllSubCategory() {
  return axios({
    url: getAllSubCategoryURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_subcategory(values) {
  return axios({
    url: get_subcategoryURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
