import { holdTransaction, rollbackTransaction } from '@db';
import { asyncRedis, client } from '@redis';
import { ADMIN_FB_PROFILE, ADMIN_ID } from '@seeds/01_users';
import { countRows, UUID_REGEX } from '@test';
import { CookieAccessInfo } from 'cookiejar';
import Koa from 'koa';
import get from 'lodash/get';
import passport from 'passport';
import { Profile } from 'passport-facebook';
import superagent from 'superagent';
import { SuperTest, Test } from 'supertest';
import agent from 'supertest-koa-agent';
import { createApp } from '../../../app';
import { extractSessionId } from '../sessions';

const ROUTE = '/auth/facebook';
const CALLBACK_ROUTE = '/auth/facebook/callback?__mock_strategy_callback=true';
const LOGOUT_ROUTE = '/auth/logout';

const newProfile: Partial<Profile> = {
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

let app: Koa;

let usersBefore: number;
let loginsBefore: number;

beforeAll(async () => {
  [usersBefore, loginsBefore] = await countRows(true, 'users', 'logins');
});

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
  await asyncRedis.flushall();
  app = createApp();
});

afterEach(async () => {
  await rollbackTransaction();
  client.removeAllListeners();
});

it('should redirect on call from web-client', async () => {
  const req = agent(app).get(`${ROUTE}?returnTo=/test_return_to`);
  await expect(req).rejects.toMatchObject({
    status: 302,
  });
});

it('should redirect to login when auth failed on fb side', async () => {
  const strategy = get(passport, '_strategies.facebook');
  strategy._error = new Error('facebook error');

  const req = agent(app).get(CALLBACK_ROUTE);
  await expect(req).rejects.toMatchObject({
    status: 302,
    response: {
      headers: {
        location: '/login',
      },
    },
  });
});

describe('new user', async () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    response = null;
    const strategy = get(passport, '_strategies.facebook');
    strategy._profile = newProfile;
    strategy._token_response = {
      access_token: '__mock_access_token__',
    };
    testAgent = agent(app);
    const req = testAgent.get(CALLBACK_ROUTE);
    try {
      response = await req;
    } catch (err) {
      response = err.response;
    }
  });

  it('should redirect', async () => {
    await expect(response).toMatchObject({
      status: 302,
      headers: {
        location: '/',
      },
    });
  });

  it('should create new user and login', async () => {
    const [usersAfter, loginsAfter] = await countRows(false, 'users', 'logins');
    expect(usersAfter - usersBefore).toBe(1);
    expect(loginsAfter - loginsBefore).toBe(1);
  });

  it('should create session', async () => {
    const sessionId = extractSessionId(response);
    expect(sessionId).toBeDefined();
    const keys = await asyncRedis.keys('*');
    expect(keys).toHaveLength(1);
    const session = await asyncRedis.get(sessionId!);
    expect(JSON.parse(session)).toHaveProperty(
      'passport.user',
      expect.stringMatching(UUID_REGEX),
    );
  });

  it('should set cookie', async () => {
    const cookie = testAgent.jar.getCookie('wwguide', CookieAccessInfo.All);
    expect(cookie.value).toBeTruthy();
  });

  it('should use existing session', async () => {
    // Fire second request
    response = null;
    const strategy = get(passport, '_strategies.facebook');
    strategy._profile = newProfile;
    strategy._token_response = {
      access_token: '__mock_access_token__',
    };
    // use same agent (should have cookies from first request)
    const req = testAgent.get(CALLBACK_ROUTE);
    try {
      response = await req;
    } catch (err) {
      response = err.response;
    }

    const sessionId = extractSessionId(response);
    expect(sessionId).toBeDefined();
    const keys = await asyncRedis.keys('*');
    expect(keys).toHaveLength(1);
    const session = await asyncRedis.get(sessionId!);
    expect(JSON.parse(session)).toHaveProperty(
      'passport.user',
      expect.stringMatching(UUID_REGEX),
    );
  });
});

describe('existing user', async () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    response = null;
    const strategy = get(passport, '_strategies.facebook');
    strategy._profile = ADMIN_FB_PROFILE;
    strategy._token_response = {
      access_token: '__admin_fb_access_token__',
    };
    testAgent = agent(app);
    const req = testAgent.get(CALLBACK_ROUTE);
    try {
      response = await req;
    } catch (err) {
      response = err.response;
    }
  });

  it('should redirect', async () => {
    await expect(response).toMatchObject({
      status: 302,
      headers: {
        location: '/',
      },
    });
  });

  it('should not create new user and login', async () => {
    const [usersAfter, loginsAfter] = await countRows(false, 'users', 'logins');
    expect(usersAfter - usersBefore).toBe(0);
    expect(loginsAfter - loginsBefore).toBe(0);
  });

  it('should create session', async () => {
    const sessionId = extractSessionId(response);
    expect(sessionId).toBeDefined();
    const keys = await asyncRedis.keys('*');
    expect(keys).toHaveLength(1);
    const session = await asyncRedis.get(sessionId!);
    expect(JSON.parse(session)).toHaveProperty('passport.user', ADMIN_ID);
  });

  it('should set cookie', async () => {
    const cookie = testAgent.jar.getCookie('wwguide', CookieAccessInfo.All);
    expect(cookie.value).toBeTruthy();
  });
});

describe('logout', () => {
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    const strategy = get(passport, '_strategies.facebook');
    strategy._profile = ADMIN_FB_PROFILE;
    strategy._token_response = {
      access_token: '__admin_fb_access_token__',
    };
    testAgent = agent(app);
    const req = testAgent.get(CALLBACK_ROUTE);
    try {
      await req;
    } catch {}
  });

  it('should redirect to referrer', async () => {
    try {
      await testAgent.get(LOGOUT_ROUTE).set('Referer', 'https://referer.com');
    } catch (err) {
      const resp = err.response;
      expect(resp.status).toBe(302);
      expect(resp.header.location).toBe('https://referer.com');
    }
  });

  it('should remove session', async () => {
    // existence of session before logout call is tested in different test above
    try {
      await testAgent.get(LOGOUT_ROUTE);
    } catch {
      /* redirect is here */
    }
    const keys = await asyncRedis.keys('*');
    expect(keys).toHaveLength(0);
  });

  it('should remove session from cookie', async () => {
    // existence of session before logout call is tested in different test above
    try {
      await testAgent.get(LOGOUT_ROUTE);
    } catch {}
    const cookie = testAgent.jar.getCookie('wwguide', CookieAccessInfo.All);
    expect(cookie.value).toBe('');
  });
});
