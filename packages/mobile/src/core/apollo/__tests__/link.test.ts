import { AuthPayload } from '@whitewater-guide/commons';
import { execute, toPromise } from 'apollo-link';
import gql from 'graphql-tag';
import { sign } from 'jsonwebtoken';
import fbsdk from 'react-native-fbsdk';
import { MobileAuthService } from '../../auth';
import { tokenStorage } from '../../auth/tokens';
import { createLink } from '../createLink';

jest.mock('../../auth/tokens');
jest.mock('react-native-fbsdk', () => ({
  LoginManager: {
    logOut: jest.fn(),
  },
}));

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
const atFresh = sign(
  { id: UID },
  JWT_SECRET,
  { expiresIn: 10 }, // 10 seconds
);
const refreshToken = sign({ id: UID, refresh: true }, JWT_SECRET);
const refreshSuccess: AuthPayload = {
  success: true,
  accessToken: atFresh,
  id: UID,
};
const refreshFail: AuthPayload = {
  success: false,
  error: 'refresh.jwt.bad.token', // e.g. blacklisted
};
const respExpired: AuthPayload = {
  success: false,
  error: 'jwt.expired',
};
const respUnauthenticated: AuthPayload = {
  success: false,
  error: 'unauthenticated',
};

beforeEach(() => {
  fetchMock.mockClear();
});

describe('anonymous', () => {
  it('should return data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: ANON_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ANON_RESPONSE });
  });

  it('should not pass authorization header', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: ME_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
    await toPromise(execute(link, { query }));
    expect(fetchMock).not.toHaveProperty(
      'mock.calls.0.1.headers.authorization',
    );
  });

  it('should retry on fetch error', async () => {
    fetchMock
      .mockRejectOnce(new Error('fetch failed'))
      .mockResponseOnce(JSON.stringify({ data: ANON_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ANON_RESPONSE });
  });

  it('should retry on 500 error', async () => {
    fetchMock
      .mockResponseOnce(JSON.stringify({ success: false }), { status: 500 })
      .mockResponseOnce(JSON.stringify({ data: ANON_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ANON_RESPONSE });
  });
});

describe('good token', () => {
  beforeEach(async () => {
    await tokenStorage.setAccessToken(atFresh);
    await tokenStorage.setRefreshToken(refreshToken);
  });

  it('should return data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: ME_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
  });

  it('should pass authorization header', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: ME_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
    await toPromise(execute(link, { query }));
    expect(fetchMock).toHaveProperty(
      'mock.calls.0.1.headers.authorization',
      `Bearer ${atFresh}`,
    );
  });

  it('should retry on fetch error', async () => {
    fetchMock
      .mockRejectOnce(new Error('fetch failed'))
      .mockResponseOnce(JSON.stringify({ data: ME_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
  });

  it('should retry on 500 error', async () => {
    fetchMock
      .mockResponseOnce(JSON.stringify({ success: false }), { status: 500 })
      .mockResponseOnce(JSON.stringify({ data: ME_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
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
      .mockResponseOnce(JSON.stringify(refreshSuccess))
      .mockResponseOnce(JSON.stringify({ data: ME_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
    // refresh then query
    expect(fetchMock.mock.calls).toHaveLength(2);
  });

  it('should force sign out if refresh fails', async () => {
    fetchMock.mockResponse(JSON.stringify(refreshFail), { status: 400 });
    const forceSignOut = jest.fn();
    const service = new MobileAuthService();
    service.on('forceSignOut', forceSignOut);
    const link = createLink(service);
    const promise = toPromise(execute(link, { query }));
    await expect(promise).rejects.toMatchObject({
      name: 'ServerError',
      statusCode: 400,
      result: {
        error: 'refresh.jwt.bad.token',
        success: false,
      },
    });
    // refresh and do not query afterwards
    expect(fetchMock.mock.calls).toHaveLength(1);
    expect(forceSignOut).toHaveBeenCalled();
  });

  it('should clear tokens on force sign out', async () => {
    fetchMock.mockResponse(JSON.stringify(refreshFail), { status: 400 });
    const forceSignOut = jest.fn();
    const service = new MobileAuthService();
    service.on('forceSignOut', forceSignOut);
    const link = createLink(service);
    await toPromise(execute(link, { query })).catch(() => {});
    await expect(tokenStorage.getAccessToken()).resolves.toBeNull();
    await expect(tokenStorage.getRefreshToken()).resolves.toBeNull();
  });

  it('should queue graphql requests until token is refreshed', async () => {
    fetchMock
      .mockResponseOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ body: JSON.stringify(refreshSuccess) }),
              50,
            ),
          ),
      )
      .mockResponseOnce(JSON.stringify({ data: ME_RESPONSE }))
      .mockResponseOnce(JSON.stringify({ data: ME_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
    const result = await Promise.all([
      toPromise(execute(link, { query })),
      toPromise(execute(link, { query })),
    ]);
    // refresh, then 2 queries
    expect(fetchMock.mock.calls).toHaveLength(3);
    expect(result).toEqual([{ data: ME_RESPONSE }, { data: ME_RESPONSE }]);
  });

  it('should refetch and retry', async () => {
    fetchMock
      .mockResponseOnce(JSON.stringify(refreshSuccess))
      .mockResponseOnce(JSON.stringify({ success: false }), { status: 500 })
      .mockResponseOnce(JSON.stringify({ data: ME_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
    // refresh, failed query, successful query
    expect(fetchMock.mock.calls).toHaveLength(3);
  });
});

describe('token expired remotely', () => {
  beforeEach(async () => {
    await tokenStorage.setAccessToken(atFresh);
    await tokenStorage.setRefreshToken(refreshToken);
    fetchMock.mockResponseOnce(JSON.stringify(respExpired), { status: 401 });
  });

  it('should refresh access token data', async () => {
    fetchMock
      .mockResponseOnce(JSON.stringify(refreshSuccess))
      .mockResponseOnce(JSON.stringify({ data: ME_RESPONSE }));
    const service = new MobileAuthService();
    const link = createLink(service);
    const promise = toPromise(execute(link, { query }));
    await expect(promise).resolves.toEqual({ data: ME_RESPONSE });
    // failed query, refresh, successful query
    expect(fetchMock.mock.calls).toHaveLength(3);
  });
});

describe('bad local token', () => {
  beforeEach(async () => {
    await tokenStorage.setAccessToken(atFresh);
    await tokenStorage.setRefreshToken(refreshToken);
    fetchMock.mockResponseOnce(JSON.stringify(respUnauthenticated), {
      status: 401,
    });
  });

  it('should force sign out if graphql request fails on authentication', async (done) => {
    // link chain doesn't wait for forceSignOut event handlers, so we use 'done'
    const forceSignOut = jest.fn(() => done());
    const service = new MobileAuthService();
    service.on('forceSignOut', forceSignOut);
    const link = createLink(service);
    const promise = toPromise(execute(link, { query }));
    await expect(promise).rejects.toMatchObject({
      name: 'ServerError',
      statusCode: 401,
      result: {
        error: 'unauthenticated',
        success: false,
      },
    });
    // graphql fails fatally -> do not refresh
    expect(fetchMock.mock.calls).toHaveLength(1);
    expect(forceSignOut).toHaveBeenCalled();
  });

  it('should clear tokens if graphql request fails on authentication', async () => {
    const link = createLink(new MobileAuthService());
    await toPromise(execute(link, { query })).catch(() => {});
    await expect(tokenStorage.getAccessToken()).resolves.toBeNull();
    await expect(tokenStorage.getRefreshToken()).resolves.toBeNull();
  });
});
