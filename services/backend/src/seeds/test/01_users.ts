import { LoginRaw, UserRawInput } from '~/features/users';
import { hashSync } from 'bcrypt';
import Knex from 'knex';
import set from 'lodash/fp/set';
import { Profile } from 'passport-facebook';
import { SALT_ROUNDS } from '../../auth/constants';

export const ADMIN_ID = 'bed59990-749d-11e7-8cf7-a6006ad3dba0';
export const EDITOR_GA_EC_ID = '477a0bec-8a78-11e7-b3e6-9beeff45d731';
export const EDITOR_NO_EC_ID = '442cb792-749c-11e7-8cf7-a6006ad3dba0';
export const EDITOR_NO_ID = '0da87d58-378f-11e8-b467-0ed5f89f718b';
export const EDITOR_GE_ID = '42cf6da0-5dc0-11e8-9c2d-fa7ae01bbebc';
export const TEST_USER_ID = 'fa3ce7ba-36ab-11e8-b467-0ed5f89f718b';
export const TEST_USER2_ID = '65fa3f3a-62a7-11e8-adc0-fa7ae01bbebc';
export const BOOM_USER_3500_ID = 'cd3c7db8-5cc4-11e8-9c2d-fa7ae01bbebc';
export const BOOM_USER_1500_ID = 'e8224a5e-5d00-11e8-9c2d-fa7ae01bbebc';
export const UNVERIFIED_USER_ID = '2f54863c-4368-11e9-b210-d663bd873d93';
export const UNVERIFIED_USER2_ID = '0680ea2e-4369-11e9-b210-d663bd873d93';
export const UNVERIFIED_USER3_ID = '80ffcb14-44f7-11e9-b210-d663bd873d93';
export const EXP_VER_USER_ID = 'a0553aa2-4368-11e9-b210-d663bd873d93';

export const NEW_FB_PROFILE: Partial<Profile> = {
  id: '__mock_new_profile_id__',
  name: {
    familyName: 'New Profile Family Name',
    givenName: 'New Profile Given Name',
  },
  emails: [
    {
      value: 'new.profile@mail.com',
    },
  ],
  photos: [
    {
      value:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/mock_new_profile',
    },
  ],
  provider: 'facebook',
  _raw:
    '{"last_name": "New Profile Family Name", "first_name": "New Profile Given Name", "email": "new.profile\u0040mail.com", "picture": {"data": {"height": 50, "is_silhouette": false, "url": "https:\\/\\/platform-lookaside.fbsbx.com\\/platform\\/profilepic\\/mock_new_profile", "width": 50}}, "id": "__mock_new_profile_id__"}',
  _json: {
    last_name: 'New Profile Family Name',
    first_name: 'New Profile Given Name',
    email: 'new.profile@mail.com',
    picture: {
      data: {
        height: 50,
        is_silhouette: false,
        url:
          'https://platform-lookaside.fbsbx.com/platform/profilepic/mock_new_profile',
        width: 50,
      },
    },
    id: '__mock_new_profile_id__',
  },
};
export const NEW_FB_PROFILE_W_LOCALE: Partial<Profile> = set(
  '_json.locale',
  'ru_RU',
  NEW_FB_PROFILE,
);
export const NEW_FB_PROFILE_NO_EMAIL: Partial<Profile> = {
  id: '__mock_new_profile_id__',
  name: {
    familyName: 'New Profile Family Name',
    givenName: 'New Profile Given Name',
  },
  emails: [],
  photos: [
    {
      value:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/mock_new_profile',
    },
  ],
  provider: 'facebook',
  _raw:
    '{"last_name": "New Profile Family Name", "first_name": "New Profile Given Name", "picture": {"data": {"height": 50, "is_silhouette": false, "url": "https:\\/\\/platform-lookaside.fbsbx.com\\/platform\\/profilepic\\/mock_new_profile", "width": 50}}, "id": "__mock_new_profile_id__"}',
  _json: {
    last_name: 'New Profile Family Name',
    first_name: 'New Profile Given Name',
    picture: {
      data: {
        height: 50,
        is_silhouette: false,
        url:
          'https://platform-lookaside.fbsbx.com/platform/profilepic/mock_new_profile',
        width: 50,
      },
    },
    id: '__mock_new_profile_id__',
  },
};

export const ADMIN_FB_PROFILE: Partial<Profile> = {
  id: '__fb_admin_id__',
  name: {
    familyName: 'Ivanov',
    givenName: 'Ivan',
  },
  emails: [
    {
      value: 'kaospostage@gmail.com',
    },
  ],
  photos: [
    {
      value:
        'https://scontent.xx.fbcdn.net/v/t1.0-1/c34.34.422.422/s50x50/557311_106591882827406_2013499307_n.jpg?oh=777cb7f306789d5452fb47bc87ba95c7&oe=59FD2267',
    },
  ],
  provider: 'facebook',
  _raw:
    '{"last_name": "Ivanov", "first_name": "Ivan", "email": "kaospostage\u0040gmail.com", "picture": {"data": {"height": 50, "is_silhouette": false, "url": "https:\\/\\/scontent.xx.fbcdn.net\\/v\\/t1.0-1\\/c34.34.422.422\\/s50x50\\/557311_106591882827406_2013499307_n.jpg?oh=777cb7f306789d5452fb47bc87ba95c7&oe=59FD2267", "width": 50}}, "id": "__fb_admin_id__"}',
  _json: {
    last_name: 'Ivanov',
    first_name: 'Ivan',
    email: 'kaospostage@gmail.com',
    picture: {
      data: {
        height: 50,
        is_silhouette: false,
        url:
          'https://scontent.xx.fbcdn.net/v/t1.0-1/c34.34.422.422/s50x50/557311_106591882827406_2013499307_n.jpg?oh=777cb7f306789d5452fb47bc87ba95c7&oe=59FD2267',
        width: 50,
      },
    },
    id: '__fb_admin_id__',
  },
};

export const ADMIN: UserRawInput = {
  id: ADMIN_ID,
  name: 'Ivan Ivanov',
  // tslint:disable-next-line:max-line-length
  avatar: null,
  email: 'kaospostage@gmail.com',
  admin: true,
  language: 'en',
  editor_settings: null,
  imperial: false,
  password: null,
  verified: true,
  tokens: JSON.stringify([]),
  created_at: new Date(Date.UTC(2017, 1, 1)),
  updated_at: new Date(Date.UTC(2017, 1, 1)),
};

export const ADMIN_FB_ACCOUNT: LoginRaw = {
  user_id: ADMIN_ID,
  id: '__fb_admin_id__',
  provider: 'facebook',
  username: 'Ivan Ivanov',
  tokens: { accessToken: '__admin_fb_access_token__' },
  profile: ADMIN_FB_PROFILE,
  created_at: new Date(Date.UTC(2017, 1, 1)),
  updated_at: new Date(Date.UTC(2017, 1, 1)),
};

export const EDITOR_GA_EC: UserRawInput = {
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
  password: hashSync('G@l1c1a_pwd', SALT_ROUNDS),
  verified: true,
  tokens: JSON.stringify([]),
  created_at: new Date(Date.UTC(2017, 2, 2)),
  updated_at: new Date(Date.UTC(2017, 2, 2)),
};

export const EDITOR_NO_EC: UserRawInput = {
  id: EDITOR_NO_EC_ID,
  name: 'User user',
  avatar: null,
  email: 'user@gmail.com',
  admin: false,
  language: 'en',
  editor_settings: { language: 'en' },
  imperial: false,
  password: null,
  verified: true,
  tokens: JSON.stringify([]),
  created_at: new Date(Date.UTC(2017, 3, 3)),
  updated_at: new Date(Date.UTC(2017, 3, 3)),
};

export const EDITOR_NO: UserRawInput = {
  id: EDITOR_NO_ID,
  name: 'Norwegian Dude',
  avatar: null,
  email: 'dude@nve.no',
  admin: false,
  language: 'de',
  editor_settings: { language: 'de' },
  imperial: false,
  password: hashSync('N0_wAy_pwd', SALT_ROUNDS),
  verified: true,
  tokens: JSON.stringify([
    {
      claim: 'passwordReset',
      value: hashSync('_reset_token_', SALT_ROUNDS),
      expires: 2145906000000,
    },
  ]),
  created_at: new Date(Date.UTC(2017, 6, 6)),
  updated_at: new Date(Date.UTC(2017, 6, 6)),
};

export const TEST_USER: UserRawInput = {
  id: TEST_USER_ID,
  name: 'Another usr',
  avatar: null,
  email: 'konstantin@gmail.com',
  admin: false,
  language: 'ru',
  editor_settings: null,
  imperial: false,
  password: hashSync('ttttE_s_t1a', SALT_ROUNDS),
  verified: true,
  tokens: JSON.stringify([
    {
      claim: 'passwordReset',
      value: hashSync('_reset_token_', SALT_ROUNDS),
      expires: 1000,
    },
  ]),
  created_at: new Date(Date.UTC(2017, 4, 4)),
  updated_at: new Date(Date.UTC(2017, 4, 4)),
};

export const TEST_USER2: UserRawInput = {
  id: TEST_USER2_ID,
  name: 'Test user 2',
  avatar: null,
  email: 'test2@gmail.com',
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  password: null,
  verified: true,
  tokens: JSON.stringify([]),
  created_at: new Date(Date.UTC(2017, 4, 4)),
  updated_at: new Date(Date.UTC(2017, 4, 4)),
};

export const UNVERIFIED_USER: UserRawInput = {
  id: UNVERIFIED_USER_ID,
  name: 'Unverified user',
  avatar: null,
  email: 'unverified@whitewater.guide',
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  password: null,
  verified: false,
  tokens: JSON.stringify([
    {
      claim: 'verification',
      value: hashSync('_verification_token_', SALT_ROUNDS),
      expires: 2145906000000,
    },
  ]),
  created_at: new Date(Date.UTC(2017, 5, 5)),
  updated_at: new Date(Date.UTC(2017, 5, 5)),
};

export const UNVERIFIED_USER2: UserRawInput = {
  id: UNVERIFIED_USER2_ID,
  name: 'Unverified No Token',
  avatar: null,
  email: null,
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  password: null,
  verified: false,
  tokens: JSON.stringify([]),
  created_at: new Date(Date.UTC(2017, 8, 5)),
  updated_at: new Date(Date.UTC(2017, 8, 5)),
};

export const UNVERIFIED_USER3: UserRawInput = {
  id: UNVERIFIED_USER3_ID,
  name: 'Unverified Three',
  avatar: null,
  email: 'unverified3@whitewater.guide',
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  password: null,
  verified: false,
  tokens: JSON.stringify([]),
  created_at: new Date(Date.UTC(2017, 5, 25)),
  updated_at: new Date(Date.UTC(2017, 5, 25)),
};

export const EXP_VER_USER: UserRawInput = {
  id: EXP_VER_USER_ID,
  name: 'Expired Verification',
  avatar: null,
  email: 'expired.verification@whitewater.guide',
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  password: null,
  verified: false,
  tokens: JSON.stringify([
    {
      claim: 'verification',
      value: hashSync('_verification_token_', SALT_ROUNDS),
      expires: 1000,
    },
  ]),
  created_at: new Date(Date.UTC(2017, 6, 6)),
  updated_at: new Date(Date.UTC(2017, 6, 6)),
};

export const BOOM_USER_3500: UserRawInput = {
  id: BOOM_USER_3500_ID,
  name: 'Boom Backer 3500',
  avatar: null,
  email: 'boom_backer_3500@gmail.com',
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  password: null,
  verified: true,
  tokens: JSON.stringify([
    {
      claim: 'passwordReset',
      value: hashSync('_passwordReset_token_', SALT_ROUNDS),
      expires: 2145906000000,
    },
  ]),
  created_at: new Date(Date.UTC(2017, 4, 5)),
  updated_at: new Date(Date.UTC(2017, 4, 5)),
};

export const BOOM_USER_1500: UserRawInput = {
  id: BOOM_USER_1500_ID,
  name: 'Boom Backer 1500',
  avatar: null,
  email: 'boom_backer_1500@gmail.com',
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  password: null,
  verified: true,
  tokens: JSON.stringify([]),
  created_at: new Date(Date.UTC(2017, 4, 5)),
  updated_at: new Date(Date.UTC(2017, 4, 5)),
};

export const EDITOR_GE: UserRawInput = {
  id: EDITOR_GE_ID,
  name: 'Kaki',
  avatar: null,
  email: 'kaki@gmail.com',
  admin: false,
  language: 'en',
  editor_settings: null,
  imperial: false,
  password: null,
  verified: true,
  tokens: JSON.stringify([]),
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
  UNVERIFIED_USER,
  UNVERIFIED_USER2,
  UNVERIFIED_USER3,
  EXP_VER_USER,
];

const fcmTokens = [
  { user_id: TEST_USER_ID, token: '__user_fcm_token__' },
  { user_id: ADMIN_ID, token: '__admin_fcm_token__' },
];

export async function seed(db: Knex) {
  await db.table('users').del();
  await db.table('accounts').del();
  await db.raw('ALTER TABLE users DISABLE TRIGGER ALL');
  await db.table('users').insert(users);
  await db.table('accounts').insert(ADMIN_FB_ACCOUNT);
  await db.table('fcm_tokens').insert(fcmTokens);
  await db.raw('ALTER TABLE users ENABLE TRIGGER ALL');
}
