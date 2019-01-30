import { TopLevelResolver } from '@apollo';
import db from '@db';
import { QueryBuilder } from 'knex';

interface Vars {
  regionId: string;
}

const regionEditors: TopLevelResolver<Vars> = (_, { regionId }) =>
  db()
    .table('users')
    .whereExists(function(this: QueryBuilder) {
      this.select('*')
        .from('regions_editors')
        .where({ region_id: regionId })
        .andWhereRaw('users.id = regions_editors.user_id');
    });

export default regionEditors;
