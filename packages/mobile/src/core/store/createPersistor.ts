import { AsyncStorage } from 'react-native';
import { Store } from 'redux';
import { Persistor, persistStore } from 'redux-persist';
import { bootstrapped } from '../actions';

const STORE_CONFIG = {
  version: '1',
};

export default async function createPersistor(store: Store<any>): Promise<Persistor> {
  const { version } = STORE_CONFIG;
  let persistor;
  const makePersitor = () => persistStore(store, {}, () => store.dispatch(bootstrapped()));
  try {
    const localVersion = await AsyncStorage.getItem('storeVersion');
    if (localVersion === version) {
      persistor = makePersitor();
    } else {
      persistor = makePersitor();
      await persistor.purge();
      AsyncStorage.setItem('storeVersion', version);
    }
  } catch (error) {
    persistor = makePersitor();
    await persistor.purge();
    AsyncStorage.setItem('storeVersion', version);
  }
  return persistor;
}
