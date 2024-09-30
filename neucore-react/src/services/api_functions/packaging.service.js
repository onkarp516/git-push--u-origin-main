import { getHeader } from "@/helpers";
import axios from "axios";
import { getMstPackageListURL, getProductPackageListURL } from "../api";

export function getMstPackageList() {
  return axios({
    url: getMstPackageListURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getProductPackageList(requestData) {
  return axios({
    url: getProductPackageListURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
