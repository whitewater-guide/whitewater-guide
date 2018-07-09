import { AsyncStorage } from 'react-native';
import { reducer as network } from 'react-native-offline';
import { combineReducers, Reducer } from 'redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
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

const rootReducer = combineReducers<RootState>({
  app: appReducer,
  settings: settingsReducer,
  purchase: purchaseReducer,
  network,
});

const persistConfig: PersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['app'],
  stateReconciler: autoMergeLevel2,
};

export const persistedRootReducer: Reducer<RootState> = persistReducer(persistConfig, rootReducer as any);
