import { authenticationService } from "@/services/api_functions";

export function HandleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        authenticationService.logout();
        window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

export function handleLoginResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    // if (!response.ok) {
    //   const error = (data && {
    //     message: data.message,
    //     status: data.status,
    //   }) || { message: response.statusText, status: 500 };
    //   return Promise.reject(error);
    // }
    return data;
  });
}
