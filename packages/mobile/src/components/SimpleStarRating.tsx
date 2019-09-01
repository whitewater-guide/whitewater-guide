import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../theme';
import { Icon } from './Icon';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  unknownContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unknownText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});

const getStarIcon = (n: number, value: number) => {
  if (n - value === 0.5) {
    return 'star-half';
  } else if (n > value) {
    return 'star-outline';
  }
  return 'star';
};

interface Props {
  value: number;
  style?: StyleProp<ViewStyle>;
}

export const SimpleStarRating: React.FC<Props> = React.memo((props) => {
  const { value, style } = props;
  return (
    <View style={[styles.container, style]}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          narrow={true}
          icon={getStarIcon(n, value)}
          size={14}
          color={
            value ? theme.colors.componentBorder : 'rgba(158, 158, 158, 0.4)'
          }
        />
      ))}
      {!value && (
        <View style={styles.unknownContainer} pointerEvents="none">
          <Text style={styles.unknownText}>?</Text>
        </View>
      )}
    </View>
  );
});

SimpleStarRating.displayName = 'SimpleStarRating';
