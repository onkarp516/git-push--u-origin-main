import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function authLoginURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/authenticate`;
}
