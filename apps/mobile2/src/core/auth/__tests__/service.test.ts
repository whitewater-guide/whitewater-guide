import type { AuthResponse, AuthService } from '@whitewater-guide/clients';
import {
  continuouslyAdvanceTimers,
} from '@whitewater-guide/clients/dist/test';
import type {
  AuthBody,
  RefreshBody,
  SignInBody,
} from '@whitewater-guide/commons';

import { fetchMock } from '../../../test';
import { MobileAuthService } from '../service';
import { tokenStorage } from '../tokens';

jest.mock('../tokens');
jest.mock('react-native/Libraries/AppState/AppState', () => ({
  default: {
    currentState: 'active',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

const ACCESS_TOKEN = '__accessToken__';
const REFRESH_TOKEN = '__refreshToken__';

const resetApolloCache = jest.fn().mockResolvedValue({});
const onSignOut = jest.fn();
let service: AuthService;

beforeEach(async () => {
  await tokenStorage.setAccessToken(null);
  await tokenStorage.setRefreshToken(null);
  jest.resetAllMocks();
  fetchMock.mockReset();
  fetchMock.mockGlobal();
  service = new MobileAuthService();
  service.on('sign-in', resetApolloCache);
  service.on('sign-out', onSignOut);
  fetchMock.route('glob:*logout*', 200);
  await service.init();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('refresh access token', () => {
  const SUCCESS: AuthBody<RefreshBody> = {
    success: true,
    id: 'uid',
    accessToken: ACCESS_TOKEN,
    refreshToken: REFRESH_TOKEN,
  };

  it('should fail locally when refresh token is not present', async () => {
    const resp = await service.refreshAccessToken();
    expect(resp).toEqual({
      success: false,
      status: 400,
      error: { jwt: 'refresh_not_found' },
    });
    expect(fetchMock.callHistory.calls()).toHaveLength(0);
  });

  describe('when tokens are present locally', () => {
    beforeEach(async () => {
      await tokenStorage.setAccessToken(ACCESS_TOKEN);
      await tokenStorage.setRefreshToken(REFRESH_TOKEN);
    });

    it('should save accessToken on success', async () => {
      fetchMock.route('end:refresh', SUCCESS);
      await service.refreshAccessToken();
      await expect(tokenStorage.getAccessToken()).resolves.toBe(ACCESS_TOKEN);
    });

    it('should force sign out on 400 refresh error', async () => {
      const signOut = jest.spyOn(service, 'signOut');
      const error: AuthBody<RefreshBody> = {
        success: false,
        error: 'refresh.jwt.bad_token',
        error_id: 'eid',
      };
      fetchMock.route('end:refresh', { status: 400, body: error });
      await service.refreshAccessToken();
      expect(signOut).toHaveBeenCalledWith(true);
      await expect(tokenStorage.getAccessToken()).resolves.toBe(null);
      await expect(tokenStorage.getRefreshToken()).resolves.toBe(null);
    });

    it('should not force sign out on 500 error', async () => {
      const signOut = jest.spyOn(service, 'signOut');
      fetchMock.route('end:refresh', {
        status: 500,
        body: 'Internal server error',
      });
      const resp = await service.refreshAccessToken();
      expect(resp).toEqual({
        success: false,
        error: { form: 'server_error' },
        status: 500,
      });
      expect(signOut).not.toHaveBeenCalled();
      await expect(tokenStorage.getAccessToken()).resolves.toBe(ACCESS_TOKEN);
      await expect(tokenStorage.getRefreshToken()).resolves.toBe(REFRESH_TOKEN);
    });

    it('should not force sign out on network error', async () => {
      const signOut = jest.spyOn(service, 'signOut');
      fetchMock.route('end:refresh', { throws: new Error('network error') });
      const cancelAdvance = continuouslyAdvanceTimers();
      const resp = await service.refreshAccessToken();
      cancelAdvance();
      expect(resp).toEqual({
        success: false,
        error: { form: 'fetch_error', original: expect.any(Error) },
        status: 0,
      });
      expect(signOut).not.toHaveBeenCalled();
      await expect(tokenStorage.getAccessToken()).resolves.toBe(ACCESS_TOKEN);
      await expect(tokenStorage.getRefreshToken()).resolves.toBe(REFRESH_TOKEN);
    });
  });
});

describe('sign in', () => {
  describe('local success', () => {
    const success: AuthBody<SignInBody> = {
      success: true,
      accessToken: ACCESS_TOKEN,
      refreshToken: REFRESH_TOKEN,
      id: '__user_id__',
    };
    let resp: AuthResponse;

    beforeEach(async () => {
      fetchMock.route('end:signin', success);
      resp = await service.signIn('local', {
        email: 'foo',
        password: 'bar',
      });
    });

    it('should sign in locally', () => {
      expect(resp).toEqual({ ...success, status: 200 });
    });

    it('should emit sign-in event', () => {
      expect(resetApolloCache).toHaveBeenCalledTimes(1);
    });

    it('should save tokens', async () => {
      await expect(tokenStorage.getAccessToken()).resolves.toBe(ACCESS_TOKEN);
      await expect(tokenStorage.getRefreshToken()).resolves.toBe(
        REFRESH_TOKEN,
      );
    });
  });

  describe.each([
    [
      'sign in error',
      {
        status: 400,
        body: {
          success: false,
          error: 'signin.errors.email.not_found',
          error_id: 'eid',
        },
      },
    ],
    [
      'server 500 error',
      { status: 500, body: 'Internal server error' },
    ],
    [
      'network error',
      { throws: new Error('network request failed') },
    ],
  ])('%s', (_, mock: any) => {
    let resp: AuthResponse;

    beforeEach(async () => {
      fetchMock.route('end:signin', mock);
      const cancelAdvance = continuouslyAdvanceTimers();
      resp = await service.signIn('local', {
        email: 'foo',
        password: 'bar',
      });
      cancelAdvance();
    });

    it('should not sign in', () => {
      expect(resp.success).toBe(false);
    });

    it('should not emit sign-in event', () => {
      expect(resetApolloCache).not.toHaveBeenCalled();
    });

    it('should not save any tokens', async () => {
      await expect(tokenStorage.getAccessToken()).resolves.toBeNull();
      await expect(tokenStorage.getRefreshToken()).resolves.toBeNull();
    });
  });
});

describe('sign out', () => {
  it('should clear tokens and emit event', async () => {
    await tokenStorage.setAccessToken(ACCESS_TOKEN);
    await tokenStorage.setRefreshToken(REFRESH_TOKEN);
    await service.signOut();
    await expect(tokenStorage.getAccessToken()).resolves.toBe(null);
    await expect(tokenStorage.getRefreshToken()).resolves.toBe(null);
    expect(onSignOut).toHaveBeenCalled();
  });
});
