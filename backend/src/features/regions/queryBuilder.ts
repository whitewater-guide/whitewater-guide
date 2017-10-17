import { buildRootQuery, QueryBuilderOptions } from '../../db/queryBuilders';
import { Region } from '../../ww-commons';

const customFieldMap = {
  riversCount: () => null,
  sectionsCount: () => null,
};

export const buildRegionQuery = (options: Partial<QueryBuilderOptions<Region>>) =>
  buildRootQuery({
    context: options.context!,
    table: 'regions_view',
    customFieldMap,
    ...options,
  });
