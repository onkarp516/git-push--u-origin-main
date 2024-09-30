import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createTaxURL,
  gettaxmasterbyOutletUrl,
  updateTaxUrl,
  get_tax_masterUrl,
} from "../api";

export function createTax(requestData) {
  return axios({
    url: createTaxURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function get_taxOutlet(requestData) {
  return axios({
    url: gettaxmasterbyOutletUrl(),
    data: requestData,
    method: "GET",
    headers: getHeader(),
  });
}
export function updateTax(requestData) {
  return axios({
    url: updateTaxUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
export function get_tax_master(requestData) {
  return axios({
    url: get_tax_masterUrl(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
