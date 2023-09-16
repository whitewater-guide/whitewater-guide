import type { BannerInput } from '@whitewater-guide/schema';
import type { Overwrite } from 'utility-types';

import type { LocalPhoto } from '../../../utils/files';

export type BannerFormData = Overwrite<
  BannerInput,
  {
    extras: string | null;
    source: string | LocalPhoto;
  }
>;

export interface RouterParams {
  bannerId?: string;
}
