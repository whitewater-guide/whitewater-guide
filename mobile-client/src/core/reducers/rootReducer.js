import { combineReducers } from 'redux';
import app from './appReducer';
import settings from './settingsReducer';
import nav from './navReducer';
import { guideReducer } from '../../guide';
import { regionsReducer } from '../../commons/features/regions';
import { apolloClient } from '../config/configureApollo';

const persistent = combineReducers({
  nav,
  settings,
  regions: regionsReducer,
  apollo: apolloClient.reducer(),
  guidedTour: guideReducer({ numberOfSteps: 2 }),
});

const transient = combineReducers({
  app,
});

export default combineReducers({
  persistent,
  transient,
});
