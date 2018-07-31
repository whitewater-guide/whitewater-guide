import { Overwrite } from 'type-zoo';
import { NamedNode, Node } from '../../core';
import { Group } from '../groups';
import { Region } from '../regions';
import { Connection } from '../types';

export enum BannerPlacement {
  MOBILE_SECTION_DESCRIPTION = 'mobileSectionDescription',
  MOBILE_SECTION_ROW = 'mobileSectionRow',
  MOBILE_SECTION_MEDIA = 'mobileSectionMedia',
  MOBILE_REGION_DESCRIPTION = 'mobileRegionDescription',
}

export enum BannerKind {
  Image = 'Image',
  WebView = 'WebView',
}

export interface BannerSource {
  kind: BannerKind;
  ratio: number | null;
  src: string | null;
}

export interface Banner extends NamedNode {
  enabled: boolean;
  slug: string;
  priority: number;
  placement: BannerPlacement;
  source: BannerSource;
  link: string | null;
  extras: any;
  // --- connections
  regions?: Connection<Region>;
  groups?: Connection<Group>;
  // ---- transient
  deleted?: boolean;
}

export interface BannerInput {
  id: string | null;
  slug: string;
  name: string;
  enabled: boolean;
  priority: number;
  placement: BannerPlacement;
  source: BannerSource;
  link: string | null;
  extras: {[key: string]: any} | null;
  // --- connections
  regions: Node[];
  groups: Node[];
}

export type BannerFormInput = Overwrite<BannerInput, { extras: string | null }>;

export function isBanner(node: Node): node is Banner {
  return node.__typename === 'Banner';
}
