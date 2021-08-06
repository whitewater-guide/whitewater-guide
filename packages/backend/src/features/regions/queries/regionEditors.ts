import { QueryBuilder } from 'knex';

import { QueryResolvers } from '~/apollo';
import { db } from '~/db';

const regionEditors: QueryResolvers['regionEditors'] = (_, { regionId }) =>
  db()
    .table('users')
    .whereExists(function (this: QueryBuilder) {
      this.select('*')
        .from('regions_editors')
        .where({ region_id: regionId })
        .andWhereRaw('users.id = regions_editors.user_id');
    });

export default regionEditors;
