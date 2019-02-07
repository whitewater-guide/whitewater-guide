import { TopLevelResolver } from '@apollo';
import db from '@db';
import { UserFilter } from '@whitewater-guide/commons';

interface Vars {
  filter: UserFilter;
}

const findUsers: TopLevelResolver<Vars> = async (_, { filter }) => {
  const { search, editorsOnly } = filter;
  let query = db().table('users');
  if (search) {
    query = query.where((qb) =>
      qb
        .where('name', 'ilike', `%${search}%`)
        .orWhere('email', 'ilike', `%${search}%`),
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
