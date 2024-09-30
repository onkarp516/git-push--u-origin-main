import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createFeesMasterUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createFeesMaster`;
}

export function getFeesMastersUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getFeesMasters`;
}

export function getFeesMasterByIdUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getFeesMasterById`;
}
export function updateFeesMasterUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateFeesMaster`;
}
export function getSubFeeHeadsByFeeHeadUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getSubFeeHeadsByFeeHead`;
}
