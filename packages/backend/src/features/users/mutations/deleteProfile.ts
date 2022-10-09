import { ForbiddenError } from 'apollo-server-koa';

import { AuthenticatedMutation, isAuthenticatedResolver } from '~/apollo';
import { db } from '~/db';
import { synapseClient } from '~/features/chats';

const updateProfile: AuthenticatedMutation['deleteProfile'] = async (
  _,
  __,
  context,
) => {
  if (context.user.admin) {
    throw new ForbiddenError('not allowed');
  }
  await db().table('users').delete().where({ id: context.user.id });
  await synapseClient.deactivateAccount(context.user.id);
  return true;
};

export default isAuthenticatedResolver(updateProfile);
