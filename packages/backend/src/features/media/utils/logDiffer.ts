import { DiffPatcher } from 'jsondiffpatch';

import { Sql } from '~/db';

export const logDiffer = new DiffPatcher({
  propertyFilter: (name: keyof Sql.MediaView) =>
    name !== 'created_at' &&
    name !== 'created_by' &&
    name !== 'updated_at' &&
    name !== 'language',
});
