import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createSysModuleURL,
  getSysModuleTlstURL,
  getSysModuleDlstURL,
  getActionMappingURL,
} from "@/services/api";

export function createSysModule(requestData) {
  return axios({
    url: createSysModuleURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getSysModuleTlst() {
  return axios({
    url: getSysModuleTlstURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getSysModuleDlst() {
  return axios({
    url: getSysModuleDlstURL(),
    method: "GET",
    headers: getHeader(),
  });
}
export function getActionMapping() {
  return axios({
    url: getActionMappingURL(),
    method: "GET",
    headers: getHeader(),
  });
}
