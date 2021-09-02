import React from 'react';
import { StyleSheet } from 'react-native';
import { LargeList } from 'react-native-largelist';

import { ITEM_HEIGHT } from './item';
import NoSectionsPlaceholder from './NoSectionsPlaceholder';
import RefreshControl from './RefreshControl';
import { ListProps } from './types';
import useLargelist from './useLargelist';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const heightForIndexPath = () => ITEM_HEIGHT;

export const SectionsList = React.memo<ListProps>((props) => {
  const { region, sections } = props;
  const listProps = useLargelist(props);

  if (!region || sections.length === 0) {
    return <NoSectionsPlaceholder />;
  }

  return (
    <LargeList
      directionalLockEnabled
      style={styles.container}
      heightForIndexPath={heightForIndexPath}
      showsVerticalScrollIndicator={false}
      refreshHeader={RefreshControl}
      testID="sections-largelist"
      {...listProps}
    />
  );
});

SectionsList.displayName = 'SectionsList';

export default SectionsList;
