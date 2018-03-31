import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { Context, isAdminResolver, isInputValidResolver } from '../../../apollo';
import db, { rawUpsert, stringifyJSON } from '../../../db';
import { RegionInput, RegionInputSchema } from '../../../ww-commons';

interface Vars {
  region: RegionInput;
}

const Schema = Joi.object().keys({
  region: RegionInputSchema,
});

const resolver: GraphQLFieldResolver<any, Context> = (root, { region }: Vars, { language }) =>
  rawUpsert(db(), `SELECT upsert_region('${stringifyJSON(region)}', '${language}')`);

const queryResolver = isInputValidResolver(Schema).createResolver(resolver);

const upsertRegion = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertRegion;
