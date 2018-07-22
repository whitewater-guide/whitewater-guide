import { AsyncStorage } from 'react-native';
import { reducer as network } from 'react-native-offline';
import { combineReducers, Reducer } from 'redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import { Action } from 'typescript-fsa';
import { purchaseReducer, PurchaseStore } from '../../features/purchases';
import { appReducer, AppState } from './appReducer';
import { settingsReducer, SettingsState } from './settingsReducer';

export interface RootState {
  app: AppState;
  settings: SettingsState;
  purchase: PurchaseStore;
  network: {
    isConnected: boolean;
    actionQueue: any;
  };
}

const rootReducer = combineReducers<RootState, Action<any>>({
  app: appReducer,
  settings: settingsReducer,
  purchase: purchaseReducer,
  network,
});

const persistConfig: PersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['app', 'purchase', 'network'],
};

export const persistedRootReducer: Reducer = persistReducer(persistConfig, rootReducer as any);
