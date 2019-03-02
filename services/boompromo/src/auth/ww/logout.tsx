import { API_HOST } from '../../environment';

export const wwLogout = () =>
  fetch(`${API_HOST}/auth/logout`, {
    credentials: 'include',
  });
