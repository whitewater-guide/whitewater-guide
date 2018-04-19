import { actionCreatorFactory } from 'typescript-fsa';
import { AuthError } from './types';

const authFactory = actionCreatorFactory('AUTH');
export const loginWithFB = authFactory.async<{}, {}, AuthError>('FB/LOGIN');
export const logoutWithFB = authFactory('FB/LOGOUT');
export const logout = authFactory('LOGOUT');
export const initialized = authFactory('INITIALIZED');

export const auth = {
  loginWithFB,
  logoutWithFB,
  logout,
  initialized,
};
