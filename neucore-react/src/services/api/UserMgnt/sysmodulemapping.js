import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSysModuleMappingURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_actions_mappings`;
}
export function getSysActionsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_master_actions`;
}

// export function getSysModuleDlstURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/get_parents_modules`;
// }
