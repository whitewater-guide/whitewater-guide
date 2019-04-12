import db, { holdTransaction, rollbackTransaction } from '@db';
import { asyncRedis, client } from '@redis';
import {
  ADMIN_ID,
  EDITOR_GA_EC_ID,
  EDITOR_NO_ID,
  TEST_USER_ID,
} from '@seeds/01_users';
import { compare } from 'bcrypt';
import Koa from 'koa';
import superagent from 'superagent';
import agent from 'supertest-koa-agent';
import { createApp } from '../../../app';
import { MailType, sendMail } from '../../mail';

jest.mock('../../mail');

const ROUTE = '/auth/local/reset';
const TOKEN = '_reset_token_';
const PASSWORD = 'p@__w01rd';

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

interface Payload {
  id?: string;
  token?: string;
  password?: string;
}

const request = (payload: Payload) =>
  agent(app)
    .post(ROUTE)
    .send(payload);

describe('errors', () => {
  it('should fail when token is missing', async () => {
    const resp = await request({ id: ADMIN_ID, password: PASSWORD });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'reset.missing.arguments',
      error_id: expect.any(String),
    });
  });

  it('should fail when id is missing', async () => {
    const resp = await request({ token: TOKEN, password: PASSWORD });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'reset.missing.arguments',
      error_id: expect.any(String),
    });
  });

  it('should fail when password is missing', async () => {
    const resp = await request({ token: TOKEN, id: ADMIN_ID });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'reset.missing.arguments',
      error_id: expect.any(String),
    });
  });

  it('should fail when id is incorrect', async () => {
    const resp = await request({
      token: TOKEN,
      id: 'qwerty',
      password: PASSWORD,
    });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'reset.id.invalid',
      error_id: expect.any(String),
    });
  });

  it('should fail when password is weak', async () => {
    const resp = await request({ token: TOKEN, id: ADMIN_ID, password: '123' });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'reset.weak.password',
      error_id: expect.any(String),
    });
  });

  it('should fail when user not found', async () => {
    const resp = await request({
      token: TOKEN,
      id: '1fe442f2-467c-11e9-b210-d663bd873d93',
      password: PASSWORD,
    });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'reset.id.invalid',
      error_id: expect.any(String),
    });
  });

  it('should fail when user is not local user', async () => {
    const resp = await request({
      token: TOKEN,
      id: ADMIN_ID,
      password: PASSWORD,
    });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'reset.not.local',
      error_id: expect.any(String),
    });
  });

  it('should fail when token not found', async () => {
    const resp = await request({
      token: TOKEN,
      id: EDITOR_GA_EC_ID,
      password: PASSWORD,
    });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'reset.unexpected',
      error_id: expect.any(String),
    });
  });

  it('should fail when token expired', async () => {
    const resp = await request({
      token: TOKEN,
      id: TEST_USER_ID,
      password: PASSWORD,
    });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'reset.expired',
      error_id: expect.any(String),
    });
  });

  it('should fail when tokens do not match', async () => {
    const resp = await request({
      token: 'foo',
      id: EDITOR_NO_ID,
      password: PASSWORD,
    });
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'reset.token.mismatch',
      error_id: expect.any(String),
    });
  });
});

describe('success', () => {
  let response: superagent.Response | null = null;

  beforeEach(async () => {
    response = null;
    response = await request({
      token: TOKEN,
      id: EDITOR_NO_ID,
      password: PASSWORD,
    });
  });

  it('should send success', () => {
    expect(response).toMatchObject({
      status: 200,
      body: {
        success: true,
        id: EDITOR_NO_ID,
      },
    });
  });

  it('should change password and remove token', async () => {
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id: EDITOR_NO_ID })
      .first();
    expect(user).toMatchObject({
      password: expect.any(String),
      tokens: [],
    });
    await expect(compare(PASSWORD, user.password)).resolves.toBe(true);
  });

  it('should send email', () => {
    expect(sendMail).toHaveBeenCalledWith(
      MailType.RESET_SUCCESS,
      'dude@nve.no',
      { user: { id: EDITOR_NO_ID, name: 'Norwegian Dude' } },
    );
  });
});
