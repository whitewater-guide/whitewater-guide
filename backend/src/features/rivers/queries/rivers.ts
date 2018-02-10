import { baseResolver, ListQuery } from '../../../apollo';
import { RiversFilter } from '../../../ww-commons';
import { buildRiversListQuery } from '../queryBuilder';

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
