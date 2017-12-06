import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { regionsReducer } from '../ww-clients/features/regions';
import { RootState } from './types';

const persistent = combineReducers({
  regions: regionsReducer,
});

// const transient = combineReducers({
// });

export default combineReducers<RootState>({
  persistent,
  // transient,
  form,
});
