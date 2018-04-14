import { actionCreatorFactory } from 'typescript-fsa';

const authFactory = actionCreatorFactory('AUTH');
export const loginViaVK = authFactory('LOGIN_VIA_VK');
export const logout = authFactory('LOGOUT');
export const confirmLogout = authFactory('CONFIRM_LOGOUT');

export const auth = {
  loginViaVK,
  logout,
  confirmLogout,
};
