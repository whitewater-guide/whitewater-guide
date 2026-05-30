import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { ListRenderItemInfo } from '@shopify/flash-list';
import { FlashList } from '@shopify/flash-list';
import type {
  ListedSectionFragment,
  SectionDerivedFields,
} from '@whitewater-guide/clients';
import { useRegion, useSectionsList } from '@whitewater-guide/clients';
import type { BannerWithSourceFragment } from '@whitewater-guide/schema';
import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Screens } from '../../../core/navigation';
import { useAppSettings } from '../../../features/settings';
import theme from '../../../theme';
import type {
  SectionsListItem,
  SubtitleItem,
} from './getSectionsListData';
import { getSectionsListData } from './getSectionsListData';
import SectionListBanner from './item/SectionListBanner';
import SectionListItem from './item/SectionListItem';
import SectionsListSubtitle from './item/SectionsListSubtitle';
import SwipeableSectionTip from './item/SwipeableSectionTip';
import type { RegionSectionsListScreenProps } from './navigation-types';
import NoSectionsPlaceholder from './NoSectionsPlaceholder';

type Section = ListedSectionFragment & SectionDerivedFields;

const styles = StyleSheet.create({
  list: {
    backgroundColor: theme.colors.lightBackground,
  },
});

const getItemType = (item: SectionsListItem) => {
  switch (item.__typename) {
    case 'Banner':
      return 'banner';
    case 'Subtitle':
      return 'subtitle';
    case 'SwipeableSectionTipItem':
      return 'tip';
    default:
      return 'section';
  }
};

const keyExtractor = (item: SectionsListItem) => {
  switch (item.__typename) {
    case 'Banner':
      return 'banner-' + item.id;
    case 'Subtitle':
    case 'SwipeableSectionTipItem':
      return item.id;
    default:
      return (item as Section).id;
  }
};

function RegionSectionsListScreen({
  navigation,
}: RegionSectionsListScreenProps) {
  const { sections } = useSectionsList();
  const region = useRegion();
  const {
    settings: { seenSwipeableSectionTip },
  } = useAppSettings();
  const tabBarHeight = useBottomTabBarHeight();

  const items = useMemo(
    () =>
      getSectionsListData(
        sections as Section[] | null | undefined,
        region?.banners?.nodes as BannerWithSourceFragment[] | null | undefined,
        seenSwipeableSectionTip,
      ),
    [sections, region?.banners?.nodes, seenSwipeableSectionTip],
  );

  const handlePress = useCallback(
    (section: Section) => {
      navigation.navigate(Screens.SECTION_SCREEN, { sectionId: section.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SectionsListItem>) => {
      switch (item.__typename) {
        case 'Banner':
          return (
            <SectionListBanner banner={item as BannerWithSourceFragment} />
          );
        case 'Subtitle':
          return <SectionsListSubtitle i18nKey={(item as SubtitleItem).id} />;
        case 'SwipeableSectionTipItem':
          return <SwipeableSectionTip />;
        default:
          return (
            <SectionListItem section={item as Section} onPress={handlePress} />
          );
      }
    },
    [handlePress],
  );

  return (
    <FlashList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      contentContainerStyle={{ paddingBottom: tabBarHeight }}
      ListEmptyComponent={NoSectionsPlaceholder}
      style={styles.list}
      testID="sections-list"
    />
  );
}

export default memo(RegionSectionsListScreen);
