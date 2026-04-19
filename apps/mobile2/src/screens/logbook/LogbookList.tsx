import { NetworkStatus } from '@apollo/client';
import type { ListRenderItemInfo } from '@shopify/flash-list';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';

import WithQueryError from '../../components/WithQueryError';
import LogbookEmpty from './LogbookEmpty';
import LogbookListItem from './LogbookListItem';
import type { MyDescentFragment } from './myDescents.generated';
import useMyDescents from './useMyDescents';

const keyExtractor = (descent: MyDescentFragment) => descent.id;

function LogbookList() {
  const { descents, networkStatus, refetch, loadMore, loading, error } =
    useMyDescents();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MyDescentFragment>) => (
      <LogbookListItem descent={item} />
    ),
    [],
  );

  return (
    <WithQueryError
      hasData={!!descents}
      error={error}
      loading={loading}
      refetch={refetch}
    >
      <FlashList
        data={descents}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshing={networkStatus === NetworkStatus.refetch}
        ListEmptyComponent={<LogbookEmpty />}
        onRefresh={refetch}
        testID="descents-list"
        onEndReached={loadMore}
      />
    </WithQueryError>
  );
}

export default LogbookList;
