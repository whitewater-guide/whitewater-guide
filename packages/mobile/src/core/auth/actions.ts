import { actionCreatorFactory } from 'typescript-fsa';
import { AuthError } from './types';

const authFactory = actionCreatorFactory('AUTH');
const loginWithFB = authFactory.async<{}, {}, AuthError>('FB/LOGIN');
const logoutWithFB = authFactory('FB/LOGOUT');
const logout = authFactory('LOGOUT');
const initialized = authFactory('INITIALIZED');

export const authActions = {
  loginWithFB,
  logoutWithFB,
  logout,
  initialized,
};
