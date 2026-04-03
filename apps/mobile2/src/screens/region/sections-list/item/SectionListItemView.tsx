import type {
  ListedSectionFragment,
  SectionDerivedFields,
} from '@whitewater-guide/clients';
import React, { memo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import DifficultyThumb from '../../../../components/DifficultyThumb';
import FlowsThumb from '../../../../components/FlowsThumb';
import SimpleStarRating from '../../../../components/SimpleStarRating';
import UnverifiedBadge from '../../../../components/UnverifiedBadge';
import theme from '../../../../theme';
import { ITEM_HEIGHT } from './constants';

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    backgroundColor: theme.colors.lightBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.componentBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
  },
  riverName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textMain,
  },
  sectionName: {
    fontSize: 14,
    color: theme.colors.textMain,
  },
  starsContainer: {
    width: 80,
    paddingTop: 2,
  },
  row: {
    flexDirection: 'row',
  },
  unlocked: {
    fontFamily:
      Platform.OS === 'android'
        ? 'MaterialCommunityIcons'
        : 'Material Design Icons',
    paddingTop: 2,
    paddingLeft: 4,
  },
});

interface Props {
  section: ListedSectionFragment & SectionDerivedFields;
  onPress?: () => void;
}

function SectionListItemView({ section, onPress }: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <DifficultyThumb
        difficulty={section.difficulty}
        difficultyXtra={section.difficultyXtra}
      />

      <View style={styles.body}>
        <Text style={styles.riverName} numberOfLines={1}>
          {section.river.name}
        </Text>

        <Text style={styles.sectionName} numberOfLines={1}>
          {section.name}
        </Text>

        <View style={styles.row}>
          <SimpleStarRating
            value={section.rating}
            style={styles.starsContainer}
          />
          {section.verified === false && <UnverifiedBadge />}
        </View>
      </View>

      <FlowsThumb section={section} />
    </Pressable>
  );
}

export default memo(SectionListItemView);
