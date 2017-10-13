import { GraphQLResolveInfo } from 'graphql';
import * as Knex from 'knex';
import { Context } from '../../apollo';
import { getPrimitives } from '../../db/queryBuilders';
import { Source } from '../../ww-commons';
import graphqlFields = require('graphql-fields');
import { getRegionColumns } from '../regions';

export const getSourceColumns = (topLevelFields: Array<keyof Source>, context: Context, tableAlias = 'sources_view') =>
  getPrimitives<Source>(topLevelFields, tableAlias, context, ['regions', 'gauges']);

export const buildQuery = (db: Knex, info: GraphQLResolveInfo, context: Context, id?: string, language = 'en') => {
  let result = db.table('sources_view');
  const fieldsTree = graphqlFields(info);
  const topLevelFields: Array<keyof Source> = Object.keys(fieldsTree) as Array<keyof Source>;
  const primitiveColumns = getSourceColumns(topLevelFields, context);
  result = result.select(primitiveColumns);
  if (fieldsTree.regions) {
    const sourceId = db.raw('??', ['sources_view.id']);
    const sourceLang = db.raw('??', ['sources_view.language']);
    if (fieldsTree.regions.count) {
      const countSubquery = db.table('sources_regions').count().where('source_id', sourceId).as('count');
      result = result.select(countSubquery);
    }
    if (fieldsTree.regions.nodes) {
      const regionFields = Object.keys(fieldsTree.regions.nodes);
      const regionColumns = getRegionColumns(regionFields as any, context);
      result = result.with('connected_regions', (db2) => {
        db2
          .select(regionColumns).select('source_id')
          .from('regions_view').innerJoin('sources_regions', 'regions_view.id', 'sources_regions.region_id');
      });
      const regionsSubquery = db.table('connected_regions')
        .select(db.raw('json_agg(connected_regions.*)'))
        .where('connected_regions.source_id', sourceId)
        .andWhere('connected_regions.language', sourceLang)
        .as('regions');
      result = result.select(regionsSubquery);
    }
  }
  result = result.where('sources_view.language', language);
  if (id) {
    result = result.where('sources_view.id', id);
  }
  return result;
};
