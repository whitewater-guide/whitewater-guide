import {
  ListedSectionFragment,
  SectionDerivedFields,
  toRomanDifficulty,
} from '@whitewater-guide/clients';
import memoize from 'lodash/memoize';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import theme from '~/theme';

import { ITEM_HEIGHT } from './constants';
import RNSectionItem from './RNSectionItem';

const styles = StyleSheet.create({
  component: {
    width: theme.screenWidth,
    height: ITEM_HEIGHT,
  },
});

interface SectionOverlayProps {
  section: ListedSectionFragment & SectionDerivedFields;
  regionPremium?: boolean | null;
}

const denseRoman = memoize((difficulty: number) =>
  toRomanDifficulty(difficulty).replace(/\s/gi, ''),
);

const SectionOverlay: FC<SectionOverlayProps> = ({
  regionPremium,
  section,
}) => (
  <RNSectionItem
    style={styles.component}
    riverName={section.river.name}
    sectionName={section.name}
    difficulty={denseRoman(section.difficulty)}
    difficultyExtra={section.difficultyXtra}
    rating={section.rating}
    flows={section.flowsThumb}
    verified={section.verified}
    demo={section.demo && regionPremium}
  />
);

SectionOverlay.displayName = 'SectionOverlay';

export default SectionOverlay;
