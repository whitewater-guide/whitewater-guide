import type { MutationUpsertSourceArgs } from '@whitewater-guide/schema';
import { SourceInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object } from 'yup';

import type { MutationResolvers } from '../../../apollo/index';
import {
  isInputValidResolver,
  MutationNotAllowedError,
} from '../../../apollo/index';
import { db, rawUpsert } from '../../../db/index';

const Schema: ObjectSchema<MutationUpsertSourceArgs> = object({
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
