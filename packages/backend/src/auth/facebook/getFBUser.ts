import { LANGUAGES, SocialMediaProvider } from '@whitewater-guide/commons';
import get from 'lodash/get';
import { preferredLanguages } from 'negotiator/lib/language';
import { Profile } from 'passport';

import { negotiateLanguage, storeUser } from '../social';

const getFBUser = async (profile: Profile, req: any) => {
  // Use fake content-negotiation to determine best language for user based on facebook locale
  // Accept-language uses dashes, facebook uses underscore
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
  // https://developers.facebook.com/docs/internationalization/#locales
  // Make sure that it it is always defined
  const fbLocale = get(profile, '_json.locale');
  const fbLangs = fbLocale
    ? preferredLanguages(`${fbLocale.replace('_', '-')};q=1.0`, LANGUAGES)
    : [];
  const language = negotiateLanguage(req, fbLangs);

  const username = `${profile.name?.givenName} ${profile.name?.familyName}`;
  return storeUser(
    SocialMediaProvider.FACEBOOK,
    {
      id: profile.id,
      email: profile.emails?.[0]?.value?.toLowerCase() ?? null,
      username,
      displayName: username,
      profile: profile._json,
    },
    language,
  );
};

export default getFBUser;
