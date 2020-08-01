import {
  isInputValidResolver,
  MutationNotAllowedError,
  TopLevelResolver,
} from '~/apollo';
import db, { rawUpsert } from '~/db';
import { SourceInput, SourceInputSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';

interface Vars {
  source: SourceInput;
}

const Struct = yup.object({
  source: SourceInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (
  root,
  args,
  { language, dataSources },
) => {
  const { source } = args;
  if (source.id) {
    const enabled = await dataSources.gorge.isSourceEnabled(source.id);
    if (enabled) {
      throw new MutationNotAllowedError('Disable source before editing it');
    }
  }
  return rawUpsert(db(), 'SELECT upsert_source(?, ?)', [source, language]);
};

const upsertSource = isInputValidResolver(Struct, resolver);

export default upsertSource;
