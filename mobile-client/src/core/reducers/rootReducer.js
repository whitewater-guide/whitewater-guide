import { combineReducers } from 'redux';
import app from './appReducer';
import nav from './navReducer';
import filter from './filterReducer';
import { apolloClient } from '../config/configureApollo';

const persistent = combineReducers({
  filter,
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
