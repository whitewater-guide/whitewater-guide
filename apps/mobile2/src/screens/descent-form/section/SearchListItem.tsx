import type { Section } from '@whitewater-guide/schema';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import DifficultyThumb from '../../../components/DifficultyThumb';
import theme from '../../../theme';
import { ITEM_HEIGHT } from './constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightBackground,
    padding: theme.margin.single,
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rows: {
    flex: 1,
    justifyContent: 'space-between',
  },
  riverName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textMain,
  },
  sectionName: {
    color: theme.colors.textMain,
    fontSize: 14,
  },
  regionName: {
    color: theme.colors.textNote,
    fontSize: 12,
  },
});

interface Props {
  section: Section;
  onPress?: (section: Section) => void;
}

function SearchListItem({ section, onPress }: Props) {
  return (
    <TouchableOpacity onPress={() => onPress?.(section)}>
      <View style={styles.container}>
        <View style={styles.rows}>
          <Text style={styles.sectionName} numberOfLines={1}>
            <Text style={styles.riverName}>{section.river.name}</Text>
            {' - '}
            {section.name}
          </Text>
          <Text style={styles.regionName} numberOfLines={1}>
            {section.region.name}
          </Text>
        </View>
        <DifficultyThumb
          noBorder
          difficulty={section.difficulty}
          difficultyXtra={(section as any).difficultyXtra}
        />
      </View>
    </TouchableOpacity>
  );
}

SearchListItem.displayName = 'SearchListItem';

export default SearchListItem;
