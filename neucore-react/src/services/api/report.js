import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getStandardWiseStudentDataURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStudentListasPerStandard`;
}

export function getDailyCollectionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getCollectionByDate`;
}

export function deleteFeestransactionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/deleteFeesDataForVidyalay`;
}
