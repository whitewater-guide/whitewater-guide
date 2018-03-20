import { Context, newContext } from '../apollo';
import { Role } from '../features/users/types';

export const anonContext: Context = newContext();
export const userContext: Context = newContext({
  id: '442cb792-749c-11e7-8cf7-a6006ad3dba0',
  role: Role.USER,
  name: 'user',
  avatar: null,
  email: null,
  created_at: new Date(Date.UTC(2017, 0, 1)),
  updated_at: new Date(Date.UTC(2017, 0, 2)),
});

export const adminContext: Context = newContext({
  id: '477a0bec-8a78-11e7-b3e6-9beeff45d731',
  role: Role.ADMIN,
  name: 'admin',
  avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/1780622_1380926282175020_67535950_n.jpg?oh=80afda8f3e3d817e233fed522e2d9f1a&oe=5A1B4612',
  email: 'fish.munga@yandex.ru',
  created_at: new Date(Date.UTC(2017, 0, 1)),
  updated_at: new Date(Date.UTC(2017, 0, 2)),
});

export const superAdminContext: Context = newContext({
  id: 'bed59990-749d-11e7-8cf7-a6006ad3dba0',
  role: Role.SUPERADMIN,
  name: 'superadmin',
  avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c34.34.422.422/s50x50/557311_106591882827406_2013499307_n.jpg?oh=777cb7f306789d5452fb47bc87ba95c7&oe=59FD2267',
  email: 'kaospostage@gmail.com',
  created_at: new Date(Date.UTC(2017, 0, 1)),
  updated_at: new Date(Date.UTC(2017, 0, 2)),
});
