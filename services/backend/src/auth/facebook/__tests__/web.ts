import { holdTransaction, rollbackTransaction } from '~/db';
import { redis } from '~/redis';
import {
  ADMIN_FB_PROFILE,
  ADMIN_ID,
  NEW_FB_PROFILE,
} from '~/seeds/test/01_users';
import { countRows, UUID_REGEX } from '~/test';
import { AuthBody, SignInBody } from '@whitewater-guide/commons';
import { CookieAccessInfo } from 'cookiejar';
import Koa from 'koa';
import FacebookTokenStrategy from 'passport-facebook-token';
import superagent from 'superagent';
import { SuperTest, Test } from 'supertest';
import agent from 'supertest-koa-agent';
import { createApp } from '../../../app';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../../constants';
import { MailType, sendMail } from '../../mail';

jest.mock('../../mail');
const ROUTE = '/auth/facebook/signin?web=true&';

let app: Koa;

let usersBefore: number;
let accountsBefore: number;

beforeAll(async () => {
  [usersBefore, accountsBefore] = await countRows(true, 'users', 'accounts');
});

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

describe('new user', () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, NEW_FB_PROFILE);
      });
    response = null;
    testAgent = agent(app);
    response = await testAgent.get(`${ROUTE}access_token=__new_access_token__`);
  });

  it('should respond with access and refresh tokens in cookies', async () => {
    const atCookie = testAgent.jar.getCookie(
      ACCESS_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    const rtCookie = testAgent.jar.getCookie(
      REFRESH_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    expect(atCookie.value).toBeTruthy();
    expect(rtCookie.value).toBeTruthy();
  });

  it('should respond id and isNew in body', async () => {
    const body: AuthBody<SignInBody> = {
      success: true,
      id: expect.any(String),
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

  it('should populate koa context with user', async () => {
    const spyMiddleware = jest.fn();
    app.use(spyMiddleware);
    await testAgent.get('/');
    expect(spyMiddleware.mock.calls[0][0].state.user).toEqual({
      id: expect.stringMatching(UUID_REGEX),
      language: 'en',
      verified: true,
      admin: false,
    });
  });

  it('should send welcome email', async () => {
    expect(sendMail).toHaveBeenCalledWith(
      MailType.WELCOME_VERIFIED,
      'new.profile@mail.com',
      {
        user: {
          id: expect.stringMatching(UUID_REGEX),
          name: `${NEW_FB_PROFILE.name!.givenName} ${
            NEW_FB_PROFILE.name!.familyName
          }`,
        },
      },
    );
  });
});

describe('existing user', () => {
  let response: superagent.Response | null = null;
  let testAgent: SuperTest<Test>;

  beforeEach(async () => {
    FacebookTokenStrategy.prototype.userProfile = jest
      .fn()
      .mockImplementationOnce((accessToken: string, done: any) => {
        done(null, ADMIN_FB_PROFILE);
      });
    response = null;
    testAgent = agent(app);
    response = await testAgent.get(
      `${ROUTE}access_token=__existing_access_token__`,
    );
  });

  it('should respond with access and refresh tokens in cookies', async () => {
    const atCookie = testAgent.jar.getCookie(
      ACCESS_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    const rtCookie = testAgent.jar.getCookie(
      REFRESH_TOKEN_COOKIE,
      CookieAccessInfo.All,
    );
    expect(atCookie.value).toBeTruthy();
    expect(rtCookie.value).toBeTruthy();
  });

  it('should respond id and isNew in body', async () => {
    const body: AuthBody<SignInBody> = {
      success: true,
      id: ADMIN_ID,
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
    const spyMiddleware = jest.fn();
    app.use(spyMiddleware);
    await testAgent.get('/');
    expect(spyMiddleware.mock.calls[0][0].state.user).toEqual({
      id: ADMIN_ID,
      language: 'en',
      verified: true,
      admin: true,
    });
  });

  it('should not send welcome email', async () => {
    expect(sendMail).not.toHaveBeenCalled();
  });
});
