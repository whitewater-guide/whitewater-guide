import { combineReducers } from 'redux';
import app from './appReducer';
import nav from './navReducer';
import filter from './filterReducer';
import { apolloClient } from '../config/configureApollo';

const persistent = combineReducers({
  nav,
  apollo: apolloClient.reducer(),
});

const transient = combineReducers({
  app,
  filter,
});

export default combineReducers({
  persistent,
  transient,
});
