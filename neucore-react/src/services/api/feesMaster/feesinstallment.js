import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getFeesMasterDetailsForInstallmentUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getFeesMasterDetailsForInstallment`;
}

export function createInstallmentMasterUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createInstallmentMaster`;
}
export function updateInstallmentMasterUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateInstallmentMaster`;
}

export function getInstallmentMastersUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getInstallmentMasters`;
}

export function getConcessionsByInstallmentUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getConcessionsByInstallment`;
}

export function getDetailsByInstallmentUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getDetailsByInstallment`;
}

export function getDetailsByInstallmentForManualURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getDetailsByInstallmentForManual`;
}

export function getInstallmentsUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getInstallments`;
}

export function getInstallmentsByIdUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getFeesInstallmentById`;
}

export function getInstallmentMasterByFilterURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getInstallmentMasterByFilter`;
}

export function deleteFeesInstallmentMasterURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/deleteFeesInstallmentMaster`;
}
