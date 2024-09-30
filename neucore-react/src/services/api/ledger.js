import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getUnderListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_under_list`;
}

export function getBalancingMethodsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_balancing_methods`;
}

export function createSundryCreditorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sundry_creditors`;
}
export function editSundryCreditorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_sundry_creditors`;
}

export function createSundryDebtorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_sundry_debtors`;
}
export function editSundryDebtorsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_sundry_debtors`;
}

export function createBankAccountURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_bank_account_ledger`;
}
export function editBankAccountURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_bank_account_ledger`;
}
export function createDutiesTaxesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_duties_taxes_ledger`;
}

export function editDutiesTaxesURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/update_duties_taxes_ledger`;
}

export function createAssetsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_assets`;
}
export function editAssetsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_assets`;
}

export function createOthersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_others_ledger`;
}
export function editOthersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_others_ledger`;
}
export function getLedgersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_ledgers`;
}
export function getLedgersByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_ledgers_by_id`;
}

export function getDiscountLedgersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_indirect_incomes`;
}

export function getAdditionalLedgersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_indirect_expenses`;
}
export function getLedgersDetailsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_ledger_details`;
}
export function createLedgerURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_ledger_master`;
}

export function editLedgerURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/edit_ledger_master`;
}

export function DTGetAllLedgersURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/DTGet_all_ledgers`;
}

export function getLedgersForListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getLedgersForList`;
}

export function getLedgersByBranchURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getLedgersByBranch`;
}

export function getDebtorLedgersByBranchURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_student_sundry_debtors`;
}

export function getBankDetailsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getbankdetails`;
}