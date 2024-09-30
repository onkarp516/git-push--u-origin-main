import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createStudentURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createStudent`;
}

export function getStudentListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStudentList`;
}

export function getStudentListForTransactionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStudentListForTransaction`;
}

export function getStudentOutstandingURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStudentOutstanding`;
}

export function createTransactionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createTransactionForVidyalay`;
}

export function getTransactionListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getTransactionList`;
}

export function getStudentRegisterbyIdUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStudentRegisterById`;
}
export function getStudentDetailsforBonafideURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_student_Details_For_Bonafide`;
}

export function updateStudentUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/updateStudent`;
}
export function findStudentUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/findStudent`;
}

export function getTrasactionDetailsByIdURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getTransactionDetailsById`;
}

export function getStudentListByStandardURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStudentListByStandard`;
}
export function getTransactionListByStandardURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getTransactionListByStandard`;
}

export function deleteStudentURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/deleteStudent`;
}

export function getStudentListforStudentPromotionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStudentListForPromotion`;
}

export function exportExcelStudentDataURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/exportExcelStudentData`;
}

// export function exportExcelStudentDataURL(outletId, branchId) {
//   return `http://${getCurrentIpaddress()}:${getPortNo()}/exportExcelStudentData/${outletId}/${branchId}`;
// }
export function exportDailycollectionDataURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/exportDailyCollectionSheet`;
}

export function exportOutstandingListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/exportOutstandingListSheet`;
}
export function getStudentTransportationListURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getBusAllocatedStudentList`;
}

export function createStudentPromotionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/createStudentPromotion`;
}

export function exportExcelStudentTransportDataURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/exportExcelStudentTransportData`;
}

export function getStudentPaidReceiptsURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStudentPaidReceipts`;
}

export function cancelStudentAdmissionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/cancelStudentAdmission`;
}

export function getStudentDataForPromotionURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getStudentDataForPromotion`;
}

export function promoteStudentURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/promoteStudent`;
}

export function getDataForDashboardURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/getDataForDashboard`;
}

export function exportFeesPaymentSheetForTallyURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/exportFeesPaymentSheetForTallyByReceipt`;
}
