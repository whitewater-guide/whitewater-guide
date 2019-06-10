import { AuthResponse, AuthService } from '@whitewater-guide/clients';
import { RefreshBody, SignInBody } from '@whitewater-guide/commons';
import { MockResponse } from 'fetch-mock';
import { AuthBody } from '../../../../commons/src/auth';
import { fetchMock } from '../../test';
import { MobileAuthService } from './service';
import { tokenStorage } from './tokens';

jest.mock('./tokens');

const UID = '__user_id__';
const ACCESS_TOKEN = '__accessToken__';
const REFRESH_TOKEN = '__refreshToken__';

const resetApolloCache = jest.fn();
const onSignOut = jest.fn();
let service: AuthService;

beforeEach(async () => {
  await tokenStorage.setAccessToken(null);
  await tokenStorage.setRefreshToken(null);
  jest.clearAllMocks();
  fetchMock.reset();
  service = new MobileAuthService(resetApolloCache, onSignOut);
  await service.init();
});

describe('refresh access token', () => {
  it('should fail locally when refresh token is not present', async () => {
    const resp = await service.refreshAccessToken();
    expect(resp).toEqual({
      success: false,
      status: 400,
      error: { jwt: 'refresh_not_found' },
    });
    expect(fetchMock.calls()).toHaveLength(0);
  });

  describe('when tokens are present locally', () => {
    beforeEach(async () => {
      await tokenStorage.setAccessToken(ACCESS_TOKEN);
      await tokenStorage.setRefreshToken(REFRESH_TOKEN);
    });

    it('should save accessToken on success', async () => {
      const success: AuthBody<RefreshBody> = {
        success: true,
        id: 'uid',
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
      };
      fetchMock.mock('end:refresh', success);
      await service.refreshAccessToken();
      await expect(tokenStorage.getAccessToken()).resolves.toBe(ACCESS_TOKEN);
    });

    it('should force sign out in case of refresh error', async () => {
      const signOut = jest.spyOn(service, 'signOut');
      const error: AuthBody<RefreshBody> = {
        success: false,
        error: 'refresh.jwt.bad_token',
        error_id: 'eid',
      };
      fetchMock.mock('end:refresh', { status: 400, body: error });
      await service.refreshAccessToken();
      expect(signOut).toHaveBeenCalledWith(true);
      await expect(tokenStorage.getAccessToken()).resolves.toBe(null);
      await expect(tokenStorage.getRefreshToken()).resolves.toBe(null);
    });

    it('should not force sign out in case of 500 error', async () => {
      const signOut = jest.spyOn(service, 'signOut');
      fetchMock.mock('end:refresh', {
        status: 500,
        body: 'Internal server error',
      });
      const resp = await service.refreshAccessToken();
      expect(resp).toEqual({
        success: false,
        error: {
          form: 'server_error',
        },
        status: 500,
      });
      expect(signOut).not.toHaveBeenCalled();
      await expect(tokenStorage.getAccessToken()).resolves.toBe(ACCESS_TOKEN);
      await expect(tokenStorage.getRefreshToken()).resolves.toBe(REFRESH_TOKEN);
    });

    it('should not force sign out in case of network error', async () => {
      const signOut = jest.spyOn(service, 'signOut');
      fetchMock.mock('end:refresh', { throws: new Error('network error') });
      const resp = await service.refreshAccessToken();
      expect(resp).toEqual({
        success: false,
        error: {
          form: 'fetch_error',
        },
        status: 0,
      });
      expect(signOut).not.toHaveBeenCalled();
      await expect(tokenStorage.getAccessToken()).resolves.toBe(ACCESS_TOKEN);
      await expect(tokenStorage.getRefreshToken()).resolves.toBe(REFRESH_TOKEN);
    });
  });
});

describe('sign in', () => {
  describe('local', () => {
    describe('success', () => {
      const success: AuthBody<SignInBody> = {
        success: true,
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
        id: UID,
      };
      let resp: AuthResponse;

      beforeEach(async () => {
        fetchMock.mock('end:signin', success);
        resp = await service.signIn('local', { email: 'foo', password: 'bar' });
      });

      it('should sign in locally', async () => {
        expect(resp).toEqual({
          ...success,
          status: 200,
        });
      });

      it('should reset apollo cache', async () => {
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
        {
          status: 500,
          body: 'Internal server error',
        },
      ],
      [
        'network error',
        {
          throws: new Error('network request failed'),
        },
      ],
    ])('%s', (_, mock: any) => {
      let resp: AuthResponse;

      beforeEach(async () => {
        jest.useFakeTimers();
        fetchMock.mock('end:signin', mock);
        resp = await service.signIn('local', { email: 'foo', password: 'bar' });
        for (let i = 0; i < 18; i++) {
          jest.advanceTimersByTime(1000);
          await Promise.resolve(); // allow any pending jobs in the PromiseJobs queue to run
        }
      });

      it('should not sign in', () => {
        expect(resp.success).toBe(false);
      });

      it('should not reset apollo cache', () => {
        expect(resetApolloCache).not.toHaveBeenCalled();
      });

      it('should not save any tokens', async () => {
        await expect(tokenStorage.getAccessToken()).resolves.toBeNull();
        await expect(tokenStorage.getRefreshToken()).resolves.toBeNull();
      });
    });
  });
});
