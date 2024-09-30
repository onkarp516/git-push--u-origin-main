import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSubCastURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_subCast`;
}

export function getSubCastesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getSubCastes`;
}

export function getSubCasteByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getSubCasteById`;
}
export function updateSubCasteURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateSubCaste`;
}

export function getSubCasteByCasteURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getSubCasteByCaste`;
}
