import { actionCreatorFactory } from 'typescript-fsa';
import { AuthError } from './types';

const authFactory = actionCreatorFactory('AUTH');
export const loginWithFB = authFactory.async<{}, {}, AuthError>('LOGIN_WITH_FB');
export const logout = authFactory('LOGOUT');
export const confirmLogout = authFactory('CONFIRM_LOGOUT');
export const initialized = authFactory('INITIALIZED');

export const auth = {
  loginWithFB,
  logout,
  confirmLogout,
  initialized,
};
