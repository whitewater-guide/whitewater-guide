import { RegionAdminSettings } from '@whitewater-guide/schema';
import { Overwrite } from 'utility-types';

import { LocalPhoto } from '../../../../utils/files';

export type RegionAdminFormData = Overwrite<
  RegionAdminSettings,
  {
    coverImage: LocalPhoto | null;
  }
>;
