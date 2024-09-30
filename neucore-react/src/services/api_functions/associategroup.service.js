import { getHeader } from "@/helpers";
import axios from "axios";
import {
  createAssociateGroupURL,
  updateAssociateGroupURL,
  getAssociateGroupsURL,
  get_associate_groupURL,
} from "../api";

export function createAssociateGroup(requestData) {
  return axios({
    url: createAssociateGroupURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}

export function updateAssociateGroup(requestData) {
  return axios({
    url: updateAssociateGroupURL(),
    method: "POST",
    headers: getHeader(),
    data: requestData,
  });
}
export function getAssociateGroups() {
  return axios({
    url: getAssociateGroupsURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function get_associate_group(values) {
  return axios({
    url: get_associate_groupURL(),
    method: "POST",
    headers: getHeader(),
    data: values,
  });
}
