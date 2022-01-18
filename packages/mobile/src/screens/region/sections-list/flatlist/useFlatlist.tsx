import { useNavigation, useScrollToTop } from '@react-navigation/native';
import {
  ListedSectionFragment,
  SectionsStatus,
} from '@whitewater-guide/clients';
import React, { RefObject, useMemo } from 'react';
import { FlatListProps } from 'react-native';

import { Screens } from '~/core/navigation';
import { useAppSettings } from '~/features/settings';

import { ListItem, SectionsListSubtitle } from '../item';
import { RegionSectionsNavProp } from '../types';
import getDataAndLayout from './getDataAndLayout';
import { FlatListDataItem, ListProps } from './types';

export default function useFlatlist(
  props: ListProps,
  listRef: RefObject<any>,
): FlatListProps<FlatListDataItem> {
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

    return {
      ...getDataAndLayout(sections, region, seenSwipeableSectionTip),
      renderItem: ({ item }) => {
        if (item.__typename === 'SubtitleItem') {
          return <SectionsListSubtitle i18nkey={item.id} />;
        }
        return (
          <ListItem
            item={item}
            onPress={onSectionSelected}
            regionPremium={true}
          />
        );
      },
      keyExtractor: (i) => i.id,
      refreshing: status === SectionsStatus.LOADING_UPDATES,
      onRefresh: refresh,
      ref: listRef,
      // Optimizations
      removeClippedSubviews: true,
      // maxToRenderPerBatch: 20,
      // updateCellsBatchingPeriod: 25,
      // initialNumToRender: 30,
      // windowSize: 31,
    };
  }, [props, navigate, seenSwipeableSectionTip, listRef]);
}
