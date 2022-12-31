import { LANGUAGES, SocialMediaProvider } from '@whitewater-guide/schema';
import get from 'lodash/get';
import { preferredLanguages } from 'negotiator/lib/language';
import { Profile } from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';

import config from '~/config';
import { sendWelcome } from '~/mail';

import { negotiateLanguage, storeUser } from '../social';

async function getFBUser(profile: Profile, req: any) {
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
      // do not use ??, because we do not want empty string emails
      email: profile.emails?.[0]?.value?.toLowerCase() || null,
      username,
      displayName: username,
      profile: profile._json,
    },
    language,
  );
}

const classicStrategy = new FacebookTokenStrategy(
  {
    clientID: config.FB_APP_ID,
    clientSecret: config.FB_SECRET,
    profileFields: ['name', 'email', 'picture', 'link', 'locale'],
    passReqToCallback: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const { isNew, user } = await getFBUser(profile, req);
      if (user && isNew) {
        await sendWelcome(user);
      }
      done(null, user, { isNew });
    } catch (err) {
      done(err);
    }
  },
);

export default classicStrategy;
