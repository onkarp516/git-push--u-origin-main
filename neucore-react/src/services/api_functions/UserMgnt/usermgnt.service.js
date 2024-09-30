import { getHeader } from "@/helpers";
import axios from "axios";
import { getSysAllPermissionsURL } from "@/services/api";

export function getSysAllPermissions() {
  return axios({
    url: getSysAllPermissionsURL(),
    method: "GET",
    headers: getHeader(),
  });
}
