import { FacebookProfile } from './types';

export const getMyFacebookProfile = (): Promise<FacebookProfile> =>
  new Promise((resolve) => {
    FB.api('/me?fields=id,name,picture', resolve);
  });
