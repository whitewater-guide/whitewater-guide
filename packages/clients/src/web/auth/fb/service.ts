import { callWithTimeout } from '../../../utils';
import { FBSDK } from './types';

const FB_ELEMENT_ID = 'facebook-jssdk';
const FB_API_VERSION = 'v3.3';

// In dev environment some promises fb api callbacks are never called, hence timeouts
class FBWebService {
  private _accessToken?: string;

  api = (path: string, params?: any) =>
    new Promise((resolve) => {
      FB.api(path, { access_token: this._accessToken, ...params }, resolve);
    });

  getLoginStatus = (roundtrip?: boolean): Promise<facebook.StatusResponse> =>
    callWithTimeout(
      () =>
        new Promise((resolve) => {
          FB.getLoginStatus(resolve, roundtrip);
        }),
      1000,
    );

  loadSDK = (appId: string, locale: string): Promise<FBSDK> =>
    // eslint-disable-next-line consistent-return
    new Promise((resolve) => {
      if (document.getElementById(FB_ELEMENT_ID)) {
        resolve(FB);
        return;
      }

      window.fbAsyncInit = () => {
        FB.init({
          appId,
          version: FB_API_VERSION,
          xfbml: false,
          autoLogAppEvents: true,
        });
        FB.Event.subscribe(
          'auth.authResponseChange',
          this.onAuthResponseChange,
        );
        resolve(FB);
      };

      const fjs = document.getElementsByTagName('script')[0];
      const js = document.createElement('script');
      js.id = FB_ELEMENT_ID;
      js.src = `https://connect.facebook.net/${locale}/sdk.js`;
      fjs.parentNode?.insertBefore(js, fjs);
    });

  login = (): Promise<facebook.StatusResponse> =>
    new Promise((resolve) => {
      FB.login(resolve, { scope: 'public_profile, email' });
    });

  logout = (): Promise<facebook.StatusResponse> =>
    callWithTimeout(
      () =>
        new Promise((resolve) => {
          FB.logout(resolve);
        }),
      1000,
    );

  onAuthResponseChange = (data: facebook.StatusResponse) => {
    this._accessToken = data.authResponse?.accessToken;
  };
}

export const fbWebService = new FBWebService();
