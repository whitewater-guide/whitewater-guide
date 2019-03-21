import db from '@db';
import { UserRaw } from '@features/users';
import { LANGUAGES } from '@whitewater-guide/commons';
import get from 'lodash/get';
// tslint:disable-next-line:no-submodule-imports
import { preferredLanguages } from 'negotiator/lib/language';
import { Profile } from 'passport';

const loginWithFacebook = async (profile: Profile, tokens: any) => {
  profile.username = `${profile.name!.givenName} ${profile.name!.familyName}`;
  profile.displayName = `${profile.name!.givenName} ${
    profile.name!.familyName
  }`;

  let user: UserRaw | null = null;

  const fbEmail = get(profile, 'emails.0.value', null);
  const fbAvatar = get(profile, 'photos.0.value', null);

  // Use fake content-negotiation to determine best language for user based on facebook locale
  // Accept-language uses dashes, facebook uses underscore
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
  // https://developers.facebook.com/docs/internationalization/#locales
  // Make sure that it it is always defined
  const locale = get(profile, '_json.locale', 'en').replace('_', '-');
  const preferred = preferredLanguages(`${locale};q=1.0`, LANGUAGES);
  const languages = [...preferred, 'en'];
  const language: string = languages[0];

  // else not logged-in. Authenticate based on Facebook account.

  if (!user) {
    user = await db()
      .table('accounts')
      .innerJoin('users', 'users.id', 'accounts.user_id')
      .where({ 'accounts.provider': 'facebook', 'accounts.id': profile.id })
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
        avatar: fbAvatar,
        language,
        editor_settings: { language: 'en' },
        verified: true,
      })
      .returning('*');
    user = users[0];
  }

  const loginKeys = { user_id: user!.id, provider: 'facebook', id: profile.id };
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

  // Set avatar if not present
  if (user && !user.avatar && fbAvatar) {
    user.avatar = fbAvatar;
    await db()
      .table('users')
      .update({ avatar: fbAvatar })
      .where({ id: user.id });
  }

  return user;
};

export default loginWithFacebook;
