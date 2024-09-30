import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getTranxCreditNoteLastURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_sales_returns_record`;
}

export function getTranxCreditNoteListInvoiceBillSCURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sales_invoice_clients_wise`;
}

export function getTranxSalesProductListBillNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sales_invoice_product_list`;
}

export function get_sales_invoice_by_id_with_pr_idsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_invoice_by_id_with_pr_ids`;
}

export function create_sales_returns_invoicesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_returns_invoices`;
}
export function list_credit_notesUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_credit_notes`;
}
export function getTranxCreditNoteLastRecordURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_record_creditnote`;
}
export function create_creditUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_credit`;
}
