import { getHeader } from "@/helpers";
import axios from "axios";
import { get_Payment_listURL } from "@/services/api";
export function get_Payment_list() {
  return axios({
    url: get_Payment_listURL(),
    method: "GET",
    headers: getHeader(),
  });
}
