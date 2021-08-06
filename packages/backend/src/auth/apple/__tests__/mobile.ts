import { countRows, UUID_REGEX } from '@test';
import { AuthBody, SignInBody } from '@whitewater-guide/commons';
import Koa from 'koa';
import superagent from 'superagent';
import { SuperTest, Test } from 'supertest';
import agent from 'supertest-koa-agent';
import {} from 'util';
import { DeepPartial } from 'utility-types';

import { db, holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN_ID } from '~/seeds/test/01_users';

import { createApp } from '../../../app';
import { sendWelcome } from '../../mail';
import { AppleSignInPayload } from '../types';

jest.mock('../../mail');

const ROUTE = '/auth/apple/signin';

const payload: DeepPartial<AppleSignInPayload> = {
  fullName: { familyName: 'Ivanov', givenName: 'Ivan' },
};

let app: Koa;

let usersBefore: number;
let accountsBefore: number;
let tokensBefore: number;

beforeAll(async () => {
  [usersBefore, accountsBefore, tokensBefore] = await countRows(
    true,
    'users',
    'accounts',
    'fcm_tokens',
  );
});

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
  app = createApp();
});

afterEach(async () => {
  await rollbackTransaction();
});

it('should fail when access token is not provided', async () => {
  const resp = await agent(app).post(ROUTE).send({});
  expect(resp).toMatchObject({
    status: 401,
  });
});

it('should fail for bad token', async () => {
  const resp = await agent(app)
    .post(ROUTE)
    .send({ ...payload, identityToken: 'bad' });
  expect(resp).toMatchObject({
    status: 401,
  });
});

describe.each([
  ['with email', '__apple_token_w_email__', 'email@apple.com'],
  ['without email', '__apple_token_wo_email__', null],
])('new user %s', (_, identityToken, email) => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    response = null;
    testAgent = agent(app);
    response = await testAgent.post(ROUTE).send({ ...payload, identityToken });
  });

  it('should respond with access and refresh tokens', async () => {
    const body: AuthBody<SignInBody> = {
      success: true,
      id: expect.stringMatching(UUID_REGEX),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      isNew: true,
    };
    expect(response).toMatchObject({
      status: 200,
      body,
    });
  });

  it('should create new user and login', async () => {
    const [usersAfter, accountsAfter] = await countRows(
      false,
      'users',
      'accounts',
    );
    expect(usersAfter - usersBefore).toBe(1);
    expect(accountsAfter - accountsBefore).toBe(1);
  });

  it('should create verified user', async () => {
    const { id } = response!.body;
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id })
      .first();
    expect(user).toMatchObject({
      email,
      verified: true,
      language: 'en',
    });
  });

  it('should populate koa context with user', async () => {
    const aT = response!.body.accessToken;
    const spyMiddleware = jest.fn();
    app.use(spyMiddleware);
    await agent(app).get('/').set('Authorization', `bearer ${aT}`);
    expect(spyMiddleware.mock.calls[0][0].state.user).toEqual({
      id: expect.stringMatching(UUID_REGEX),
      language: 'en',
      verified: true,
      admin: false,
    });
  });

  it('should send welcome email', async () => {
    expect(sendWelcome).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.stringMatching(UUID_REGEX),
        name: `${payload.fullName?.givenName} ${payload.fullName?.familyName}`,
        email,
      }),
    );
  });
});

describe('existing user', () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    response = null;
    testAgent = agent(app);
    response = await testAgent
      .post(ROUTE)
      .send({ ...payload, identityToken: '__apple_token_admin__' });
  });

  it('should respond with access and refresh tokens', async () => {
    const body: AuthBody<SignInBody> = {
      success: true,
      id: ADMIN_ID,
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      isNew: false,
    };
    expect(response).toMatchObject({
      status: 200,
      body,
    });
  });

  it('should not create new user and login', async () => {
    const [usersAfter, accountsAfter] = await countRows(
      false,
      'users',
      'accounts',
    );
    expect(usersAfter - usersBefore).toBe(0);
    expect(accountsAfter - accountsBefore).toBe(0);
  });

  it('should populate koa context with user', async () => {
    const aT = response!.body.accessToken;
    const spyMiddleware = jest.fn();
    app.use(spyMiddleware);
    await agent(app).get('/').set('Authorization', `bearer ${aT}`);
    expect(spyMiddleware.mock.calls[0][0].state.user).toEqual({
      id: ADMIN_ID,
      language: 'en',
      verified: true,
      admin: true,
    });
  });

  it('should not send welcome email', async () => {
    expect(sendWelcome).not.toHaveBeenCalled();
  });
});

describe('fcm tokens', () => {
  it('should create fcm token for new user', async () => {
    const testAgent = agent(app);
    const response = await testAgent.post(ROUTE).send({
      ...payload,
      identityToken: '__apple_token_w_email__',
      fcm_token: '__foo__',
    });
    expect(response.status).toBe(200);
    const [tokens] = await countRows(false, 'fcm_tokens');
    expect(tokens - tokensBefore).toBe(1);
  });

  it('should create fcm token for existing user', async () => {
    const testAgent = agent(app);
    const response = await testAgent.post(ROUTE).send({
      ...payload,
      identityToken: '__apple_token_admin__',
      fcm_token: '__foo__',
    });
    expect(response.status).toBe(200);
    const [tokens] = await countRows(false, 'fcm_tokens');
    expect(tokens - tokensBefore).toBe(1);
  });

  it('should not fail for existing fcm token', async () => {
    const testAgent = agent(app);
    const response = await testAgent.post(ROUTE).send({
      ...payload,
      identityToken: '__apple_token_admin__',
      fcm_token: '__admin_fcm_token__',
    });
    expect(response.status).toBe(200);
    const [tokens] = await countRows(false, 'fcm_tokens');
    expect(tokens - tokensBefore).toBe(0);
  });
});
