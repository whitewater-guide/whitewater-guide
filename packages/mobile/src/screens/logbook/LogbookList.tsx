import { NetworkStatus } from '@apollo/client';
import type { Descent } from '@whitewater-guide/schema';
import React from 'react';
import { FlatList } from 'react-native';

import WithQueryError from '~/components/WithQueryError';

import LogbookEmpty from './LogbookEmpty';
import { getItemLayout, renderDescent } from './LogbookListItem';
import useMyDescents from './useMyDescents';

const keyExtractor = (descent: Descent) => descent.id;

const LogbookList: React.FC = () => {
  const { descents, networkStatus, refetch, loadMore, loading, error } =
    useMyDescents();

  return (
    <WithQueryError
      hasData={!!descents}
      error={error}
      loading={loading}
      refetch={refetch}
    >
      <FlatList
        data={descents}
        renderItem={renderDescent}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        refreshing={networkStatus === NetworkStatus.refetch}
        ListEmptyComponent={<LogbookEmpty />}
        onRefresh={refetch}
        testID="descents-list"
        onEndReached={loadMore}
      />
    </WithQueryError>
  );
};

export default LogbookList;
