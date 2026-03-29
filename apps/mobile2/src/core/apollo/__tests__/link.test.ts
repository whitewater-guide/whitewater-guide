import { toPromise } from '@apollo/client';
import type { ApolloLink } from '@apollo/client/link/core';
import { execute } from '@apollo/client/link/core';
import type { AuthBody, RefreshBody } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { sign } from 'jsonwebtoken';
import noop from 'lodash/noop';

import { fetchMock } from '../../../test';
import { MobileAuthService, tokenStorage } from '../../auth';
import { createLink } from '../createLink';

jest.mock('../../auth/tokens');

const query = gql`
  {
    me {
      id
    }
  }
`;

const JWT_SECRET = '_jwt_secret_';
const UID = '_user_id_';
const ANON_RESPONSE = { me: null };
const ME_RESPONSE = { me: { id: UID } };

const atExpired = sign(
  { id: UID, iat: Date.now() / 1000 - 20 },
  JWT_SECRET,
  { expiresIn: 10 },
);
const atFreshStored = sign({ id: UID }, JWT_SECRET, { expiresIn: 10 });
const atFreshReturned = sign({ id: UID }, JWT_SECRET, { expiresIn: 20 });
const refreshToken = sign({ id: UID, refresh: true }, JWT_SECRET);
const refreshSuccess: AuthBody<RefreshBody> = {
  success: true,
  accessToken: atFreshReturned,
  id: UID,
};
const refreshFail: AuthBody = {
  success: false,
  error: 'refresh.jwt.bad_token',
};
const respExpired: AuthBody = {
  success: false,
  error: 'refresh.jwt.expired',
};
const respUnauthenticated: AuthBody = {
  success: false,
  error: 'refresh.jwt.unauthenticated',
};

let link: ApolloLink;

beforeEach(async () => {
  jest.clearAllMocks();
  fetchMock.mockReset();
  fetchMock.mockGlobal();
  fetchMock.route(/logout/, { data: { success: true } });
  const service = new MobileAuthService();
  await service.init();
  link = createLink(service);
});

describe('anonymous', () => {
  it('should return data', async () => {
    fetchMock.route('end:graphql', { data: ANON_RESPONSE });
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ANON_RESPONSE });
  });

  it('should retry on fetch error', async () => {
    fetchMock
      .route('end:graphql', { throws: new Error('fetch failed') }, { repeat: 1 })
      .route('end:graphql', { data: ANON_RESPONSE }, { name: 'retry-anon' });
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ANON_RESPONSE });
  });

  it('should retry on 500 error', async () => {
    fetchMock
      .route('end:graphql', { status: 500, body: { success: false } }, { repeat: 1 })
      .route('end:graphql', { data: ANON_RESPONSE }, { name: 'retry-500' });
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ANON_RESPONSE });
  });
});

describe('good token', () => {
  beforeEach(async () => {
    await tokenStorage.setAccessToken(atFreshStored);
    await tokenStorage.setRefreshToken(refreshToken);
  });

  it('should return data', async () => {
    fetchMock.route('end:graphql', { data: ME_RESPONSE }, { repeat: 1 });
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
  });

  it('should pass authorization header', async () => {
    fetchMock.route('end:graphql', { data: ME_RESPONSE }, { repeat: 1 });
    await toPromise(execute(link, { query }));
    const lastCall = fetchMock.callHistory.lastCall();
    expect(lastCall?.options?.headers).toHaveProperty(
      'authorization',
      `Bearer ${atFreshStored}`,
    );
  });

  it('should retry on fetch error', async () => {
    fetchMock
      .route('end:graphql', { throws: new Error('fetch failed') }, { repeat: 1 })
      .route('end:graphql', { data: ME_RESPONSE }, { name: 'retry-auth' });
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
  });
});

describe('token expired locally', () => {
  beforeEach(async () => {
    await tokenStorage.setAccessToken(atExpired);
    await tokenStorage.setRefreshToken(refreshToken);
  });

  it('should refresh access token and retry', async () => {
    fetchMock
      .route('end:refresh', refreshSuccess, { repeat: 1 })
      .route('end:graphql', { data: ME_RESPONSE }, { repeat: 1 });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
    const calls = fetchMock.callHistory.calls();
    expect(calls[0].url).toEqual(expect.stringContaining('jwt/refresh'));
    expect(calls[1].url).toEqual(expect.stringContaining('graphql'));
  });

  it('should force sign out if refresh fails', async () => {
    fetchMock.route('end:refresh', { status: 400, body: refreshFail });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).rejects.toMatchObject({
      name: 'ServerError',
      statusCode: 400,
    });
    const calls = fetchMock.callHistory.calls();
    expect(calls[0].url).toEqual(expect.stringContaining('refresh'));
    expect(calls[1].url).toEqual(expect.stringContaining('logout'));
  });

  it('should clear tokens on force sign out', async () => {
    fetchMock.route('end:refresh', { status: 400, body: refreshFail });

    await toPromise(execute(link, { query })).catch(noop);
    await expect(tokenStorage.getAccessToken()).resolves.toBeNull();
    await expect(tokenStorage.getRefreshToken()).resolves.toBeNull();
  });

  it('should queue concurrent requests during refresh', async () => {
    fetchMock
      .route(
        'end:refresh',
        new Promise((resolve) => {
          setTimeout(() => resolve(refreshSuccess), 50);
        }),
      )
      .route('end:graphql', { data: ME_RESPONSE });

    const result = await Promise.all([
      toPromise(execute(link, { query })),
      toPromise(execute(link, { query })),
    ]);
    const calls = fetchMock.callHistory.calls();
    expect(calls[0].url).toEqual(expect.stringContaining('jwt/refresh'));
    expect(calls[1].url).toEqual(expect.stringContaining('graphql'));
    expect(calls[2].url).toEqual(expect.stringContaining('graphql'));
    expect(result).toEqual([{ data: ME_RESPONSE }, { data: ME_RESPONSE }]);
  });

  it('should use new token after refresh', async () => {
    fetchMock
      .route(
        'end:refresh',
        new Promise((resolve) => {
          setTimeout(() => resolve(refreshSuccess), 50);
        }),
      )
      .route('end:graphql', { data: ME_RESPONSE });

    await Promise.all([
      toPromise(execute(link, { query })),
      toPromise(execute(link, { query })),
    ]);
    const lastCall = fetchMock.callHistory.lastCall();
    expect(lastCall?.options?.headers).toHaveProperty(
      'authorization',
      `Bearer ${atFreshReturned}`,
    );
  });
});

describe('token expired remotely (401)', () => {
  beforeEach(async () => {
    await tokenStorage.setAccessToken(atFreshStored);
    await tokenStorage.setRefreshToken(refreshToken);
    fetchMock.route('end:graphql', { body: respExpired, status: 401 }, { repeat: 1 });
  });

  it('should refresh and retry', async () => {
    fetchMock
      .route('end:refresh', refreshSuccess, { repeat: 1 })
      .route('end:graphql', { data: ME_RESPONSE }, { name: 'retry-after-refresh' });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
    const calls = fetchMock.callHistory.calls();
    expect(calls[0].url).toEqual(expect.stringContaining('graphql'));
    expect(calls[1].url).toEqual(expect.stringContaining('jwt/refresh'));
    expect(calls[2].url).toEqual(expect.stringContaining('graphql'));
  });
});

describe('bad token (UNAUTHENTICATED)', () => {
  beforeEach(async () => {
    await tokenStorage.setAccessToken(atFreshStored);
    await tokenStorage.setRefreshToken(refreshToken);
    fetchMock.route('end:graphql', { body: respUnauthenticated, status: 401 }, { repeat: 1 });
  });

  it('should force sign out without refresh', async () => {
    const promise = toPromise(execute(link, { query }));
    await expect(promise).rejects.toMatchObject({
      name: 'ServerError',
      statusCode: 401,
    });
    const calls = fetchMock.callHistory.calls();
    expect(calls[0].url).toEqual(expect.stringContaining('graphql'));
    expect(calls[1].url).toEqual(expect.stringContaining('logout'));
  });

  it('should clear tokens', async () => {
    await toPromise(execute(link, { query })).catch(noop);
    await expect(tokenStorage.getAccessToken()).resolves.toBeNull();
    await expect(tokenStorage.getRefreshToken()).resolves.toBeNull();
  });
});
