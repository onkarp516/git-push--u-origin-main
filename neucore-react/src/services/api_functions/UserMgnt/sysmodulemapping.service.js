import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createSysModuleMappingURL,
  getSysActionsURL,
  //   getSysModuleDlstURL,
} from "@/services/api";

export function createSysModuleMapping(requestData) {
  return axios({
    url: createSysModuleMappingURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function getSysActions() {
  return axios({
    url: getSysActionsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

// export function getSysModuleDlst() {
//   return axios({
//     url: getSysModuleDlstURL(),
//     method: 'GET',
//     headers: getHeader(),
//   });
// }
