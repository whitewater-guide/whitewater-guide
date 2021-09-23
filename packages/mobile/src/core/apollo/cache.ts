import AsyncStorage from '@react-native-community/async-storage';
import { configureApolloCache } from '@whitewater-guide/clients';
import { CachePersistor, MMKVStorageWrapper } from 'apollo3-cache-persist';
import MMKVStorage from 'react-native-mmkv-storage';

import { trackError } from '../errors';

const SCHEMA_VERSION = '3'; // Must be a string.
const SCHEMA_VERSION_KEY = 'apollo-schema-version';

export const cache = configureApolloCache();

const storage = new MMKVStorage.Loader().initialize();

export const apolloCachePersistor = new CachePersistor({
  cache,
  storage: new MMKVStorageWrapper(storage),
  maxSize: false,
  debug: __DEV__,
});

export async function assertCachePersistorVersion(): Promise<void> {
  // Read the current schema version from AsyncStorage.
  const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);

  if (currentVersion === SCHEMA_VERSION) {
    // If the current version matches the latest version,
    // we're good to go and can restore the cache.
    try {
      await apolloCachePersistor.restore();
    } catch (e) {
      trackError('apollo-cache-persistor', e as Error);
    }
  } else {
    // Otherwise, we'll want to purge the outdated persisted cache
    // and mark ourselves as having updated to the latest version.
    await apolloCachePersistor.purge();
    await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
  }
}
