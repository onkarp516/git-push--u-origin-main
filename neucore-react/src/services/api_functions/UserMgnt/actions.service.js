import { getHeader } from "@/helpers";
import axios from "axios";
import { createAccessActionsUrl, getMasterActionsUrl } from "@/services/api";

export function createAccessActions(requestData) {
  return axios({
    url: createAccessActionsUrl(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getMasterActions() {
  return axios({
    url: getMasterActionsUrl(),
    method: "GET",
    headers: getHeader(),
  });
}
