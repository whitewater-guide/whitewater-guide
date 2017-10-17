import { Context } from '../../apollo';
import { getPrimitives } from '../../db';
import { buildRootQuery, QueryBuilderOptions } from '../../db/queryBuilders';
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
