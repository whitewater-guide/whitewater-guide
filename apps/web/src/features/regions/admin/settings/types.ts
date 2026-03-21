import type { RegionAdminSettings } from '@whitewater-guide/schema';
import type { Overwrite } from 'utility-types';

import type { LocalPhoto } from '../../../../utils/files';

export type RegionAdminFormData = Overwrite<
  RegionAdminSettings,
  {
    coverImage: LocalPhoto | null;
  }
>;
