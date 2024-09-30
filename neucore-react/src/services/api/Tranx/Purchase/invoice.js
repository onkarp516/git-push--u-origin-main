import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getPurchaseAccountsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_purchase_accounts`;
}
export function getSundryCreditorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_creditors`;
}
export function getProductURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_product`;
}
export function createPurchaseInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_purchase_invoices`;
}

export function editPurchaseInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_purchase_invoices`;
}

export function getPurchaseInvoiceListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_purchase_invoice`;
}
export function getLastPurchaseInvoiceNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_invoice_record`;
}
export function getPurchaseInvoiceByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_purchase_invoice_by_id`;
}
export function getPurchaseInvoiceShowByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_creditors_by_id`;
}
export function listTranxDebitesNotesUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_tranx_debites_notes`;
}
