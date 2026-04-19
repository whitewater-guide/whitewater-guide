import type { DescentSectionFragment } from '@whitewater-guide/schema';
import type { Section } from '@whitewater-guide/schema';
import { useCallback } from 'react';
import type {
  SectionListData,
  SectionListRenderItemInfo,
} from 'react-native';
import { SectionList, StyleSheet } from 'react-native';

import Loading from '../../../components/Loading';
import theme from '../../../theme';
import { ITEM_HEIGHT } from './constants';
import AddNewHeader from './AddNewHeader';
import SearchListItem from './SearchListItem';
import SectionHeader from './SectionHeader';
import type { SearchResults } from './useSearchSections';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginVertical: theme.margin.double,
  },
});

const keyExtractor = (item: any) => item.id;

const renderSectionHeader = ({ section }: any) => (
  <SectionHeader id={section.id} />
);

const getItemLayout = (
  _data: Array<SectionListData<DescentSectionFragment>> | null,
  index: number,
) => ({ length: ITEM_HEIGHT, offset: index * ITEM_HEIGHT, index });

interface Props {
  data: SearchResults;
  onSelect?: (value: Section) => void;
}

function SectionSearchList({ data, onSelect }: Props) {
  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<DescentSectionFragment>) => (
      <SearchListItem section={item as Section} onPress={onSelect} />
    ),
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
}

export default SectionSearchList;
