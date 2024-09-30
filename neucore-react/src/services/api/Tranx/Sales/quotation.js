import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSalesQuotationURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_quotation`;
}
export function getLastSalesQuotationNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_sales_quotation_record`;
}
export function getAllSalesOrdersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_sales_orders`;
}

export function DTSaleQuotationURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_sales_quotation`;
}
// export function getSaleQuotationListURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sale_quotation`;
// }
export function getSaleQuotationWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sale_quotation_with_ids`;
}
export function getSaleQuotationListIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sales_quotations`;
}

export function getSaleQuotationListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sales_quotations`;
}
