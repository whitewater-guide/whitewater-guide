import type Koa from 'koa';

import { createApp } from '../../../app';
import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import { sendMail } from '../../../mail/index';
import {
  ADMIN_ID,
  UNVERIFIED_USER_ID,
  UNVERIFIED_USER2_ID,
  UNVERIFIED_USER3_ID,
} from '../../../seeds/test/01_users';
import { koaTestAgent } from '../../../test/index';

jest.mock('../../../mail');

let app: Koa;

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
  app = createApp();
});

afterEach(async () => {
  await rollbackTransaction();
});

const request = (id: string) =>
  koaTestAgent(app).post('/auth/local/verification/request').send({ id });

describe('errors', () => {
  it('should fail on missing id', async () => {
    const resp = await request('');
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification_request.errors.form.id_missing',
      error_id: expect.any(String),
    });
  });

  it('should fail on incorrect id', async () => {
    const resp = await request('foobar');
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification_request.errors.form.id_invalid',
      error_id: expect.any(String),
    });
  });

  it('should fail on nonexisting id', async () => {
    const resp = await request('50486bf4-44f5-11e9-b210-d663bd873d93');
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification_request.errors.form.user_not_found',
      error_id: expect.any(String),
    });
  });

  it('should fail on already verified users', async () => {
    const resp = await request(ADMIN_ID);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification_request.errors.form.already_verified',
      error_id: expect.any(String),
    });
  });

  it('should fail on absent email', async () => {
    const resp = await request(UNVERIFIED_USER2_ID);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification_request.errors.form.not_local',
      error_id: expect.any(String),
    });
  });

  it('should fail on mail send failure', async () => {
    (sendMail as any).mockImplementationOnce(() => {
      throw new Error('sendMail failed');
    });
    const resp = await request(UNVERIFIED_USER_ID);
    expect(resp.status).toBe(400);
    expect(resp.body).toEqual({
      success: false,
      error: 'verification_request.errors.form.send_failed',
      error_id: expect.any(String),
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
