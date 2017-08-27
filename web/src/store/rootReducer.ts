import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { apolloClient } from '../apollo/configureApollo';
import { regionsReducer } from '../ww-clients/features/regions';
import { RootState } from './types';

const persistent = combineReducers({
  regions: regionsReducer,
});

const transient = combineReducers({
  apollo: apolloClient.reducer(),
});

export default combineReducers<RootState>({
  persistent,
  transient,
  form,
});
