export const logout = (): Promise<facebook.StatusResponse> =>
  new Promise((resolve) => {
    FB.logout(resolve);
  });
