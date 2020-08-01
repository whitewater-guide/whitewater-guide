import { DescentInput, DescentInputSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';
import {
  isAuthenticatedResolver,
  isInputValidResolver,
  TopLevelResolver,
} from '~/apollo';
import db from '~/db';
import { ForbiddenError } from 'apollo-server';

interface Vars {
  descent: DescentInput;
  shareToken?: string | null;
}

const Struct = yup.object({
  descent: DescentInputSchema.clone(),
  shareToken: yup
    .string()
    .notRequired()
    .nullable(true),
});

const resolver: TopLevelResolver<Vars> = async (
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
    if (old?.user_id !== user?.id) {
      throw new ForbiddenError('unauthorized');
    }
  }

  return dataSources?.descents.upsert(descent, shareToken);
};

const upsertDescent = isInputValidResolver(
  Struct,
  isAuthenticatedResolver(resolver),
);

export default upsertDescent;
