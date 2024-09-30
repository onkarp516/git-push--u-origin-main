import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createGroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_group`;
}
export function getGroupsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_groups`;
}

export function updateGroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_group`;
}

export function DTGroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTGroup`;
}
export function get_groupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_group`;
}
export function get_outlet_groupsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_groups`;
}
