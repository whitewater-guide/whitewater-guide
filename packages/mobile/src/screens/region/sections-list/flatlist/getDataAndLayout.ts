import { BannerPlacement } from '@whitewater-guide/schema';
import { FlatListProps } from 'react-native';

import { getBannersForPlacement } from '~/features/banners';

import {
  ITEM_HEIGHT,
  ROWS_PER_SCREEN,
  SECTIONS_LIST_SUBTITLE_HEIGHT,
} from '../item';
import { FlatListDataItem, ListProps } from './types';

export default function getDataAndLayout(
  sections: ListProps['sections'],
  region: ListProps['region'],
  seenSwipeableSectionTip?: boolean,
): Pick<FlatListProps<FlatListDataItem>, 'data' | 'getItemLayout'> {
  const favorites = sections?.filter((s) => s.favorite) ?? [];
  const favsCount = favorites.length;
  let favs: FlatListDataItem[] = [];
  let secondSubtitleIndex = 0;

  if (favsCount) {
    favs = [
      {
        __typename: 'SubtitleItem',
        id: 'screens:region.sectionsList.favorites',
      },
      ...favorites,
    ];
    secondSubtitleIndex = favorites.length + 1;
  } else if (!seenSwipeableSectionTip) {
    favs = [
      {
        __typename: 'SubtitleItem',
        id: 'screens:region.sectionsList.favorites',
      },
      {
        __typename: 'SwipeableSectionTipItem',
        id: 'SwipeableSectionTipItem',
      },
    ];
    secondSubtitleIndex = 2;
  }

  const items: FlatListDataItem[] = sections ?? [];

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
      items.splice(insertAt, 0, banners[i - 1]);
    }
  }

  return {
    data: [
      ...favs,
      { __typename: 'SubtitleItem', id: 'screens:region.sectionsList.all' },
      ...(sections ?? []),
    ],
    getItemLayout: (_, index) => {
      let offset = index * ITEM_HEIGHT;

      if (index > 0) {
        offset = offset - ITEM_HEIGHT + SECTIONS_LIST_SUBTITLE_HEIGHT;
      }

      if (secondSubtitleIndex && index > secondSubtitleIndex) {
        offset = offset - ITEM_HEIGHT + SECTIONS_LIST_SUBTITLE_HEIGHT;
      }

      return {
        index,
        length:
          index === 0 || index === secondSubtitleIndex
            ? SECTIONS_LIST_SUBTITLE_HEIGHT
            : ITEM_HEIGHT,
        offset,
      };
    },
  };
}
