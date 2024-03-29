import { useNavigation, useScrollToTop } from '@react-navigation/native';
import type { ListedSectionFragment } from '@whitewater-guide/clients';
import { SectionsStatus } from '@whitewater-guide/clients';
import type { RefObject } from 'react';
import React, { useMemo } from 'react';
import type { BigListProps } from 'react-native-big-list';

import { Screens } from '~/core/navigation';
import { useAppSettings } from '~/features/settings';

import type { SectionsListDataItem } from '../item';
import {
  ITEM_HEIGHT,
  ListItem,
  SECTIONS_LIST_SUBTITLE_HEIGHT,
  SectionsListSubtitle,
} from '../item';
import type { RegionSectionsNavProp } from '../types';
import getData from './getData';
import type { ListProps } from './types';

function keyExtractor(item: SectionsListDataItem): string {
  return item.key;
}

export default function useBiglist(
  props: ListProps,
  listRef: RefObject<any>,
): Omit<BigListProps<SectionsListDataItem>, 'renderFooter' | 'renderHeader'> {
  const { navigate } = useNavigation<RegionSectionsNavProp>();
  const {
    settings: { seenSwipeableSectionTip },
  } = useAppSettings();

  useScrollToTop(listRef);

  return useMemo(() => {
    const { region, sections, refresh, status } = props;

    const onSectionSelected = (section: ListedSectionFragment) => {
      navigate(Screens.SECTION_SCREEN, {
        sectionId: section.id,
      });
    };
    const [data, subtitles] = getData(
      sections,
      region,
      seenSwipeableSectionTip,
    );

    return {
      sections: data,
      renderItem: ({ item, key }) => {
        return (
          <ListItem
            key={key}
            item={item}
            onPress={onSectionSelected}
            regionPremium={region?.premium}
          />
        );
      },
      itemHeight: ITEM_HEIGHT,
      renderSectionHeader: (index) => (
        <SectionsListSubtitle i18nkey={subtitles[index]} />
      ),
      sectionHeaderHeight: SECTIONS_LIST_SUBTITLE_HEIGHT,
      keyExtractor,
      refreshing: status === SectionsStatus.LOADING_UPDATES,
      onRefresh: refresh,
      actionSheetScrollRef: listRef,
      batchSizeThreshold: 2,
      controlItemRender: true,
      maintainVisibleContentPosition: { minIndexForVisible: 0 },
      overScrollMode: 'never',
    };
  }, [props, navigate, seenSwipeableSectionTip, listRef]);
}
