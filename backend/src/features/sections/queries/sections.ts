import { baseResolver } from '../../../apollo';
import { ListQuery } from '../../../apollo/types';
import { buildSectionsListQuery } from '../queryBuilder';

const sections = baseResolver.createResolver(
  (root, args: ListQuery, context, info) => {
    const query = buildSectionsListQuery({ info, context, ...args });
    return query;
  },
);

export default sections;
