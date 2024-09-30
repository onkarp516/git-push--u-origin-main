import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getFeesMasterDetailsForInstallmentUrl,
  createInstallmentMasterUrl,
  updateInstallmentMasterUrl,
  getInstallmentMastersUrl,
  getConcessionsByInstallmentUrl,
  getDetailsByInstallmentUrl,
  getInstallmentsUrl,
  getConcessionsUrl,
  getInstallmentsByIdUrl,
  getInstallmentMasterByFilterURL,
  getDetailsByInstallmentForManualURL,
  deleteFeesInstallmentMasterURL,
} from "@/services/api";

export function getFeesMasterDetailsForInstallment(requestData) {
  return axios({
    url: getFeesMasterDetailsForInstallmentUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function createInstallmentMaster(requestData) {
  return axios({
    url: createInstallmentMasterUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function updateInstallmentMaster(requestData) {
  return axios({
    url: updateInstallmentMasterUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getInstallmentMasters() {
  return axios({
    url: getInstallmentMastersUrl(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getConcessionsByInstallment(reqData) {
  return axios({
    url: getConcessionsByInstallmentUrl(),
    data: reqData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getDetailsByInstallment(reqData) {
  return axios({
    url: getDetailsByInstallmentUrl(),
    data: reqData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getDetailsByInstallmentForManual(reqData) {
  return axios({
    url: getDetailsByInstallmentForManualURL(),
    data: reqData,
    method: "POST",
    headers: getHeader(),
  });
}

//
export function getInstallments(reqData) {
  return axios({
    url: getInstallmentsUrl(),
    data: reqData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getInstallmentsById(requestData) {
  return axios({
    url: getInstallmentsByIdUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getInstallmentMasterByFilter(requestData) {
  return axios({
    url: getInstallmentMasterByFilterURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function deleteFeesInstallmentMaster(requestData) {
  return axios({
    url: deleteFeesInstallmentMasterURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
