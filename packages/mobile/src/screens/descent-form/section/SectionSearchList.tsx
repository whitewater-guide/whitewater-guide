import React, { useCallback } from 'react';
import {
  SectionList,
  SectionListRenderItemInfo,
  StyleSheet,
} from 'react-native';
import theme from '~/theme';
import SearchListItem from './SearchListItem';
import SectionHeader from './SectionHeader';
import { ItemType, SearchData } from './types';
import { LogbookSectionInput } from '@whitewater-guide/logbook-schema';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginVertical: theme.margin.double,
  },
});

const keyExtractor = (i: any) => i.id;

const renderSectionHeader = ({ section }: any) => (
  <SectionHeader id={section.id} />
);

interface Props {
  data: SearchData;
  onSelect?: (value: LogbookSectionInput) => void;
  onAdd?: () => void;
}

const SectionSearchList: React.FC<Props> = ({ data, onAdd, onSelect }) => {
  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<ItemType>) => {
      return <SearchListItem item={item} onAdd={onAdd} onSelect={onSelect} />;
    },
    [onAdd, onSelect],
  );
  return (
    <SectionList
      style={styles.list}
      sections={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
    />
  );
};

export default SectionSearchList;
