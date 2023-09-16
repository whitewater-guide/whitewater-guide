import times from 'lodash/times';
import React, { memo } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { Platform, StyleSheet, Text } from 'react-native';

import theme from '../theme';

const STAR = 984270;
const STAR_OUTLINE = 984274;
const STAR_HALF = 984272;

const styles = StyleSheet.create({
  stars: {
    height: 14,
    fontSize: 14,
    fontFamily:
      Platform.OS === 'android'
        ? 'MaterialCommunityIcons'
        : 'Material Design Icons',
    color: theme.colors.componentBorder,
  },
});

function getStarString(value: number): string {
  const result: number[] = [];
  for (let i = 0; i < 5; i++) {
    if (value - i === 0.5) {
      result.push(STAR_HALF);
    } else if (value > i) {
      result.push(STAR);
    } else {
      result.push(STAR_OUTLINE);
    }
  }
  return String.fromCodePoint(...result);
}

const STAR_STRINGS: Map<number, string> = new Map(
  times(11).map((i) => [i * 0.5, getStarString(i * 0.5)]),
);

interface Props {
  // value in 0.5 increments from 0.0 to 5.0
  value?: number | null;
  style?: StyleProp<TextStyle>;
}

const SimpleStarRating = memo<Props>((props) => {
  const { value, style } = props;
  if (value === null || value === undefined) {
    return null;
  }
  // Do not use icon components here. Because it's rendered in list we want this to be as fast as possible
  return <Text style={[styles.stars, style]}>{STAR_STRINGS.get(value)}</Text>;
});

SimpleStarRating.displayName = 'SimpleStarRating';

export default SimpleStarRating;
