import type {
  ListedSectionFragment,
  SectionDerivedFields,
} from '@whitewater-guide/clients';
import type { BannerWithSourceFragment } from '@whitewater-guide/schema';
import { BannerPlacement } from '@whitewater-guide/schema';

import { getBannersForPlacement } from '../../../features/banners';
import { ROWS_PER_SCREEN } from './item/constants';

type Section = ListedSectionFragment & SectionDerivedFields;

export interface SubtitleItem {
  __typename: 'Subtitle';
  id: string;
}

export interface SwipeTipItem {
  __typename: 'SwipeableSectionTipItem';
  id: string;
}

export type SectionsListItem =
  | Section
  | BannerWithSourceFragment
  | SubtitleItem
  | SwipeTipItem;

const SUBTITLE_FAVORITES: SubtitleItem = {
  __typename: 'Subtitle',
  id: 'screens:region.sectionsList.favorites',
};

const SUBTITLE_ALL: SubtitleItem = {
  __typename: 'Subtitle',
  id: 'screens:region.sectionsList.all',
};

const SWIPE_TIP: SwipeTipItem = {
  __typename: 'SwipeableSectionTipItem',
  id: 'SwipeableSectionTipItem',
};

export function getSectionsListData(
  sections: Section[] | null | undefined,
  banners: BannerWithSourceFragment[] | null | undefined,
  seenSwipeableSectionTip: boolean,
): SectionsListItem[] {
  const allSections = sections ?? [];
  const favs = allSections.filter((s) => s.favorite);
  const rest = allSections.filter((s) => !s.favorite);

  const hasFavs = favs.length > 0;
  const hasRest = rest.length > 0;

  const result: SectionsListItem[] = [];

  if (hasFavs && hasRest) {
    result.push(SUBTITLE_FAVORITES, ...favs, SUBTITLE_ALL);
  } else if (!hasFavs && !seenSwipeableSectionTip) {
    result.push(SUBTITLE_FAVORITES, SWIPE_TIP, SUBTITLE_ALL);
  }

  // Build the "rest" span with injected banners
  const restItems: SectionsListItem[] = hasFavs ? [...rest] : [...allSections];
  const restLen = restItems.length;

  if (banners?.length) {
    const numBanners = restLen >= 2 * ROWS_PER_SCREEN + 1 ? 2 : 1;
    const rowBanners = getBannersForPlacement(
      banners,
      BannerPlacement.MobileSectionRow,
      numBanners,
    );
    for (let i = 1; i <= rowBanners.length; i += 1) {
      const insertAt = Math.max(0, i * ROWS_PER_SCREEN + 2);
      restItems.splice(insertAt, 0, rowBanners[i - 1]);
    }
  }

  result.push(...restItems);

  return result;
}
