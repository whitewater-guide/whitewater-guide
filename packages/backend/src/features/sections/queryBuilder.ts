import * as Knex from 'knex';
import db, { buildListQuery, buildRootQuery, ListQueryBuilderOptions, QueryBuilderOptions } from '../../db';
import { Section } from '../../ww-commons';

const connections = {
  media: {
    getBuilder: () => require('../media').buildMediaQuery,
    join: (table: string, query: Knex.QueryBuilder) => {
      const sectionId = db(true).raw('??', ['sections_view.id']);
      return query
        .innerJoin('sections_media', `${table}.id`, 'sections_media.media_id')
        .where('sections_media.section_id', '=', sectionId);
    },
  },
};

const oneToOnes = {
  river: {
    getBuilder: () => require('../rivers').buildRiverQuery,
    join: (table: string, query: Knex.QueryBuilder) => {
      const riverId = db(true).raw('??', ['sections_view.river_id']);
      return query.where(`${table}.id`, '=', riverId);
    },
  },
  gauge: {
    getBuilder: () => require('../gauges').buildGaugeQuery,
    join: (table: string, query: Knex.QueryBuilder) => {
      const gaugeId = db(true).raw('??', ['sections_view.gauge_id']);
      return query.where(`${table}.id`, '=', gaugeId);
    },
  },
  region: {
    getBuilder: () => require('../regions').buildRegionQuery,
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
    connections,
    ...options,
  });

export const buildSectionsListQuery = (options: Partial<ListQueryBuilderOptions<Section>>) =>
  buildListQuery({
    context: options.context!,
    table: 'sections_view',
    oneToOnes,
    connections,
    ...options,
  });
