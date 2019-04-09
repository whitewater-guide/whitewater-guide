import { holdTransaction, rollbackTransaction } from '@db';
import { asyncRedis, client } from '@redis';
import { ADMIN_ID } from '@seeds/01_users';
import { BLACKLISTED_REFRESH_TOKEN } from '@seeds/16_tokens_blacklist';
import { CookieAccessInfo } from 'cookiejar';
import jsonwebtoken from 'jsonwebtoken';
import Koa from 'koa';
import agent from 'supertest-koa-agent';
import { createApp } from '../../app';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../constants';
import { getAccessToken } from './tokens';

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

describe('mobile', () => {
  const request = (refreshToken: string) =>
    agent(app)
      .post('/auth/jwt/refresh')
      .send({ refreshToken });

  it('should fail if refresh token is missing', async () => {
    const resp = await request('');
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.not.found',
      errorId: expect.any(String),
    });
  });

  it('should fail if refresh token is corrupt', async () => {
    const refreshToken = jsonwebtoken.sign(
      { id: ADMIN_ID, refresh: true },
      'ajsdhflksdhf',
    );
    const resp = await request(refreshToken);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad.token',
      errorId: expect.any(String),
    });
  });

  it('should fail if refresh token is corrupt', async () => {
    const accessToken = getAccessToken(ADMIN_ID);

    const resp = await request(accessToken);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad.token',
      errorId: expect.any(String),
    });
  });

  it('should fail if refresh claim is missing', async () => {
    const accessToken = getAccessToken(ADMIN_ID);

    const resp = await request(accessToken);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad.token',
      errorId: expect.any(String),
    });
  });

  it('should fail if id is missing', async () => {
    const refreshToken = jsonwebtoken.sign(
      { refresh: true },
      process.env.REFRESH_TOKEN_SECRET!,
    );

    const resp = await request(refreshToken);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad.token',
      errorId: expect.any(String),
    });
  });

  it('should fail if token is blacklisted', async () => {
    const resp = await request(BLACKLISTED_REFRESH_TOKEN);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad.token',
      errorId: expect.any(String),
    });
  });

  it('should send new access token on success', async () => {
    const refreshToken = jsonwebtoken.sign(
      { id: ADMIN_ID, refresh: true },
      process.env.REFRESH_TOKEN_SECRET!,
    );

    const resp = await request(refreshToken);
    expect(resp).toMatchObject({
      status: 200,
      body: {
        refreshToken,
        accessToken: expect.any(String),
      },
    });
  });
});

describe('web', () => {
  it('should send new access token on success', async () => {
    const refreshToken = jsonwebtoken.sign(
      { id: ADMIN_ID, refresh: true },
      process.env.REFRESH_TOKEN_SECRET!,
    );

    const testAgent = agent(app);
    const resp = await testAgent
      .post('/auth/jwt/refresh?web=true')
      .set('Cookie', [`${REFRESH_TOKEN_COOKIE}=${refreshToken}`]);

    expect(resp).toMatchObject({
      status: 200,
      body: { success: true, id: ADMIN_ID },
    });
    const atCookie = testAgent.jar.getCookie(
      ACCESS_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    const rtCookie = testAgent.jar.getCookie(
      REFRESH_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    expect(atCookie.value).toBeTruthy();
    expect(rtCookie.value).toBe(refreshToken);
  });
});
