import { AuthResponse, AuthService } from '@whitewater-guide/clients';
import { SignInBody } from '@whitewater-guide/commons';
import { AuthBody } from '../../../../commons/src/auth';
import { fetchMock } from '../../test';
import { MobileAuthService } from './service';
import { tokenStorage } from './tokens';

jest.mock('./tokens');

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

describe('sign in', () => {
  describe('success', () => {
    const ACCESS_TOKEN = '__accessToken__';
    const REFRESH_TOKEN = '__refreshToken__';
    const UID = '__user_id__';
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

    it('should reset apollo cache and call onSignIn', async () => {
      expect(resetApolloCache).toHaveBeenCalledTimes(1);
    });

    it('should save tokens', async () => {
      await expect(tokenStorage.getAccessToken()).resolves.toBe(ACCESS_TOKEN);
      await expect(tokenStorage.getRefreshToken()).resolves.toBe(REFRESH_TOKEN);
    });
  });
});
