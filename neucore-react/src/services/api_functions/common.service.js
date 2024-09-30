import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getStateURL,
  getIndianStateURL,
  getIndiaCountryURL,
  get_mesg_for_token_expiredURL,
} from "../api";

export function getState() {
  return axios({
    url: getStateURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getIndianState() {
  return axios({
    url: getIndianStateURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getIndiaCountry() {
  return axios({
    url: getIndiaCountryURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_mesg_for_token_expired() {
  return axios({
    url: get_mesg_for_token_expiredURL(),
    method: "GET",
    headers: getHeader(),
  });
}
