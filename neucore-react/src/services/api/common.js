import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getStateURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getState`;
}

export function getIndianStateURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getIndianState`;
}

export function getIndiaCountryURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getIndiaCountry`;
}

export function get_mesg_for_token_expiredURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_mesg_for_token_expired`;
}
