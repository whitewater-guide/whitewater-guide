import { countRows, UUID_REGEX } from '@test';
import { AuthBody, SignInBody } from '@whitewater-guide/commons';
import Koa from 'koa';
import get from 'lodash/get';
import { Profile } from 'passport-facebook';
import FacebookTokenStrategy from 'passport-facebook-token';
import superagent from 'superagent';
import { SuperTest, Test } from 'supertest';
import agent from 'supertest-koa-agent';

import db, { holdTransaction, rollbackTransaction } from '~/db';
import {
  ADMIN_FB_PROFILE,
  ADMIN_ID,
  NEW_FB_PROFILE,
  NEW_FB_PROFILE_NO_EMAIL,
  NEW_FB_PROFILE_W_LOCALE,
} from '~/seeds/test/01_users';

import { createApp } from '../../../app';
import { sendWelcome } from '../../mail';

jest.mock('../../mail');

const ROUTE = '/auth/facebook/signin';

let app: Koa;

let usersBefore: number;
let accountsBefore: number;
let tokensBefore: number;

beforeAll(async () => {
  [usersBefore, accountsBefore, tokensBefore] = await countRows(
    true,
    'users',
    'accounts',
    'fcm_tokens',
  );
});

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
  app = createApp();
});

afterEach(async () => {
  await rollbackTransaction();
});

it('should fail when access token is not provided', async () => {
  const resp = await agent(app).get(ROUTE);
  expect(resp).toMatchObject({
    status: 401,
  });
});

it('should fail for bad token', async () => {
  FacebookTokenStrategy.prototype.userProfile = jest
    .fn()
    .mockImplementationOnce((accessToken: string, done: any) => {
      done(new Error('Failed to fetch user profile'));
    });
  const resp = await agent(app).get(
    `${ROUTE}?access_token=__bad_access_token__`,
  );
  expect(resp).toMatchObject({
    status: 401,
  });
});

describe.each([
  ['with email', NEW_FB_PROFILE],
  ['without email', NEW_FB_PROFILE_NO_EMAIL],
])('new user %s', (_, mockProfile: Partial<Profile>) => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, mockProfile);
      });
    response = null;
    testAgent = agent(app);
    response = await testAgent.get(
      `${ROUTE}?access_token=__new_access_token__`,
    );
  });

  it('should respond with access and refresh tokens', async () => {
    const body: AuthBody<SignInBody> = {
      success: true,
      id: expect.stringMatching(UUID_REGEX),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      isNew: true,
    };
    expect(response).toMatchObject({
      status: 200,
      body,
    });
  });

  it('should create new user and login', async () => {
    const [usersAfter, accountsAfter] = await countRows(
      false,
      'users',
      'accounts',
    );
    expect(usersAfter - usersBefore).toBe(1);
    expect(accountsAfter - accountsBefore).toBe(1);
  });

  it('should create verified user', async () => {
    const id = response!.body.id;
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id })
      .first();
    expect(user).toMatchObject({
      email: get(mockProfile, 'emails.0.value', null),
      verified: true,
      language: 'en',
    });
  });

  it('should populate koa context with user', async () => {
    const aT = response!.body.accessToken;
    const spyMiddleware = jest.fn();
    app.use(spyMiddleware);
    await agent(app).get('/').set('Authorization', `bearer ${aT}`);
    expect(spyMiddleware.mock.calls[0][0].state.user).toEqual({
      id: expect.stringMatching(UUID_REGEX),
      language: 'en',
      verified: true,
      admin: false,
    });
  });

  it('should send welcome email', async () => {
    const email = get(mockProfile, 'emails.0.value', null);
    expect(sendWelcome).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.stringMatching(UUID_REGEX),
        name: `${mockProfile.name!.givenName} ${mockProfile.name!.familyName}`,
        email,
      }),
    );
  });
});

describe('language', () => {
  it('should use explicitly set language', async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, NEW_FB_PROFILE_W_LOCALE);
      });
    const resp = await agent(app)
      .get(`${ROUTE}?access_token=__new_access_token__&language=it`)
      .set('Accept-Language', 'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5');
    const id = resp.body.id;
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id })
      .first();
    expect(user).toMatchObject({
      email: get(NEW_FB_PROFILE_W_LOCALE, 'emails.0.value', null),
      language: 'it',
    });
  });

  it('should use fb locale when present', async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, NEW_FB_PROFILE_W_LOCALE);
      });
    const resp = await agent(app)
      .get(`${ROUTE}?access_token=__new_access_token__`)
      .set('Accept-Language', 'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5');
    const id = resp.body.id;
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id })
      .first();
    expect(user).toMatchObject({
      email: get(NEW_FB_PROFILE_W_LOCALE, 'emails.0.value', null),
      language: 'ru',
    });
  });

  it('should use Accept-Language', async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, NEW_FB_PROFILE);
      });
    const resp = await agent(app)
      .get(`${ROUTE}?access_token=__new_access_token__`)
      .set('Accept-Language', 'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5');
    const id = resp.body.id;
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id })
      .first();
    expect(user).toMatchObject({
      email: get(NEW_FB_PROFILE, 'emails.0.value', null),
      language: 'fr',
    });
  });
});

describe('existing user', () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, ADMIN_FB_PROFILE);
      });
    response = null;
    testAgent = agent(app);
    response = await testAgent.get(
      `${ROUTE}?access_token=__existing_access_token__`,
    );
  });

  it('should respond with access and refresh tokens', async () => {
    const body: AuthBody<SignInBody> = {
      success: true,
      id: ADMIN_ID,
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      isNew: false,
    };
    expect(response).toMatchObject({
      status: 200,
      body,
    });
  });

  it('should not create new user and login', async () => {
    const [usersAfter, accountsAfter] = await countRows(
      false,
      'users',
      'accounts',
    );
    expect(usersAfter - usersBefore).toBe(0);
    expect(accountsAfter - accountsBefore).toBe(0);
  });

  it('should populate koa context with user', async () => {
    const aT = response!.body.accessToken;
    const spyMiddleware = jest.fn();
    app.use(spyMiddleware);
    await agent(app).get('/').set('Authorization', `bearer ${aT}`);
    expect(spyMiddleware.mock.calls[0][0].state.user).toEqual({
      id: ADMIN_ID,
      language: 'en',
      verified: true,
      admin: true,
    });
  });

  it('should not send welcome email', async () => {
    expect(sendWelcome).not.toHaveBeenCalled();
  });
});

describe('fcm tokens', () => {
  it('should create fcm token for new user', async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, NEW_FB_PROFILE);
      });
    const testAgent = agent(app);
    const response = await testAgent.get(
      `${ROUTE}?access_token=__new_access_token__&fcm_token=__foo__`,
    );
    expect(response.status).toBe(200);
    const [tokens] = await countRows(false, 'fcm_tokens');
    expect(tokens - tokensBefore).toBe(1);
  });

  it('should create fcm token for existing user', async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, ADMIN_FB_PROFILE);
      });
    const testAgent = agent(app);
    const response = await testAgent.get(
      `${ROUTE}?access_token=__existing_access_token__&fcm_token=__foo__`,
    );
    expect(response.status).toBe(200);
    const [tokens] = await countRows(false, 'fcm_tokens');
    expect(tokens - tokensBefore).toBe(1);
  });

  it('should not fail for existing fcm token', async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, ADMIN_FB_PROFILE);
      });
    const testAgent = agent(app);
    const response = await testAgent.get(
      `${ROUTE}?access_token=__existing_access_token__&fcm_token=__admin_fcm_token__`,
    );
    expect(response.status).toBe(200);
    const [tokens] = await countRows(false, 'fcm_tokens');
    expect(tokens - tokensBefore).toBe(0);
  });
});
