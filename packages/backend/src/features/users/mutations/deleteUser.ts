import { ForbiddenError, UserInputError } from 'apollo-server-koa';

import { MutationResolvers } from '~/apollo';
import { db, Sql } from '~/db';
import { synapseClient } from '~/features/chats';

const deleteUser: MutationResolvers['deleteUser'] = async (
  _,
  { id, email },
) => {
  if (!id && !email) {
    throw new UserInputError('Either id or email id must be specified');
  }

  const user: Sql.Users | undefined = await db()
    .select('*')
    .from('users')
    .where(id ? { id } : { email })
    .first();
  if (!user) {
    throw new UserInputError('not found');
  }

  if (user.admin) {
    throw new ForbiddenError('not allowed to delete admin');
  }

  await db().table('users').delete().where({ id: user.id });
  // If use has no comments, this will fail
  try {
    await synapseClient.deactivateAccount(user.id);
  } catch {}

  return true;
};

export default deleteUser;
