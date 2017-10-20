import { buildListQuery, buildRootQuery, ListQueryBuilderOptions, QueryBuilderOptions } from '../../db';
import { Gauge } from '../../ww-commons';

// Not yet implemented
const customFieldMap = {
  lastTimestamp: () => null,
  lastLevel: () => null,
  lastFlow: () => null,
};

export const buildGaugeQuery = (options: Partial<QueryBuilderOptions<Gauge>>) =>
  buildRootQuery({
    info: options.info!,
    context: options.context!,
    table: 'gauges_view',
    customFieldMap,
    ...options,
  });

export const buildGaugesListQuery = (options: Partial<ListQueryBuilderOptions<Gauge>>) =>
  buildListQuery({
    info: options.info!,
    context: options.context!,
    table: 'gauges_view',
    customFieldMap,
    ...options,
  });
