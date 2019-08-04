import { isAuthenticatedResolver, TopLevelResolver } from '@apollo';
import db from '@db';

interface Vars {
  token: string;
}

const removeFCMToken: TopLevelResolver<Vars> = async (
  root,
  { token },
  { user },
) => {
  await db()
    .delete()
    .from('fcm_tokens')
    .where({ user_id: user!.id, token });
  return true;
};

export default isAuthenticatedResolver(removeFCMToken);
