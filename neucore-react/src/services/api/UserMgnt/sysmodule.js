import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSysModuleURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_system_modules`;
}
export function getSysModuleTlstURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_system_modules`;
}

export function getSysModuleDlstURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_parents_modules`;
}

export function getActionMappingURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_actions_mappings`;
}
