import { buildListQuery, buildRootQuery, ListQueryBuilderOptions, QueryBuilderOptions } from '../../db';
import { River } from '../../ww-commons';

export const buildRiverQuery = (options: Partial<QueryBuilderOptions<River>>) =>
  buildRootQuery({
    info: options.info!,
    context: options.context!,
    table: 'rivers_view',
    ...options,
  });

export const buildRiversListQuery = (options: Partial<ListQueryBuilderOptions<River>>) =>
  buildListQuery({
    info: options.info!,
    context: options.context!,
    table: 'rivers_view',
    ...options,
  });
