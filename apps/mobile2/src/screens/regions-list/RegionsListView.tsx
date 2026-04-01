import { NetworkStatus } from '@apollo/client';
import type { ListRenderItemInfo } from '@shopify/flash-list';
import { FlashList } from '@shopify/flash-list';
import React, { memo, useCallback, useMemo } from 'react';
import { Dimensions, PixelRatio } from 'react-native';

import WithQueryError from '../../components/WithQueryError';
import { RegionCard } from './card';
import { useRegionsListQuery } from './regionsList.generated';
import RegionsListSubtitle from './RegionsListSubtitle';
import type { ListedRegion, RegionSubtitleData } from './useFavRegions';
import useFavRegions from './useFavRegions';

type ListItem = (ListedRegion & { key?: string }) | RegionSubtitleData;

const { width: screenWidth } = Dimensions.get('window');
const screenWidthPx = Math.round(screenWidth * PixelRatio.get());

const keyExtractor = (item: ListItem) => item.key ?? item.id;

const getItemType = (item: ListItem) =>
  item.__typename === 'Subtitle' ? 'subtitle' : 'card';

function RegionsListView() {
  const { data, error, loading, refetch, networkStatus } = useRegionsListQuery({
    variables: { coverWidth: screenWidthPx },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const items = useFavRegions(data?.regions.nodes ?? undefined);

  const stickyHeaderIndices = useMemo(
    () =>
      items
        .map((item, index) => (item.__typename === 'Subtitle' ? index : null))
        .filter((i): i is number => i !== null),
    [items],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ListItem>) => {
      if (item.__typename === 'Subtitle') {
        return <RegionsListSubtitle i18nKey={item.id} />;
      }
      return <RegionCard region={item} index={index} />;
    },
    [],
  );

  return (
    <WithQueryError
      hasData={!!data}
      error={error}
      loading={loading}
      refetch={refetch}
    >
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        stickyHeaderIndices={stickyHeaderIndices}
        refreshing={networkStatus === NetworkStatus.refetch}
        onRefresh={refetch}
        testID="regions-list"
      />
    </WithQueryError>
  );
}

export default memo(RegionsListView);
