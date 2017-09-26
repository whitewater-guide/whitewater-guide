import { GraphQLFieldResolver } from 'graphql';
// tslint:disable:variable-name
import { isAdminResolver, isInputValidResolver } from '../../../apollo';
import db from '../../../db';
import { RegionInput, RegionInputSchema } from '../../../ww-commons';
import upsertRegionSql from './upsertRegionSql';
import { rawUpsert } from '../../../db/rawUpsert';

interface UpsertVariables {
  region: RegionInput;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, region: RegionInput) => {
  const result = await rawUpsert(db(), `SELECT upsert_region('${JSON.stringify(region)}')`);
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
