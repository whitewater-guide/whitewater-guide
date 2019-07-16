import {
  checkInternetConnection,
  offlineActionTypes,
} from 'react-native-offline';
import { Store } from 'redux';
import { persistStore } from 'redux-persist';

const createPersistor = (store: Store<any>) =>
  persistStore(store, {}, async () => {
    const isConnected = await checkInternetConnection(undefined, 3000);
    store.dispatch({
      type: offlineActionTypes.CONNECTION_CHANGE,
      payload: isConnected,
    });
  });

export default createPersistor;
