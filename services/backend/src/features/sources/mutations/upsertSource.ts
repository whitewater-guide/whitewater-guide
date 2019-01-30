import {
  isInputValidResolver,
  MutationNotAllowedError,
  TopLevelResolver,
} from '@apollo';
import db, { rawUpsert } from '@db';
import { SourceInput, SourceInputStruct } from '@whitewater-guide/commons';
import { struct } from 'superstruct';

interface Vars {
  source: SourceInput;
}

const Struct = struct.object({
  source: SourceInputStruct,
});

const resolver: TopLevelResolver<Vars> = async (root, args, { language }) => {
  const { source } = args;
  if (source.id) {
    const { enabled } = await db()
      .table('sources')
      .select(['enabled'])
      .where({ id: source.id })
      .first();
    if (enabled) {
      throw new MutationNotAllowedError('Disable source before editing it');
    }
  }
  return rawUpsert(db(), 'SELECT upsert_source(?, ?)', [source, language]);
};

const upsertSource = isInputValidResolver(Struct, resolver);

export default upsertSource;
