export const logout = (): Promise<facebook.AuthResponse> => new Promise((resolve) => {
  FB.logout(resolve);
});