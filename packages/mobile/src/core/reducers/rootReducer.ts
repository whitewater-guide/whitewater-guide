import { AsyncStorage } from 'react-native';
import { NavigationState } from 'react-navigation';
import { combineReducers, Reducer } from 'redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { appReducer, AppState } from './appReducer';
import nav from './navReducer';

export interface RootState {
  nav: NavigationState;
  app: AppState;
}

const rootReducer = combineReducers<RootState>({
  nav,
  app: appReducer,
});

const persistConfig: PersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['app'],
  stateReconciler: autoMergeLevel2,
};

export const persistedRootReducer: Reducer<RootState> = persistReducer(persistConfig, rootReducer as any);
