import { combineReducers } from 'redux';
import app from './appReducer';
import settings from './settingsReducer';
import nav from './navReducer';
import guide from './guideReducer';
import { regionsReducer } from '../../commons/features/regions';
import { apolloClient } from '../config/configureApollo';

const persistent = combineReducers({
  nav,
  settings,
  regions: regionsReducer,
  apollo: apolloClient.reducer(),
  guide,
});

const transient = combineReducers({
  app,
});

export default combineReducers({
  persistent,
  transient,
});
