import db, { holdTransaction, rollbackTransaction } from '@db';
import { redis } from '@redis';
import {
  ADMIN_ID,
  EXP_VER_USER_ID,
  UNVERIFIED_USER,
  UNVERIFIED_USER2_ID,
  UNVERIFIED_USER_ID,
} from '@seeds/01_users';
import Koa from 'koa';
import superagent from 'superagent';
import agent from 'supertest-koa-agent';
import { createApp } from '../../../app';

const ROUTE = '/auth/local/verification';
const TOKEN = '_verification_token_';

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

interface FetchParams {
  id?: string;
  token?: string;
}

const request = (params: FetchParams) => {
  const qs = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  let route = ROUTE;
  if (qs) {
    route = `${ROUTE}?${qs}`;
  }
  return agent(app).get(route);
};

describe('errors', () => {
  it('should 400 when token is missing', async () => {
    const resp = await request({ id: ADMIN_ID });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification.token.missing',
      error_id: expect.any(String),
    });
  });

  it('should 400 when user id is missing', async () => {
    const resp = await request({ token: ADMIN_ID });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification.id.missing',
      error_id: expect.any(String),
    });
  });

  it('should 400 when token does not belong to user', async () => {
    const resp = await request({
      id: 'fb9af3d0-4367-11e9-b210-d663bd873d93',
      token: ADMIN_ID,
    });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification.token.invalid',
      error_id: expect.any(String),
    });
  });

  it('should 400 when verification token is not id db', async () => {
    const resp = await request({
      id: UNVERIFIED_USER2_ID,
      token: TOKEN,
    });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification.unexpected',
      error_id: expect.any(String),
    });
  });

  it('should 400 when verification token has expired', async () => {
    const resp = await request({
      id: EXP_VER_USER_ID,
      token: TOKEN,
    });
    // Maybe it should be redirect?
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification.expired',
      error_id: expect.any(String),
    });
  });

  it('should 400 when verification token does not match', async () => {
    const resp = await request({
      id: UNVERIFIED_USER_ID,
      token: 'foobar',
    });
    // Maybe it should be redirect?
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification.token.mismatch',
      error_id: expect.any(String),
    });
  });
});

describe('success', () => {
  let response: superagent.Response | null = null;

  beforeEach(async () => {
    response = null;
    response = await request({
      id: UNVERIFIED_USER_ID,
      token: TOKEN,
    });
  });

  it('should redirect', async () => {
    expect(response).toMatchObject({
      status: 302,
      headers: {
        location: expect.stringContaining('/verified'),
      },
    });
  });

  it('should redirect when user is already verified', async () => {
    const response2 = await request({
      id: UNVERIFIED_USER_ID,
      token: TOKEN,
    });
    expect(response2).toMatchObject({
      status: 302,
      headers: {
        location: expect.stringContaining('/verified'),
      },
    });
  });

  it('should mark user as verified and remove the token', async () => {
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ email: UNVERIFIED_USER.email })
      .first();
    expect(user).toMatchObject({
      verified: true,
      tokens: [],
    });
  });
});
