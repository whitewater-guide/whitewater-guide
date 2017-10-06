import { GraphQLFieldResolver } from 'graphql';
import * as Joi from 'joi';
import { isAdminResolver, isInputValidResolver } from '../../../apollo';
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
  const result = await rawUpsert(db(), `SELECT upsert_source('${JSON.stringify(source)}', '${language}')`);
  // console.log(result);
  return result;
};

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) => {
  return isInputValidResolver(Schema).createResolver(resolver)(root, args, context, info);
};

const upsertSource = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertSource;
