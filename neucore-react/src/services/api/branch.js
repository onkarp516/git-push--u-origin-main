import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createBranchURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_branch`;
}
export function getBranchesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branches`;
}
export function getBranchByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branch_by_id`;
}
export function updateBranchByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_branch`;
}
export function createBranchUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/register_user`;
}
export function getBranchesByUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branches_by_users`;
}
export function getBranchByInstituteAndUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branches_by_institutes`;
}
export function get_branches_superAdminURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branches_superAdmin`;
}

export function get_branches_super_adminURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branches_super_admin`;
}

export function getBAdminUsersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_b_admin_users`;
}

export function get_b_user_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_b_user_by_id`;
}
