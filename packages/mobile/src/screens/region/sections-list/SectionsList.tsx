import React, { forwardRef } from 'react';
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

export const SectionsList = React.memo(
  forwardRef<any, Props>((props, ref) => {
    const { region, sections } = props;
    const dataProvider = useDataProvider(sections, region);
    const { extendedState, renderItem, scrollViewProps } = useRenderer(props);

    if (!region || sections.length === 0) {
      return <NoSectionsPlaceholder />;
    }
    return (
      <RecyclerListView
        ref={ref}
        style={StyleSheet.absoluteFill}
        layoutProvider={layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={renderItem}
        extendedState={extendedState}
        scrollViewProps={scrollViewProps}
        testID="sections-list-recycler"
      />
    );
  }),
);

SectionsList.displayName = 'SectionsList';

export default connectPremiumDialog(SectionsList);
