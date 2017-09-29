import { GraphQLFieldResolver } from 'graphql';
// tslint:disable:variable-name
import { isAdminResolver, isInputValidResolver } from '../../../apollo';
import db from '../../../db';
import { rawUpsert } from '../../../db/rawUpsert';
import { RegionInput, RegionInputSchema } from '../../../ww-commons';

interface UpsertVariables {
  region: RegionInput;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, region: RegionInput) => {
  const result = await rawUpsert(db(), `SELECT upsert_region('${JSON.stringify(region)}', 'en')`);
  // console.log(result);
  return result;
};

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) => {
  const { region } = args;
  return isInputValidResolver(RegionInputSchema).createResolver(resolver)(root, region, context, info);
};

const upsertRegion = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertRegion;
