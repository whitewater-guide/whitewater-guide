import { GraphQLResolveInfo } from 'graphql';
import * as Knex from 'knex';
import { Context } from '../../apollo';
import { getPrimitives } from '../../db/queryBuilders';
import { Region } from '../../ww-commons';
import graphqlFields = require('graphql-fields');

const customMap = {
  riversCount: () => null,
  sectionsCount: () => null,
};

export const getRegionColumns = (topLevelFields: Array<keyof Region>, context: Context, tableAlias = 'regions_view') =>
  getPrimitives<Region>(topLevelFields, tableAlias, context, [], customMap);

export const buildQuery = (db: Knex, info: GraphQLResolveInfo, context: Context) => {
  let result = db.table('regions_view');
  const fieldsTree = graphqlFields(info);
  const topLevelFields: Array<keyof Region> = Object.keys(fieldsTree) as Array<keyof Region>;
  const primitiveColumns = getRegionColumns(topLevelFields, context);
  result = result.select(primitiveColumns);
  return result;
};
