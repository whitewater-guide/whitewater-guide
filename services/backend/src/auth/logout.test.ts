import { holdTransaction, rollbackTransaction } from '@db';
import { asyncRedis, client } from '@redis';
import { CookieAccessInfo } from 'cookiejar';
import Koa from 'koa';
import agent from 'supertest-koa-agent';
import { createApp } from '../app';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './constants';

const LOGIN_ROUTE = '/auth/local/signin';
const LOGOUT_ROUTE = '/auth/logout';

let app: Koa;

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

it('should sign out', async () => {
  const testAgent = agent(app);
  await testAgent.post(LOGIN_ROUTE).send({
    email: 'fish.munga@yandex.ru',
    password: 'G@l1c1a_pwd',
    web: true,
  });
  const atCookieBefore = testAgent.jar.getCookie(
    ACCESS_TOKEN_COOKIE,
    CookieAccessInfo.All,
  );
  const rtCookieBefore = testAgent.jar.getCookie(
    REFRESH_TOKEN_COOKIE,
    CookieAccessInfo.All,
  );
  expect(atCookieBefore.value).toBeTruthy();
  expect(rtCookieBefore.value).toBeTruthy();

  await testAgent.get(LOGOUT_ROUTE);
  const atCookieAfter = testAgent.jar.getCookie(
    ACCESS_TOKEN_COOKIE,
    CookieAccessInfo.All,
  );
  const rtCookieAfter = testAgent.jar.getCookie(
    REFRESH_TOKEN_COOKIE,
    CookieAccessInfo.All,
  );
  expect(atCookieAfter).toBeUndefined();
  expect(rtCookieAfter).toBeUndefined();
});
