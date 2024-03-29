import { CookieAccessInfo } from 'cookiejar';
import type Koa from 'koa';
import type superagent from 'superagent';
import type { SuperTest, Test } from 'supertest';

import { createApp } from '../../../app';
import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import { EDITOR_GA_EC_ID } from '../../../seeds/test/01_users';
import { countRows, koaTestAgent } from '../../../test/index';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../../constants';

const ROUTE = '/auth/local/signin';

let app: Koa;

let usersBefore: number;
let accountsBefore: number;

beforeAll(async () => {
  [usersBefore, accountsBefore] = await countRows(true, 'users', 'accounts');
});

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
  app = createApp();
});

afterEach(async () => {
  await rollbackTransaction();
});

describe('errors', () => {
  it('should fail if user does not exist', async () => {
    const resp = await koaTestAgent(app).post(ROUTE).send({
      email: 'foo@bar.com',
      password: 'qwertyui',
    });
    expect(resp).toMatchObject({
      status: 401,
      body: {
        error: 'signin.errors.email.not_found',
      },
    });
  });

  it('should fail if password does not match', async () => {
    const resp = await koaTestAgent(app).post(ROUTE).send({
      email: 'fish.munga@yandex.ru',
      password: 'qwertyui',
    });
    expect(resp).toMatchObject({
      status: 401,
      body: {
        error: 'signin.errors.password.mismatch',
      },
    });
  });

  it('should fail if password does not exist', async () => {
    const resp = await koaTestAgent(app).post(ROUTE).send({
      email: 'kaospostage@gmail.com',
      password: 'qwertyui',
    });
    expect(resp).toMatchObject({
      status: 401,
      body: {
        error: 'signin.errors.email.not_local',
      },
    });
  });
});

describe('mobile', () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    response = null;
    testAgent = koaTestAgent(app);
    response = await testAgent.post(ROUTE).send({
      email: 'fish.munga@yandex.ru',
      password: 'G@l1c1a_pwd',
    });
  });

  it('should respond with access and refresh tokens', async () => {
    const body = {
      success: true,
      id: EDITOR_GA_EC_ID,
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
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
    await koaTestAgent(app).get('/').set('Authorization', `bearer ${aT}`);
    expect(spyMiddleware.mock.calls[0][0].state.user).toEqual({
      id: EDITOR_GA_EC_ID,
      language: 'en',
      verified: true,
      admin: false,
    });
  });
});

describe('web', () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    response = null;
    testAgent = koaTestAgent(app);
    response = await testAgent.post(ROUTE).send({
      email: 'fish.munga@yandex.ru',
      password: 'G@l1c1a_pwd',
      web: true,
    });
  });

  it('should respond with success body', async () => {
    const body = {
      success: true,
      id: EDITOR_GA_EC_ID,
    };
    expect(response).toMatchObject({
      status: 200,
      body,
    });
    expect(response!.body).not.toHaveProperty('accessToken');
    expect(response!.body).not.toHaveProperty('refreshToken');
  });

  it('should respond with access and refresh tokens in cookies', async () => {
    const atCookie = testAgent.jar.getCookie(
      ACCESS_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    const rtCookie = testAgent.jar.getCookie(
      REFRESH_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    expect(atCookie?.value).toBeTruthy();
    expect(rtCookie?.value).toBeTruthy();
  });

  it('should populate koa context with user', async () => {
    const spyMiddleware = jest.fn();
    app.use(spyMiddleware);
    await testAgent.get('/');
    expect(spyMiddleware.mock.calls[0][0].state.user).toEqual({
      id: EDITOR_GA_EC_ID,
      language: 'en',
      verified: true,
      admin: false,
    });
  });
});

it('should be case-insensitive', async () => {
  const resp = await koaTestAgent(app).post(ROUTE).send({
    email: 'fish.MUNGA@yandex.ru',
    password: 'G@l1c1a_pwd',
  });
  expect(resp.status).toBe(200);
});

it('should insert new access token', async () => {
  const testAgent = koaTestAgent(app);
  const resp = await testAgent.post(ROUTE).send({
    email: 'konstantin@gmail.com',
    password: 'ttttE_s_t1a',
    fcm_token: '__foo__',
  });
  const tokens = await db(false)
    .select('token')
    .from('fcm_tokens')
    .where({ user_id: resp.body.id });
  expect(tokens).toEqual(
    expect.arrayContaining([
      { token: '__foo__' },
      { token: '__user_fcm_token__' },
    ]),
  );
});

it('should not fail on old access token', async () => {
  const testAgent = koaTestAgent(app);
  const resp = await testAgent.post(ROUTE).send({
    email: 'konstantin@gmail.com',
    password: 'ttttE_s_t1a',
    fcm_token: '__user_fcm_token__',
  });
  const tokens = await db(false)
    .select('token')
    .from('fcm_tokens')
    .where({ user_id: resp.body.id });
  expect(tokens).toEqual([{ token: '__user_fcm_token__' }]);
});
