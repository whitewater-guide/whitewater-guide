import { Descent } from '@whitewater-guide/schema';
import { NetworkStatus } from 'apollo-client';
import React from 'react';
import { FlatList } from 'react-native';

import LogbookEmpty from './LogbookEmpty';
import { getItemLayout, useRenderDescent } from './LogbookListItem';
import useMyDescents from './useMyDescents';

const keyExtractor = (descent: Descent) => descent.id;

const LogbookList: React.FC = () => {
  const { descents, networkStatus, refetch, loadMore } = useMyDescents();
  const renderItem = useRenderDescent();
  return (
    <FlatList
      data={descents}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      keyExtractor={keyExtractor}
      refreshing={networkStatus === NetworkStatus.refetch}
      ListEmptyComponent={<LogbookEmpty />}
      onRefresh={refetch}
      testID="descents-list"
      onEndReached={loadMore}
    />
  );
};

export default LogbookList;
