import { getHeader } from "@/helpers";
import axios from "axios";
import { get_last_record_contraURL, create_contraURL,get_contra_list_by_outletUrl } from "@/services/api";

export function get_last_record_contra() {
  return axios({
    url: get_last_record_contraURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function create_contra(values) {
  return axios({
    url: create_contraURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
export function get_contra_list_by_outlet() {
  return axios({
    url: get_contra_list_by_outletUrl(),
    method: 'GET',
    headers: getHeader(),
  });
}