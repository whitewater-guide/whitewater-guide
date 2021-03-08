import { useRegionsFilterOptions } from '@whitewater-guide/clients';
import { filterRegions, Region } from '@whitewater-guide/commons';
import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import WithNetworkError from '~/components/WithNetworkError';
import theme from '~/theme';

import { CARD_HEIGHT, RegionCard } from './RegionCard';
import useRegionsListQuery from './useRegionsListQuery';

const keyExtractor = (region: Region) => region.id;

const getItemLayout = (data: any, index: number) => ({
  length: CARD_HEIGHT,
  offset: index * CARD_HEIGHT,
  index,
});
const rowsPerScreen = Math.ceil(theme.screenHeight / CARD_HEIGHT);

const RegionsListView: React.FC = React.memo(() => {
  const { data, error, loading, refetch } = useRegionsListQuery();
  const filter = useRegionsFilterOptions();
  const regions = useMemo(
    () => filterRegions(data ? data.regions.nodes : [], filter),
    [filter, data],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Region>) => (
      <RegionCard region={item} index={index} />
    ),
    [],
  );

  return (
    <WithNetworkError
      data={data}
      error={error}
      loading={loading}
      refetch={refetch}
    >
      <FlatList
        data={regions}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshing={loading}
        onRefresh={refetch}
        removeClippedSubviews={true}
        windowSize={10}
        initialNumToRender={rowsPerScreen}
        testID="regions-list-flat-list"
      />
    </WithNetworkError>
  );
});

RegionsListView.displayName = 'RegionsListView';

export default RegionsListView;
