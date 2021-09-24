// eslint-disable-next-line import/default
import messaging from '@react-native-firebase/messaging';
import { AuthResponse, AuthService } from '@whitewater-guide/clients';
import {
  continuouslyAdvanceTimers,
  flushPromises,
} from '@whitewater-guide/clients/dist/test';
import { AuthBody, RefreshBody, SignInBody } from '@whitewater-guide/commons';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

import { fetchMock } from '../../test';
import { MobileAuthService } from './service';
import { tokenStorage } from './tokens';

jest.mock('./tokens');
jest.mock('react-native/Libraries/AppState/AppState', () => ({
  currentState: 'active ',
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

const UID = '__user_id__';
const ACCESS_TOKEN = '__accessToken__';
const REFRESH_TOKEN = '__refreshToken__';

const resetApolloCache = jest.fn().mockResolvedValue({});
const onSignOut = jest.fn();
let service: AuthService;

beforeEach(async () => {
  await tokenStorage.setAccessToken(null);
  await tokenStorage.setRefreshToken(null);
  jest.resetAllMocks();
  fetchMock.reset();
  (AccessToken.getCurrentAccessToken as jest.Mock).mockResolvedValue(null);
  (messaging().hasPermission as jest.Mock).mockResolvedValue(true);
  (messaging().getToken as jest.Mock).mockResolvedValue('__fcm_token__');
  service = new MobileAuthService();
  service.on('sign-in', resetApolloCache);
  service.on('sign-out', onSignOut);
  fetchMock.mock('end:fcm/set', { success: true });
  fetchMock.mock('glob:*logout*', 200);
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
    expect(fetchMock.calls()).toHaveLength(0);
  });

  describe('when tokens are present locally', () => {
    beforeEach(async () => {
      await tokenStorage.setAccessToken(ACCESS_TOKEN);
      await tokenStorage.setRefreshToken(REFRESH_TOKEN);
    });

    it('should save accessToken on success', async () => {
      fetchMock.mock('end:refresh', SUCCESS);
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
      const cancelAdvance = continuouslyAdvanceTimers();
      const promise = service.refreshAccessToken();
      const resp = await promise;
      cancelAdvance();
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

    it('should send fcm token on first refresh', async () => {
      fetchMock.mock('end:refresh', SUCCESS);
      await service.refreshAccessToken();
      await flushPromises(); // because set fcm token is not awaited
      const calls = fetchMock.calls('end:fcm/set');
      expect(calls).toHaveLength(1);
      expect(calls).toHaveProperty(
        '0.1.body',
        JSON.stringify({ fcm_token: '__fcm_token__', old_fcm_token: null }),
      );
      await service.refreshAccessToken();
      await flushPromises();
      expect(fetchMock.calls('end:fcm/set')).toHaveLength(1);
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

      it('should sign in locally', () => {
        expect(resp).toEqual({
          ...success,
          status: 200,
        });
      });

      it('should reset apollo cache', () => {
        expect(resetApolloCache).toHaveBeenCalledTimes(1);
      });

      it('should save tokens', async () => {
        await expect(tokenStorage.getAccessToken()).resolves.toBe(ACCESS_TOKEN);
        await expect(tokenStorage.getRefreshToken()).resolves.toBe(
          REFRESH_TOKEN,
        );
      });

      it('should send fcm token', () => {
        const calls = fetchMock.calls('end:signin');
        expect(JSON.parse(calls[0][1]!.body as any)).toMatchObject({
          fcm_token: '__fcm_token__',
        });
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
        fetchMock.mock('end:signin', mock);
        const promise = service.signIn('local', {
          email: 'foo',
          password: 'bar',
        });
        const cancelAdvance = continuouslyAdvanceTimers();
        resp = await promise;
        cancelAdvance();
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

  describe('facebook', () => {
    describe('success', () => {
      const success: AuthBody<SignInBody> = {
        success: true,
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
        id: UID,
      };
      let resp: AuthResponse | undefined;

      beforeEach(async () => {
        resp = undefined;
        fetchMock.mock('glob:*facebook/signin*', success);
        (LoginManager.logInWithPermissions as jest.Mock).mockResolvedValue({});
        (AccessToken.getCurrentAccessToken as jest.Mock).mockResolvedValue({
          accessToken: '__fb_access_token__',
        });
        const promise = service.signIn('facebook');
        await Promise.resolve().then(() => jest.advanceTimersByTime(5000));
        resp = await promise;
      });

      it('should sign via fb', () => {
        expect(resp).toEqual({
          ...success,
          status: 200,
        });
      });

      it('should reset apollo cache', () => {
        expect(resetApolloCache).toHaveBeenCalledTimes(1);
      });

      it('should save tokens', async () => {
        await expect(tokenStorage.getAccessToken()).resolves.toBe(ACCESS_TOKEN);
        await expect(tokenStorage.getRefreshToken()).resolves.toBe(
          REFRESH_TOKEN,
        );
      });

      it('should send fcm token', () => {
        const calls = fetchMock.calls('glob:*facebook/signin*');
        expect(calls[0][0]).toContain(
          'facebook/signin?access_token=__fb_access_token__&fcm_token=__fcm_token__',
        );
      });
    });

    describe('errors', () => {
      it('should return error when user canceled', async () => {
        (LoginManager.logInWithPermissions as any).mockResolvedValue({
          isCancelled: true,
        });
        const resp = await service.signIn('facebook');
        expect(resp.success).toBe(false);
      });
      it('should not hit backend when user canceled', async () => {
        (LoginManager.logInWithPermissions as any).mockResolvedValue({
          isCancelled: true,
        });
        await service.signIn('facebook');
        expect(fetchMock.calls()).toHaveLength(0);
      });
      it('should not reset cache when user canceled', async () => {
        (LoginManager.logInWithPermissions as any).mockResolvedValue({
          isCancelled: true,
        });
        await service.signIn('facebook');
        expect(resetApolloCache).not.toHaveBeenCalled();
      });

      it('should return fb error', async () => {
        (LoginManager.logInWithPermissions as any).mockResolvedValue({
          error: 'fb_error',
        });
        const resp = await service.signIn('facebook');
        expect(resp).toEqual({
          success: false,
          error: { form: 'fb_error' },
          status: 400,
        });
      });

      it('should return fb error when access token is unavailable', async () => {
        (LoginManager.logInWithPermissions as jest.Mock).mockReturnValue({});
        (AccessToken.getCurrentAccessToken as jest.Mock).mockResolvedValue(
          null,
        );
        const promise = service.signIn('facebook');
        await Promise.resolve().then(() => jest.advanceTimersByTime(2000));
        const resp = await promise;
        expect(resp).toEqual({
          success: false,
          error: { form: 'fb_access_token_not_found' },
          status: 400,
        });
      });
    });
  });
});

describe('fcm tokens', () => {
  it('should send fcm token on logout', async () => {
    await tokenStorage.setAccessToken(ACCESS_TOKEN);
    await tokenStorage.setRefreshToken(REFRESH_TOKEN);
    await service.signOut();
    await flushPromises();
    const calls = fetchMock.calls('glob:*logout*');
    expect(calls[0][0]).toEqual(expect.stringContaining('__fcm_token__'));
  });

  it('should send fcm token on refresh', async () => {
    await tokenStorage.setAccessToken(ACCESS_TOKEN);
    await tokenStorage.setRefreshToken(REFRESH_TOKEN);
    (messaging() as any).emitTokenRefresh('foo');
    await flushPromises();
    const calls = fetchMock.calls('end:fcm/set');
    expect(calls).toHaveLength(1);
    expect(calls[0][1]).toMatchObject({
      body: JSON.stringify({
        fcm_token: 'foo',
        old_fcm_token: '__fcm_token__',
      }),
    });
  });
});
