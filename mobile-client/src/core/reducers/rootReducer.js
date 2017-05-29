import { combineReducers } from 'redux';
import app from './appReducer';
import nav from './navReducer';
import { regionsReducer } from '../../commons/features/regions';
import { apolloClient } from '../config/configureApollo';

const persistent = combineReducers({
  nav,
  regions: regionsReducer,
  apollo: apolloClient.reducer(),
});

const transient = combineReducers({
  app,
});

export default combineReducers({
  persistent,
  transient,
});
