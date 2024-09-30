import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createOutletURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_branch`;
}
export function updateOutletURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_branch`;
}

export function getOutletByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_branch_by_id`;
}
export function getListOfCompanyURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/listOfCompanies`;
}
export function getAllBranchesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAllBranches`;
}
export function getBranchesByOutletUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getBranchesByOutlet`;
}
