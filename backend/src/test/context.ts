import { Context } from '../apollo';
import { Role } from '../features/users/types';

export const anonContext: Context = {};
export const userContext: Context = {
  user: {
    name: 'user',
    id: '442cb792-749c-11e7-8cf7-a6006ad3dba0',
    role: Role.USER,
    avatar: null,
    email: null,
    created_at: new Date(Date.UTC(2017, 0, 1)),
    updated_at: new Date(Date.UTC(2017, 0, 2)),
  },
};
export const adminContext: Context = {
  user: {
    name: 'admin',
    id: '8525b2b0-749e-11e7-b5a5-be2e44b06b34',
    role: Role.ADMIN,
    avatar: null,
    email: null,
    created_at: new Date(Date.UTC(2017, 0, 1)),
    updated_at: new Date(Date.UTC(2017, 0, 2)),
  },
};
export const superAdminContext: Context = {
  user: {
    name: 'superadmin',
    id: 'bed59990-749d-11e7-8cf7-a6006ad3dba0',
    role: Role.SUPERADMIN,
    avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c34.34.422.422/s50x50/557311_106591882827406_2013499307_n.jpg?oh=777cb7f306789d5452fb47bc87ba95c7&oe=59FD2267',
    email: 'kaospostage@gmail.com',
    created_at: new Date(Date.UTC(2017, 0, 1)),
    updated_at: new Date(Date.UTC(2017, 0, 2)),
  },
};
