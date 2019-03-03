import { BannerPlacement, BannerSource } from '@whitewater-guide/commons';

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

export interface BannerSourceArgs {
  width?: number;
}
