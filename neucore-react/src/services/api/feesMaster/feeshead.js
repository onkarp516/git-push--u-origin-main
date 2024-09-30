import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createFeeHeadURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createFeeHead`;
}

export function getAllFeeHeadsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAllFeeHeads`;
}

export function getFeeHeadByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getFeeHeadById`;
}
export function updateFeeHeadURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateFeesHeadAccounting`;
}

export function getFeeHeadsByBranchURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getFeeHeadsByBranch`;
}
export function updateFeeHeadNormalURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateFeeHead`;
}