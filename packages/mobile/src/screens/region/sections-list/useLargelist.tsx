import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { Section } from '@whitewater-guide/schema';
import React, { RefObject, useMemo, useRef, useState } from 'react';
import { LargeList, LargeListPropType } from 'react-native-largelist';

import { Screens } from '~/core/navigation';
import { hasPremiumAccess, useIap } from '~/features/purchases';
import { useAppSettings } from '~/features/settings';

import getSectionsListData from './getSectionsListData';
import {
  ListItem,
  SECTIONS_LIST_SUBTITLE_HEIGHT,
  SectionsListSubtitle,
} from './item';
import { ListProps, RegionSectionsNavProp } from './types';

interface ExtendedState {
  swipedId: string;
  hasPremiumAccess: boolean;
  forceCloseCnt: number;
}

interface UseLargeList {
  data: LargeListPropType['data'];
  renderIndexPath: LargeListPropType['renderIndexPath'];
  onRefresh: LargeListPropType['onRefresh'];
  heightForSection: LargeListPropType['heightForSection'];
  renderSection?: LargeListPropType['renderSection'];
  onScrollBeginDrag?: () => void;
  onScrollEndDrag?: () => void;
  ref: RefObject<LargeList>;
}

export default function useLargelist(props: ListProps): UseLargeList {
  const { navigate } = useNavigation<RegionSectionsNavProp>();
  const { canMakePayments } = useIap();
  const ref = useRef<LargeList>(null);
  useScrollToTop(ref);
  const {
    settings: { seenSwipeableSectionTip },
  } = useAppSettings();

  const [extraState, setExtraState] = useState<ExtendedState>({
    swipedId: '',
    hasPremiumAccess: props.region?.hasPremiumAccess ?? false,
    forceCloseCnt: 0,
  });

  return useMemo(() => {
    const { region, refresh } = props;
    const data = getSectionsListData(props, seenSwipeableSectionTip);
    const hasFavs = data.length > 1;

    const heightForSection = () =>
      hasFavs ? SECTIONS_LIST_SUBTITLE_HEIGHT : 0;

    const onSectionSelected = (section: Section) => {
      if (region) {
        navigate(Screens.SECTION_SCREEN, {
          sectionId: section.id,
        });
      }
    };

    const onItemSwiped = (swipedId: string) => {
      setExtraState((state) => ({ ...state, swipedId }));
    };

    const buyRegion = () => {
      if (region) {
        navigate(Screens.PURCHASE_STACK, { region });
      }
    };

    const forceCloseRows = () =>
      setExtraState((state) => ({
        ...state,
        swipedId: '',
        forceCloseCnt: state.forceCloseCnt + 1,
      }));

    const renderIndexPath: LargeListPropType['renderIndexPath'] = ({
      section,
      row,
    }) => {
      const item = data[section].items[row];
      const gotPremium =
        item.__typename === 'Section' &&
        hasPremiumAccess(canMakePayments, region, item);
      return (
        <ListItem
          hasPremiumAccess={gotPremium}
          buyRegion={buyRegion}
          regionPremium={region ? region.premium : false}
          forceCloseCnt={extraState.forceCloseCnt}
          swipedId={extraState.swipedId}
          item={item}
          onPress={onSectionSelected}
          onSwipe={onItemSwiped}
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
      onScrollBeginDrag: forceCloseRows,
      onScrollEndDrag: forceCloseRows,
    };
  }, [
    props,
    navigate,
    canMakePayments,
    extraState,
    setExtraState,
    seenSwipeableSectionTip,
    ref,
  ]);
}
