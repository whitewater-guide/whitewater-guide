import { CookieAccessInfo } from 'cookiejar';
import type Koa from 'koa';
import type superagent from 'superagent';
import type { SuperTest, Test } from 'supertest';

import { createApp } from '../../../app';
import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import { sendMail } from '../../../mail/index';
import { countRows, koaTestAgent } from '../../../test/index';
import { UUID_REGEX } from '../../../utils/index';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../../constants';

jest.mock('../../../mail');

const ROUTE = '/auth/local/signup';

let app: Koa;

let usersBefore: number;
let accountsBefore: number;

beforeAll(async () => {
  [usersBefore, accountsBefore] = await countRows(true, 'users', 'accounts');
});

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
  app = createApp();
});

afterEach(async () => {
  await rollbackTransaction();
});

describe('errors', () => {
  it('should fail if password is missing', async () => {
    const resp = await koaTestAgent(app).post(ROUTE).send({
      email: 'foo@bar.com',
      password: '',
      name: 'Foo Bar',
    });
    expect(resp).toMatchObject({
      status: 401,
      body: {
        error: 'signup.errors.email.missing',
      },
    });
  });

  it('should fail if email is unavailable', async () => {
    const resp = await koaTestAgent(app).post(ROUTE).send({
      email: 'fish.munga@yandex.ru',
      password: 'qwErty__u1',
      name: 'Foo Bar',
    });
    expect(resp).toMatchObject({
      status: 401,
      body: {
        error: 'signup.errors.email.unavailable',
      },
    });
  });

  it('should fail if email is invalid', async () => {
    const resp = await koaTestAgent(app).post(ROUTE).send({
      email: 'fish.munga@yandex',
      password: 'qwErty__u1',
      name: 'Foo Bar',
    });
    expect(resp).toMatchObject({
      status: 401,
      body: {
        error: 'signup.errors.email.invalid',
      },
    });
  });

  it('should fail if the password is too weak', async () => {
    const resp = await koaTestAgent(app).post(ROUTE).send({
      email: 'foo@bar.com',
      password: '123',
      name: 'Foo Bar',
    });
    expect(resp).toMatchObject({
      status: 401,
      body: {
        error: 'signup.errors.password.weak',
      },
    });
  });
});

describe('mobile', () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    response = null;
    testAgent = koaTestAgent(app);
    response = await testAgent.post(ROUTE).send({
      email: 'foo@bar.com',
      password: 'L0ng___p@ssW0rD',
      name: 'Foo Bar',
    });
  });

  it('should create a new user', async () => {
    const [usersAfter, accountsAfter] = await countRows(
      false,
      'users',
      'accounts',
    );
    expect(usersAfter - usersBefore).toBe(1);
    expect(accountsAfter - accountsBefore).toBe(0);
  });

  it('should create NOT verified user', async () => {
    const { id } = response!.body;
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id })
      .first();
    expect(user).toMatchObject({
      email: 'foo@bar.com',
      verified: false,
    });
  });

  it('should save signup data', async () => {
    const dbUser = await db(false)
      .select('*')
      .from('users')
      .orderBy('created_at', 'DESC')
      .first();
    expect(dbUser).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      name: 'Foo Bar',
      avatar: null,
      email: 'foo@bar.com',
      admin: false,
      language: 'en',
      imperial: false,
      editor_settings: null,

      password: expect.any(String),
      verified: false,
      tokens: [
        {
          claim: 'verification',
          expires: expect.any(Number),
          value: expect.any(String),
        },
      ],
    });
  });

  it('should respond with access and refresh tokens', () => {
    const body = {
      success: true,
      id: expect.stringMatching(UUID_REGEX),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    };
    expect(response).toMatchObject({
      status: 200,
      body,
    });
  });

  it('should populate koa context with user', async () => {
    const aT = response!.body.accessToken;
    const spyMiddleware = jest.fn();
    app.use(spyMiddleware);
    await koaTestAgent(app).get('/').set('Authorization', `bearer ${aT}`);
    expect(spyMiddleware.mock.calls[0][0].state.user).toEqual({
      id: expect.stringMatching(UUID_REGEX),
      language: 'en',
      verified: false,
      admin: false,
    });
  });

  it('should send welcome email', () => {
    expect(sendMail).toHaveBeenCalledWith('welcome-unverified', 'foo@bar.com', {
      user: {
        id: expect.stringMatching(UUID_REGEX),
        name: 'Foo Bar',
      },
      token: {
        raw: expect.any(String),
        encrypted: expect.any(String),
        expires: expect.any(Number),
      },
    });
  });
});

describe('web', () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    response = null;
    testAgent = koaTestAgent(app);
    response = await testAgent.post(ROUTE).send({
      email: 'FOO@bar.com',
      password: 'L0ng___p@ssW0rD',
      name: 'Foo Bar',
      web: true,
    });
  });

  it('should respond with success body', () => {
    const body = {
      success: true,
      id: expect.stringMatching(UUID_REGEX),
    };
    expect(response).toMatchObject({
      status: 200,
      body,
    });
    expect(response!.body).not.toHaveProperty('accessToken');
    expect(response!.body).not.toHaveProperty('refreshToken');
  });

  it('should respond with access and refresh tokens in cookies', () => {
    const atCookie = testAgent.jar.getCookie(
      ACCESS_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    const rtCookie = testAgent.jar.getCookie(
      REFRESH_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    expect(atCookie?.value).toBeTruthy();
    expect(rtCookie?.value).toBeTruthy();
  });

  it('should populate koa context with user', async () => {
    const spyMiddleware = jest.fn();
    app.use(spyMiddleware);
    await testAgent.get('/');
    expect(spyMiddleware.mock.calls[0][0].state.user).toEqual({
      id: expect.stringMatching(UUID_REGEX),
      language: 'en',
      verified: false,
      admin: false,
    });
  });

  it('should send welcome email', () => {
    expect(sendMail).toHaveBeenCalledWith('welcome-unverified', 'foo@bar.com', {
      user: {
        id: expect.stringMatching(UUID_REGEX),
        name: 'Foo Bar',
      },
      token: {
        raw: expect.any(String),
        encrypted: expect.any(String),
        expires: expect.any(Number),
      },
    });
  });
});

describe('other fields', () => {
  it('should save optional fields', async () => {
    const resp = await koaTestAgent(app).post(ROUTE).send({
      email: 'foo@bar.com',
      password: 'L0ng___p@ssW0rD',
      imperial: true,
      language: 'it',
      name: 'Foo Bar',
    });
    const { id } = resp.body;
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id })
      .first();
    expect(user).toMatchObject({
      email: 'foo@bar.com',
      password: expect.any(String),
      imperial: true,
      language: 'it',
      name: 'Foo Bar',
    });
  });

  it('should guess language from header', async () => {
    const resp = await koaTestAgent(app)
      .post(ROUTE)
      .set('Accept-Language', 'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5')
      .send({
        email: 'foo@bar.com',
        password: 'L0ng___p@ssW0rD',
        name: 'Foo Bar',
      });
    const { id } = resp.body;
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id })
      .first();
    expect(user).toHaveProperty('language', 'fr');
  });

  it('should use en for not supported languages (explicit)', async () => {
    const resp = await koaTestAgent(app).post(ROUTE).send({
      email: 'foo@bar.com',
      password: 'L0ng___p@ssW0rD',
      name: 'Foo Bar',
      language: 'ar',
    });
    const { id } = resp.body;
    const user = await db(false)
      .select('*')
      .from('users')
      .where({ id })
      .first();
    expect(user).toHaveProperty('language', 'en');
  });

  it('should save fcm token', async () => {
    const resp = await koaTestAgent(app).post(ROUTE).send({
      email: 'foo@bar.com',
      password: 'L0ng___p@ssW0rD',
      name: 'Foo Bar',
      fcm_token: '__foo__',
    });
    const { id } = resp.body;
    const tokens = await db(false)
      .select('token')
      .from('fcm_tokens')
      .where({ user_id: id });
    expect(tokens).toEqual([{ token: '__foo__' }]);
  });
});
