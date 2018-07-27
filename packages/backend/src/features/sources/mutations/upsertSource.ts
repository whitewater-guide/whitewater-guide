import { baseResolver, isInputValidResolver, MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { SourceInput, SourceInputSchema } from '@ww-commons';
import Joi from 'joi';

interface Vars {
  source: SourceInput;
}

const Schema = Joi.object().keys({
  source: SourceInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (root, args, { language }) => {
  const { source } = args;
  if (source.id) {
    const { enabled } = await db().table('sources').select(['enabled']).where({ id: source.id }).first();
    if (enabled) {
      throw new MutationNotAllowedError({ message: 'Disable source before editing it' });
    }
  }
  return rawUpsert(db(), 'SELECT upsert_source(?, ?)', [source, language]);
};

const queryResolver = isInputValidResolver(Schema).createResolver(resolver);

const upsertSource = baseResolver.createResolver(
  queryResolver,
);

export default upsertSource;
