import { BannerKind, BannerPlacement } from '@whitewater-guide/commons';

export interface BannerSourceRaw {
  kind: BannerKind;
  url: string;
  ratio?: number; // @deprecated, might exist in older records
  src?: string; // @deprecated, use url now, might exist in older records
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
