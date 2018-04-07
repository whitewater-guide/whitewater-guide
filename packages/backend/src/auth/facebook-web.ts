import get from 'lodash/get';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import db from '../db';
import { UserRaw } from '../features/users';

async function login(req: Express.Request, provider: string, profile: passport.Profile, tokens: any) {
  let user: UserRaw | null = null;

  const fbEmail = get(profile, 'emails.0.value', null);
  const fbAvatar = get(profile, 'photos.0.value', null);

  // Logged in. But might be logged in via different service (not facebook)
  const reqUesr = req.user;
  if (reqUesr) {
    user = await db().table('users').where({ id: reqUesr.id }).first();
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
}

const FacebookWebStrategy = new FacebookStrategy(
  {
    clientID: process.env.FB_APP_ID!,
    clientSecret: process.env.FB_SECRET!,
    profileFields: ['name', 'email', 'picture', 'link', 'locale'],
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      profile.username = `${profile.name!.givenName} ${profile.name!.familyName}`;
      profile.displayName = `${profile.name!.givenName} ${profile.name!.familyName}`;
      const user = await login(req, 'facebook', profile, { accessToken, refreshToken });
      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);

export default FacebookWebStrategy;
