import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createTaxURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_tax_master`;
}
export function gettaxmasterbyOutletUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_tax_master_by_outlet`;
}
export function updateTaxUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_tax_master`;
}
export function get_tax_masterUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_tax_master_by_id`;
}
