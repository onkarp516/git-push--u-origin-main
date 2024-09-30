import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createUnitURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_unit`;
}

export function getAllUnitURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_units_by_outlet`;
}

export function updateUnitURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_unit`;
}

export function DTUnitURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTUnit`;
}

export function get_units_by_IdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_units_by_id`;
}
