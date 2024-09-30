import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getStandardWiseStudentDataURL,
  getDailyCollectionURL,
  deleteFeestransactionURL,
} from "@/services/api";

export function getStandardWiseStudentData(requestData) {
  return axios({
    url: getStandardWiseStudentDataURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function getDailyCollection(requestData) {
  return axios({
    url: getDailyCollectionURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}

export function deleteFeestransaction(requestData) {
  return axios({
    url: deleteFeestransactionURL(),
    data: requestData,
    method: "POST",
    headers: getHeader(),
  });
}
