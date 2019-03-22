import { API_HOST } from '../environment';

export const refreshJWT = () =>
  fetch(`${API_HOST}/auth/jwt/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ web: true }),
  });
