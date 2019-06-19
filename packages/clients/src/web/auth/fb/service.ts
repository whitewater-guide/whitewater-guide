import { callWithTimeout } from '../../../utils';
import { FacebookProfile, FBSDK } from './types';

const FB_ELEMENT_ID = 'facebook-jssdk';

// In dev environment some promises fb api callbacks are never called, hence timeouts
export const fbWebService = {
  getLoginStatus: (roundtrip?: boolean): Promise<facebook.StatusResponse> =>
    callWithTimeout(
      () =>
        new Promise((resolve) => {
          FB.getLoginStatus(resolve, roundtrip);
        }),
      1000,
    ),
  getMyProfile: (): Promise<FacebookProfile> =>
    new Promise((resolve) => {
      FB.api('/me?fields=id,name,picture', resolve);
    }),
  loadSDK: (appId: string, locale: string): Promise<FBSDK> => {
    return new Promise((resolve) => {
      if (document.getElementById(FB_ELEMENT_ID)) {
        return resolve(FB);
      }

      window.fbAsyncInit = () => {
        FB.init({
          appId,
          version: 'v3.3',
          xfbml: false,
          autoLogAppEvents: true,
        });
        resolve(FB);
      };

      const fjs = document.getElementsByTagName('script')[0];
      const js = document.createElement('script');
      js.id = FB_ELEMENT_ID;
      js.src = `https://connect.facebook.net/${locale}/sdk.js`;
      fjs.parentNode!.insertBefore(js, fjs);
    });
  },
  login: (): Promise<facebook.StatusResponse> =>
    new Promise((resolve) => {
      FB.login(resolve, { scope: 'public_profile, email' });
    }),
  logout: (): Promise<facebook.StatusResponse> =>
    callWithTimeout(
      () =>
        new Promise((resolve) => {
          FB.logout(resolve);
        }),
      1000,
    ),
};
