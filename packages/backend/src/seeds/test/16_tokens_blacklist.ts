import jwt from 'jsonwebtoken';
import type { Knex } from 'knex';

import config from '../../config';
import { ADMIN_ID } from './01_users';

export const BLACKLISTED_REFRESH_TOKEN = jwt.sign(
  { id: ADMIN_ID, refresh: true, iat: new Date(2010, 1, 1).valueOf() / 1000 },
  config.REFRESH_TOKEN_SECRET,
);

export async function seed(db: Knex) {
  await db.table('tokens_blacklist').del();
  await db.table('tokens_blacklist').insert({
    token: BLACKLISTED_REFRESH_TOKEN,
  });
}
