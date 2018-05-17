import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { OfflineQueryPlaceholder, RefreshIndicator } from '../../components';
import isApolloOfflineError from '../../utils/isApolloOfflineError';
import { Region } from '../../ww-commons';
import { default as RegionListItem, REGION_ITEM_HEIGHT } from './RegionListItem';
import { InnerProps } from './types';

const keyExtractor = (region: Region) => region.id;

const getItemLayout = (data, index) => ({
  length: REGION_ITEM_HEIGHT,
  offset: index * REGION_ITEM_HEIGHT,
  index,
});

class RegionsListView extends React.PureComponent<InnerProps> {

  onRegionSelected = (region: Region) =>
    this.props.navigate('Region', { regionId: region.id });

  renderItem = ({ item }: ListRenderItemInfo<Region>) => (
    <RegionListItem region={item} onPress={this.onRegionSelected} t={this.props.t} />
  );

  render() {
    const { regions } = this.props;
    const { nodes, error, loading, refetch } = regions;
    if (isApolloOfflineError(error, nodes)) {
      return (
        <OfflineQueryPlaceholder refetch={refetch} />
      );
    }
    return (
      <FlatList
        data={nodes}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        refreshControl={<RefreshIndicator refreshing={loading} onRefresh={refetch} />}
      />
    );
  }
}

export default RegionsListView;
