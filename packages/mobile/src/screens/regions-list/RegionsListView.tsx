import { ApolloQueryResult } from 'apollo-client';
import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { cloneableGenerator } from 'redux-saga/utils';
import { RefreshIndicator, RetryPlaceholder } from '../../components';
import isApolloOfflineError from '../../utils/isApolloOfflineError';
import { queryResultToList, WithList } from '../../ww-clients/apollo';
import { Connection, Region } from '../../ww-commons';
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

interface State {
  refetchingFromError: boolean;
}

class RegionsListView extends React.PureComponent<InnerProps, State> {
  readonly state: State = { refetchingFromError: false };
  private _refetch!: () => Promise<ApolloQueryResult<Connection<Region>>>;

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
    const { refetchingFromError } = this.state;
    const { nodes, error, loading, refetch } = regions;
    this._refetch = refetch;
    if (refetchingFromError || isApolloOfflineError(error, nodes)) {
      const refetchFromError = async () => {
        this.setState({ refetchingFromError: true });
        await refetch();
        this.setState({ refetchingFromError: false });
      };
      return (
        <RetryPlaceholder refetch={refetchFromError} loading={loading} />
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
