import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createFeeSubHeadURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createSubFeeHead`;
}
export function getAllSubFeeHeadsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAllSubFeeHeads`;
}
export function getSubFeeHeadByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getSubFeeHeadById`;
}
export function updateFeeSubHeadURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateSubFeeHead`;
}
