import { holdTransaction, rollbackTransaction } from '~/db';
import { redis } from '~/redis';
import {
  ADMIN,
  ADMIN_FB_PROFILE,
  ADMIN_ID,
  NEW_FB_PROFILE,
} from '~/seeds/test/01_users';
import { countRows, UUID_REGEX } from '~/test';
import { CookieAccessInfo } from 'cookiejar';
import Koa from 'koa';
import get from 'lodash/get';
import superagent from 'superagent';
import { SuperTest, Test } from 'supertest';
import agent from 'supertest-koa-agent';
import { createApp } from '../../../app';
import passport from '../passport';
import { extractSessionId } from '../sessions';

const ROUTE = '/auth/facebook';
const CALLBACK_ROUTE = '/auth/facebook/callback?__mock_strategy_callback=true';
const LOGOUT_ROUTE = '/auth/logout';

let app: Koa;

let usersBefore: number;
let accountsBefore: number;

beforeAll(async () => {
  [usersBefore, accountsBefore] = await countRows(true, 'users', 'accounts');
});

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
  await redis.flushall();
  app = createApp();
});

afterEach(async () => {
  await rollbackTransaction();
  redis.removeAllListeners();
});

it('should redirect on call from web-client', async () => {
  const resp = await agent(app).get(`${ROUTE}?returnTo=/test_return_to`);
  expect(resp).toMatchObject({
    status: 302,
  });
});

it('should redirect to login when auth failed on fb side', async () => {
  const strategy = get(passport, '_strategies.facebook-legacy');
  strategy._error = new Error('facebook error');

  const resp = await agent(app).get(CALLBACK_ROUTE);
  expect(resp).toMatchObject({
    status: 302,
    headers: {
      location: '/login',
    },
  });
});

describe('new user', () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    response = null;
    const strategy = get(passport, '_strategies.facebook-legacy');
    strategy._profile = NEW_FB_PROFILE;
    strategy._token_response = {
      access_token: '__mock_access_token__',
    };
    testAgent = agent(app);
    response = await testAgent.get(CALLBACK_ROUTE);
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
    const [usersAfter, accountsAfter] = await countRows(
      false,
      'users',
      'accounts',
    );
    expect(usersAfter - usersBefore).toBe(1);
    expect(accountsAfter - accountsBefore).toBe(1);
  });

  it('should create session', async () => {
    const sessionId = extractSessionId(response);
    expect(sessionId).toBeDefined();
    const keys = await redis.keys('*');
    expect(keys).toHaveLength(1);
    const session = await redis.get(sessionId!);
    expect(JSON.parse(session!)).toHaveProperty(
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
    const strategy = get(passport, '_strategies.facebook-legacy');
    strategy._profile = NEW_FB_PROFILE;
    strategy._token_response = {
      access_token: '__mock_access_token__',
    };
    // use same agent (should have cookies from first request)
    response = await testAgent.get(CALLBACK_ROUTE);

    const sessionId = extractSessionId(response);
    expect(sessionId).toBeDefined();
    const keys = await redis.keys('*');
    expect(keys).toHaveLength(1);
    const session = await redis.get(sessionId!);
    expect(JSON.parse(session!)).toHaveProperty(
      'passport.user',
      expect.stringMatching(UUID_REGEX),
    );
  });

  it('should populate koa context with user', async () => {
    const spyMiddleware = jest.fn();
    app.use(spyMiddleware);
    await testAgent.get('/');
    expect(spyMiddleware.mock.calls[0][0].state).toMatchObject({
      legacyUser: {
        id: expect.stringMatching(UUID_REGEX),
        name: `${NEW_FB_PROFILE.name!.givenName} ${
          NEW_FB_PROFILE.name!.familyName
        }`,
        avatar: null,
        email: NEW_FB_PROFILE.emails![0].value,
        admin: false,
        language: 'en',
        editor_settings: { language: 'en' },
        imperial: false,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
    });
  });
});

describe('existing user', () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    response = null;
    const strategy = get(passport, '_strategies.facebook-legacy');
    strategy._profile = ADMIN_FB_PROFILE;
    strategy._token_response = {
      access_token: '__admin_fb_access_token__',
    };
    testAgent = agent(app);
    response = await testAgent.get(CALLBACK_ROUTE);
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
    const [usersAfter, accountsAfter] = await countRows(
      false,
      'users',
      'accounts',
    );
    expect(usersAfter - usersBefore).toBe(0);
    expect(accountsAfter - accountsBefore).toBe(0);
  });

  it('should create session', async () => {
    const sessionId = extractSessionId(response);
    expect(sessionId).toBeDefined();
    const keys = await redis.keys('*');
    expect(keys).toHaveLength(1);
    const session = await redis.get(sessionId!);
    expect(JSON.parse(session!)).toHaveProperty('passport.user', ADMIN_ID);
  });

  it('should set cookie', async () => {
    const cookie = testAgent.jar.getCookie('wwguide', CookieAccessInfo.All);
    expect(cookie.value).toBeTruthy();
  });

  it('should populate koa context with user', async () => {
    const spyMiddleware = jest.fn();
    app.use(spyMiddleware);
    await testAgent.get('/');
    expect(spyMiddleware.mock.calls[0][0].state).toMatchObject({
      legacyUser: {
        ...ADMIN,
        tokens: [],
      },
    });
  });
});

describe('logout', () => {
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    const strategy = get(passport, '_strategies.facebook-legacy');
    strategy._profile = ADMIN_FB_PROFILE;
    strategy._token_response = {
      access_token: '__admin_fb_access_token__',
    };
    testAgent = agent(app);
    await testAgent.get(CALLBACK_ROUTE);
  });

  it('should redirect to referrer', async () => {
    const resp = await testAgent
      .get(LOGOUT_ROUTE)
      .set('Referer', 'https://referer.com');
    expect(resp.status).toBe(302);
    expect(resp.header.location).toBe('https://referer.com');
  });

  it('should remove session', async () => {
    await testAgent.get(LOGOUT_ROUTE);
    const keys = await redis.keys('*');
    expect(keys).toHaveLength(0);
  });

  it('should remove session from cookie', async () => {
    // existence of session before logout call is tested in different test above
    await testAgent.get(LOGOUT_ROUTE);
    const cookie = testAgent.jar.getCookie('wwguide', CookieAccessInfo.All);
    expect(cookie).toBeUndefined();
  });
});
