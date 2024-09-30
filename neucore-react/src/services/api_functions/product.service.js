import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createProductURL,
  getProductLstURL,
  updateProductURL,
  getProductEditURL,
  get_product_by_IdURL,
  get_product_ListURL,
} from "../api";

export function createProduct(requestData) {
  return axios({
    url: createProductURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateProduct(requestData) {
  return axios({
    url: updateProductURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getProductEdit(requestData) {
  return axios({
    url: getProductEditURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getProductLst() {
  return axios({
    url: getProductLstURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_product_by_Id(values) {
  return axios({
    url: get_product_by_IdURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
