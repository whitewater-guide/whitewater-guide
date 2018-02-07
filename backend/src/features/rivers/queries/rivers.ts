import { baseResolver, ListQuery } from '../../../apollo';
import { buildRiversListQuery } from '../queryBuilder';
import { RiversFilter } from '../types';

interface Query extends ListQuery {
  filter?: RiversFilter;
}

const rivers = baseResolver.createResolver(
  (root, { filter = {}, ...args }: Query, context, info) => {
    let query = buildRiversListQuery({ info, context, ...args });
    const { regionId } = filter;
    if (regionId) {
      query = query.where({ region_id: regionId });
    }
    return query;
  },
);

export default rivers;
