import { BannerInput, Overwrite } from '@whitewater-guide/commons';
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
