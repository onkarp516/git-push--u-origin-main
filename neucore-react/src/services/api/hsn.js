import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createHSNURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_hsn`;
}

export function getAllHSNURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_hsn_by_outlet`;
}
export function updateHSNURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_hsn`;
}
export function DTHsnURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTHsn`;
}

export function get_hsn_by_IdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_hsn_by_id`;
}
