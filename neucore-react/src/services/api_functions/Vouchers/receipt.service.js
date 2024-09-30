import { getHeader } from "@/helpers";
import axios from "axios";

import { get_receipt_listURL,get_receipt_DetailsRL } from "@/services/api";
export function get_receipt_list() {
  return axios({
    url: get_receipt_listURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getReceiptDetails(requestData) {
  return axios({
    url: get_receipt_DetailsRL(),
    method: "POST",
    headers: getHeader(),
    data:requestData,
  });
}

