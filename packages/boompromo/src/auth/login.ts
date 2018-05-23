const login = (): Promise<facebook.AuthResponse> => new Promise((resolve) => {
  FB.login(resolve, { scope: 'public_profile, email' });
});

export default login;
