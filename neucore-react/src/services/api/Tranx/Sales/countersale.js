import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getCounterSaleLastInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_last_invoice_record`;
}
export function createCounterSalesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_counter_sales_invoices`;
}
export function getCounterSaleInvoicesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_invoices`;
}
export function getCounterSalesClientListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_client_list_for_sale`;
}

export function getCounterSalesWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_invoices_with_ids`;
}

export function getCounterSalesWithIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_counter_sales_invoices_with_id`;
}

export function updateCounterSalesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_counter_sales_invoices`;
}

export function DTTranx_counter_sales_invoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_counter_sales_invoice`;
}
