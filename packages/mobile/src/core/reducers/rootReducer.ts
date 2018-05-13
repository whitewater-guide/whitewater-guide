import { AsyncStorage } from 'react-native';
import { combineReducers, Reducer } from 'redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { appReducer, AppState } from './appReducer';

export interface RootState {
  app: AppState;
}

const rootReducer = combineReducers<RootState>({
  app: appReducer,
});

const persistConfig: PersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['app'],
  stateReconciler: autoMergeLevel2,
};

export const persistedRootReducer: Reducer<RootState> = persistReducer(persistConfig, rootReducer as any);
