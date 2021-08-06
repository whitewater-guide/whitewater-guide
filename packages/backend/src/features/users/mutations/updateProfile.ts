import {
  MutationUpdateProfileArgs,
  UserInputSchema,
} from '@whitewater-guide/schema';
import { AuthenticationError } from 'apollo-server-koa';
import pickBy from 'lodash/pickBy';
import * as yup from 'yup';

import { isInputValidResolver, MutationResolvers } from '~/apollo';
import { db } from '~/db';

const Schema: yup.SchemaOf<MutationUpdateProfileArgs> = yup.object({
  user: UserInputSchema.clone(),
});

const updateProfile: MutationResolvers['updateProfile'] = async (
  _,
  { user },
  context,
) => {
  if (!context.user) {
    throw new AuthenticationError('must be authenticated');
  }
  const { email, ...cleanUser } = pickBy(user, (v) => v !== undefined);
  const query = db()
    .table('users')
    .update(cleanUser)
    .where({ id: context.user.id });
  if (email) {
    query.update('email', db().raw(`COALESCE(users.email, ?)`, email));
  }
  await query;
  return db().table('users').where({ id: context.user.id }).first();
};

export default isInputValidResolver(Schema, updateProfile);
