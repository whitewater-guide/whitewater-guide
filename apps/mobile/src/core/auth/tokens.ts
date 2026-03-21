import type { TokenStorage } from '@whitewater-guide/clients';
import type { RNSensitiveInfoOptions } from 'react-native-sensitive-info';
import { deleteItem, getItem, setItem } from 'react-native-sensitive-info';
import Config from 'react-native-ultimate-config';

const KEYCHAIN_SERVICE = `wwguide_${Config.ENV_NAME}`;
const SHARED_PREFERENCES = `wwguide_${Config.ENV_NAME}`;
const ACEESS_TOKEN_KEY = '@accessToken';
const REFRESH_TOKEN_KEY = '@refreshToken';

const OPTIONS: RNSensitiveInfoOptions = {
  keychainService: KEYCHAIN_SERVICE,
  sharedPreferencesName: SHARED_PREFERENCES,
};

class SecureTokenStorage implements TokenStorage {
  async getAccessToken() {
    const item = await getItem(ACEESS_TOKEN_KEY, OPTIONS);
    return item || null;
  }

  async setAccessToken(value: string | null) {
    if (value) {
      await setItem(ACEESS_TOKEN_KEY, value, OPTIONS);
    } else {
      await deleteItem(ACEESS_TOKEN_KEY, OPTIONS);
    }
  }

  async getRefreshToken() {
    const item = await getItem(REFRESH_TOKEN_KEY, OPTIONS);
    return item || null;
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
