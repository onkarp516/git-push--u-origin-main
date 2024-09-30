import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createMothertongueURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createMotherTongue`;
}

export function getMothertongueURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getMotherTongueList`;
}

export function getMotherTongueByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getMotherTongueById`;
}
export function updateMotherTongueURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateMotherTongue`;
}
