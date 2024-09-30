import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createPOInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_po_invoices`;
}
export function getPOInvoiceListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_po_invoice`;
}
export function getPOURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_po`;
}
export function getPOInvoiceWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_po_invoices_with_ids`;
}
export function getPOPendingOrderWithIdsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/po_pending_order`;
}

export function getLastPOInvoiceNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_po_invoice_record`;
}

export function DTPurchaseOrderURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_purchase_order`;
}

export function getPurchaseOrderByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_purchase_order_by_id`;
}

export function getPurchaseOrderEditByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_pur_order`;
}
