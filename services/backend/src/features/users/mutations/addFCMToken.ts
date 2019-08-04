import { isAuthenticatedResolver, TopLevelResolver } from '@apollo';
import db from '@db';

interface Vars {
  token: string;
}

const addFCMToken: TopLevelResolver<Vars> = async (
  root,
  { token },
  { user },
) => {
  const query = db()
    .insert({ user_id: user!.id, token })
    .into('fcm_tokens')
    .toString();
  await db().raw(`${query} ON CONFLICT DO NOTHING`);
  return true;
};

export default isAuthenticatedResolver(addFCMToken);
