import { getHeader } from "@/helpers";
import axios from "axios";

import {
  createBusStopURL,
  getAllBusStopURL,
  getBusStopByIdURL,
  updateBusStopURL,
  createStudentTransportURL,
  getStudentlistforBusTransportURL,
  deleteBusDataURL,
  deleteStudentBusURL,
} from "../api";

export function CreateBusStop(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    data: values,
    url: createBusStopURL(),
  });
}

export function getAllBusStop() {
  return axios({
    url: getAllBusStopURL(),
    method: "GET",
    headers: getHeader(),
  });
}

export function getBusStopById(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    data: values,
    url: getBusStopByIdURL(),
  });
}

export function updateBusStop(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    url: updateBusStopURL(),
    data: values,
  });
}

export function createStudentTransport(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    url: createStudentTransportURL(),
    data: values,
  });
}

export function getStudentlistforBusTransport(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    url: getStudentlistforBusTransportURL(),
    data: values,
  });
}

export function deleteBusData(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    url: deleteBusDataURL(),
    data: values,
  });
}

export function deleteStudentBus(values) {
  return axios({
    headers: getHeader(),
    method: "POST",
    url: deleteStudentBusURL(),
    data: values,
  });
}
