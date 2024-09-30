import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getTranxDebitNoteLastURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_pur_returns_record`;
}

export function getTranxDebitNoteListInvoiceBillSCURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_pur_invoice_supplier_wise`;
}

export function getTranxPurchaseProductListBillNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_pur_invoice_product_list`;
}
// list_pur_invoice_product_list
// export function DTTranx_purchase_challanURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_purchase_challan`;
// }

export function create_purchase_returns_invoicesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_purchase_returns_invoices`;
}

export function get_outstanding_pur_return_amtURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outstanding_pur_return_amt`;
}

export function getPurchaseReturnLstUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_pur_returns_by_outlet`;
}
export function list_debit_notesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_debit_notes`;
}
export function get_last_record_debitnoteURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_record_debitnote`;
}
export function create_debitURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_debit`;
}
