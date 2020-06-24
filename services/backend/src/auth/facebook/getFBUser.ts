import db from '~/db';
import { UserRaw } from '~/features/users';
import { LANGUAGES, SocialMediaProvider } from '@whitewater-guide/commons';
import get from 'lodash/get';
import Negotiator from 'negotiator';
// tslint:disable-next-line:no-submodule-imports
import { preferredLanguages } from 'negotiator/lib/language';
import { Profile } from 'passport';

const getFBUser = async (profile: Profile, tokens: any, req: any) => {
  let isNew = false;

  profile.username = `${profile.name!.givenName} ${profile.name!.familyName}`;
  profile.displayName = `${profile.name!.givenName} ${
    profile.name!.familyName
  }`;

  let user: UserRaw | null = null;

  let fbEmail = get(profile, 'emails.0.value', null);
  const fbAvatar = get(profile, 'photos.0.value', null);
  if (fbEmail) {
    fbEmail = fbEmail.toLowerCase();
  }

  // Use fake content-negotiation to determine best language for user based on facebook locale
  // Accept-language uses dashes, facebook uses underscore
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
  // https://developers.facebook.com/docs/internationalization/#locales
  // Make sure that it it is always defined
  const fbLocale = get(profile, '_json.locale');
  const fbLangs = fbLocale
    ? preferredLanguages(`${fbLocale.replace('_', '-')};q=1.0`, LANGUAGES)
    : [];
  // 'Accept-Language' header is the last resort
  const negotiator = new Negotiator(req);
  const languages = [...fbLangs, ...negotiator.languages(LANGUAGES), 'en'];
  // Explicit language passed as param is a first choice
  const qLanguage = get(req, 'query.language');
  const language: string = qLanguage || languages[0];

  if (!user) {
    user = await db()
      .table('accounts')
      .innerJoin('users', 'users.id', 'accounts.user_id')
      .where({
        'accounts.provider': SocialMediaProvider.FACEBOOK,
        'accounts.id': profile.id,
      })
      .first('users.*');
    if (!user && fbEmail) {
      user = await db()
        .table('users')
        .where({ email: fbEmail })
        .first();
    }
  }

  // Never logged in, register user
  if (!user) {
    const users = await db()
      .table('users')
      .insert({
        name: profile.displayName,
        email: fbEmail,
        avatar: null,
        language,
        editor_settings: { language: 'en' },
        verified: true,
      })
      .returning('*');
    user = users[0];
    isNew = true;
  }

  const loginKeys = {
    user_id: user!.id,
    provider: SocialMediaProvider.FACEBOOK,
    id: profile.id,
  };
  const { count } = await db()
    .table('accounts')
    .where(loginKeys)
    .count('id')
    .first();

  // Connect/update facebook login <-> user association
  if (count === '0') {
    await db()
      .table('accounts')
      .insert({
        ...loginKeys,
        username: profile.username,
        tokens: JSON.stringify(tokens),
        profile: JSON.stringify(profile._json), // Facebook stores extra data here
      });
  } else {
    await db()
      .table('accounts')
      .where(loginKeys)
      .update({
        username: profile.username,
        tokens: JSON.stringify(tokens),
        profile: JSON.stringify(profile._json),
      });
  }

  return { isNew, user };
};

export default getFBUser;
