import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createAcademicYearURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_AcademicYear`;
}

export function getAcademicYearURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAllAcademicYear`;
}

export function getAcademicByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAcademicYearById`;
}
export function updateAcademicURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateAcademicYear`;
}

export function getAcademicYearByBranchURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAcademicYearByBranch`;
}
