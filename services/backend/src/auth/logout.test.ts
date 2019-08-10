import db, { holdTransaction, rollbackTransaction } from '@db';
import { redis } from '@redis';
import { TEST_USER_ID } from '@seeds/01_users';
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
  await redis.flushall();
  app = createApp();
});

afterEach(async () => {
  await rollbackTransaction();
  redis.removeAllListeners();
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

it('should delete fcm_token if provided', async () => {
  const testAgent = agent(app);
  const resp = await testAgent.post(LOGIN_ROUTE).send({
    email: 'konstantin@gmail.com',
    password: 'ttttE_s_t1a',
  });
  const accessToken = resp.body.accessToken;
  await testAgent
    .get(`${LOGOUT_ROUTE}?fcm_token=__user_fcm_token__`)
    .set('authorization', `bearer ${accessToken}`);
  const tokens = await db(false)
    .select('token')
    .from('fcm_tokens')
    .where({ user_id: TEST_USER_ID });
  expect(tokens).toHaveLength(0);
});
