export const getLoginStatus = (): Promise<facebook.StatusResponse> =>
  new Promise((resolve) => {
    FB.getLoginStatus(resolve);
  });
