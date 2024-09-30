import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createDivisionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createDivision`;
}

export function getAllDivisionsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAllDivisions`;
}

export function getDivisionByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getDivisionById`;
}
export function updateDivisionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateDivision`;
}

export function getDivisionsByStandardURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getDivisionsByStandard`;
}
