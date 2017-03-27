import { AsyncStorage } from 'react-native';
import { persistStore } from 'redux-persist';

const STORE_CONFIG = {
  version: '1',
  config: {
    storage: AsyncStorage,
    blacklist: ['transient'],
  },
};

export default async function configurePersist(store) {
  const { version, config } = STORE_CONFIG;
  try {
    const localVersion = await AsyncStorage.getItem('storeVersion');
    if (localVersion === version) {
      persistStore(store, config);
    } else {
      persistStore(store, config).purge();
      AsyncStorage.setItem('storeVersion', version);
    }
  } catch (error) {
    persistStore(store, config).purge();
    AsyncStorage.setItem('storeVersion', version);
  }
}
