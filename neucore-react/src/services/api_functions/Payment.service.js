import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getpaymentinvoicelastrecordsUrl,
  getsundrycreditorsindirectexpensesUrl,
  getcreditorspendingbillsUrl,
  getcashAcbankaccountUrl,
  create_paymentsUrl,
} from "../api";

export function getpaymentinvoicelastrecords(requestData) {
  return axios({
    url: getpaymentinvoicelastrecordsUrl(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}
export function getsundrycreditorsindirectexpenses(requestData) {
  return axios({
    url: getsundrycreditorsindirectexpensesUrl(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}
export function getcashAcbankaccount(requestData) {
  return axios({
    url: getcashAcbankaccountUrl(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}
export function getcreditorspendingbills(requestData) {
  return axios({
    url: getcreditorspendingbillsUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function create_payments(requestData) {
  return axios({
    url: create_paymentsUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
