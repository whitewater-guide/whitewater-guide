import passport from 'passport';
import db from '../db';
import { UserRaw } from '../features/users';

import Koa from 'koa';
import { Strategy as FacebookStrategy } from 'passport-facebook';

async function login(req: Koa.Request, provider: string, profile: passport.Profile, tokens: any) {
  let user: UserRaw | null = null;

  // Logged in. But might be logged in via different service (not facebook)
  const reqUesr = (req as any).user;
  if (reqUesr) {
    user = await db().table('users').where({ id: reqUesr.id }).first();
  }
  // else not logged-in. Authenticate based on Facebook account.

  if (!user) {
    user = await db().table('logins')
      .innerJoin('users', 'users.id', 'logins.user_id')
      .where({ 'logins.provider': provider, 'logins.id': profile.id })
      .first('users.*');
    if (!user && profile.emails && profile.emails.length && profile.emails[0]) {
      user = await db().table('users').where({ email: profile.emails[0].value }).first();
    }
  }

  // Never logged in, register user
  if (!user) {
    user = (await db().table('users')
      .insert({
        name: profile.displayName,
        email: profile.emails && profile.emails.length ? profile.emails[0].value : null,
        avatar: profile.photos && profile.photos.length ? profile.photos[0].value : null,
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
      profile: JSON.stringify((profile as any)._json), // Facebook stores extra data here
    });
  } else {
    await db().table('logins').where(loginKeys).update({
      username: profile.username,
      tokens: JSON.stringify(tokens),
      profile: JSON.stringify((profile as any)._json),
    });
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
      const user = await login(req as any, 'facebook', profile, { accessToken, refreshToken });
      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);

export default FacebookWebStrategy;
