import { DiffPatcher } from 'jsondiffpatch';

import { Sql } from '~/db';

export const differ = new DiffPatcher({
  propertyFilter: (name: keyof Sql.SectionsView) =>
    name !== 'created_at' &&
    name !== 'created_by' &&
    name !== 'updated_at' &&
    name !== 'language' &&
    name !== 'region_name',
});
