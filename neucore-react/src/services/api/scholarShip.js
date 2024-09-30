import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createScholarShipURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_scholar_ship`;
}
export function getAllScholarShipURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAllScholarShip`;
}

export function getScholarShipDetailsByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getScholarShipDetailsById`;
}
export function updateScholarShipURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateScholarShip`;
}

export function deleteScholarShipURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/deleteScholarShip`;
}
export function getStudentListforScholarShipURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStudentListforScholarShip`;
}
export function assignScholarshipToStudentURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/assignScholarshipToStudent`;
}

export function getScholarshipAssignedListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getScholarshipAssignedList`;
}
