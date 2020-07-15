import { Section } from '@whitewater-guide/commons';
import {
  LogbookSection,
  LogbookSectionInput,
} from '@whitewater-guide/logbook-schema';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DifficultyThumb from '~/components/DifficultyThumb';
import theme from '~/theme';
import { ITEM_HEIGHT } from './constants';
import { useUpstreamSection } from '../DescentFormContext';

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

const isLogbookSection = (
  section: Section | LogbookSection,
): section is LogbookSection => typeof section.region === 'string';

interface Props {
  section: Section | LogbookSection;
  onPress?: (section: LogbookSectionInput) => void;
}

const SectionListItem: React.FC<Props> = React.memo(({ section, onPress }) => {
  const { setUpstreamSection } = useUpstreamSection();
  const region = isLogbookSection(section)
    ? section.region
    : section.region.name;
  const river = isLogbookSection(section) ? section.river : section.river.name;
  const sectionName = isLogbookSection(section)
    ? section.section
    : section.name;

  const handlePress = useCallback(() => {
    if (!isLogbookSection(section)) {
      setUpstreamSection(section);
    }
    const val: LogbookSectionInput = isLogbookSection(section)
      ? section
      : {
          upstreamId: section.id,
          difficulty: section.difficulty,
          region: section.region.name,
          river: section.river.name,
          section: section.name,
          putIn: {
            lat: section.putIn.coordinates[1],
            lng: section.putIn.coordinates[0],
          },
          takeOut: {
            lat: section.takeOut.coordinates[1],
            lng: section.takeOut.coordinates[0],
          },
          upstreamData: {
            gaugeId: section.gauge?.id,
          },
        };
    onPress?.(val);
  }, [section, onPress, setUpstreamSection]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.rows}>
          <Text style={styles.sectionName} numberOfLines={1}>
            <Text style={styles.riverName}>{river}</Text>
            {' - '}
            {sectionName}
          </Text>
          <Text style={styles.regionName} numberOfLines={1}>
            {region}
          </Text>
        </View>
        <DifficultyThumb
          noBorder={true}
          difficulty={section.difficulty}
          difficultyXtra={(section as any).difficultyXtra}
        />
      </View>
    </TouchableOpacity>
  );
});

SectionListItem.displayName = 'SectionListItem';

export default SectionListItem;
