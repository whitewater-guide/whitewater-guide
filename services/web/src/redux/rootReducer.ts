import {
  apolloErrorReducer,
  ApolloErrorState,
} from '@whitewater-guide/clients';
import localForage from 'localforage';
import { combineReducers } from 'redux';
import { FormStateMap, reducer as form } from 'redux-form';
import { PersistConfig, persistReducer } from 'redux-persist';
// tslint:disable-next-line:no-submodule-imports
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

export interface RootState {
  apolloError: ApolloErrorState;
  form: FormStateMap;
}

const rootReducer = combineReducers<RootState>({
  apolloError: apolloErrorReducer,
  form,
});

const persistConfig: PersistConfig = {
  key: 'root',
  storage: localForage,
  blacklist: ['form', 'apolloError'],
  stateReconciler: autoMergeLevel2,
};

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export default persistedRootReducer;
