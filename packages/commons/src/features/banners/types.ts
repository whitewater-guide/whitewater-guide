import { Connection, NamedNode, Node, NodeRef } from '../../apollo';
import { Group } from '../groups';
import { Region } from '../regions';

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
  src: string;
}

export interface BannerCore extends NamedNode {
  enabled: boolean;
  slug: string;
  priority: number;
  placement: BannerPlacement;
  source: BannerSource;
  link: string | null;
  extras: any;
}

export interface Banner extends BannerCore {
  // --- connections
  regions?: Connection<Region>;
  groups?: Connection<Group>;
  // ---- transient
  deleted?: boolean;
}

export interface BannerSourceInput {
  kind: BannerKind;
  ratio: number | null;
  src: string | null;
}

export interface BannerInput {
  id: string | null;
  slug: string;
  name: string;
  enabled: boolean;
  priority: number;
  placement: BannerPlacement;
  source: BannerSourceInput;
  link: string | null;
  extras: { [key: string]: any } | null;
  // --- connections
  regions: NodeRef[];
  groups: NodeRef[];
}

export function isBanner(node: Node): node is Banner {
  return node.__typename === 'Banner';
}
