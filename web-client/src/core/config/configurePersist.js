import localForage from 'localforage'
import { persistStore} from 'redux-persist';

const STORE_CONFIG = {
  version: '1',
  config: {
    storage: localForage,
    blacklist: ['transient'],
  },
};

export default async function configurePersist(store) {
  const { version, config } = STORE_CONFIG;
  try {
    const localVersion = await localForage.getItem('storeVersion');
    if (localVersion === version) {
      persistStore(store, config);
    } else {
      persistStore(store, config).purge();
      localForage.setItem('storeVersion', version);
    }
  } catch (error) {
    persistStore(store, config).purge();
    localForage.setItem('storeVersion', version);
  }
}
