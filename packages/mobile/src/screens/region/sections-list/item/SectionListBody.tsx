import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { DifficultyThumb, FlowsThumb, StarRating } from '../../../../components';
import { WithT } from '../../../../i18n';
import theme from '../../../../theme';
import { Section } from '../../../../ww-commons';

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
});

interface Props extends WithT {
  section: Section;
  onPress: () => void;
}

const SectionListBody: React.StatelessComponent<Props> = ({ onPress, section, t }) => (
  <TouchableRipple onPress={onPress}>
    <View style={styles.container}>
      <DifficultyThumb difficulty={section.difficulty} difficultyXtra={section.difficultyXtra} />
      <View style={styles.body}>
        <Text style={styles.riverName}>{section.river.name}</Text>
        <Text style={styles.sectionName}>{section.name}</Text>
        <View style={styles.starsContainer}>
          <StarRating disabled value={section.rating} />
        </View>
      </View>
      <FlowsThumb section={section} t={t} />
    </View>
  </TouchableRipple>
);

export default SectionListBody;
