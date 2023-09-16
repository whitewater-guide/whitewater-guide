import type { MutationUpsertGroupArgs } from '@whitewater-guide/schema';
import { GroupInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object } from 'yup';

import type { MutationResolvers } from '../../../apollo/index';
import { isInputValidResolver } from '../../../apollo/index';
import { db, rawUpsert } from '../../../db/index';

const Schema: ObjectSchema<MutationUpsertGroupArgs> = object({
  group: GroupInputSchema.clone().required(),
});

const upsertGroup: MutationResolvers['upsertGroup'] = (
  _,
  { group },
  { language },
) => rawUpsert(db(), 'SELECT upsert_group(?, ?)', [group, language]);

export default isInputValidResolver(Schema, upsertGroup);
