import type { MutationUpsertTagArgs } from '@whitewater-guide/schema';
import { TagInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object } from 'yup';

import type { MutationResolvers } from '../../../apollo/index';
import { isInputValidResolver } from '../../../apollo/index';
import { db, rawUpsert } from '../../../db/index';

const Struct: ObjectSchema<MutationUpsertTagArgs> = object({
  tag: TagInputSchema.clone(),
});

const upsertTag: MutationResolvers['upsertTag'] = (_, { tag }, { language }) =>
  rawUpsert(db(), 'SELECT upsert_tag(?, ?)', [tag, language]);

export default isInputValidResolver(Struct, upsertTag);
