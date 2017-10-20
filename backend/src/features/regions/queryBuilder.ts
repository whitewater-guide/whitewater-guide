import { buildListQuery, buildRootQuery, ListQueryBuilderOptions, QueryBuilderOptions } from '../../db';
import { Region } from '../../ww-commons';

export const buildRegionQuery = (options: Partial<QueryBuilderOptions<Region>>) =>
  buildRootQuery({
    context: options.context!,
    table: 'regions_view',
    ...options,
  });

export const buildRegionsListQuery = (options: Partial<ListQueryBuilderOptions<Region>>) =>
  buildListQuery({
    context: options.context!,
    table: 'regions_view',
    ...options,
  });
