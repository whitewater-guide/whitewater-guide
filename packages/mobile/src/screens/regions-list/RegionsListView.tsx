import { useRegionsFilter } from '@whitewater-guide/clients';
import { Region } from '@whitewater-guide/schema';
import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import WithNetworkError from '~/components/WithNetworkError';
import theme from '~/theme';

import { CARD_HEIGHT, RegionCard } from './card';
import { useRegionsListQuery } from './regionsList.generated';

const keyExtractor = (region: Region) => region.id;

const getItemLayout = (data: any, index: number) => ({
  length: CARD_HEIGHT,
  offset: index * CARD_HEIGHT,
  index,
});

const rowsPerScreen = Math.ceil(theme.screenHeight / CARD_HEIGHT);

const renderItem = ({ item, index }: ListRenderItemInfo<Region>) => (
  <RegionCard region={item} index={index} />
);

const RegionsListView: React.FC = React.memo(() => {
  const { data, error, loading, refetch } = useRegionsListQuery({
    variables: { coverWidth: theme.screenWidthPx },
    fetchPolicy: 'cache-and-network',
  });
  const regions = useRegionsFilter(data?.regions.nodes);

  return (
    <WithNetworkError
      hasData={!!data}
      hasError={!!error}
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
        removeClippedSubviews
        windowSize={10}
        initialNumToRender={rowsPerScreen}
        testID="regions-list-flat-list"
      />
    </WithNetworkError>
  );
});

RegionsListView.displayName = 'RegionsListView';

export default RegionsListView;
