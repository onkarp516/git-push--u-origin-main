import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_Payment_listURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_payment_list_by_outlet`;
}
