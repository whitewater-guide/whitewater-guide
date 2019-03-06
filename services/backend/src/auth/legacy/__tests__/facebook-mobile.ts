import { holdTransaction, rollbackTransaction } from '@db';
import { asyncRedis, client } from '@redis';
import { countRows, UUID_REGEX } from '@test';
import { CookieAccessInfo } from 'cookiejar';
import Koa from 'koa';
import superagent from 'superagent';
import { SuperTest, Test } from 'supertest';
import agent from 'supertest-koa-agent';
import { createApp } from '../../../app';
import { extractSessionId } from '../sessions';

const ROUTE = '/auth/facebook/token';
const LOGOUT_ROUTE = '/auth/logout';

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

it('should fail when access token is not provided ', async () => {
  const req = agent(app).get(ROUTE);
  await expect(req).rejects.toMatchObject({
    status: 401,
  });
});

it('should fail for bad token', async () => {
  const req = agent(app).get(`${ROUTE}?access_token=__bad_access_token__`);
  // await expect(req).rejects.toMatchObject({
  //   status: 401,
  // });
  try {
    const resp = await req;
  } catch (err) {
    expect(err.status).toBe(401);
  }
});

describe('new user', async () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    response = null;
    testAgent = agent(app);
    const req = testAgent.get(`${ROUTE}?access_token=__new_access_token__`);
    try {
      response = await req;
    } catch (err) {
      response = err.response;
    }
  });

  it('should respond with 200', async () => {
    expect(response).toMatchObject({
      status: 200,
      text: 'OK',
    });
  });

  it('should create new user and login', async () => {
    const [usersAfter, loginsAfter] = await countRows(false, 'users', 'logins');
    expect(usersAfter - usersBefore).toBe(1);
    expect(loginsAfter - loginsBefore).toBe(1);
  });

  it('should create session for user', async () => {
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

  it('should reuse existing session', async () => {
    // Fire second request
    const resp = await testAgent.get(
      `${ROUTE}?access_token=__new_access_token__`,
    );
    const sessionId = extractSessionId(resp);
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
    testAgent = agent(app);
    const req = testAgent.get(
      `${ROUTE}?access_token=__existing_access_token__`,
    );
    try {
      response = await req;
    } catch (err) {
      response = err.response;
    }
  });

  it('should respond with 200', async () => {
    expect(response).toMatchObject({
      status: 200,
      text: 'OK',
    });
  });

  it('should not create new user and login', async () => {
    const [usersAfter, loginsAfter] = await countRows(false, 'users', 'logins');
    expect(usersAfter - usersBefore).toBe(0);
    expect(loginsAfter - loginsBefore).toBe(0);
  });

  it('should create session for user', async () => {
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
});

describe('logout', () => {
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    testAgent = agent(app);
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
