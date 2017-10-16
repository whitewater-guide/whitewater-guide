import { Context } from '../../apollo';
import { buildRootQuery, getPrimitives, QueryBuilderOptions } from '../../db/queryBuilders';
import { Region } from '../../ww-commons';

const customFieldMap = {
  riversCount: () => null,
  sectionsCount: () => null,
};

export const getRegionColumns = (topLevelFields: Array<keyof Region>, context: Context, tableAlias = 'regions_view') =>
  getPrimitives<Region>(topLevelFields, tableAlias, context, [], customFieldMap);

export const buildQuery = (options: Partial<QueryBuilderOptions<Region>>) =>
  buildRootQuery({
    context: options.context!,
    table: 'regions_view',
    customFieldMap,
    ...options,
  });
