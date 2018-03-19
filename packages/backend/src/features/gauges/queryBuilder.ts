import { buildListQuery, buildRootQuery, ListQueryBuilderOptions, QueryBuilderOptions } from '../../db';
import { Gauge } from '../../ww-commons';

const customFieldMap = {
  lastMeasurement: () => 'script',
  status: () => 'source',
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
