import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createInstituteURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_institute`;
}

export function getInstitutesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_institute_list`;
}


export function createInstituteUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/register_user`;
}

export function getInstituteByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_institute_by_id`;
}
export function updateInstituteByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_institute`;
}

export function getInstituteUserByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getUser`;
}

export function updateInstituteUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateUser`;
}
