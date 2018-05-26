const getLoginStatus = (): Promise<facebook.AuthResponse> => new Promise((resolve) => {
  FB.getLoginStatus(resolve);
});

export default getLoginStatus;
