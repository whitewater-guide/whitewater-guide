import { UserRaw } from '@features/users';
import Knex from 'knex';

export const ADMIN_ID = 'bed59990-749d-11e7-8cf7-a6006ad3dba0';
export const EDITOR_GA_EC_ID = '477a0bec-8a78-11e7-b3e6-9beeff45d731';
export const EDITOR_NO_EC_ID = '442cb792-749c-11e7-8cf7-a6006ad3dba0';
export const EDITOR_NO_ID = '0da87d58-378f-11e8-b467-0ed5f89f718b';
export const EDITOR_GE_ID = '42cf6da0-5dc0-11e8-9c2d-fa7ae01bbebc';
export const TEST_USER_ID = 'fa3ce7ba-36ab-11e8-b467-0ed5f89f718b';
export const TEST_USER2_ID = '65fa3f3a-62a7-11e8-adc0-fa7ae01bbebc';
export const BOOM_USER_3500_ID = 'cd3c7db8-5cc4-11e8-9c2d-fa7ae01bbebc';
export const BOOM_USER_1500_ID = 'e8224a5e-5d00-11e8-9c2d-fa7ae01bbebc';

export const ADMIN: UserRaw = {
  id: ADMIN_ID,
  name: 'Ivan Ivanov',
  // tslint:disable-next-line:max-line-length
  avatar:
    'https://scontent.xx.fbcdn.net/v/t1.0-1/c34.34.422.422/s50x50/557311_106591882827406_2013499307_n.jpg?oh=777cb7f306789d5452fb47bc87ba95c7&oe=59FD2267',
  email: 'kaospostage@gmail.com',
  admin: true,
  language: 'en',
  editor_settings: null,
  imperial: false,
  created_at: new Date(Date.UTC(2017, 1, 1)),
  updated_at: new Date(Date.UTC(2017, 1, 1)),
};

export const EDITOR_GA_EC: UserRaw = {
  id: EDITOR_GA_EC_ID,
  name: 'Konstantin Kuznetsov',
  // tslint:disable-next-line:max-line-length
  avatar:
    'https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/1780622_1380926282175020_67535950_n.jpg?oh=80afda8f3e3d817e233fed522e2d9f1a&oe=5A1B4612',
  email: 'fish.munga@yandex.ru',
  admin: false,
  language: 'en',
  editor_settings: { language: 'en' },
  imperial: false,
  created_at: new Date(Date.UTC(2017, 2, 2)),
  updated_at: new Date(Date.UTC(2017, 2, 2)),
};

export const EDITOR_NO_EC: UserRaw = {
  id: EDITOR_NO_EC_ID,
  name: 'User user',
  avatar: null,
  email: 'user@gmail.com',
  admin: false,
  language: 'en',
  editor_settings: { language: 'en' },
  imperial: false,
  created_at: new Date(Date.UTC(2017, 3, 3)),
  updated_at: new Date(Date.UTC(2017, 3, 3)),
};

export const EDITOR_NO: UserRaw = {
  id: EDITOR_NO_ID,
  name: 'Norwegian Dude',
  avatar: null,
  email: 'dude@nve.no',
  admin: false,
  language: 'de',
  editor_settings: { language: 'de' },
  imperial: false,
  created_at: new Date(Date.UTC(2017, 6, 6)),
  updated_at: new Date(Date.UTC(2017, 6, 6)),
};

export const TEST_USER: UserRaw = {
  id: TEST_USER_ID,
  name: 'Another usr',
  avatar: null,
  email: 'konstantin@gmail.com',
  admin: false,
  language: 'ru',
  editor_settings: null,
  imperial: false,
  created_at: new Date(Date.UTC(2017, 4, 4)),
  updated_at: new Date(Date.UTC(2017, 4, 4)),
};

export const TEST_USER2: UserRaw = {
  id: TEST_USER2_ID,
  name: 'Test user 2',
  avatar: null,
  email: 'test2@gmail.com',
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  created_at: new Date(Date.UTC(2017, 4, 4)),
  updated_at: new Date(Date.UTC(2017, 4, 4)),
};

export const BOOM_USER_3500: UserRaw = {
  id: BOOM_USER_3500_ID,
  name: 'Boom Backer 3500',
  avatar: null,
  email: 'boom_backer_3500@gmail.com',
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  created_at: new Date(Date.UTC(2017, 4, 5)),
  updated_at: new Date(Date.UTC(2017, 4, 5)),
};

export const BOOM_USER_1500: UserRaw = {
  id: BOOM_USER_1500_ID,
  name: 'Boom Backer 1500',
  avatar: null,
  email: 'boom_backer_1500@gmail.com',
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  created_at: new Date(Date.UTC(2017, 4, 5)),
  updated_at: new Date(Date.UTC(2017, 4, 5)),
};

export const EDITOR_GE: UserRaw = {
  id: EDITOR_GE_ID,
  name: 'Kaki',
  avatar: null,
  email: 'kaki@gmail.com',
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  created_at: new Date(Date.UTC(2017, 4, 6)),
  updated_at: new Date(Date.UTC(2017, 4, 6)),
};

const users = [
  ADMIN,
  EDITOR_GA_EC,
  EDITOR_NO_EC,
  EDITOR_NO,
  EDITOR_GE,
  TEST_USER,
  TEST_USER2,
  BOOM_USER_3500,
  BOOM_USER_1500,
];

export async function seed(db: Knex) {
  await db.table('users').del();
  await db.raw('ALTER TABLE users DISABLE TRIGGER ALL');
  await db.table('users').insert(users);
  await db.raw('ALTER TABLE users ENABLE TRIGGER ALL');
}