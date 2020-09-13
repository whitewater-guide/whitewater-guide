import { TokenStorage } from '@whitewater-guide/clients';

class SecureTokenStorage implements TokenStorage {
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;

  async getAccessToken() {
    return Promise.resolve(this._accessToken);
  }

  async setAccessToken(value: string | null) {
    this._accessToken = value;
  }

  async getRefreshToken() {
    return Promise.resolve(this._refreshToken);
  }

  async setRefreshToken(value: string | null) {
    this._refreshToken = value;
  }
}

export const tokenStorage = new SecureTokenStorage();
