import { AsyncStorage } from 'react-native';
import { combineReducers, Reducer } from 'redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { appReducer, AppState } from './appReducer';
import { settingsReducer, SettingsState } from './settingsReducer';

export interface RootState {
  app: AppState;
  settings: SettingsState;
}

const rootReducer = combineReducers<RootState>({
  app: appReducer,
  settings: settingsReducer,
});

const persistConfig: PersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['app'],
  stateReconciler: autoMergeLevel2,
};

export const persistedRootReducer: Reducer<RootState> = persistReducer(persistConfig, rootReducer as any);
