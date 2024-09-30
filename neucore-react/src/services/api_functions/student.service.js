import { getHeader, getFormDataHeader } from "@/helpers";
import axios from "axios";
import {
  createStudentURL,
  getStudentListURL,
  getStudentListForTransactionURL,
  getStudentOutstandingURL,
  createTransactionURL,
  getTransactionListURL,
  getStudentRegisterbyIdUrl,
  updateStudentUrl,
  findStudentUrl,
  getTrasactionDetailsByIdURL,
  getStudentDetailsforBonafideURL,
  getTransactionListByStandardURL,
  getStudentListforStudentPromotionURL,
  getStudentListByStandardURL,
  getStudentTransportationListURL,
  deleteStudentURL,
  createStudentPromotionURL,
  exportExcelStudentTransportDataURL,
  getStudentPaidReceiptsURL,
  cancelStudentAdmissionURL,
  getStudentDataForPromotionURL,
  promoteStudentURL,
  getDataForDashboardURL,
} from "../api";

export function createStudent(values) {
  return axios({
    url: createStudentURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getStudentList() {
  return axios({
    url: getStudentListURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getStudentListForTransaction(values) {
  return axios({
    url: getStudentListForTransactionURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getStudentListByStandard(values) {
  return axios({
    url: getStudentListByStandardURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getStudentOutstanding(values) {
  return axios({
    url: getStudentOutstandingURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function createTransaction(values) {
  return axios({
    url: createTransactionURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getTransactionList() {
  return axios({
    url: getTransactionListURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getStudentRegisterbyId(values) {
  return axios({
    url: getStudentRegisterbyIdUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getStudentDetailsforBonafide(values) {
  return axios({
    url: getStudentDetailsforBonafideURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function updateStudent(values) {
  return axios({
    url: updateStudentUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function findStudent(values) {
  return axios({
    url: findStudentUrl(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getTrasactionDetailsById(values) {
  // return axios({
  //   url: getTrasactionDetailsByIdURL(),
  //   method: "POST",
  //   headers: getHeader(),
  //   data: values,
  // });

  const requestOption = {
    method: "POST",
    headers: getFormDataHeader(),
    body: values,
  };
  const url = getTrasactionDetailsByIdURL();
  return fetch(url, requestOption).then((res) => res.json());
}

export function getTransactionListByStandard(values) {
  return axios({
    url: getTransactionListByStandardURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function deleteStudent(values) {
  return axios({
    url: deleteStudentURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getStudentListforStudentPromotion(values) {
  return axios({
    url: getStudentListforStudentPromotionURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getStudentTransportationList(values) {
  return axios({
    url: getStudentTransportationListURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function createStudentPromotion(values) {
  return axios({
    url: createStudentPromotionURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function exportExcelStudentTransportData(values) {
  return axios({
    url: exportExcelStudentTransportDataURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getStudentPaidReceipts(values) {
  return axios({
    url: getStudentPaidReceiptsURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function cancelStudentAdmission(values) {
  return axios({
    url: cancelStudentAdmissionURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function getStudentDataForPromotion(values) {
  return axios({
    url: getStudentDataForPromotionURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function promoteStudent(values) {
  return axios({
    url: promoteStudentURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}

export function getDataForDashboard(values) {
  return axios({
    url: getDataForDashboardURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
