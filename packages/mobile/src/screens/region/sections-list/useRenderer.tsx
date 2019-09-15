import { SectionsStatus } from '@whitewater-guide/clients';
import { Banner, isBanner, Section } from '@whitewater-guide/commons';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import max from 'date-fns/max';
import parseISO from 'date-fns/parseISO';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl } from 'react-native';
import { WithPremiumDialog } from '../../../features/purchases';
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

export default (props: ListProps & WithPremiumDialog) => {
  const {
    region,
    sections,
    refresh,
    status,
    canMakePayments,
    buyRegion,
  } = props;
  const { navigate } = useNavigation();

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
          section.gauge.lastMeasurement &&
          section.gauge.lastMeasurement.timestamp;
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

  const canNavigate = useCallback(() => {
    if (!region) {
      return false;
    }
    const { premium, hasPremiumAccess } = region;
    if (canMakePayments && premium && !hasPremiumAccess) {
      buyRegion(region);
      return false;
    }
    return true;
  }, [region, canMakePayments, buyRegion]);

  const renderItem = useCallback(
    (
      type: any,
      item: Section | Banner,
      index: number,
      extendedState: ExtendedState,
    ) => {
      const { premium, hasPremiumAccess } = region || {
        premium: false,
        hasPremiumAccess: false,
      };
      if (isBanner(item)) {
        return <SectionListBanner banner={item} />;
      }
      return (
        <ListItem
          forceCloseCnt={extendedState.forceCloseCnt}
          premium={premium}
          hasPremiumAccess={hasPremiumAccess}
          canNavigate={canNavigate}
          swipedId={extendedState.swipedId}
          item={item}
          onPress={onSectionSelected}
          onMaximize={onItemMaximized}
        />
      );
    },
    [region, canNavigate, onSectionSelected, onItemMaximized],
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
