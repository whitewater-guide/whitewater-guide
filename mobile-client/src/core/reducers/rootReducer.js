import { combineReducers } from 'redux';
import app from './appReducer';
import nav from './navReducer';

const persistent = combineReducers({
  nav,
});

const transient = combineReducers({
  app,
});

export default combineReducers({
  persistent,
  transient,
});
