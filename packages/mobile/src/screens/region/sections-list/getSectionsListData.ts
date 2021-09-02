import { ListedSectionFragment } from '@whitewater-guide/clients';
import {
  BannerPlacement,
  BannerWithSourceFragment,
} from '@whitewater-guide/schema';

import { getBannersForPlacement } from '~/features/banners';
import {
  ListProps,
  SectionsListDataItem,
} from '~/screens/region/sections-list/types';

import { ROWS_PER_SCREEN } from './item';

type SectionsListData = {
  label: string;
  items: SectionsListDataItem[];
}[];

export default function getSectionsListData({
  sections,
  region,
}: ListProps): SectionsListData {
  const favorites = sections.filter((s) => s.favorite);
  const favsCount = favorites.length;
  const favsSection: SectionsListData = favsCount
    ? [
        {
          items: favorites,
          label: 'screens:region.sectionsList.favorites',
        },
      ]
    : [];

  if (!region) {
    return [
      ...favsSection,
      { items: sections, label: 'screens:region.sectionsList.all' },
    ];
  }
  const { banners: bannerNodes } = region;
  if (!bannerNodes) {
    return [
      ...favsSection,
      { items: sections, label: 'screens:region.sectionsList.all' },
    ];
  }
  const { nodes } = bannerNodes;
  const numSections = sections.length;
  const numBanners = numSections >= 2 * ROWS_PER_SCREEN + 1 ? 2 : 1;
  const banners = getBannersForPlacement(
    nodes ?? [],
    BannerPlacement.MobileSectionRow,
    numBanners,
  );
  const result: Array<ListedSectionFragment | BannerWithSourceFragment> = [
    ...sections,
  ];
  for (let i = 1; i <= banners.length; i += 1) {
    const insertAt = Math.max(0, i * ROWS_PER_SCREEN + 2 - favsCount);
    result.splice(insertAt, 0, banners[i - 1]);
  }
  return [
    ...favsSection,
    { items: result, label: 'screens:region.sectionsList.all' },
  ];
}
