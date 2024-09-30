import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getProfitLossDetailsURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/getProfitLossDetails`;
}