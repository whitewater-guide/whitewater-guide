import { Action, AnyAction } from 'typescript-fsa';
import { appStarted } from '../actions';

export interface AppState {
  initialized: boolean;
}

const initialState: AppState = {
  initialized: false,
};

export function appReducer(state: AppState = initialState, action: AnyAction) {
  const { type } = action as Action<any>;
  switch (type) {
    case appStarted.type:
      return { ...state, initialized: true };
    default:
      return state;
  }
}
