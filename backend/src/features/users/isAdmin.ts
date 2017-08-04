import { Role, User, UserRaw } from './types';

export const isAdmin = (user?: User | UserRaw) => {
  return user && (user.role === Role.ADMIN || user.role === Role.SUPERADMIN);
};

export const isSuperAdmin = (user?: User | UserRaw) => {
  return user && user.role === Role.SUPERADMIN;
};
