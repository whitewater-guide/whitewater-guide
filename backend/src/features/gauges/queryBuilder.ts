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

export const getGaugeColumns = (topLevelFields: Array<keyof Gauge>, context: Context, tableAlias = 'gauges_view') =>
  getPrimitives<Gauge>(topLevelFields, tableAlias, context, [], customFieldMap);

export const buildQuery = (options: Partial<QueryBuilderOptions<Gauge>>) =>
  buildRootQuery({
    info: options.info!,
    context: options.context!,
    table: 'gauges_view',
    customFieldMap,
    ...options,
  });
