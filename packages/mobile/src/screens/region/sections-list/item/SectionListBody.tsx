import { Section } from '@whitewater-guide/commons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import {
  DifficultyThumb,
  FlowsThumb,
  Icon,
  StarRating,
} from '../../../../components';
import theme from '../../../../theme';

export const ITEM_HEIGHT = 72;

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
  },
  riverName: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionName: {
    fontSize: 14,
  },
  starsContainer: {
    width: 80,
    paddingTop: 2,
  },
  row: {
    flexDirection: 'row',
  },
  unlocked: {
    position: 'absolute',
    top: -6,
  },
});

interface Props {
  section: Section;
  hasPremiumAccess: boolean;
  onPress: () => void;
}

const SectionListBody: React.FC<Props> = ({
  onPress,
  hasPremiumAccess,
  section,
}) => (
  <TouchableRipple onPress={onPress}>
    <View style={styles.container}>
      <DifficultyThumb
        difficulty={section.difficulty}
        difficultyXtra={section.difficultyXtra}
      />
      <View style={styles.body}>
        <Text style={styles.riverName} numberOfLines={1}>
          {section.river.name}
        </Text>
        <View style={styles.row}>
          <Text style={styles.sectionName} numberOfLines={1}>
            {section.name}
          </Text>
          {section.demo && !hasPremiumAccess && (
            <View>
              <Icon
                style={styles.unlocked}
                icon="lock-open-outline"
                color={theme.colors.textMain}
                size={16}
              />
            </View>
          )}
        </View>
        <View style={styles.starsContainer}>
          <StarRating disabled={true} value={section.rating || 0} />
        </View>
      </View>
      <FlowsThumb section={section} />
    </View>
  </TouchableRipple>
);

export default SectionListBody;
