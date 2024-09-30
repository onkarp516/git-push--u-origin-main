import { getHeader } from "@/helpers";
import axios from "axios";
import {
  getProductStockURL,
  get_closing_stock_URL,
  get_opening_stock_URL,
  get_inward_stock_URL,
  get_outward_stock_URL,
} from "@/services/api";

export function getProductStock() {
  return axios({
    url: getProductStockURL(),
    method: "GET",
    headers: getHeader(),
  });
}

//  this is for Closing Stocks  inventory..
export function getClosingStock(dates) {
  console.log(dates);
  return axios({
    url: get_closing_stock_URL(),
    method: "POST",
    headers: getHeader(),
    data: dates,
  });
}
export function getOpeningStock(dates) {
  return axios({
    url: get_opening_stock_URL(),
    method: "POST",
    headers: getHeader(),
    data: dates,
  });
}
export function getInwardStock(dates) {
  return axios({
    url: get_inward_stock_URL(),
    method: "POST",
    headers: getHeader(),
    data: dates,
  });
}
export function getOutwardStock(dates) {
  return axios({
    url: get_outward_stock_URL(),
    method: "POST",
    headers: getHeader(),
    data: dates,
  });
}

//
