import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createPOChallanInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_po_challan_invoices`;
}
export function getPOChallanInvoiceListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_po_challan_invoice`;
}
export function getPOChallanInvoiceWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_po_challan_invoices_with_ids`;
}
export function getLastPOChallanInvoiceNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_po_challan_record`;
}

export function DTTranx_purchase_challanURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_purchase_challan`;
}
