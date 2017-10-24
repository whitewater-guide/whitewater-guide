import * as Knex from 'knex';
import db, { buildListQuery, buildRootQuery, ListQueryBuilderOptions, QueryBuilderOptions } from '../../db';
import { Source } from '../../ww-commons';
import { buildGaugeQuery } from '../gauges';
import { buildRegionQuery } from '../regions';

const connections = {
  regions: {
    build: buildRegionQuery,
    join: (table: string, query: Knex.QueryBuilder) => {
      const sourceId = db(true).raw('??', ['sources_view.id']);
      return query
        .innerJoin('sources_regions', `${table}.id`, 'sources_regions.region_id')
        .where('sources_regions.source_id', '=', sourceId);
    },
  },
  gauges: {
    build: buildGaugeQuery,
    foreignKey: 'source_id',
    join: (table: string, query: Knex.QueryBuilder) => {
      const sourceId = db(true).raw('??', ['sources_view.id']);
      return query.where(`${table}.source_id`, '=', sourceId);
    },
  },
};

export const buildQuery = (options: Partial<QueryBuilderOptions<Source>>) =>
  buildRootQuery({
    context: options.context!,
    table: 'sources_view',
    connections,
    ...options,
  });

export const buildSourcesListQuery = (options: Partial<ListQueryBuilderOptions<Source>>) =>
  buildListQuery({
    context: options.context!,
    table: 'sources_view',
    connections,
    ...options,
  });
