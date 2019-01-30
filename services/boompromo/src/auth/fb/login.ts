export const login = (): Promise<facebook.StatusResponse> =>
  new Promise((resolve) => {
    FB.login(resolve, { scope: 'public_profile, email' });
  });
