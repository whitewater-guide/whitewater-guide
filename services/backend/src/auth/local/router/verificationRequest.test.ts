import db, { holdTransaction, rollbackTransaction } from '@db';
import { asyncRedis, client } from '@redis';
import {
  ADMIN_ID,
  UNVERIFIED_USER2_ID,
  UNVERIFIED_USER3_ID,
  UNVERIFIED_USER_ID,
} from '@seeds/01_users';
import Koa from 'koa';
import agent from 'supertest-koa-agent';
import { createApp } from '../../../app';
import { sendMail } from '../../mail';

jest.mock('../../mail');

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

const request = (id: string) =>
  agent(app)
    .post('/auth/local/verification/request')
    .send({ id });

describe('errors', () => {
  it('should fail on missing id', async () => {
    const resp = await request('');
    expect(resp).toMatchObject({
      status: 400,
      body: {
        success: false,
        error: 'verification.request.id.missing',
      },
    });
  });

  it('should fail on incorrect id', async () => {
    const resp = await request('foobar');
    expect(resp).toMatchObject({
      status: 400,
      body: {
        success: false,
        error: 'verification.request.id.incorrect',
      },
    });
  });

  it('should fail on nonexisting id', async () => {
    const resp = await request('50486bf4-44f5-11e9-b210-d663bd873d93');
    expect(resp).toMatchObject({
      status: 400,
      body: {
        success: false,
        error: 'verification.request.user.not.found',
      },
    });
  });

  it('should fail on nonexisting id', async () => {
    const resp = await request(ADMIN_ID);
    expect(resp).toMatchObject({
      status: 400,
      body: {
        success: false,
        error: 'verification.request.unnecessary',
      },
    });
  });

  it('should fail on absent email', async () => {
    const resp = await request(UNVERIFIED_USER2_ID);
    expect(resp).toMatchObject({
      status: 400,
      body: {
        success: false,
        error: 'verification.request.email.missing',
      },
    });
  });

  it('should fail on mail send failure', async () => {
    (sendMail as any).mockImplementationOnce(() => {
      throw new Error('sendMail failed');
    });
    const resp = await request(UNVERIFIED_USER_ID);
    expect(resp).toMatchObject({
      status: 400,
      body: {
        success: false,
        error: 'verification.request.send.failed',
      },
    });
  });
});

describe('success', () => {
  it('should respond with OK', async () => {
    const resp = await request(UNVERIFIED_USER3_ID);
    expect(resp.status).toBe(200);
  });

  it('should save verification token', async () => {
    await request(UNVERIFIED_USER3_ID);
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id: UNVERIFIED_USER3_ID })
      .first();
    expect(user.tokens).toEqual([
      {
        claim: 'verification',
        expires: expect.any(Number),
        value: expect.any(String),
      },
    ]);
  });

  it('should overwrite existing token', async () => {
    await request(UNVERIFIED_USER_ID);
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id: UNVERIFIED_USER_ID })
      .first();
    expect(user.tokens).toEqual([
      {
        claim: 'verification',
        expires: expect.any(Number),
        value: expect.any(String),
      },
    ]);
    expect(user.tokens[0].expires).not.toEqual(2145906000000);
  });

  it('should send email with token', async () => {
    await request(UNVERIFIED_USER_ID);
    expect(sendMail).toHaveBeenCalledWith(
      'verification-request',
      'unverified@whitewater.guide',
      {
        user: { id: UNVERIFIED_USER_ID, name: 'Unverified user' },
        token: {
          expires: expect.any(Number),
          raw: expect.any(String),
          encrypted: expect.any(String),
        },
      },
    );
  });
});