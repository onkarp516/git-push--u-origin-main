import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getreceiptlastrecordsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_receipt_invoice_last_records`;
}

export function getSDIEReceiptUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_sundry_debtors_indirect_incomes`;
}
export function getCBADReceiptUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_cashAc_bank_account_details`;
}
export function getdebtorspendingbillsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_debtors_pending_bills`;
}
export function create_receiptUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_receipt`;
}
