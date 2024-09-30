import { getHeader } from "@/helpers";
import axios from "axios";
import {
    getProfitLossDetailsURL

} from "../api";

export function getProfitLossDetails(requestData) {
    return axios({
        url: getProfitLossDetailsURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}

