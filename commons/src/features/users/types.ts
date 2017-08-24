import { NamedResource, Timestamped } from '../../core';

export enum Role {
  USER = 1,
  ADMIN = 2,
  SUPERADMIN = 3,
}

/**
 * This is graphql type
 */
export interface User extends NamedResource, Timestamped {
  avatar: string | null;
  email: string | null;
  role: Role;
}
