import { getHeader } from "@/helpers";
import axios from "axios";
import {
  get_journal_list_by_outletUrl,
  get_last_record_journalUrl,
  get_ledger_list_by_outletUrl,
  create_journalUrl,
  getJournalDetailsURL,
  deleteJournalMasterURL,
} from "@/services/api";

export function get_journal_list_by_outlet() {
  return axios({
    url: get_journal_list_by_outletUrl(),

    method: "GET",
    headers: getHeader(),
  });
}

export function get_last_record_journal() {
  return axios({
    url: get_last_record_journalUrl(),

    method: "GET",
    headers: getHeader(),
  });
}
export function get_ledger_list_by_outlet() {
  return axios({
    url: get_ledger_list_by_outletUrl(),

    method: "GET",
    headers: getHeader(),
  });
}
export function create_journal(requestData) {
  return axios({
    url: create_journalUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getJournalDetails(requestData) {
  return axios({
    url: getJournalDetailsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}


export function deleteJournalMaster(requestData) {
  return axios({
    url: deleteJournalMasterURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
