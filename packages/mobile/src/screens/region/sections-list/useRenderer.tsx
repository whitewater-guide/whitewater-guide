import { Banner, Section, isBanner } from '@whitewater-guide/commons';
import { ListProps, RegionSectionsNavProp } from './types';
import React, { useCallback, useMemo, useState } from 'react';
import {
  SectionsStatus,
  useSectionsSearchString,
} from '@whitewater-guide/clients';
import { hasPremiumAccess, useIap } from '~/features/purchases';

import { ListItem } from './item';
import { RefreshControl } from 'react-native';
import { Screens } from '~/core/navigation';
import { SectionListBanner } from './item/SectionListBanner';
import max from 'date-fns/max';
import parseISO from 'date-fns/parseISO';
import { useNavigation } from '@react-navigation/native';

interface ExtendedState {
  swipedId: string;
  hasPremiumAccess: boolean;
  forceCloseCnt: number;
  lastTimestamp: Date;
}

export default (props: ListProps) => {
  const { region, sections, refresh, status } = props;
  const { navigate } = useNavigation<RegionSectionsNavProp>();
  const searchString = useSectionsSearchString();
  const { canMakePayments } = useIap();

  const [extraState, setExtraState] = useState<ExtendedState>({
    swipedId: '',
    hasPremiumAccess: region ? region.hasPremiumAccess : false,
    forceCloseCnt: 0,
    lastTimestamp: new Date(1990, 0),
  });

  const lastTimestamp = useMemo(
    () =>
      sections.reduce((acc, section) => {
        const dates = [acc, parseISO(section.updatedAt)];
        const msm = section.gauge?.latestMeasurement?.timestamp;
        if (msm) {
          dates.push(parseISO(msm));
        }
        return max(dates);
      }, new Date(1990, 0)),
    [sections],
  );

  const onSectionSelected = useCallback(
    (section: Section) => {
      if (region) {
        navigate(Screens.SECTION_SCREEN, {
          sectionId: section.id,
        });
      }
    },
    [navigate, region],
  );

  const onItemMaximized = useCallback(
    (swipedId: string) => {
      setExtraState((state) => ({ ...state, swipedId }));
    },
    [setExtraState],
  );

  const buyRegion = useCallback(() => {
    if (region) {
      navigate(Screens.PURCHASE_STACK, { region });
    }
  }, [region]);

  const renderItem = useCallback(
    (
      type: any,
      item: Section | Banner,
      index: number,
      extendedState: ExtendedState,
    ) => {
      if (isBanner(item)) {
        return <SectionListBanner banner={item} />;
      }
      return (
        <ListItem
          hasPremiumAccess={hasPremiumAccess(canMakePayments, region, item)}
          buyRegion={buyRegion}
          regionPremium={region ? region.premium : false}
          forceCloseCnt={extendedState.forceCloseCnt}
          swipedId={extendedState.swipedId}
          item={item}
          onPress={onSectionSelected}
          onMaximize={onItemMaximized}
          testID={`SectionsListItem${index}`}
        />
      );
    },
    [region, canMakePayments, buyRegion, onSectionSelected, onItemMaximized],
  );

  const scrollViewProps = useMemo(() => {
    const forceCloseRows = () =>
      setExtraState((state) => ({
        ...state,
        swipedId: '',
        forceCloseCnt: state.forceCloseCnt + 1,
      }));
    return {
      refreshControl: (
        <RefreshControl
          refreshing={status === SectionsStatus.LOADING_UPDATES}
          onRefresh={refresh}
        />
      ),
      onScrollBeginDrag: forceCloseRows,
      onScrollEndDrag: forceCloseRows,
      // onMomentumScrollBegin: forceCloseRows,
      // onMomentumScrollEnd: forceCloseRows,
    };
  }, [status, refresh, setExtraState]);

  return {
    extendedState: {
      ...extraState,
      searchString,
      lastTimestamp,
    },
    renderItem,
    scrollViewProps,
  };
};
