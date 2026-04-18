import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';

import theme from '../../theme';
import { STAR_STRINGS } from './common';

const styles = StyleSheet.create({
  stars: {
    alignSelf: 'flex-start',
    height: 30,
    fontSize: 30,
    fontFamily: 'MaterialDesignIcons',
    color: theme.colors.componentBorder,
  },
});

interface Props {
  // value in 0.5 increments from 0.0 to 5.0
  value?: number | null;
  style?: StyleProp<TextStyle>;
}

export function SimpleStarRating({ value, style }: Props) {
  if (value === null || value === undefined) {
    return null;
  }
  // Avoid icon components here — rendered in list items, needs minimal overhead
  return (
    <Text
      style={[styles.stars, style]}
      pointerEvents="box-only"
      selectable={false}
    >
      {STAR_STRINGS.get(value)}
    </Text>
  );
}
