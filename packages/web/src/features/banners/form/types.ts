import { BannerInput } from '@whitewater-guide/schema';
import { Overwrite } from 'utility-types';

import { LocalPhoto } from '../../../utils/files';

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
