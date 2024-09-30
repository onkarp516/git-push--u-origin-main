import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createPOChallanInvoiceURL,
  getPOChallanInvoiceListURL,
  getLastPOChallanInvoiceNoURL,
  getPOChallanInvoiceWithIdsURL,
} from "@/services/api";

export function getLastPOChallanInvoiceNo() {
  return axios({
    url: getLastPOChallanInvoiceNoURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function createPOChallanInvoice(requestData) {
  return axios({
    url: createPOChallanInvoiceURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function getPOChallanInvoiceList() {
  return axios({
    url: getPOChallanInvoiceListURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getPOChallanInvoiceWithIds(requestData) {
  return axios({
    url: getPOChallanInvoiceWithIdsURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
