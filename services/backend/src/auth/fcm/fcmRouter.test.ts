import db, { holdTransaction, rollbackTransaction } from '~/db/db';
import { redis } from '~/redis';
import { TEST_USER_ID } from '~/seeds/test/01_users';
import Koa from 'koa';
import agent from 'supertest-koa-agent';
import { createApp } from '../../app';
import { getAccessToken } from '../jwt';

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

describe('set fcm token', () => {
  const ROUTE = '/fcm/set';

  const request = async (
    fcm_token?: string | null,
    old_fcm_token?: string | null,
  ) => {
    const testAgent = agent(app);
    const resp = await testAgent
      .post(ROUTE)
      .set('authorization', `bearer ${getAccessToken(TEST_USER_ID)}`)
      .send({ fcm_token, old_fcm_token });
    const tokens = await db(false)
      .select('token')
      .from('fcm_tokens')
      .where({ user_id: TEST_USER_ID });
    return {
      tokens,
      success: resp.body.success,
    };
  };

  it('should set new fcm token', async () => {
    const { success, tokens } = await request('foo');
    expect(success).toBe(true);
    expect(tokens).toHaveLength(2);
    expect(tokens).toContainEqual({ token: 'foo' });
  });

  it('should not fail on existing fcm token', async () => {
    const { success, tokens } = await request('__user_fcm_token__');
    expect(success).toBe(true);
    expect(tokens).toHaveLength(1);
  });

  it('should not fail on empty token', async () => {
    const { success, tokens } = await request(null);
    expect(success).toBe(true);
    expect(tokens).toHaveLength(1);
  });

  it('should replace existing token', async () => {
    const { success, tokens } = await request('foo', '__user_fcm_token__');
    expect(tokens).toHaveLength(1);
    expect(tokens).toContainEqual({ token: 'foo' });
  });

  it('should not fail on when attempting to replace non-existing token', async () => {
    const { success, tokens } = await request('foo', 'bar');
    expect(tokens).toHaveLength(2);
    expect(tokens).toContainEqual({ token: 'foo' });
    expect(tokens).toContainEqual({ token: '__user_fcm_token__' });
  });
});
