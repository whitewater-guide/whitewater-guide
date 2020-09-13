import { DiffPatcher } from 'jsondiffpatch';

import { MediaRaw } from '../types';

export const logDiffer = new DiffPatcher({
  propertyFilter: (name: keyof MediaRaw) => {
    return (
      name !== 'created_at' &&
      name !== 'created_by' &&
      name !== 'updated_at' &&
      name !== 'language'
    );
  },
});
