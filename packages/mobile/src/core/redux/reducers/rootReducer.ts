import { reducer as network } from 'react-native-offline';
import { combineReducers } from 'redux';
import { Action } from 'typescript-fsa';
import {
  offlineContentReducer,
  OfflineContentStore,
} from '../../../features/offline';
import { AppSettings, appSettingsReducer } from '../../../features/settings';

export interface RootState {
  settings: AppSettings; // persistent app state
  offlineContent: OfflineContentStore;
  network: {
    isConnected: boolean;
    actionQueue: any;
  };
}

export const rootReducer = combineReducers<RootState, Action<any>>({
  settings: appSettingsReducer,
  offlineContent: offlineContentReducer,
  network,
});
