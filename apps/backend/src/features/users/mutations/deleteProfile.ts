import type { AuthenticatedMutation } from '../../../apollo/index';
import { ForbiddenError, isAuthenticatedResolver } from '../../../apollo/index';
import { db } from '../../../db/index';
import { synapseClient } from '../../../features/chats/index';

const deleteProfile: AuthenticatedMutation['deleteProfile'] = async (
  _,
  __,
  context,
) => {
  if (context.user.admin) {
    throw new ForbiddenError('not allowed');
  }
  await db().table('users').delete().where({ id: context.user.id });
  // If use has no comments, this will fail
  try {
    await synapseClient.deactivateAccount(context.user.id);
  } catch {}
  return true;
};

export default isAuthenticatedResolver(deleteProfile);
