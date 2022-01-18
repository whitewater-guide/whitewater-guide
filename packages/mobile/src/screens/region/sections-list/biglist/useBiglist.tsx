import { useNavigation, useScrollToTop } from '@react-navigation/native';
import {
  ListedSectionFragment,
  SectionsStatus,
} from '@whitewater-guide/clients';
import React, { RefObject, useMemo } from 'react';
import { BigListProps } from 'react-native-big-list';

import { Screens } from '~/core/navigation';
import { useAppSettings } from '~/features/settings';

import {
  ITEM_HEIGHT,
  ListItem,
  SECTIONS_LIST_SUBTITLE_HEIGHT,
  SectionsListDataItem,
  SectionsListSubtitle,
} from '../item';
import { RegionSectionsNavProp } from '../types';
import getData from './getData';
import { ListProps } from './types';

export default function useBiglist(
  props: ListProps,
  listRef: RefObject<any>,
): BigListProps<SectionsListDataItem> {
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
      keyExtractor: (i) => i.id,
      refreshing: status === SectionsStatus.LOADING_UPDATES,
      onRefresh: refresh,
      actionSheetScrollRef: listRef,
      batchSizeThreshold: 2,
      controlItemRender: true,
    };
  }, [props, navigate, seenSwipeableSectionTip, listRef]);
}
