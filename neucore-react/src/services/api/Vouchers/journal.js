import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_journal_list_by_outletUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_journal_list_by_outlet`;
}

export function get_last_record_journalUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_last_record_journal`;
}

export function create_journalUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_journal`;
}

export function get_ledger_list_by_outletUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_ledger_list_by_outlet`;
}

export function getJournalDetailsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_journal_details`;
}


export function deleteJournalMasterURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/deleteJournalMaster`;
}