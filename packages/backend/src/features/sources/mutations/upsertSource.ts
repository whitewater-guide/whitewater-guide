import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { baseResolver, Context, isInputValidResolver, MutationNotAllowedError } from '../../../apollo';
import db, { rawUpsert } from '../../../db';
import { SourceInput, SourceInputSchema } from '../../../ww-commons';

interface Vars {
  source: SourceInput;
}

const Schema = Joi.object().keys({
  source: SourceInputSchema,
});

const resolver: GraphQLFieldResolver<any, Context> = async (root, args: Vars, { language }) => {
  const { source } = args;
  if (source.id) {
    const { enabled } = await db().table('sources').select(['enabled']).where({ id: source.id }).first();
    if (enabled) {
      throw new MutationNotAllowedError({ message: 'Disable source before editing it' });
    }
  }
  return rawUpsert(db(), 'SELECT upsert_source(?, ?)', [source, language]);
};

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: Vars, context, info) => {
  return isInputValidResolver(Schema).createResolver(resolver)(root, args, context, info);
};

const upsertSource = baseResolver.createResolver(
  queryResolver,
);

export default upsertSource;
