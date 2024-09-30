import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSalesOrderURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_order_invoice`;
}
export function getLastSalesOrderURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_sales_order_record`;
}
export function DTSaleOrderURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_sales_order`;
}
export function getSaleOrderListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sale_orders`;
}
export function getSaleOrderWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sale_orders_with_ids`;
}
export function getSundryDebtorsIdUrlOder() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_debtors_by_id`;
}
