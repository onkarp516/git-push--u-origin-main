import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSubCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sub_category`;
}

export function getAllSubCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_subcategories`;
}

export function getSubCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_subcategories`;
}

export function updateSubCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_sub_category`;
}
export function DTSubcategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTSubcategory`;
}
export function get_subcategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_subcategory`;
}
