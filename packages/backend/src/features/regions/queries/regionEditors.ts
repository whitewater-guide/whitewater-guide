import { QueryBuilder } from 'knex';
import { baseResolver } from '../../../apollo';
import db from '../../../db/db';

interface Vars {
  regionId: string;
}

const regionEditors = baseResolver.createResolver(
  (_, { regionId }: Vars) =>
    db().table('users')
      .whereExists(function(this: QueryBuilder) {
        this.select('*').from('regions_editors')
          .where({ region_id: regionId })
          .andWhereRaw('users.id = regions_editors.user_id');
      }),
);

export default regionEditors;
