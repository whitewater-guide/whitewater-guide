import type { Knex } from 'knex';

import type { QueryResolvers } from '../../../apollo/index';
import { db } from '../../../db/index';

const regionEditors: QueryResolvers['regionEditors'] = (_, { regionId }) =>
  db()
    .table('users')
    .whereExists(function (this: Knex.QueryBuilder) {
      this.select('*')
        .from('regions_editors')
        .where({ region_id: regionId })
        .andWhereRaw('users.id = regions_editors.user_id');
    });

export default regionEditors;
