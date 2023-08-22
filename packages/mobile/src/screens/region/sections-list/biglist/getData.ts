import { BannerPlacement } from '@whitewater-guide/schema';

import { getBannersForPlacement } from '~/features/banners';

import { ROWS_PER_SCREEN, SectionsListDataItem } from '../item';
import { ListProps } from './types';

export default function getData(
  sections: ListProps['sections'],
  region: ListProps['region'],
  seenSwipeableSectionTip?: boolean,
): [SectionsListDataItem[][], string[]] {
  const favorites = sections?.filter((s) => s.favorite) ?? [];
  const favsCount = favorites.length;
  const data: SectionsListDataItem[][] = [];
  const subtitles: string[] = [];

  if (favsCount) {
    data.push(favorites.map((i) => ({ key: 'fav-' + i.id, ...i })));
    subtitles.push('screens:region.sectionsList.favorites');
  } else if (!seenSwipeableSectionTip) {
    data.push([
      {
        __typename: 'SwipeableSectionTipItem',
        id: 'SwipeableSectionTipItem',
        key: 'SwipeableSectionTipItem',
      },
    ]);
    subtitles.push('screens:region.sectionsList.favorites');
  }

  const items: SectionsListDataItem[] = (sections ?? []).map((i) => ({
    key: i.id,
    ...i,
  }));

  if (region?.banners) {
    const { nodes } = region.banners;
    const numSections = sections?.length ?? 0;
    const numBanners = numSections >= 2 * ROWS_PER_SCREEN + 1 ? 2 : 1;
    const banners = getBannersForPlacement(
      nodes ?? [],
      BannerPlacement.MobileSectionRow,
      numBanners,
    );
    for (let i = 1; i <= banners.length; i += 1) {
      const insertAt = Math.max(0, i * ROWS_PER_SCREEN + 2 - favsCount);
      const banner = banners[i - 1];
      items.splice(insertAt, 0, { ...banner, key: banner.id });
    }
  }
  data.push(items);
  subtitles.push('screens:region.sectionsList.all');

  return [data, subtitles];
}
