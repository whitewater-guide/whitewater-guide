import { AuthPayload, RefreshPayload } from '@whitewater-guide/commons';
import { AuthResponse } from './types';

export const fetchAccessToken = (baseUrl: string, payload?: RefreshPayload) =>
  fetch(`${baseUrl}/auth/jwt/refresh`, {
    method: 'POST',
    credentials: !!payload ? 'omit' : 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });

export const refreshAccessToken = async (
  baseUrl: string,
  payload?: RefreshPayload,
): Promise<AuthResponse> => {
  const resp = await fetchAccessToken(baseUrl, payload);
  let responsePayload: AuthPayload = { success: false };
  try {
    responsePayload = await resp.json();
  } catch {}
  return {
    ...responsePayload,
    status: resp.status,
    success: resp.ok && responsePayload.success,
  };
};
