import {
  MutationUpsertTagArgs,
  TagInputSchema,
} from '@whitewater-guide/schema';
import * as yup from 'yup';

import { isInputValidResolver, MutationResolvers } from '~/apollo';
import { db, rawUpsert } from '~/db';

const Struct: yup.SchemaOf<MutationUpsertTagArgs> = yup.object({
  tag: TagInputSchema.clone(),
});

const upsertTag: MutationResolvers['upsertTag'] = (_, { tag }, { language }) =>
  rawUpsert(db(), 'SELECT upsert_tag(?, ?)', [tag, language]);

export default isInputValidResolver(Struct, upsertTag);
