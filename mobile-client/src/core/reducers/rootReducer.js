import { combineReducers } from 'redux';
import app from './appReducer';
import nav from './navReducer';
import { apolloClient } from '../config/configureApollo';

const persistent = combineReducers({
  nav,
  apollo: apolloClient.reducer(),
});

const transient = combineReducers({
  app,
});

export default combineReducers({
  persistent,
  transient,
});
