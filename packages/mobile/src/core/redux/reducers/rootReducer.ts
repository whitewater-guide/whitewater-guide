import { reducer as network } from 'react-native-offline';
import { combineReducers } from 'redux';
import { Action } from 'typescript-fsa';
import {
  offlineContentReducer,
  OfflineContentStore,
} from '../../../features/offline';
import { purchaseReducer, PurchaseStore } from '../../../features/purchases';
import { AppSettings, appSettingsReducer } from '../../../features/settings';
import { appReducer, AppState } from './appReducer';

export interface RootState {
  app: AppState; // transient app state
  settings: AppSettings; // persistent app state
  purchase: PurchaseStore;
  offlineContent: OfflineContentStore;
  network: {
    isConnected: boolean;
    actionQueue: any;
  };
}

export const rootReducer = combineReducers<RootState, Action<any>>({
  app: appReducer,
  settings: appSettingsReducer,
  purchase: purchaseReducer,
  offlineContent: offlineContentReducer,
  network,
});
