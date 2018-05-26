import { FBSDK } from './types';

const FB_ELEMENT_ID = 'facebook-jssdk';

const loadFacebookSDK = (appId: string): Promise<FBSDK> => {

  return new Promise(resolve => {
    if (document.getElementById(FB_ELEMENT_ID)) {
      return resolve(FB);
    }

    window.fbAsyncInit = () => {
      FB.init({
        appId,
        version: 'v3.0',
        xfbml: false,
      });
      resolve(FB);
    };

    const fjs = document.getElementsByTagName('script')[0];
    const js = document.createElement('script');
    js.id = FB_ELEMENT_ID;
    js.src = 'https://connect.facebook.net/ru_RU/sdk.js';
    fjs.parentNode!.insertBefore(js, fjs);
  });
};

export default loadFacebookSDK;
