import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createBrandURL,
  getBrandsURL,
  getAllBrandsURL,
  updateBrandURL,
  get_subgroups_by_IdURL,
} from "@/services/api";

export function createBrand(requestData) {
  return axios({
    url: createBrandURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getBrands(requestData) {
  return axios({
    url: getBrandsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getAllBrands() {
  return axios({
    url: getAllBrandsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function updateBrand(requestData) {
  return axios({
    url: updateBrandURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_subgroups(values) {
  return axios({
    url: get_subgroups_by_IdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
