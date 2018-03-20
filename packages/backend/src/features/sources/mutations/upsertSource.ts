import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { isAdminResolver, isInputValidResolver, MutationNotAllowedError } from '../../../apollo';
import db, { rawUpsert } from '../../../db';
import { SourceInput, SourceInputSchema } from '../../../ww-commons';

interface UpsertVariables {
  source: SourceInput;
  language?: string;
}

const Schema = Joi.object().keys({
  source: SourceInputSchema,
  language: Joi.string().optional(),
});

const resolver: GraphQLFieldResolver<any, any> = async (root, args: UpsertVariables) => {
  const { source, language = 'en' } = args;
  if (source.id) {
    const { enabled } = await db().table('sources').select(['enabled']).where({ id: source.id }).first();
    if (enabled) {
      throw new MutationNotAllowedError({ message: 'Disable source before editing it' });
    }
  }
  return rawUpsert(db(), `SELECT upsert_source('${JSON.stringify(source)}', '${language}')`);
};

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) => {
  return isInputValidResolver(Schema).createResolver(resolver)(root, args, context, info);
};

const upsertSource = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertSource;
