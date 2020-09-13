import { DiffPatcher } from 'jsondiffpatch';

import { SectionRaw } from '../../types';

export const differ = new DiffPatcher({
  propertyFilter: (name: keyof SectionRaw) => {
    return (
      name !== 'created_at' &&
      name !== 'created_by' &&
      name !== 'updated_at' &&
      name !== 'language' &&
      name !== 'region_name'
    );
  },
});
