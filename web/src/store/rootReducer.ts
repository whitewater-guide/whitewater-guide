import * as localForage from 'localforage';
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { PersistConfig, persistReducer } from 'redux-persist';
import * as autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { regionsReducer } from '../ww-clients/features/regions';
import { RootState } from './types';

const rootReducer = combineReducers<RootState>({
  regions: regionsReducer,
  form,
});

const persistConfig: PersistConfig = {
  key: 'root',
  storage: localForage,
  blacklist: ['form'],
  stateReconciler: (autoMergeLevel2 as any).default, // TODO: https://github.com/rt2zz/redux-persist/issues/714
};

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export default persistedRootReducer;
