import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createBrandURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sub_group`;
}
export function getBrandsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_subgroups`;
}
export function getAllBrandsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_subgroups`;
}
export function updateBrandURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_sub_group`;
}

export function DTSubgroupURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTSubgroup`;
}
export function get_subgroups_by_IdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_subgroups_by_id`;
}
