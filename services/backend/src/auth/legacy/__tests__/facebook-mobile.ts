import db, { holdTransaction, rollbackTransaction } from '~/db';
import { redis } from '~/redis';
import { ADMIN, ADMIN_FB_PROFILE, NEW_FB_PROFILE } from '~/seeds/test/01_users';
import { countRows, UUID_REGEX } from '~/test';
import { Cookie, CookieAccessInfo } from 'cookiejar';
import Koa from 'koa';
import get from 'lodash/get';
import FacebookTokenStrategy from 'passport-facebook-token';
import superagent from 'superagent';
import { SuperTest, Test } from 'supertest';
import agent from 'supertest-koa-agent';
import { createApp } from '../../../app';
import { extractSessionId } from '../sessions';

const ROUTE = '/auth/facebook/token';
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

it('should fail when access token is not provided ', async () => {
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
  expect(resp.status).toBe(401);
});

describe('new user', () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, NEW_FB_PROFILE);
      });

    response = null;
    testAgent = agent(app);
    response = await testAgent.get(
      `${ROUTE}?access_token=__new_access_token__`,
    );
  });

  it('should respond with 200', async () => {
    expect(response).toMatchObject({
      status: 200,
      text: 'OK',
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
    const user = await db(false)
      .select('*')
      .from('users')
      .orderBy('created_at', 'desc')
      .first();
    expect(user).toMatchObject({
      email: get(NEW_FB_PROFILE, 'emails.0.value', null),
      verified: true,
    });
  });

  it('should create session for user', async () => {
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

  it('should reuse existing session', async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, NEW_FB_PROFILE);
      });
    // Fire second request
    const resp = await testAgent.get(
      `${ROUTE}?access_token=__new_access_token__`,
    );
    const sessionId = extractSessionId(resp);
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

  it('should respond with 200', async () => {
    expect(response).toMatchObject({
      status: 200,
      text: 'OK',
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

  it('should create session for user', async () => {
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
    testAgent = agent(app);
    testAgent.jar.setCookie(new Cookie('wwguide=legacy_id;path=/'));
    testAgent.get(`${ROUTE}?access_token=__new_access_token__`);
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
    const keys = await redis.keys('*');
    expect(keys).toHaveLength(0);
  });

  it('should remove session from cookie', async () => {
    // existence of session before logout call is tested in different test above
    try {
      await testAgent.get(LOGOUT_ROUTE);
    } catch {}
    const cookie = testAgent.jar.getCookie('wwguide', CookieAccessInfo.All);
    expect(cookie).toBeUndefined();
  });
});
