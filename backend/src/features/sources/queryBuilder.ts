import * as Knex from 'knex';
import { buildRootQuery, QueryBuilderOptions } from '../../db/queryBuilders';
import { Source } from '../../ww-commons';
import { buildGaugeQuery } from '../gauges';
import { buildRegionQuery } from '../regions';

export const buildQuery = (options: Partial<QueryBuilderOptions<Source>>) =>
  buildRootQuery({
    context: options.context!,
    table: 'sources_view',
    connections: {
      regions: {
        build: buildRegionQuery,
        join: (table: string, query: Knex.QueryBuilder) => {
          const sourceId = options.knex!.raw('??', ['sources_view.id']);
          return query
            .innerJoin('sources_regions', `${table}.id`, 'sources_regions.region_id')
            .where('sources_regions.source_id', '=', sourceId);
        },
      },
      gauges: {
        build: buildGaugeQuery,
        foreignKey: 'source_id',
        join: (table: string, query: Knex.QueryBuilder) => {
          const sourceId = options.knex!.raw('??', ['sources_view.id']);
          return query.where(`${table}.source_id`, '=', sourceId);
        },
      },
    },
    ...options,
  });
