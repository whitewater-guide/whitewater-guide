import db, { holdTransaction, rollbackTransaction } from '@db';
import { asyncRedis, client } from '@redis';
import { BOOM_USER_3500_ID } from '@seeds/01_users';
import Koa from 'koa';
import agent from 'supertest-koa-agent';
import { createApp } from '../../../app';
import { MailType, sendMail } from '../../mail';

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

const request = (email: string) =>
  agent(app)
    .post('/auth/local/reset/request')
    .send({ email });

describe('errors', () => {
  it('should fail on invalid email', async () => {
    const resp = await request('foo');
    expect(resp).toMatchObject({
      status: 400,
      body: {
        success: false,
        error: 'reset.request.invalid.email',
      },
    });
  });

  it('should fail when email is not in db', async () => {
    const resp = await request('foo@bar.com');
    expect(resp).toMatchObject({
      status: 400,
      body: {
        success: false,
        error: 'reset.request.email.not.found',
      },
    });
  });

  it('should fail when sending email fails', async () => {
    (sendMail as any).mockImplementationOnce(() => {
      throw new Error('sendMail failed');
    });
    const resp = await request('boom_backer_3500@gmail.com');
    expect(resp).toMatchObject({
      status: 400,
      body: {
        success: false,
        error: 'reset.request.send.failed',
      },
    });
  });
});

describe('success', () => {
  it('should respond with OK', async () => {
    const resp = await request('boom_backer_3500@gmail.com');
    expect(resp.status).toBe(200);
  });

  it('should be case-insensitive', async () => {
    const resp = await request('BOOM_BACKER_3500@gmail.com');
    expect(resp.status).toBe(200);
  });

  it('should save password reset token', async () => {
    await request('boom_backer_1500@gmail.com');
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ email: 'boom_backer_1500@gmail.com' })
      .first();
    expect(user.tokens).toEqual([
      {
        claim: 'passwordReset',
        expires: expect.any(Number),
        value: expect.any(String),
      },
    ]);
  });

  it('should overwrite existing token', async () => {
    await request('boom_backer_3500@gmail.com');
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ email: 'boom_backer_3500@gmail.com' })
      .first();
    expect(user.tokens).toEqual([
      {
        claim: 'passwordReset',
        expires: expect.any(Number),
        value: expect.any(String),
      },
    ]);
    expect(user.tokens[0].expires).not.toEqual(2145906000000);
  });

  it('should not affect verification token', async () => {
    await request('unverified@whitewater.guide');
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ email: 'unverified@whitewater.guide' })
      .first();
    expect(user.tokens).toEqual([
      {
        claim: 'verification',
        expires: 2145906000000,
        value: expect.any(String),
      },
      {
        claim: 'passwordReset',
        expires: expect.any(Number),
        value: expect.any(String),
      },
    ]);
  });

  it('should send email with token', async () => {
    await request('boom_backer_3500@gmail.com');
    expect(sendMail).toHaveBeenCalledWith(
      MailType.RESET_REQUEST,
      'boom_backer_3500@gmail.com',
      {
        user: {
          id: BOOM_USER_3500_ID,
          name: 'Boom Backer 3500',
        },
        token: {
          expires: expect.any(Number),
          raw: expect.any(String),
          encrypted: expect.any(String),
        },
      },
    );
  });
});
