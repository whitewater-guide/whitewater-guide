import { Overwrite, RegionAdminSettings } from '@whitewater-guide/commons';

import { LocalPhoto } from '../../../../utils/files';

export type RegionAdminFormData = Overwrite<
  RegionAdminSettings,
  {
    coverImage: LocalPhoto | null;
  }
>;
