import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createCasteCategoryUrl,
  getAllCasteCategoryURL,
  getCasteCategoryByIdURL,
  updateCasteCategoryURL,
  getCategoryBySubCasteURL,
  getCasteCategoriesURL,
} from "../api";

export function createCasteCategory(values) {
  return axios({
    url: createCasteCategoryUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getCasteCategoryById(values) {
  return axios({
    url: getCasteCategoryByIdURL(),
    method: "POST",
    data: values,
    headers: getHeader(),
  });
}
export function getAllCasteCategory() {
  return axios({
    url: getAllCasteCategoryURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function updateCasteCategory(values) {
  return axios({
    url: updateCasteCategoryURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getCategoryBySubCaste(values) {
  return axios({
    url: getCategoryBySubCasteURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getCasteCategories() {
  return axios({
    url: getCasteCategoriesURL(),
    method: "GET",
    headers: getHeader(),
  });
}
