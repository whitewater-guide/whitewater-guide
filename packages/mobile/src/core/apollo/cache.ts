import AsyncStorage from '@react-native-community/async-storage';
import { configureApolloCache } from '@whitewater-guide/clients';
import { CachePersistor } from 'apollo-cache-persist';
import { storage } from './storage';

const SCHEMA_VERSION = '1'; // Must be a string.
const SCHEMA_VERSION_KEY = 'apollo-schema-version';

export const inMemoryCache = configureApolloCache();

export const apolloCachePersistor = new CachePersistor({
  cache: inMemoryCache,
  storage,
  maxSize: false,
  debug: __DEV__,
  debounce: 4000,
});

export const assertCachePersistorVersion = async () => {
  // Read the current schema version from AsyncStorage.
  const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);

  if (currentVersion === SCHEMA_VERSION) {
    // If the current version matches the latest version,
    // we're good to go and can restore the cache.
    await apolloCachePersistor.restore();
  } else {
    // Otherwise, we'll want to purge the outdated persisted cache
    // and mark ourselves as having updated to the latest version.
    await apolloCachePersistor.purge();
    await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
  }
};
