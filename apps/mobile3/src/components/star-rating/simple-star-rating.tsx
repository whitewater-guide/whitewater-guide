import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';

import { STAR_STRINGS } from './common';

import { useTheme } from '@/hooks/use-theme';

export interface SimpleStarRatingProps {
  value?: number | null;
  style?: StyleProp<TextStyle>;
}

export function SimpleStarRating({ value, style }: SimpleStarRatingProps) {
  const theme = useTheme();
  if (value === null || value === undefined) {
    return null;
  }
  return (
    <Text
      style={[
        styles.stars,
        { fontFamily: MaterialCommunityIcons.getFontFamily(), color: theme.textSecondary },
        style,
      ]}
      pointerEvents="box-only"
      selectable={false}
    >
      {STAR_STRINGS.get(value)}
    </Text>
  );
}

const styles = StyleSheet.create({
  stars: {
    alignSelf: 'flex-start',
    height: 14,
    fontSize: 14,
  },
});
