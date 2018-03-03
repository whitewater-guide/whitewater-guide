import * as Knex from 'knex';
import { buildListQuery, buildRootQuery, ListQueryBuilderOptions, QueryBuilderOptions } from '../../db';
import { Media } from '../../ww-commons';

export const buildMediaQuery = (options: Partial<QueryBuilderOptions<Media>>): Knex.QueryBuilder =>
  buildRootQuery({
    info: options.info!,
    context: options.context!,
    table: 'media_view',
    orderBy: 'weight',
    ...options,
  });

export const buildMediaListQuery = (options: Partial<ListQueryBuilderOptions<Media>>) =>
  buildListQuery({
    info: options.info!,
    context: options.context!,
    table: 'media_view',
    orderBy: 'weight',
    ...options,
  });
