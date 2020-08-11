import { Section } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
} from 'react-native';
import Loading from '~/components/Loading';
import theme from '~/theme';
import AddNewHeader from './AddNewHeader';
import { ITEM_HEIGHT } from './constants';
import SearchListItem from './SearchListItem';
import SectionHeader from './SectionHeader';
import { SearchResults } from './useSearchSections';

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

const getItemLayout = (
  data: Array<SectionListData<Section>> | null,
  index: number,
) => {
  return { length: ITEM_HEIGHT, offset: index * ITEM_HEIGHT, index };
};

interface Props {
  data: SearchResults;
  onSelect?: (value: Section) => void;
}

const SectionSearchList: React.FC<Props> = ({ data, onSelect }) => {
  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<Section>) => {
      return <SearchListItem section={item} onPress={onSelect} />;
    },
    [onSelect],
  );
  if (data.loading) {
    return <Loading />;
  }
  return (
    <SectionList
      getItemLayout={getItemLayout}
      style={styles.list}
      sections={data.result}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ListHeaderComponent={<AddNewHeader />}
    />
  );
};

export default SectionSearchList;
