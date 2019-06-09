import { combineReducers } from 'redux';
import { FormStateMap, reducer as form } from 'redux-form';

export interface RootState {
  form: FormStateMap;
}

const rootReducer = combineReducers<RootState>({
  form,
});

export default rootReducer;
