import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureApolloCache } from '@whitewater-guide/clients';
import { CachePersistor } from 'apollo3-cache-persist';
import { createMMKV } from 'react-native-mmkv';

const SCHEMA_VERSION = '1';
const SCHEMA_VERSION_KEY = 'apollo-schema-version';

export const cache = configureApolloCache();

const mmkv = createMMKV({ id: 'apollo-cache' });

const mmkvStorage = {
  getItem: (key: string) => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => {
    mmkv.remove(key);
  },
};

export const apolloCachePersistor = new CachePersistor({
  cache,
  storage: mmkvStorage,
  maxSize: false,
  debug: __DEV__,
});

export async function assertCachePersistorVersion(): Promise<void> {
  const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);

  if (currentVersion === SCHEMA_VERSION) {
    try {
      await apolloCachePersistor.restore();
    } catch {
      // ignore restore errors
    }
  } else {
    await apolloCachePersistor.purge();
    await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
  }
}
