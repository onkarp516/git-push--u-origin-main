import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getUnderListURL,
  getBalancingMethodsURL,
  createSundryCreditorsURL,
  createSundryDebtorsURL,
  createBankAccountURL,
  createAssetsURL,
  createDutiesTaxesURL,
  createOthersURL,
  getLedgersURL,
  getLedgersByIdURL,
  editSundryCreditorsURL,
  editSundryDebtorsURL,
  editBankAccountURL,
  editAssetsURL,
  editDutiesTaxesURL,
  editOthersURL,
  getDiscountLedgersURL,
  getAdditionalLedgersURL,
  createLedgerURL,
  editLedgerURL,
  getLedgersForListURL,
  getLedgersByBranchURL,
  getDebtorLedgersByBranchURL,
  getLedgersDetailsURL,
  getLedgerVoucherDetailsURL,
  getBankDetailsURL
} from "../api";

export function getUnderList() {
  return axios({
    url: getUnderListURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getLedgers() {
  return axios({
    url: getLedgersURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getDiscountLedgers() {
  return axios({
    url: getDiscountLedgersURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getLedgerVoucherDetails(Values) {
  return axios({
    url: getLedgerVoucherDetailsURL(),
    method: "POST",
    data: Values,
    headers: getHeader(),
  });
}
export function getAdditionalLedgers() {
  return axios({
    url: getAdditionalLedgersURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getLedgersDetails(Values) {
  return axios({
    url: getLedgersDetailsURL(),
    method: "POST",
    data: Values,
    headers: getHeader(),
  });
}
export function getBalancingMethods() {
  return axios({
    url: getBalancingMethodsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function createSundryCreditors(requestData) {
  return axios({
    url: createSundryCreditorsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function editSundryCreditors(requestData) {
  return axios({
    url: editSundryCreditorsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function createSundryDebtors(requestData) {
  return axios({
    url: createSundryDebtorsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function editSundryDebtors(requestData) {
  return axios({
    url: editSundryDebtorsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function createBankAccount(requestData) {
  return axios({
    url: createBankAccountURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function editBankAccount(requestData) {
  return axios({
    url: editBankAccountURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function createAssets(requestData) {
  return axios({
    url: createAssetsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function editAssets(requestData) {
  return axios({
    url: editAssetsURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function createDutiesTaxes(requestData) {
  return axios({
    url: createDutiesTaxesURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function editDutiesTaxes(requestData) {
  return axios({
    url: editDutiesTaxesURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function createOthers(requestData) {
  return axios({
    url: createOthersURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function editOthers(requestData) {
  return axios({
    url: editOthersURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getLedgersById(requestData) {
  return axios({
    url: getLedgersByIdURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function createLedger(requestData) {
  return axios({
    url: createLedgerURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function editLedger(requestData) {
  return axios({
    url: editLedgerURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getLedgersForList() {
  return axios({
    url: getLedgersForListURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getLedgersByBranch(values) {
  return axios({
    url: getLedgersByBranchURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getDebtorLedgersByBranch(values) {
  return axios({
    url: getDebtorLedgersByBranchURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getBankDetails(values) {
  return axios({
    url: getBankDetailsURL(),
    method: "GET",
    headers: getHeader(),
  });
}
