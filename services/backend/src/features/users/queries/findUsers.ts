import { TopLevelResolver } from '~/apollo';
import db from '~/db';
import { UserFilterOptions } from '@whitewater-guide/commons';

interface Vars {
  filter: UserFilterOptions;
}

const findUsers: TopLevelResolver<Vars> = async (_, { filter }) => {
  const { searchString, editorsOnly } = filter;
  let query = db().table('users');
  if (searchString) {
    query = query.where((qb) =>
      qb
        .where('name', 'ilike', `%${searchString}%`)
        .orWhere('email', 'ilike', `%${searchString}%`),
    );
  }
  if (editorsOnly) {
    query = query.where((builder) =>
      builder.where('users.admin', true).orWhereExists((qb) =>
        qb
          .select('*')
          .from('regions_editors')
          .whereRaw('regions_editors.user_id = users.id'),
      ),
    );
  }
  query = query.limit(10).orderBy('name');
  return query;
};

export default findUsers;
