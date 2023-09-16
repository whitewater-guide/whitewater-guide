import type { MutationUpdateProfileArgs } from '@whitewater-guide/schema';
import { UserInputSchema } from '@whitewater-guide/schema';
import { pickBy } from 'lodash';
import type { ObjectSchema } from 'yup';
import { object } from 'yup';

import type { MutationResolvers } from '../../../apollo/index';
import {
  AuthenticationError,
  isInputValidResolver,
} from '../../../apollo/index';
import { db } from '../../../db/index';

const Schema: ObjectSchema<MutationUpdateProfileArgs> = object({
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
