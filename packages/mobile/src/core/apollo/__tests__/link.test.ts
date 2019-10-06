import { AuthBody, RefreshBody } from '@whitewater-guide/commons';
import { ApolloLink, execute, toPromise } from 'apollo-link';
import gql from 'graphql-tag';
import { sign } from 'jsonwebtoken';
import { LoginManager } from 'react-native-fbsdk';
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
  { expiresIn: 10 }, // 10 seconds
);
const atFreshStored = sign(
  { id: UID },
  JWT_SECRET,
  { expiresIn: 10 }, // 10 seconds
);
const atFreshReturned = sign({ id: UID }, JWT_SECRET, { expiresIn: 20 });
const refreshToken = sign({ id: UID, refresh: true }, JWT_SECRET);
const refreshSuccess: AuthBody<RefreshBody> = {
  success: true,
  accessToken: atFreshReturned,
  id: UID,
};
const refreshFail: AuthBody = {
  success: false,
  error: 'refresh.jwt.bad_token', // e.g. blacklisted
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
  fetchMock.reset();
  fetchMock.mock(/logout/, { data: { success: true } });
  const service = new MobileAuthService(jest.fn(), jest.fn());
  await service.init();
  link = createLink(service);
});

describe('anonymous', () => {
  it('should return data', async () => {
    fetchMock.mock('end:graphql', { data: ANON_RESPONSE });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ANON_RESPONSE });
  });

  it('should not pass authorization header', async () => {
    fetchMock.once('end:graphql', { data: ME_RESPONSE });

    await toPromise(execute(link, { query }));
    expect(fetchMock).not.toHaveProperty(
      'mock.calls.0.1.headers.authorization',
    );
  });

  it('should retry on fetch error', async () => {
    fetchMock
      .once('end:graphql', { throws: new Error('fetch failed') })
      .once('end:graphql', { data: ANON_RESPONSE });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ANON_RESPONSE });
  });

  it('should retry on 500 error', async () => {
    fetchMock
      .once('end:graphql', { status: 500, body: { success: false } })
      .once('end:graphql', { data: ANON_RESPONSE });

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
    fetchMock.once('end:graphql', { data: ME_RESPONSE });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
  });

  it('should pass authorization header', async () => {
    fetchMock.once('end:graphql', { data: ME_RESPONSE });

    await toPromise(execute(link, { query }));
    expect(fetchMock.lastOptions()).toHaveProperty(
      'headers.authorization',
      `Bearer ${atFreshStored}`,
    );
  });

  it('should retry on fetch error', async () => {
    fetchMock
      .once('end:graphql', { throws: new Error('fetch failed') })
      .once('end:graphql', { data: ME_RESPONSE });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
  });

  it('should retry on 500 error', async () => {
    fetchMock
      .once('end:graphql', { status: 500, body: { success: false } })
      .once('end:graphql', { data: ME_RESPONSE });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
  });
});

describe('token expired locally', () => {
  beforeEach(async () => {
    await tokenStorage.setAccessToken(atExpired);
    await tokenStorage.setRefreshToken(refreshToken);
  });

  it('should refresh access token data', async () => {
    fetchMock
      .once('end:refresh', refreshSuccess)
      .once('end:graphql', { data: ME_RESPONSE });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
    // refresh then query
    expect(fetchMock.calls()).toHaveLength(2);
  });

  it('should force sign out if refresh fails', async () => {
    fetchMock.mock('end:refresh', { status: 400, body: refreshFail });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).rejects.toMatchObject({
      name: 'ServerError',
      statusCode: 400,
      result: {
        error: {
          jwt: 'bad_token',
        },
        success: false,
      },
    });
    // refresh and do not query afterwards
    expect(fetchMock.calls()).toHaveLength(2);
    expect(fetchMock.calls()[0][0]).toEqual(expect.stringContaining('refresh'));
    expect(fetchMock.calls()[1][0]).toEqual(expect.stringContaining('logout'));
    expect(LoginManager.logOut).toHaveBeenCalled();
  });

  it('should clear tokens on force sign out', async () => {
    fetchMock.mock('end:refresh', { status: 400, body: refreshFail });

    await toPromise(execute(link, { query })).catch(() => {});
    await expect(tokenStorage.getAccessToken()).resolves.toBeNull();
    await expect(tokenStorage.getRefreshToken()).resolves.toBeNull();
  });

  it('should queue graphql requests until token is refreshed', async () => {
    fetchMock
      .mock(
        'end:refresh',
        new Promise((resolve) => setTimeout(() => resolve(refreshSuccess), 50)),
      )
      .mock('end:graphql', { data: ME_RESPONSE });

    const result = await Promise.all([
      toPromise(execute(link, { query })),
      toPromise(execute(link, { query })),
    ]);
    // refresh, then 2 queries
    expect(fetchMock.calls()).toHaveLength(3);
    expect(result).toEqual([{ data: ME_RESPONSE }, { data: ME_RESPONSE }]);
  });

  it('should refetch and retry', async () => {
    fetchMock
      .once('end:refresh', refreshSuccess)
      .once('end:graphql', { body: { success: false }, status: 500 })
      .once('end:graphql', { data: ME_RESPONSE });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
    // refresh, failed query, successful query
    expect(fetchMock.calls()).toHaveLength(3);
  });

  it('should perform next requests with new token', async () => {
    fetchMock
      .mock(
        'end:refresh',
        new Promise((resolve) => setTimeout(() => resolve(refreshSuccess), 50)),
      )
      .once('end:graphql', { data: ME_RESPONSE })
      .once('end:graphql', { data: ME_RESPONSE });

    await Promise.all([
      toPromise(execute(link, { query })),
      toPromise(execute(link, { query })),
    ]);
    // refresh, then 2 queries
    expect(fetchMock.lastOptions()).toHaveProperty(
      'headers.authorization',
      `Bearer ${atFreshReturned}`,
    );
  });
});

describe('token expired remotely', () => {
  beforeEach(async () => {
    await tokenStorage.setAccessToken(atFreshStored);
    await tokenStorage.setRefreshToken(refreshToken);
    fetchMock.once('end:graphql', { body: respExpired, status: 401 });
  });

  it('should refresh access token data', async () => {
    fetchMock
      .once('end:refresh', refreshSuccess)
      .once('end:graphql', { data: ME_RESPONSE });

    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
    // failed query, refresh, successful query
    expect(fetchMock.calls()).toHaveLength(3);
  });
});

describe('bad local token', () => {
  beforeEach(async () => {
    await tokenStorage.setAccessToken(atFreshStored);
    await tokenStorage.setRefreshToken(refreshToken);
    fetchMock.once('end:graphql', { body: respUnauthenticated, status: 401 });
  });

  it('should force sign out if graphql request fails on authentication', async () => {
    const promise = toPromise(execute(link, { query }));
    await expect(promise).rejects.toMatchObject({
      name: 'ServerError',
      statusCode: 401,
      result: {
        error: 'refresh.jwt.unauthenticated',
        success: false,
      },
    });
    // graphql fails fatally -> do not refresh
    expect(fetchMock.calls()).toHaveLength(2);
    expect(fetchMock.calls()[0][0]).toEqual(expect.stringContaining('graphql'));
    expect(fetchMock.calls()[1][0]).toEqual(expect.stringContaining('logout'));
    expect(LoginManager.logOut).toHaveBeenCalled();
  });

  it('should clear tokens if graphql request fails on authentication', async () => {
    await toPromise(execute(link, { query })).catch(() => {});
    await expect(tokenStorage.getAccessToken()).resolves.toBeNull();
    await expect(tokenStorage.getRefreshToken()).resolves.toBeNull();
  });
});
