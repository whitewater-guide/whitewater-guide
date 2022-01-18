import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { ListedSectionFragment } from '@whitewater-guide/clients';
import React, { RefObject, useMemo, useRef } from 'react';
import { LargeList, LargeListPropType } from 'react-native-largelist';

import { Screens } from '~/core/navigation';
import { useAppSettings } from '~/features/settings';

import {
  ListItem,
  SECTIONS_LIST_SUBTITLE_HEIGHT,
  SectionsListSubtitle,
} from '../item';
import { RegionSectionsNavProp } from '../types';
import getSectionsListData from './getSectionsListData';
import { ListProps } from './types';

interface UseLargeList {
  data: LargeListPropType['data'];
  renderIndexPath: LargeListPropType['renderIndexPath'];
  onRefresh: LargeListPropType['onRefresh'];
  heightForSection: LargeListPropType['heightForSection'];
  renderSection?: LargeListPropType['renderSection'];
  ref: RefObject<LargeList>;
}

export default function useLargelist(props: ListProps): UseLargeList {
  const { navigate } = useNavigation<RegionSectionsNavProp>();
  const isScrolling = useRef(false);
  const ref = useRef<LargeList>(null);
  const {
    settings: { seenSwipeableSectionTip },
  } = useAppSettings();

  useScrollToTop(ref);

  return useMemo(() => {
    const { region, refresh } = props;
    const data = getSectionsListData(props, seenSwipeableSectionTip);
    const hasFavs = data.length > 1;

    const heightForSection = () =>
      hasFavs ? SECTIONS_LIST_SUBTITLE_HEIGHT : 0;

    const onSectionPress = (section: ListedSectionFragment) => {
      if (!isScrolling.current) {
        navigate(Screens.SECTION_SCREEN, {
          sectionId: section.id,
        });
      }
    };

    const renderIndexPath: LargeListPropType['renderIndexPath'] = ({
      section,
      row,
    }) => {
      const item = data[section].items[row];
      return (
        <ListItem
          regionPremium={!!region?.premium}
          item={item}
          onPress={onSectionPress}
          testID={`SectionsListItem${row}`}
        />
      );
    };

    const renderSection: LargeListPropType['renderSection'] = (index) => {
      return <SectionsListSubtitle i18nkey={data[index].label} />;
    };

    return {
      ref,
      onRefresh: () =>
        refresh().finally(() => {
          ref.current?.endRefresh();
        }),
      heightForSection,
      renderIndexPath,
      renderSection: hasFavs ? renderSection : undefined,
      data,
      onScrollBeginDrag: () => {
        isScrolling.current = true;
      },
      onMomentumScrollEnd: () => {
        isScrolling.current = false;
      },
    };
  }, [props, navigate, seenSwipeableSectionTip, ref, isScrolling]);
}
