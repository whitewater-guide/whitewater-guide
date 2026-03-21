import { BannerKind, BannerPlacement } from '@whitewater-guide/schema';
import type { Knex } from 'knex';

import type { Sql } from '../../db/index';
import { GROUP_ALL } from './03_groups';
import { REGION_GALICIA, REGION_NORWAY } from './04_regions';

export const NORWAY_SECTION_MEDIA_BANNER =
  '46aa7206-c66d-11e8-a355-529269fb1459';
export const GALICIA_SECTION_ROW_BANNER =
  '577ef5e8-c66d-11e8-a355-529269fb1459';
export const GALICIA_REGION_DESCR_BANNER =
  '8c89e25c-c66d-11e8-a355-529269fb1459';
export const GALICIA_REGION_DESCR_BANNER2 =
  'af282b16-c66d-11e8-a355-529269fb1459';
export const ALL_SECTION_ROW_BANNER = 'cebb31b2-c66d-11e8-a355-529269fb1459';
export const ALL_SECTION_ROW_BANNER_DISABLED =
  '79f904c4-c66d-11e8-a355-529269fb1459';

const banners: Sql.Banners[] = [
  {
    id: NORWAY_SECTION_MEDIA_BANNER,
    slug: 'norway_section_media_banner',
    name: 'norway section media banner',
    priority: 1,
    enabled: true,
    placement: BannerPlacement.MobileSectionMedia,
    source: {
      kind: BannerKind.WebView,
      url: 'http://whitewater.guide/norway_section_media_banner',
    },
    link: 'http://go.to/norway_section_media_banner',
    extras: { foo: 'bar' },
  },
  {
    id: GALICIA_SECTION_ROW_BANNER,
    slug: 'galicia_section_row_banner',
    name: 'galicia section row banner',
    priority: 1,
    enabled: true,
    placement: BannerPlacement.MobileSectionRow,
    source: {
      kind: BannerKind.WebView,
      url: 'http://whitewater.guide/galicia_section_row_banner',
    },
    link: 'http://go.to/galicia_section_row_banner',
    extras: null,
  },
  {
    id: GALICIA_REGION_DESCR_BANNER,
    slug: 'galicia_region_descr_banner',
    name: 'galicia region descr banner',
    priority: 1,
    enabled: true,
    placement: BannerPlacement.MobileRegionDescription,
    source: {
      kind: BannerKind.WebView,
      url: 'http://whitewater.guide/galicia_region_descr_banner',
    },
    link: 'http://go.to/galicia_region_descr_banner',
    extras: null,
  },
  {
    id: GALICIA_REGION_DESCR_BANNER2,
    slug: 'galicia_region_descr_banner2',
    name: 'galicia region descr banner 2',
    priority: 10,
    enabled: true,
    placement: BannerPlacement.MobileRegionDescription,
    source: {
      kind: BannerKind.Image,
      url: 'banner_4.jpg',
    },
    link: 'http://go.to/galicia_region_descr_banner2',
    extras: null,
  },
  {
    id: ALL_SECTION_ROW_BANNER,
    slug: 'all_section_row_banner',
    name: 'all section row banner',
    priority: 10,
    enabled: true,
    placement: BannerPlacement.MobileSectionRow,
    source: {
      kind: BannerKind.WebView,
      url: 'http://whitewater.guide/all_section_row_banner',
    },
    link: 'http://go.to/all_section_row_banner',
    extras: null,
  },
  {
    id: ALL_SECTION_ROW_BANNER_DISABLED,
    slug: 'all_section_row_banner_disabled',
    name: 'all section row banner disabled',
    priority: 20,
    enabled: false,
    placement: BannerPlacement.MobileSectionRow,
    source: {
      kind: BannerKind.WebView,
      url: 'http://whitewater.guide/all_section_row_banner_disabled',
    },
    link: 'http://go.to/all_section_row_banner_disabled',
    extras: null,
  },
];

export const BANNERS_COUNT = banners.length;

const bannersRegions = [
  { banner_id: NORWAY_SECTION_MEDIA_BANNER, region_id: REGION_NORWAY },
  { banner_id: GALICIA_SECTION_ROW_BANNER, region_id: REGION_GALICIA },
  { banner_id: GALICIA_REGION_DESCR_BANNER, region_id: REGION_GALICIA },
  { banner_id: GALICIA_REGION_DESCR_BANNER2, region_id: REGION_GALICIA },
];

const bannersGroups = [
  { banner_id: ALL_SECTION_ROW_BANNER, group_id: GROUP_ALL },
  { banner_id: ALL_SECTION_ROW_BANNER_DISABLED, group_id: GROUP_ALL },
];

export async function seed(db: Knex) {
  await db.table('banners_regions').del();
  await db.table('banners_groups').del();
  await db.table('banners').del();
  await db.table('banners').insert(banners);
  await db.table('banners_groups').insert(bannersGroups);
  await db.table('banners_regions').insert(bannersRegions);
}
