import { BannerPlacement, BannerSource } from '@ww-commons';

export interface BannerRaw {
  id: string;
  slug: string;
  name: string;
  priority: number;
  enabled: boolean;
  placement: BannerPlacement;
  link: string | null;
  extras: any;
  source: BannerSource;
}
