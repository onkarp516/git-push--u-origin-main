import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getProductStockURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_product_stocks`;
}

// this is for closing stock inventory..
export function get_closing_stock_URL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getClosingStock`;
}

export function get_opening_stock_URL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getOpeningStock`;
}
export function get_inward_stock_URL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getInwards`;
}
export function get_outward_stock_URL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getOutwards`;
}

//
