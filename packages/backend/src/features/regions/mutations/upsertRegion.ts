import { GraphQLFieldResolver } from 'graphql';
import * as Joi from 'joi';
import { isAdminResolver, isInputValidResolver, upsertI18nResolver } from '../../../apollo';
import db from '../../../db';
import { rawUpsert } from '../../../db/rawUpsert';
import { RegionInput, RegionInputSchema } from '../../../ww-commons';

interface UpsertVariables {
  region: RegionInput;
  language?: string;
}

const Schema = Joi.object().keys({
  region: RegionInputSchema,
  language: Joi.string().optional(),
});

const resolver: GraphQLFieldResolver<any, any> = async (root, args: UpsertVariables) => {
  const { region, language } = args;
  const result = await rawUpsert(db(), `SELECT upsert_region('${JSON.stringify(region)}', '${language}')`);
  return result;
};

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) => {
  return isInputValidResolver(Schema).createResolver(upsertI18nResolver(resolver))(root, args, context, info);
};

const upsertRegion = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertRegion;