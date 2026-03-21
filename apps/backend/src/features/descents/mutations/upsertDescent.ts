import type { MutationUpsertDescentArgs } from '@whitewater-guide/schema';
import { DescentInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import type { AuthenticatedMutation } from '../../../apollo/index';
import {
  ForbiddenError,
  isAuthenticatedResolver,
  isInputValidResolver,
} from '../../../apollo/index';
import { db } from '../../../db/index';

const Schema: ObjectSchema<MutationUpsertDescentArgs> = object({
  descent: DescentInputSchema.clone().required(),
  shareToken: string().notRequired(),
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
