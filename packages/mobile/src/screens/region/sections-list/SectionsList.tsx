import React from 'react';
import { StyleSheet } from 'react-native';
import { RecyclerListView } from 'recyclerlistview';
import {
  connectPremiumDialog,
  WithPremiumDialog,
} from '../../../features/purchases';
import { layoutProvider } from './item';
import NoSectionsPlaceholder from './NoSectionsPlaceholder';
import { ListProps } from './types';
import useDataProvider from './useDataProvider';
import useRenderer from './useRenderer';

type Props = ListProps & WithPremiumDialog;

const SectionsList: React.FC<Props> = React.memo((props) => {
  const { region, sections } = props;
  const dataProvider = useDataProvider(sections, region);
  const { extendedState, renderItem, scrollViewProps } = useRenderer(props);

  if (!region || sections.length === 0) {
    return <NoSectionsPlaceholder />;
  }
  return (
    <RecyclerListView
      style={StyleSheet.absoluteFill}
      layoutProvider={layoutProvider}
      dataProvider={dataProvider}
      rowRenderer={renderItem}
      extendedState={extendedState}
      scrollViewProps={scrollViewProps}
    />
  );
});

SectionsList.displayName = 'SectionsList';

export default connectPremiumDialog(SectionsList);
