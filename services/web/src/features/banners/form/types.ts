import { BannerInput, Overwrite } from '@whitewater-guide/commons';

export type BannerFormData = Overwrite<
  BannerInput,
  {
    extras: string | null;
  }
>;

export interface RouterParams {
  bannerId?: string;
}
