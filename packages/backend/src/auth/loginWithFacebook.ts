import db from '@db';
import { UserRaw } from '@features/users';
import { LANGUAGES } from '@ww-commons';
import { Request } from 'koa';
import get from 'lodash/get';
import { preferredLanguages } from 'negotiator/lib/language';
import { Profile } from 'passport';

const loginWithFacebook = async (req: Request, provider: string, profile: Profile, tokens: any) => {
  profile.username = `${profile.name!.givenName} ${profile.name!.familyName}`;
  profile.displayName = `${profile.name!.givenName} ${profile.name!.familyName}`;

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

  // Logged in. But might be logged in via different service (not facebook)
  // For example user is logged in via mail and want to attach facebook account
  const reqUser = req.user;
  if (reqUser) {
    user = await db().table('users').where({ id: reqUser.id }).first();
  }
  // else not logged-in. Authenticate based on Facebook account.

  if (!user) {
    user = await db().table('logins')
      .innerJoin('users', 'users.id', 'logins.user_id')
      .where({ 'logins.provider': provider, 'logins.id': profile.id })
      .first('users.*');
    if (!user && fbEmail) {
      user = await db().table('users').where({ email: fbEmail }).first();
    }
  }

  // Never logged in, register user
  if (!user) {
    user = (await db().table('users')
      .insert({
        name: profile.displayName,
        email: fbEmail,
        avatar: fbAvatar,
        language,
        editor_settings: { language: 'en' },
      })
      .returning('*'))[0];
  }

  const loginKeys = { user_id: user!.id, provider, id: profile.id };
  const { count } = await db().table('logins').where(loginKeys).count('id').first();

  // Connect/update facebook login <-> user association
  if (count === '0') {
    await db().table('logins').insert({
      ...loginKeys,
      username: profile.username,
      tokens: JSON.stringify(tokens),
      profile: JSON.stringify(profile._json), // Facebook stores extra data here
    });
  } else {
    await db().table('logins').where(loginKeys).update({
      username: profile.username,
      tokens: JSON.stringify(tokens),
      profile: JSON.stringify(profile._json),
    });
  }

  // Set avatar if not present
  if (user && !user.avatar && fbAvatar) {
    user.avatar = fbAvatar;
    await db().table('users').update({ avatar: fbAvatar }).where({ id: user.id });
  }

  return user;
};

export default loginWithFacebook;
