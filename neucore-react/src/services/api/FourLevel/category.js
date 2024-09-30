import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_category`;
}

export function getCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_categories`;
}

export function getAllCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_categories`;
}

export function updateCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_category`;
}
export function DTCategoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTCategory`;
}

export function get_categoryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_category`;
}
