import * as Knex from 'knex';
import db, { buildListQuery, buildRootQuery, ListQueryBuilderOptions, QueryBuilderOptions } from '../../db';
import { River } from '../../ww-commons';

const oneToOnes = {
  region: {
    getBuilder: () => require('../regions').buildRegionQuery,
    join: (table: string, query: Knex.QueryBuilder) => {
      const regionId = db(true).raw('??', ['rivers_view.region_id']);
      return query.where(`${table}.id`, '=', regionId);
    },
  },
};

const connections = {
  sections: {
    getBuilder: () => require('../sections').buildSectionQuery,
    foreignKey: 'river_id',
    join: (table: string, query: Knex.QueryBuilder) => {
      const riverId = db(true).raw('??', ['rivers_view.id']);
      return query.where(`${table}.river_id`, '=', riverId);
    },
  },
};

export const buildRiverQuery = (options: Partial<QueryBuilderOptions<River>>): Knex.QueryBuilder =>
  buildRootQuery({
    info: options.info!,
    context: options.context!,
    table: 'rivers_view',
    connections,
    oneToOnes,
    ...options,
  });

export const buildRiversListQuery = (options: Partial<ListQueryBuilderOptions<River>>) =>
  buildListQuery({
    info: options.info!,
    context: options.context!,
    table: 'rivers_view',
    connections,
    oneToOnes,
    ...options,
  });
