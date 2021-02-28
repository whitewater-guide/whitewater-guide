import { SocialMediaProvider } from '@whitewater-guide/commons';

import db from '~/db';
import { UserRaw } from '~/features/users';

import { SocialUser } from './types';

export async function storeUser(
  provider: SocialMediaProvider,
  profile: SocialUser,
  language: string,
) {
  let isNew = false;
  let user: UserRaw | null = null;

  if (!user) {
    user = await db()
      .table('accounts')
      .innerJoin('users', 'users.id', 'accounts.user_id')
      .where({
        'accounts.provider': provider,
        'accounts.id': profile.id,
      })
      .first('users.*');
    if (!user && profile.email) {
      user = await db().table('users').where({ email: profile.email }).first();
    }
  }

  // Never logged in, register user
  if (!user) {
    const users = await db()
      .table('users')
      .insert({
        name: profile.displayName,
        email: profile.email,
        avatar: null,
        language,
        editor_settings: { language: 'en' },
        verified: true,
      })
      .returning('*');
    user = users[0] as UserRaw;
    isNew = true;
  }

  const loginKeys = {
    user_id: user.id,
    provider,
    id: profile.id,
  };
  const { count } = await db()
    .table('accounts')
    .where(loginKeys)
    .count('id')
    .first();

  // Connect/update social login <-> user association
  if (count === '0') {
    await db()
      .table('accounts')
      .insert({
        ...loginKeys,
        username: profile.username,
        profile: profile.profile ? JSON.stringify(profile.profile) : null,
      });
  } else {
    await db()
      .table('accounts')
      .where(loginKeys)
      .update({
        username: profile.username,
        profile: profile.profile ? JSON.stringify(profile.profile) : null,
      });
  }

  return { isNew, user };
}
