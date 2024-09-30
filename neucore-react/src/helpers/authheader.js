import { authenticationService } from "@/services/api_functions";

export function authHeader() {
  const token = localStorage.getItem("authenticationService");
  return {
    // "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function authLogin() {
  return {
    "Content-Type": "application/json",
  };
}

export function getHeader() {
  const token = localStorage.getItem("authenticationService");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function getFormDataHeader() {
  const token = localStorage.getItem("authenticationService");
  return {
    // "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };
}

export function isParentExist(parent_slug) {
  let res = false;
  let permissions = JSON.parse(
    authenticationService.currentUserValue.permission
  );
  if (
    authenticationService.currentUserValue.userRole == "SADMIN" ||
    authenticationService.currentUserValue.userRole == "CADMIN" ||
    authenticationService.currentUserValue.userRole == "BADMIN"
  ) {
    return true;
  }
  if (permissions) {
    let userPermissions = permissions.userActions;
    userPermissions.map((v) => {
      let parents = v.parent_modules;
      parents.map((vi) => {
        if (vi.slug == parent_slug) {
          res = true;
        }
      });
    });
  }
  return res;
}

export function isActionExist(module_slug, action_slug) {
  let res = false;
  let permissions = JSON.parse(
    authenticationService.currentUserValue.permission
  );
  if (
    authenticationService.currentUserValue.userRole == "SADMIN"
    // authenticationService.currentUserValue.userRole == "CADMIN" ||
    // authenticationService.currentUserValue.userRole == "BADMIN"
  ) {
    return true;
  }
  if (permissions) {
    let userPermissions = permissions.userActions;
    // console.log("userPermissions", userPermissions);
    let obj = userPermissions.find((v) => v.action_mapping_slug == module_slug);
    // console.log("obj", obj);
    if (obj) {
      let actions = obj.actions;
      actions.map((vi) => {
        if (vi.slug == action_slug) {
          res = true;
        }
      });
    }
  }
  return res;
}
