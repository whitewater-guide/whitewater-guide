import { combineReducers } from 'redux';
import app from './appReducer';
import settings from './settingsReducer';
import nav from './navReducer';
import { regionsReducer } from '../../commons/features/regions';
import { apolloClient } from '../config/configureApollo';

const persistent = combineReducers({
  nav,
  settings,
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
