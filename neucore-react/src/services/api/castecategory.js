import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createCasteCategoryUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createCasteCategory`;
}

export function getAllCasteCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAllCasteCategory`;
}

export function getCasteCategoryByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getCasteCategoryById`;
}
export function updateCasteCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateCasteCategory`;
}

export function getCategoryBySubCasteURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getCategoryBySubCaste`;
}

export function getCasteCategoriesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getCasteCategories`;
}
