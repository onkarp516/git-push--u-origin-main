import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_last_record_contraURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_record_contra`;
}

export function create_contraURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_contra`;
}
export function get_contra_list_by_outletUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_contra_list_by_outlet`;
}