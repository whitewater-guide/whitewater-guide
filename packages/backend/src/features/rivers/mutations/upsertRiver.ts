import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { Context, isAdminResolver, isInputValidResolver, upsertI18nResolver } from '../../../apollo';
import db, { rawUpsert, stringifyJSON } from '../../../db';
import { RiverInput, RiverInputSchema } from '../../../ww-commons';

interface UpsertVariables {
  river: RiverInput;
  language?: string;
}

const Schema = Joi.object().keys({
  river: RiverInputSchema,
  language: Joi.string().optional(),
});

const resolver: GraphQLFieldResolver<any, any> = async (root, vars: UpsertVariables, { user }: Context) => {
  const { language } = vars;
  const river = { ...vars.river, createdBy: user!.id };
  return rawUpsert(db(), `SELECT upsert_river('${stringifyJSON(river)}', '${language}')`);
};

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) => {
  return isInputValidResolver(Schema).createResolver(upsertI18nResolver(resolver))(root, args, context, info);
};

const upsertRiver = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertRiver;
