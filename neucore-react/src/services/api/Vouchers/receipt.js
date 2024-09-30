import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_receipt_listURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_receipt_list_by_outlet`;
}

export function get_receipt_DetailsRL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_receipt_details`;
}