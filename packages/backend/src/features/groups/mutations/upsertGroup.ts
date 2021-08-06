import {
  GroupInputSchema,
  MutationUpsertGroupArgs,
} from '@whitewater-guide/schema';
import * as yup from 'yup';

import { isInputValidResolver, MutationResolvers } from '~/apollo';
import { db, rawUpsert } from '~/db';

const Schema: yup.SchemaOf<MutationUpsertGroupArgs> = yup.object({
  group: GroupInputSchema.clone(),
});

const upsertGroup: MutationResolvers['upsertGroup'] = (
  _,
  { group },
  { language },
) => rawUpsert(db(), 'SELECT upsert_group(?, ?)', [group, language]);

export default isInputValidResolver(Schema, upsertGroup);
