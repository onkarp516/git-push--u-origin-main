import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createCompanyURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_company`;
}

export function updateCompanyURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_company`;
}

export function get_companies_super_adminURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_companies_super_admin`;
}

export function getCompanyByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_company_by_id`;
}

export function createCompanyUserURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/register_user`;
}

export function get_c_admin_usersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_c_admin_users`;
}

export function get_user_by_idURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_user_by_id`;
}

export function getGSTTypesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_gst_type`;
}

export function listOfCompaniesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/listOfCompanies`;
}
