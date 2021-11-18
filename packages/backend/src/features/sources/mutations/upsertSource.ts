import {
  MutationUpsertSourceArgs,
  SourceInputSchema,
} from '@whitewater-guide/schema';
import * as yup from 'yup';

import {
  isInputValidResolver,
  MutationNotAllowedError,
  MutationResolvers,
} from '~/apollo';
import { db, rawUpsert } from '~/db';

const Schema: yup.SchemaOf<MutationUpsertSourceArgs> = yup.object({
  source: SourceInputSchema.clone().required(),
});

const upsertSource: MutationResolvers['upsertSource'] = async (
  _,
  { source },
  { language, dataSources },
) => {
  if (source.id) {
    const enabled = await dataSources.gorge.isSourceEnabled(source.id);
    if (enabled) {
      throw new MutationNotAllowedError('Disable source before editing it');
    }
  }
  return rawUpsert(db(), 'SELECT upsert_source(?, ?)', [source, language]);
};

export default isInputValidResolver(Schema, upsertSource);
