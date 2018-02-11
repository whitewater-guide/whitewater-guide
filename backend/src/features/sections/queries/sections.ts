import { clamp } from 'lodash';
import { baseResolver, ListQuery } from '../../../apollo';
import { buildSectionsListQuery } from '../queryBuilder';
import { SectionsFilter } from '../types';

interface Query extends ListQuery {
  filter?: SectionsFilter;
}

const sections = baseResolver.createResolver(
  (root, { language, page = {}, filter = {} }: Query, context, info) => {
    let { limit = 20, offset = 0 } = page;
    const { riverId, regionId, updatedAfter } = filter;
    limit = clamp(limit, 1, 100);
    let query = buildSectionsListQuery({ info, context, language, page: { limit, offset } });
    if (riverId) {
      query = query.where({ river_id: riverId });
    } else if (regionId) {
      query = query.where({ region_id: regionId });
    }
    if (updatedAfter) {
      query = query.where('sections_view.updated_at', '>', updatedAfter);
    }
    return query;
  },
);

export default sections;
