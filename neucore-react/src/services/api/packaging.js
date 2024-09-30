import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getMstPackageListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_packings`;
}

export function getProductPackageListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_product_units_packings`;
}
