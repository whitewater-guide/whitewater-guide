import { Role } from './types';

interface WithRole {
  role: Role;
}

export const isAdmin = (user?: WithRole | null): boolean => {
  return !!user && (user.role === Role.ADMIN || user.role === Role.SUPERADMIN);
};

export const isSuperAdmin = (user?: WithRole | null): boolean => {
  return !!user && user.role === Role.SUPERADMIN;
};
