import { GraphQLResolveInfo } from 'graphql';
import * as Knex from 'knex';
import { Context } from '../../apollo';
import { getPrimitives } from '../../db';
import { Gauge } from '../../ww-commons';
import graphqlFields = require('graphql-fields');

// Not yet implemented
const customMap = {
  lastTimestamp: () => null,
  lastLevel: () => null,
  lastFlow: () => null,
};

export const getSourceColumns = (topLevelFields: Array<keyof Gauge>, context: Context, tableAlias = 'gauges_view') =>
  getPrimitives<Gauge>(topLevelFields, tableAlias, context, [], customMap);

export const buildQuery = (db: Knex, info: GraphQLResolveInfo, context: Context, id?: string, language = 'en') => {
  let result = db.table('gauges_view');
  const fieldsTree = graphqlFields(info);
  const topLevelFields: Array<keyof Gauge> = Object.keys(fieldsTree) as Array<keyof Gauge>;
  const primitiveColumns = getSourceColumns(topLevelFields, context);
  result = result.select(primitiveColumns);
  result = result.where('gauges_view.language', language);
  if (id) {
    result = result.where('gauges_view.id', id);
  }
  return result;
};
