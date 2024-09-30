import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createReligionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createReligion`;
}

export function getReligionListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getReligionList`;
}

export function getReligionByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getReligionById`;
}
export function updateReligionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateReligion`;
}
