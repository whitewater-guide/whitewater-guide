import type { TokenStorage } from '@whitewater-guide/clients';

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenStorage: TokenStorage = {
  getAccessToken: async () => accessToken,
  setAccessToken: async (value: string | null) => {
    accessToken = value;
  },
  getRefreshToken: async () => refreshToken,
  setRefreshToken: async (value: string | null) => {
    refreshToken = value;
  },
};
