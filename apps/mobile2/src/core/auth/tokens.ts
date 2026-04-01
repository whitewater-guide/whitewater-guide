import type { TokenStorage } from '@whitewater-guide/clients';
import Config from 'react-native-config';
import type { StorageOptions } from 'react-native-sensitive-info';
import {
  deleteItem,
  ErrorCode,
  getItem,
  setItem,
} from 'react-native-sensitive-info';

const KEYCHAIN_SERVICE = `wwguide_${Config.ENV_NAME}_auth`;
const ACCESS_TOKEN_KEY = '@accessToken';
const REFRESH_TOKEN_KEY = '@refreshToken';

const OPTIONS: StorageOptions = {
  keychainService: KEYCHAIN_SERVICE,
  accessControl: __DEV__ ? 'none' : 'secureEnclaveBiometry',
};

class SecureTokenStorage implements TokenStorage {
  async getAccessToken() {
    try {
      const item = await getItem(ACCESS_TOKEN_KEY, OPTIONS);
      return item || null;
    } catch (e: any) {
      if (e?.code !== ErrorCode.NOT_FOUND) {
        // TODO: send to sentry
        console.error(e);
      }
      return null;
    }
  }

  async setAccessToken(value: string | null) {
    if (value) {
      await setItem(ACCESS_TOKEN_KEY, value, OPTIONS);
    } else {
      await deleteItem(ACCESS_TOKEN_KEY, OPTIONS);
    }
  }

  async getRefreshToken() {
    try {
      const item = await getItem(REFRESH_TOKEN_KEY, OPTIONS);
      return item || null;
    } catch (e: any) {
      if (e?.code !== ErrorCode.NOT_FOUND) {
        // TODO: send to sentry
        console.error(e);
      }
      return null;
    }
  }

  async setRefreshToken(value: string | null) {
    if (value) {
      await setItem(REFRESH_TOKEN_KEY, value, OPTIONS);
    } else {
      await deleteItem(REFRESH_TOKEN_KEY, OPTIONS);
    }
  }
}

export const tokenStorage = new SecureTokenStorage();
