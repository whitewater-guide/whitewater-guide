import { combineReducers } from 'redux';
import { regionsReducer } from '../../commons/features/regions';
import { apolloClient } from '../config/configureApollo';

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
