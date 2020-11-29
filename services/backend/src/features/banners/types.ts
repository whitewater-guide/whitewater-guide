import { BannerKind, BannerPlacement } from '@whitewater-guide/commons';

export interface BannerSourceRaw {
  kind: BannerKind;
  url: string;
}

export interface BannerRaw {
  id: string;
  slug: string;
  name: string;
  priority: number;
  enabled: boolean;
  placement: BannerPlacement;
  link: string | null;
  extras: any;
  source: BannerSourceRaw;
}

export interface BannerSourceArgs {
  width?: number;
}
