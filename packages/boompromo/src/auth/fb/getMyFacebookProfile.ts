import { FacebookProfile } from './types';

const getMyFacebookProfile = (): Promise<FacebookProfile> => new Promise((resolve) => {
  FB.api('/me?fields=id,name,picture', resolve);
});

export default getMyFacebookProfile;
