import { Action } from 'typescript-fsa';
import { authActions } from './actions';

export interface AuthState {
  isLoggingIn: boolean;
}

const initialState: AuthState = {
  isLoggingIn: false,
};

export const authReducer = (
  state: AuthState = initialState,
  action: Action<any>,
) => {
  switch (action.type) {
    case authActions.loginWithFB.started.type:
      return { ...state, isLoggingIn: true };
    case authActions.loginWithFB.done.type:
    case authActions.loginWithFB.failed.type:
      return { ...state, isLoggingIn: false };
    default:
      return state;
  }
};
