import Knex from 'knex';

export const BLACKLISTED_REFRESH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJlZDU5OTkwLTc0OWQtMTFlNy04Y2Y3LWE2MDA2YWQzZGJhMCIsInJlZnJlc2giOnRydWUsImlhdCI6MTU1MjQwNTM4NX0.TjbL4gcNjU89yY_sWJCn1aYxYDG7lXuE9qiQVvp7Xw0';

export async function seed(db: Knex) {
  await db.table('tokens_blacklist').del();
  await db.table('tokens_blacklist').insert({
    token: BLACKLISTED_REFRESH_TOKEN,
  });
}
