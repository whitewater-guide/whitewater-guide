import * as Knex from 'knex';
import db, { buildListQuery, buildRootQuery, ListQueryBuilderOptions, QueryBuilderOptions } from '../../db';
import { Region } from '../../ww-commons';
import { buildGaugeQuery } from '../gauges';
import { buildRiverQuery } from '../rivers';

const connections = {
  rivers: {
    build: buildRiverQuery,
    foreignKey: 'region_id',
    join: (table: string, query: Knex.QueryBuilder) => {
      const regionId = db(true).raw('??', ['regions_view.id']);
      return query.where(`${table}.region_id`, '=', regionId);
    },
  },
  gauges: {
    build: buildGaugeQuery,
    foreignKey: 'source_id',
    join: (table: string, query: Knex.QueryBuilder) => {
      const regionId = db(true).raw('??', ['regions_view.id']);
      return query
        .innerJoin('sources_regions', `${table}.source_id`, 'sources_regions.source_id')
        .where('sources_regions.region_id', '=', regionId);
    },
  },
};

export const buildRegionQuery = (options: Partial<QueryBuilderOptions<Region>>): Knex.QueryBuilder =>
  buildRootQuery({
    context: options.context!,
    table: 'regions_view',
    connections,
    ...options,
  });

export const buildRegionsListQuery = (options: Partial<ListQueryBuilderOptions<Region>>) =>
  buildListQuery({
    context: options.context!,
    table: 'regions_view',
    connections,
    ...options,
  });
