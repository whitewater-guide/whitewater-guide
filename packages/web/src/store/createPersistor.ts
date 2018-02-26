import * as localForage from 'localforage';
import { Store } from 'redux';
import { Persistor, persistStore } from 'redux-persist';

const STORE_CONFIG = {
  version: '1',
};

export default async function createPersistor(store: Store<any>): Promise<Persistor> {
  const { version } = STORE_CONFIG;
  let persistor;
  try {
    const localVersion = await localForage.getItem('storeVersion');
    if (localVersion === version) {
      persistor = persistStore(store);
    } else {
      persistor = persistStore(store);
      await persistor.purge();
      localForage.setItem('storeVersion', version);
    }
  } catch (error) {
    persistor = persistStore(store);
    await persistor.purge();
    localForage.setItem('storeVersion', version);
  }
  return persistor;
}
