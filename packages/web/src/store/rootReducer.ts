import * as localForage from 'localforage';
import { combineReducers } from 'redux';
import { FormStateMap, reducer as form } from 'redux-form';
import { PersistConfig, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { apolloErrorReducer, ApolloErrorState } from '../ww-clients/apollo';
import { regionsReducer, RegionsState } from '../ww-clients/features/regions';

export interface RootState {
  regions: RegionsState;
  apolloError: ApolloErrorState;
  form: FormStateMap;
}

const rootReducer = combineReducers<RootState>({
  regions: regionsReducer,
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
