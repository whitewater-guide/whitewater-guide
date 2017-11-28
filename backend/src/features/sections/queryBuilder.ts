import * as Knex from 'knex';
import db, { buildListQuery, buildRootQuery, ListQueryBuilderOptions, QueryBuilderOptions } from '../../db';
import { Section } from '../../ww-commons';
import { buildGaugeQuery } from '../gauges';
import { buildRegionQuery } from '../regions';
import { buildRiverQuery } from '../rivers';

const oneToOnes = {
  river: {
    build: buildRiverQuery,
    join: (table: string, query: Knex.QueryBuilder) => {
      const riverId = db(true).raw('??', ['sections_view.river_id']);
      return query.where(`${table}.id`, '=', riverId);
    },
  },
  gauge: {
    build: buildGaugeQuery,
    join: (table: string, query: Knex.QueryBuilder) => {
      const gaugeId = db(true).raw('??', ['sections_view.gauge_id']);
      return query.where(`${table}.id`, '=', gaugeId);
    },
  },
  region: {
    build: buildRegionQuery,
    join: (table: string, query: Knex.QueryBuilder) => {
      const riverId = db(true).raw('??', ['sections_view.river_id']);
      return query
        .innerJoin('rivers', `${table}.id`, 'rivers.region_id')
        .where('rivers.id', '=', riverId);
    },
  },
};

export const buildSectionQuery = (options: Partial<QueryBuilderOptions<Section>>) =>
  buildRootQuery({
    context: options.context!,
    table: 'sections_view',
    oneToOnes,
    ...options,
  });

export const buildSectionsListQuery = (options: Partial<ListQueryBuilderOptions<Section>>) =>
  buildListQuery({
    context: options.context!,
    table: 'sections_view',
    oneToOnes,
    ...options,
  });
