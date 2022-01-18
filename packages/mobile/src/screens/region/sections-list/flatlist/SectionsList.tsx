import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { SwipeableListProvider } from '~/components/swipeable';

import NoSectionsPlaceholder from '../NoSectionsPlaceholder';
import { ListProps } from './types';
import useFlatlist from './useFlatlist';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const SectionsList = React.memo<ListProps>((props) => {
  const { region, sections } = props;
  const listRef = useRef(null);
  const listProps = useFlatlist(props, listRef);

  if (!region || !sections?.length) {
    return <NoSectionsPlaceholder />;
  }

  return (
    <SwipeableListProvider listRef={listRef}>
      <FlatList style={styles.container} {...listProps} />
    </SwipeableListProvider>
  );
});

SectionsList.displayName = 'SectionsList';
