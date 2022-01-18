import {
  ListedSectionFragment,
  SectionDerivedFields,
} from '@whitewater-guide/clients';
import React, { FC } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import DifficultyThumb from '~/components/DifficultyThumb';
import FlowsThumb from '~/components/FlowsThumb';
import SimpleStarRating from '~/components/SimpleStarRating';
import UnverifiedBadge from '~/components/UnverifiedBadge';
import theme from '~/theme';

const styles = StyleSheet.create({
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

interface SectionOverlayProps {
  section: ListedSectionFragment & SectionDerivedFields;
  regionPremium?: boolean | null;
}

const SectionOverlay: FC<SectionOverlayProps> = ({
  regionPremium,
  section,
}) => (
  <>
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
        {section.demo && regionPremium && (
          /* This is rendered inside list items, so we want minimum overhead. Thaths why we don't use icons here */
          <Text style={styles.unlocked}>
            {' ' + String.fromCodePoint(983872)}
          </Text>
        )}
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
  </>
);

SectionOverlay.displayName = 'SectionOverlay';

export default SectionOverlay;
