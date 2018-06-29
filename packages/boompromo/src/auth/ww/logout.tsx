export const wwLogout = () => fetch(
  `${process.env.REACT_APP_API_HOST}/auth/logout`,
  { credentials: process.env.NODE_ENV === 'production' ? 'same-origin' : 'include' },
);
