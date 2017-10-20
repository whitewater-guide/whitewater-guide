import { isAdminResolver, ListQuery } from '../../../apollo';
import { buildGaugesListQuery } from '../queryBuilder';

interface GaugesListQuery extends ListQuery {
  sourceId?: string;
}

const gauges = isAdminResolver.createResolver(
  (root, { sourceId, ...args }: GaugesListQuery, context, info) => {
    const query = buildGaugesListQuery({ info, context, ...args });
    if (sourceId) {
      query.where('gauges_view.source_id', sourceId);
    }
    return query;
  },
);

export default gauges;
