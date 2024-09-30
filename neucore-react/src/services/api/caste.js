import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createCasteURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createCaste`;
}

export function getAllCastesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAllCastes`;
}

export function getCasteByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getCasteById`;
}
export function updateCasteURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateCaste`;
}

export function getCastesByReligionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getCastesByReligion`;
}
