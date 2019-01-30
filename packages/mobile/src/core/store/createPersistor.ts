import { AsyncStorage } from 'react-native';
import Config from 'react-native-config';
import {
  checkInternetConnection,
  offlineActionTypes,
} from 'react-native-offline';
import { Store } from 'redux';
import { Persistor, persistStore } from 'redux-persist';
import { bootstrapped } from '../actions';

const STORE_CONFIG = {
  version: '2',
};

export default async function createPersistor(
  store: Store<any>,
): Promise<Persistor> {
  const { version } = STORE_CONFIG;
  let persistor;
  const makePersitor = () =>
    persistStore(store, {}, async () => {
      const isConnected = await checkInternetConnection(
        `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}`,
        3000,
      );
      store.dispatch({
        type: offlineActionTypes.CONNECTION_CHANGE,
        payload: isConnected,
      });
      store.dispatch(bootstrapped());
    });
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
