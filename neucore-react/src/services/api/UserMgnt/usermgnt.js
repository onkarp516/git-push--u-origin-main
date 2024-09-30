import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getSysAllPermissionsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_systems_all_permissions`;
}
