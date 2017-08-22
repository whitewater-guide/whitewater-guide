import { combineReducers } from 'redux';
import { apolloClient } from '../config/configureApollo';
import { regionsReducer } from '../ww-clients/features/regions';

const persistent = combineReducers({
  regions: regionsReducer,
});

const transient = combineReducers({
  apollo: apolloClient.reducer(),
});

export default combineReducers({
  persistent,
  transient,
});
