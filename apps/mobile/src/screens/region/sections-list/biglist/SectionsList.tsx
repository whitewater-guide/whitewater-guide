import React, { useRef } from 'react';
import { RefreshControl as RNRefreshControl, StyleSheet } from 'react-native';
import BigList from 'react-native-big-list';
import { createNativeWrapper, ScrollView } from 'react-native-gesture-handler';

import { SwipeableListProvider } from '~/components/swipeable';
import theme from '~/theme';

import NoSectionsPlaceholder from '../NoSectionsPlaceholder';
import type { ListProps } from './types';
import useBiglist from './useBiglist';

export const RefreshControl = createNativeWrapper(RNRefreshControl, {
  disallowInterruption: true,
  shouldCancelWhenOutside: false,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.lightBackground,
  },
});

export const SectionsList = React.memo<ListProps>((props) => {
  const { region, sections } = props;
  const listRef = useRef(null);
  const refreshRef = useRef(null);
  const { refreshing, onRefresh, ...listProps } = useBiglist(props, listRef);

  if (!region || !sections?.length) {
    return <NoSectionsPlaceholder />;
  }

  return (
    <SwipeableListProvider listRef={listRef}>
      <BigList
        style={styles.container}
        {...listProps}
        stickySectionHeadersEnabled={false}
        waitFor={refreshRef}
        disallowInterruption={true}
        refreshControl={
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh ?? undefined}
            ref={refreshRef}
          />
        }
        ScrollViewComponent={ScrollView}
      />
    </SwipeableListProvider>
  );
});

SectionsList.displayName = 'SectionsList';
