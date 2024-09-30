import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createBusStopURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_bus_stop`;
}

export function getAllBusStopURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getAllBusStop`;
}

export function updateBusStopURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateBusStop`;
}

export function getBusStopByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getBusStopDetailsById`;
}

export function createStudentTransportURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createStudentTransport`;
}

export function getStudentlistforBusTransportURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStudentListforBusTransport`;
}

export function deleteBusDataURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/deleteBus`;
}

export function deleteStudentBusURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/deleteStudentBus`;
}
