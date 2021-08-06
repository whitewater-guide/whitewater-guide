import {
  DescentInputSchema,
  MutationUpsertDescentArgs,
} from '@whitewater-guide/schema';
import { ForbiddenError } from 'apollo-server-koa';
import * as yup from 'yup';

import {
  AuthenticatedMutation,
  isAuthenticatedResolver,
  isInputValidResolver,
} from '~/apollo';
import { db } from '~/db';

const Schema: yup.SchemaOf<MutationUpsertDescentArgs> = yup.object({
  descent: DescentInputSchema.clone(),
  shareToken: yup.string().optional().nullable(true),
});

const resolver: AuthenticatedMutation['upsertDescent'] = async (
  _,
  { descent, shareToken },
  { dataSources, user },
) => {
  if (descent.id) {
    const old = await db()
      .select(['user_id'])
      .from('descents')
      .where({ id: descent.id })
      .first();
    if (old?.user_id !== user.id) {
      throw new ForbiddenError('unauthorized');
    }
  }

  return dataSources?.descents.upsert(descent, shareToken);
};

const upsertDescent = isInputValidResolver(
  Schema,
  isAuthenticatedResolver(resolver),
);

export default upsertDescent;
