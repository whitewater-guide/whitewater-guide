import { AsyncStorage } from 'react-native';
import { persistStore, createTransform } from 'redux-persist';

// Only apollo data should be persisted
const apolloDataFilter = createTransform(
  ({ apollo, ...inboundState }) => ({ ...inboundState, apollo: { data: apollo.data } }),
  outboundState => outboundState,
);

const STORE_CONFIG = {
  version: '2',
  config: {
    storage: AsyncStorage,
    blacklist: ['transient'],
    transforms: [apolloDataFilter],
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
