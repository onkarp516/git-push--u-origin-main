import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createAccessActionsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_access_actions

  `;
}

export function getMasterActionsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_master_actions`;
}
