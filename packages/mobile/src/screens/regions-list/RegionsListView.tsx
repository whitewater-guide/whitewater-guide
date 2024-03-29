import { useRegionsFilter } from '@whitewater-guide/clients';
import React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native';

import WithQueryError from '~/components/WithQueryError';
import theme from '~/theme';

import { CARD_HEIGHT, RegionCard } from './card';
import { useRegionsListQuery } from './regionsList.generated';
import {
  REGIONS_LIST_SUBTITLE_HEIGHT,
  RegionsListSubtitle,
} from './RegionsListSubtitle';
import type { ListedRegion, RegionSubtitleData } from './useFavRegions';
import useFavRegions from './useFavRegions';

const keyExtractor = (
  item: (ListedRegion & { key?: string }) | RegionSubtitleData,
) => item.key ?? item.id;

function getItemLayout(
  data: Array<ListedRegion | RegionSubtitleData>,
  index: number,
) {
  let offset = 0;
  for (let i = 0; i < index; i++) {
    const { __typename } = data[i];
    offset +=
      __typename === 'Subtitle' ? REGIONS_LIST_SUBTITLE_HEIGHT : CARD_HEIGHT;
  }
  return {
    length:
      data[index].__typename === 'Subtitle'
        ? REGIONS_LIST_SUBTITLE_HEIGHT
        : CARD_HEIGHT,
    offset,
    index,
  };
}

const rowsPerScreen = Math.ceil(theme.screenHeight / CARD_HEIGHT);

const renderItem = ({
  item,
  index,
}: ListRenderItemInfo<ListedRegion | RegionSubtitleData>) => {
  if (item.__typename === 'Subtitle') {
    return <RegionsListSubtitle i18nkey={item.id} />;
  }
  return <RegionCard region={item} index={index} />;
};

const RegionsListView: React.FC = React.memo(() => {
  const { data, error, loading, refetch } = useRegionsListQuery({
    variables: { coverWidth: theme.screenWidthPx },
    fetchPolicy: 'cache-and-network',
  });
  const regions = useRegionsFilter(data?.regions.nodes);
  const items = useFavRegions(regions);

  return (
    <WithQueryError
      hasData={!!data}
      error={error}
      loading={loading}
      refetch={refetch}
    >
      <FlatList
        data={items}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshing={loading}
        onRefresh={refetch}
        removeClippedSubviews
        windowSize={10}
        initialNumToRender={rowsPerScreen}
        testID="regions-list-flat-list"
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      />
    </WithQueryError>
  );
});

RegionsListView.displayName = 'RegionsListView';

export default RegionsListView;
