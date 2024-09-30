import { authenticationService } from "@/services/api_functions";

export const AuthenticationCheck = () => {
  if (authenticationService.currentUserValue != null) {
    return true;
  } else {
    return false;
  }
};
