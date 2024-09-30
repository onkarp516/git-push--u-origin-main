import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createStandardURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_standard`;
}

export function getAllStandardsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAllStandards`;
}

export function getStandardByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStandardById`;
}
export function updateStandardURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateStandard`;
}

export function getStandardsByBranchURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStandardsByBranch`;
}
