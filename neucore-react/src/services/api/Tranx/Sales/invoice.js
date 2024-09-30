import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getSalesAccountsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_accounts`;
}

export function getSundryDebtorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_debtors`;
}

export function getLastSalesInvoiceNoURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_last_invoice_record`;
}
export function getLedgerVoucherDetailsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_ledger_voucher_details`;
}
export function createSalesInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_invoices`;
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_order_invoice`;
  // return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sales_quotation`;
}

export function getSalesInvoiceListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/list_sale_invoice`;
}
// export function editPurchaseInvoiceURL() {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_purchase_invoices`;
// }
export function DTSaleInvoiceURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTTranx_sales_invoice`;
}
export function getSundryDebtorsIdUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_debtors_by_id`;
}

export function get_outstanding_sales_return_amtUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outstanding_sales_return_amt`;
}

export function getSaleInvoiceDetailsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sales_invoice_details`;
}
