import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createProductURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_product`;
}
export function getProductLstURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_product`;
}
export function getProductEditURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_product_edit`;
}
export function updateProductURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_product`;
}

export function DTProductURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTProduct`;
}

export function get_product_by_IdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_productMaster_by_id`;
}
