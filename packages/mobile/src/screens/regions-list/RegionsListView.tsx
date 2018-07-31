import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { OfflineQueryPlaceholder, RefreshIndicator } from '../../components';
import isApolloOfflineError from '../../utils/isApolloOfflineError';
import { queryResultToList, WithList } from '../../ww-clients/apollo';
import { Region } from '../../ww-commons';
import container from './container';
import { CARD_HEIGHT, RegionCard } from './RegionCard';
import { REGIONS_LIST_QUERY, Result } from './regionsList.query';
import { InnerProps } from './types';

const keyExtractor = (region: Region) => region.id;

const getItemLayout = (data: any, index: number) => ({
  length: CARD_HEIGHT,
  offset: index * CARD_HEIGHT,
  index,
});

class RegionsListView extends React.PureComponent<InnerProps> {

  onRegionSelected = (region: Region) =>
    this.props.navigate('Region', { regionId: region.id });

  renderItem = ({ item }: ListRenderItemInfo<Region>) => (
    <RegionCard
      region={item}
      onPress={this.onRegionSelected}
      t={this.props.t}
      onPremiumPress={this.props.buyRegion}
      canMakePayments={this.props.canMakePayments}
      openDownloadDialog={this.props.openDownloadDialog}
      regionInProgress={this.props.regionInProgress}
    />
  );

  renderList = (regions: WithList<Region>) => {
    const { nodes, error, loading, refetch } = regions;
    if (isApolloOfflineError(error, nodes)) {
      return (
        <OfflineQueryPlaceholder refetch={refetch} />
      );
    }
    return (
      <FlatList
        data={nodes}
        extraData={this.props.regionsListRefreshToken}
        getItemLayout={getItemLayout}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
        refreshControl={<RefreshIndicator refreshing={loading} onRefresh={refetch} /> as any}
      />
    );
  };

  render() {
    return (
      <Query query={REGIONS_LIST_QUERY} fetchPolicy="cache-and-network">
        {(props: QueryResult<Result>) => {
          const { regions } = queryResultToList(props, 'regions');
          return this.renderList(regions as any);
        }}
      </Query>
    );
  }
}

export default container(RegionsListView);
