import { SectionsStatus } from '@whitewater-guide/clients';
import { Banner, isBanner, Section } from '@whitewater-guide/commons';
import max from 'date-fns/max';
import parseISO from 'date-fns/parseISO';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { hasPremiumAccess, useIap } from '../../../features/purchases';
import Screens from '../../screen-names';
import { ListItem } from './item';
import { SectionListBanner } from './item/SectionListBanner';
import { ListProps } from './types';

interface ExtendedState {
  swipedId: string;
  hasPremiumAccess: boolean;
  forceCloseCnt: number;
  lastTimestamp: Date;
}

export default (props: ListProps) => {
  const { region, sections, refresh, status } = props;
  const { navigate } = useNavigation();
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
        const msm =
          section.gauge &&
          section.gauge.latestMeasurement &&
          section.gauge.latestMeasurement.timestamp;
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
        navigate(Screens.Section.Root, {
          sectionId: section.id,
          regionId: region.id,
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

  const buyRegion = useCallback(
    () => navigate(Screens.Purchase.Root, { region }),
    [region],
  );

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
      lastTimestamp,
    },
    renderItem,
    scrollViewProps,
  };
};
