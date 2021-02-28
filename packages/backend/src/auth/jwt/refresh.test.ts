import { CookieAccessInfo } from 'cookiejar';
import { sign } from 'jsonwebtoken';
import Koa from 'koa';
import agent from 'supertest-koa-agent';

import config from '~/config';
import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN_ID } from '~/seeds/test/01_users';
import { BLACKLISTED_REFRESH_TOKEN } from '~/seeds/test/16_tokens_blacklist';

import { createApp } from '../../app';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../constants';
import { getAccessToken } from './tokens';

let app: Koa;

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
  app = createApp();
});

afterEach(async () => {
  await rollbackTransaction();
});

describe('mobile', () => {
  const request = (refreshToken: string) =>
    agent(app).post('/auth/jwt/refresh').send({ refreshToken });

  it('should fail if refresh token is missing', async () => {
    const resp = await request('');
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.not_found',
      error_id: expect.any(String),
    });
  });

  it('should fail if refresh token is corrupt', async () => {
    const refreshToken = sign({ id: ADMIN_ID, refresh: true }, 'ajsdhflksdhf');
    const resp = await request(refreshToken);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad_token',
      error_id: expect.any(String),
    });
  });

  it('should fail if refresh claim is missing', async () => {
    const accessToken = getAccessToken(ADMIN_ID);

    const resp = await request(accessToken);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad_token',
      error_id: expect.any(String),
    });
  });

  it('should fail if id is missing', async () => {
    const refreshToken = sign({ refresh: true }, config.REFRESH_TOKEN_SECRET);

    const resp = await request(refreshToken);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad_token',
      error_id: expect.any(String),
    });
  });

  it('should fail if token is blacklisted', async () => {
    const resp = await request(BLACKLISTED_REFRESH_TOKEN);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad_token',
      error_id: expect.any(String),
    });
  });

  it('should send new access token on success', async () => {
    const refreshToken = sign(
      { id: ADMIN_ID, refresh: true },
      config.REFRESH_TOKEN_SECRET,
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
  it('should clear cookies if refresh token is corrupt', async () => {
    const testAgent = agent(app);
    const refreshToken = sign({ id: ADMIN_ID, refresh: true }, 'ajsdhflksdhf');
    testAgent.jar.setCookie(
      `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
      undefined,
      '/auth/jwt/refresh',
    );
    const resp = await testAgent.post('/auth/jwt/refresh?web=true');
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad_token',
      error_id: expect.any(String),
    });
    const atCookie = testAgent.jar.getCookie(
      ACCESS_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    const rtCookie = testAgent.jar.getCookie(
      REFRESH_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    expect(atCookie).toBeUndefined();
    expect(rtCookie).toBeUndefined();
  });

  it('should fail if refresh claim is missing', async () => {
    const accessToken = getAccessToken(ADMIN_ID);
    const testAgent = agent(app);
    testAgent.jar.setCookie(
      `${REFRESH_TOKEN_COOKIE}=${accessToken}`,
      undefined,
      '/auth/jwt/refresh',
    );
    const resp = await testAgent.post('/auth/jwt/refresh?web=true');

    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad_token',
      error_id: expect.any(String),
    });
    const atCookie = testAgent.jar.getCookie(
      ACCESS_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    const rtCookie = testAgent.jar.getCookie(
      REFRESH_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    expect(atCookie).toBeUndefined();
    expect(rtCookie).toBeUndefined();
  });

  it('should fail if id is missing', async () => {
    const testAgent = agent(app);
    const refreshToken = sign({ refresh: true }, config.REFRESH_TOKEN_SECRET);

    testAgent.jar.setCookie(
      `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
      undefined,
      '/auth/jwt/refresh',
    );
    const resp = await testAgent.post('/auth/jwt/refresh?web=true');
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad_token',
      error_id: expect.any(String),
    });
    const atCookie = testAgent.jar.getCookie(
      ACCESS_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    const rtCookie = testAgent.jar.getCookie(
      REFRESH_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    expect(atCookie).toBeUndefined();
    expect(rtCookie).toBeUndefined();
  });

  it('should fail if token is blacklisted', async () => {
    const testAgent = agent(app);

    testAgent.jar.setCookie(
      `${REFRESH_TOKEN_COOKIE}=${BLACKLISTED_REFRESH_TOKEN}`,
      undefined,
      '/auth/jwt/refresh',
    );
    const resp = await testAgent.post('/auth/jwt/refresh?web=true');
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'refresh.jwt.bad_token',
      error_id: expect.any(String),
    });
    const atCookie = testAgent.jar.getCookie(
      ACCESS_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    const rtCookie = testAgent.jar.getCookie(
      REFRESH_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    expect(atCookie).toBeUndefined();
    expect(rtCookie).toBeUndefined();
  });

  it('should send new access token on success', async () => {
    const testAgent = agent(app);
    const refreshToken = sign(
      { id: ADMIN_ID, refresh: true },
      config.REFRESH_TOKEN_SECRET,
    );
    testAgent.jar.setCookie(
      `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
      undefined,
      '/auth/jwt/refresh',
    );

    const resp = await testAgent.post('/auth/jwt/refresh?web=true');

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
    expect(atCookie?.value).toBeTruthy();
    expect(rtCookie?.value).toBe(refreshToken);
  });
});
