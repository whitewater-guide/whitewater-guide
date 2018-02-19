import { GraphQLFieldResolver } from 'graphql';
import * as Joi from 'joi';
import { isAdminResolver, isInputValidResolver, upsertI18nResolver } from '../../../apollo';
import db from '../../../db';
import { rawUpsert } from '../../../db/rawUpsert';
import { RiverInput, RiverInputSchema } from '../../../ww-commons';

interface UpsertVariables {
  river: RiverInput;
  language?: string;
}

const Schema = Joi.object().keys({
  river: RiverInputSchema,
  language: Joi.string().optional(),
});

const resolver: GraphQLFieldResolver<any, any> = async (root, { river, language }: UpsertVariables) =>
  rawUpsert(db(), `SELECT upsert_river('${JSON.stringify(river)}', '${language}')`);

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) => {
  return isInputValidResolver(Schema).createResolver(upsertI18nResolver(resolver))(root, args, context, info);
};

const upsertRiver = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertRiver;