import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSalesChallanURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_challan`;
}
export function getLastSalesChallanNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_sales_challan_record`;
}

export function DTSaleChallanURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_sales_challan`;
}
export function getSalesChallanListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sale_challan`;
}
export function getSaleChallanWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sale_challan_with_ids`;
}
