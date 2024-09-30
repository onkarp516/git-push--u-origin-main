import { BehaviorSubject } from "rxjs";

import {
  authHeader,
  authLogin,
  getHeader,
  handleLoginResponse,
} from "@/helpers";
import jwt_decode from "jwt-decode";

import { authLoginURL } from "../api";

// const base64 = require("base-64");
// var utf8 = require("utf8");

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser"))
);
const currentUserToken = new BehaviorSubject(
  JSON.parse(localStorage.getItem("refreshToken"))
);

export const authenticationService = {
  login,
  logout,
  currentUser: currentUserSubject.asObservable(),
  currentUserToken: currentUserToken.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
  get currentUserToken() {
    // console.log("currentUserToken",currentUserToken.value)
    return currentUserToken.value;
  },
};

function login(userDa) {
  const userData = {
    usercode: userDa["usercode"],
    password: userDa["password"],
  };
  const requestOption = {
    method: "POST",
    headers: authLogin(),
    body: JSON.stringify(userData),
  };
  const URL = authLoginURL();
  // return axios({
  //   url: URL,
  //   data: JSON.stringify(userData),
  //   method: 'POST',
  //   headers: authLogin(),
  // });
  return fetch(URL, requestOption)
    .then(handleLoginResponse)
    .then((response) => {
      if (response["responseStatus"] == 200) {
        // base64 to string
        // var permissionJson = "";
        // if (response["data"] != null) {
        //   var bytes = base64.decode(response["data"]);
        //   permissionJson = utf8.decode(bytes);
        //   // console.log('base64ToString', permissionJson);
        //   console.log("base64ToString", JSON.stringify(permissionJson));
        // }

        let decoded = jwt_decode(response["responseObject"]["access_token"]);
        let refreshToken = jwt_decode(
          response["responseObject"]["refresh_token"]
        );
        decoded["token"] = response["responseObject"]["access_token"];
        // decoded["permissionJson"] = JSON.stringify(permissionJson);
        decoded["status"] = response["responseStatus"];

        localStorage.setItem("currentUser", JSON.stringify(decoded));
        localStorage.setItem(
          "refreshTokenOrg",
          response["responseObject"]["refresh_token"]
        );
        localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

        currentUserSubject.next(decoded);
        currentUserToken.next(response);
        return decoded;
      } else {
        return response;
      }
    });
}

function logout() {
  localStorage.clear();
  currentUserSubject.next(null);
  // history.push('/login');
  // !This is problem when we are logout
  // const URL = logoutURL();
  // return fetch(URL, {
  //   method: "POST",
  //   headers: authHeader()
  // }).then(
  //   (response) => {
  //     return response;
  //   }
  // );
}
